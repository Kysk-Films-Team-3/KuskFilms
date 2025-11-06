#!/usr/bin/env bash
# Завершать скрипт при любой ошибке (-e)
# и при ошибках в пайплайнах (-o pipefail)
set -eo pipefail

echo "Installing dependencies (curl, jq, bash, netcat, getent)..."
# Добавляем libc-utils для утилиты getent и netcat для проверки порта
apk add --no-cache curl jq bash netcat-openbsd libc-utils

echo "=================================================="
echo " Keycloak Realm Initialization Script Starting..."
echo "=================================================="

# --- Определение переменных ---
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

# Извлекаем хост и порт из переменной окружения
KEYCLOAK_HOST=$(echo "$KEYCLOAK_URL" | sed -e 's,http://\([^/]*\).*,\1,' | cut -d: -f1)
KEYCLOAK_PORT=$(echo "$KEYCLOAK_URL" | sed -e 's,http://\([^/]*\).*,\1,' | cut -d: -f2)

echo "Waiting for Keycloak service '${KEYCLOAK_HOST}' to be resolvable..."

i=0
# ЭТАП 1.1: Ждем, пока DNS-имя начнет разрешаться. Это решает ошибку "Name does not resolve".
until getent hosts "$KEYCLOAK_HOST"; do
    i=$((i+1))
    if [ "$i" -gt 30 ]; then
        echo "❌ ERROR: Could not resolve Keycloak host '${KEYCLOAK_HOST}' after 60 seconds."
        exit 1
    fi
    echo "   Attempt ${i}/30: Host '${KEYCLOAK_HOST}' not yet resolvable. Retrying in 2 seconds..."
    sleep 2
done

echo "✅ Host '${KEYCLOAK_HOST}' is resolvable. Now waiting for port ${KEYCLOAK_PORT}..."

i=0
# ЭТАП 1.2: Теперь ждем, пока порт на этом хосте станет доступен.
until nc -z -w 3 "$KEYCLOAK_HOST" "$KEYCLOAK_PORT"; do
    i=$((i+1))
    if [ "$i" -gt 30 ]; then
        echo "❌ ERROR: Keycloak port ${KEYCLOAK_PORT} is not available after 90 seconds."
        exit 1
    fi
    echo "   Attempt $((i))/30: Waiting for Keycloak port to open..."
    sleep 3
done

echo "✅ Keycloak network is ready. Now waiting for API..."


# --- ШАГ 2: Ожидание полной готовности API и получение токена ---

i=0
# ЭТАП 1.3: Ждем, пока API Keycloak не начнет возвращать корректный HTTP-статус.
until curl -s -o /dev/null -w "%{http_code}" -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=${KEYCLOAK_ADMIN}" \
        -d "password=${KEYCLOAK_ADMIN_PASSWORD}" \
        -d "grant_type=password" \
        -d "client_id=admin-cli" | grep -q "200"; do
    i=$((i+1))
    if [ "$i" -gt 30 ]; then
        echo "❌ ERROR: Could not get a token from Keycloak API after multiple retries."
        exit 1
    fi
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" -H "Content-Type: application/x-www-form-urlencoded" -d "username=${KEYCLOAK_ADMIN}" -d "password=${KEYCLOAK_ADMIN_PASSWORD}" -d "grant_type=password" -d "client_id=admin-cli")
    echo "   Attempt ${i}/30: Keycloak API not ready (HTTP code: ${HTTP_CODE}). Retrying in 5 seconds..."
    sleep 5
done

echo "✅ Successfully connected to Keycloak API!"


# --- ШАГ 3: Получение токена для дальнейших операций ---

echo "Obtaining admin access token..."
TOKEN_RESPONSE=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=$KEYCLOAK_ADMIN" \
    -d "password=$KEYCLOAK_ADMIN_PASSWORD" \
    -d "grant_type=password" \
    -d "client_id=admin-cli")

TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo "❌ ERROR: Failed to obtain access token after successful connection."
    echo "$TOKEN_RESPONSE" | jq .
    exit 1
fi
echo "✓ Access token obtained."


# --- ШАГ 4: Импорт конфигурации реалма ---
echo "Importing realm configuration from $CONFIG_FILE..."
HTTP_CODE=$(curl -s -o /tmp/realm_response.json -w "%{http_code}" \
    -X POST "$KEYCLOAK_URL/admin/realms" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "@$CONFIG_FILE")

if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ Realm '$REALM_NAME' created successfully!"
elif [ "$HTTP_CODE" = "409" ]; then
    echo "⚠️  Realm '$REALM_NAME' already exists. Skipping creation."
else
    echo "❌ Failed to import realm (HTTP $HTTP_CODE)"
    cat /tmp/realm_response.json
    exit 1
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


# --- ШАГ 6: Создание пользователей (если они не существуют) ---

# Пользователь ADMIN
ADMIN_EMAIL="admin@kyskfilms.com"
if ! curl -s -f -X GET "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?email=$ADMIN_EMAIL&exact=true" \
    -H "Authorization: Bearer $TOKEN" | jq -e '.[]' > /dev/null; then
    echo "Creating Admin user: $ADMIN_EMAIL..."
    curl -s -f -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" \
        -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
        -d '{"username": "admin", "email": "admin@kyskfilms.com", "firstName": "Admin", "lastName": "User", "enabled": true, "emailVerified": true, "credentials": [{"type": "password", "value": "admin123", "temporary": false}], "realmRoles": ["USER", "ADMIN"]}' > /dev/null
    echo "✓ Admin user created."
else
    echo "⚠️ Admin user already exists. Skipping creation."
fi

# Пользователь USER
USER_EMAIL="user@kyskfilms.com"
if ! curl -s -f -X GET "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?email=$USER_EMAIL&exact=true" \
    -H "Authorization: Bearer $TOKEN" | jq -e '.[]' > /dev/null; then
    echo "Creating Test user: $USER_EMAIL..."
    curl -s -f -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" \
        -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
        -d '{"username": "user", "email": "user@kyskfilms.com", "firstName": "Test", "lastName": "User", "enabled": true, "emailVerified": true, "credentials": [{"type": "password", "value": "user123", "temporary": false}], "realmRoles": ["USER"]}' > /dev/null
    echo "✓ Test user created."
else
    echo "⚠️ Test user already exists. Skipping creation."
fi


echo ""
echo "=================================================="
echo "✅ Keycloak Realm Initialization Completed!"
echo "=================================================="

