#!/usr/bin/env bash

set -e pipefail

echo "Installing dependencies (curl, jq, bash, netcat, getent)..."
apk add --no-cache curl jq bash netcat-openbsd libc-utils

echo "=================================================="
echo " Keycloak Realm Initialization Script Starting..."
echo "=================================================="

ADMIN_USER="${KEYCLOAK_ADMIN:-admin}"
ADMIN_PASSWORD="${KEYCLOAK_ADMIN_PASSWORD:-admin}"
REALM_NAME="${KEYCLOAK_REALM:-kyskfilms}"
CONFIG_FILE="/keycloak/import/keycloak-realm-config.json"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ ERROR: Config file not found: $CONFIG_FILE"
    exit 1
fi
echo "✓ Config file found: $CONFIG_FILE"


# --- ШАГ 1: Усиленный блок ожидания доступности сервиса Keycloak ---

KEYCLOAK_HOST=$(echo "$KEYCLOAK_URL" | sed -e 's,http://\([^/]*\).*,\1,' | cut -d: -f1)
KEYCLOAK_PORT=$(echo "$KEYCLOAK_URL" | sed -e 's,http://\([^/]*\).*,\1,' | cut -d: -f2)

echo "Waiting for Keycloak service '${KEYCLOAK_HOST}' to be resolvable..."
i=0
until getent hosts "$KEYCLOAK_HOST"; do
    i=$((i+1)); if [ "$i" -gt 30 ]; then echo "❌ ERROR: Could not resolve Keycloak host '${KEYCLOAK_HOST}' after 60 seconds."; exit 1; fi
    echo "   Attempt ${i}/30: Host '${KEYCLOAK_HOST}' not yet resolvable. Retrying in 2 seconds..."; sleep 2
done
echo "✅ Host '${KEYCLOAK_HOST}' is resolvable. Now waiting for port ${KEYCLOAK_PORT}..."
i=0
until nc -z -w 3 "$KEYCLOAK_HOST" "$KEYCLOAK_PORT"; do
    i=$((i+1)); if [ "$i" -gt 30 ]; then echo "❌ ERROR: Keycloak port ${KEYCLOAK_PORT} is not available after 90 seconds."; exit 1; fi
    echo "   Attempt $((i))/30: Waiting for Keycloak port to open..."; sleep 3
done
echo "✅ Keycloak network is ready. Now waiting for API..."


# --- ШАГ 2: Ожидание полной готовности API и получение токена ---

i=0
until curl -s -o /dev/null -w "%{http_code}" -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=${ADMIN_USER}" -d "password=${ADMIN_PASSWORD}" -d "grant_type=password" -d "client_id=admin-cli" | grep -q "200"; do
    i=$((i+1)); if [ "$i" -gt 30 ]; then echo "❌ ERROR: Could not get a token from Keycloak API after multiple retries."; exit 1; fi
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" -H "Content-Type: application/x-www-form-urlencoded" -d "username=${ADMIN_USER}" -d "password=${ADMIN_PASSWORD}" -d "grant_type=password" -d "client_id=admin-cli")
    echo "   Attempt ${i}/30: Keycloak API not ready (HTTP code: ${HTTP_CODE}). Retrying in 5 seconds..."; sleep 5
done
echo "✅ Successfully connected to Keycloak API!"


# --- ШАГ 3: Получение токена для дальнейших операций ---

echo "Obtaining admin access token..."
TOKEN_RESPONSE=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=$ADMIN_USER" -d "password=$ADMIN_PASSWORD" -d "grant_type=password" -d "client_id=admin-cli")
TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo "❌ ERROR: Failed to obtain access token after successful connection."; echo "$TOKEN_RESPONSE" | jq .; exit 1;
fi
echo "✓ Access token obtained."


# --- ШАГ 4: Импорт конфигурации реалма ---

echo "Importing realm configuration from $CONFIG_FILE..."
HTTP_CODE=$(curl -s -o /tmp/realm_response.json -w "%{http_code}" -X POST "$KEYCLOAK_URL/admin/realms" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "@$CONFIG_FILE")

if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ Realm '$REALM_NAME' created successfully!"
elif [ "$HTTP_CODE" = "409" ]; then
    echo "⚠️  Realm '$REALM_NAME' already exists. Skipping creation."
else
    echo "❌ Failed to import realm (HTTP $HTTP_CODE)"; cat /tmp/realm_response.json; exit 1;
fi


# --- ШАГ 5: Обновление SMTP ---

echo "Updating SMTP configuration..."
SMTP_CONFIG=$(cat <<EOF
{
  "smtpServer": {
    "host": "${SMTP_HOST:-smtp.example.com}",
    "port": "${SMTP_PORT:-587}",
    "from": "${SMTP_FROM:-no-reply@kyskfilms.com}",
    "fromDisplayName": "KYSKFilms",
    "replyTo": "${SMTP_FROM:-no-reply@kyskfilms.com}",
    "replyToDisplayName": "KYSKFilms Support",
    "auth": "${SMTP_AUTH:-true}",
    "user": "${SMTP_USER:-user}",
    "password": "${SMTP_PASSWORD:-password}",
    "starttls": "${SMTP_STARTTLS:-true}",
    "ssl": "${SMTP_SSL:-false}"
  }
}
EOF
)

HTTP_CODE=$(curl -s -o /tmp/smtp_response.json -w "%{http_code}" \
    -X PUT "$KEYCLOAK_URL/admin/realms/$REALM_NAME" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$SMTP_CONFIG")

if [ "$HTTP_CODE" = "204" ] || [ "$HTTP_CODE" = "200" ]; then
    echo "✅ SMTP configuration updated!"
else
    echo "⚠️  Failed to update SMTP (HTTP $HTTP_CODE). This is non-critical."
    cat /tmp/smtp_response.json
fi

# --- ШАГ 6: БЛОК СОЗДАНИЯ ПОЛЬЗОВАТЕЛЕЙ ---

create_user_with_roles() {
    local email="$1"
    local username="$2"
    local password="$3"
    shift 3
    local roles_to_assign="$@"

    echo "------------------------------------------------"
    echo "Checking user: $email"

    local user_id=$(curl -s -X GET "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?email=$email&exact=true" \
        -H "Authorization: Bearer $TOKEN" | jq -r '.[0].id')

    if [ -z "$user_id" ] || [ "$user_id" = "null" ]; then
        echo "Creating user '$username' ($email)..."
        curl -s -f -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" \
            -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
            -d "{
                  \"username\": \"$username\", \"email\": \"$email\",
                  \"firstName\": \"$username\", \"lastName\": \"User\",
                  \"enabled\": true, \"emailVerified\": true,
                  \"credentials\": [{\"type\": \"password\", \"value\": \"$password\", \"temporary\": false}]
                }" > /dev/null

        user_id=$(curl -s -X GET "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?email=$email&exact=true" \
            -H "Authorization: Bearer $TOKEN" | jq -r '.[0].id')
        echo "✓ User created with ID: $user_id"

        echo "Assigning roles: $roles_to_assign..."

        ROLES_PAYLOAD="["
        for role_name in $roles_to_assign; do
            role_json=$(curl -s -X GET "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles/$role_name" \
                -H "Authorization: Bearer $TOKEN")

            if [ -n "$role_json" ] && [ "$(echo "$role_json" | jq .name)" != "null" ]; then
                ROLES_PAYLOAD="$ROLES_PAYLOAD$role_json,"
            else
                echo "⚠️  WARNING: Role '$role_name' not found in realm '$REALM_NAME'. Skipping."
            fi
        done
        ROLES_PAYLOAD=$(echo "$ROLES_PAYLOAD" | sed 's/,$//')
        ROLES_PAYLOAD="$ROLES_PAYLOAD]"

        if [ "$ROLES_PAYLOAD" != "[]" ]; then
            curl -s -f -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users/$user_id/role-mappings/realm" \
                -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
                -d "$ROLES_PAYLOAD" > /dev/null
            echo "✓ Roles assigned successfully."
        else
            echo "⚠️ No valid roles found to assign."
        fi

    else
        echo "⚠️ User $email (ID: $user_id) already exists. Skipping."
    fi
}

create_user_with_roles "admin@kyskfilms.com" "admin" "admin123" "USER" "ADMIN"
create_user_with_roles "user@kyskfilms.com"  "user"  "user123"  "USER"

echo ""
echo "=================================================="
echo "✅ Keycloak Realm Initialization Completed!"
echo "=================================================="

