#!/bin/sh
set -e

echo "Installing dependencies (curl, jq, bash)..."
apk add --no-cache curl jq bash

echo "=================================================="
echo " Keycloak Realm Initialization Script Starting..."
echo "=================================================="

# <--- КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Мы НЕ переопределяем KEYCLOAK_URL --->
# Он будет взят из окружения, которое передает docker-compose
ADMIN_USER="${KEYCLOAK_ADMIN:-admin}"
ADMIN_PASSWORD="${KEYCLOAK_ADMIN_PASSWORD:-admin}"
REALM_NAME="${KEYCLOAK_REALM:-kyskfilms}"
CONFIG_FILE="/keycloak/import/keycloak-realm-config.json"

if [ ! -f "$CONFIG_FILE" ]; then
    echo " ERROR: Config file not found: $CONFIG_FILE"
    exit 1
fi
echo "✓ Config file found: $CONFIG_FILE"

# --- Шаг 1: Просто ждем, а затем пытаемся получить токен ---

echo "Initial delay of 60 seconds to ensure Keycloak is fully started..."
sleep 60

echo "Attempting to get admin token from $KEYCLOAK_URL..." # Переменная придет из docker-compose
for i in $(seq 1 30); do

    TOKEN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=$KEYCLOAK_ADMIN" \
        -d "password=$KEYCLOAK_ADMIN_PASSWORD" \
        -d "grant_type=password" \
        -d "client_id=admin-cli")

    if [ "$TOKEN_RESPONSE" = "200" ]; then
        echo "✅ Successfully connected to Keycloak and received a token!"
        break
    fi

    echo "   Attempt $i/30: Keycloak not ready (HTTP code: $TOKEN_RESPONSE). Retrying in 10 seconds..."
    sleep 10

    if [ $i -eq 30 ]; then
        echo "❌ ERROR: Could not connect to Keycloak and get a token."
        exit 1
    fi
done

# --- Шаг 2 и далее: ваш оригинальный скрипт ---
echo "Proceeding with realm configuration..."

# Теперь мы запрашиваем токен еще раз, чтобы его использовать
TOKEN_RESPONSE=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=$KEYCLOAK_ADMIN" \
    -d "password=$KEYCLOAK_ADMIN_PASSWORD" \
    -d "grant_type=password" \
    -d "client_id=admin-cli")

TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo " ERROR: Failed to obtain access token after successful connection."
    echo "$TOKEN_RESPONSE" | jq .
    exit 1
fi
echo "✓ Access token obtained"

# --- Шаг 3: Создание/Обновление Реалма (основной конфиг) ---
echo " Importing realm configuration from $CONFIG_FILE..."
HTTP_CODE=$(curl -s -o /tmp/realm_response.json -w "%{http_code}" \
    -X POST "$KEYCLOAK_URL/admin/realms" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d @$CONFIG_FILE)

# Keycloak при импорте может вернуть 201 (создан) или 409 (уже существует)
if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ Realm '$REALM_NAME' created successfully!"
elif [ "$HTTP_CODE" = "409" ]; then
    echo "⚠️  Realm '$REALM_NAME' already exists. Configuration might have been updated."
else
    echo "❌ Failed to import/create realm (HTTP $HTTP_CODE)"
    cat /tmp/realm_response.json
    exit 1
fi


# --- Шаг 4: Обновление SMTP (используем PUT для обновления) ---
# NOTE: Для PUT/обновления нам нужно только поле, которое мы хотим изменить.
echo " Updating SMTP configuration..."
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
    echo "⚠️  Failed to update SMTP (HTTP $HTTP_CODE)"
    # Выводим ошибку, но не прерываем скрипт, так как реалм может быть рабочим
    cat /tmp/smtp_response.json
fi


# --- Шаг 5: Создание/Обновление пользователей (только если не существует) ---

# Пользователь ADMIN
ADMIN_EMAIL="admin@kyskfilms.com"
if ! curl -s -X GET "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?email=$ADMIN_EMAIL" \
    -H "Authorization: Bearer $TOKEN" | jq -e '.[]' > /dev/null; then
    echo " Creating Admin user: $ADMIN_EMAIL"
    curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "username": "admin",
            "email": "admin@kyskfilms.com",
            "firstName": "Admin",
            "lastName": "User",
            "enabled": true,
            "emailVerified": true,
            "credentials": [{"type": "password", "value": "admin123", "temporary": false}],
            "realmRoles": ["USER", "ADMIN"]
        }' > /dev/null
    echo "✓ Admin user created"
else
    echo "⚠️ Admin user already exists. Skipping creation."
fi

# Пользователь USER
USER_EMAIL="user@kyskfilms.com"
if ! curl -s -X GET "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?email=$USER_EMAIL" \
    -H "Authorization: Bearer $TOKEN" | jq -e '.[]' > /dev/null; then
    echo " Creating Test user: $USER_EMAIL"
    curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "username": "user",
            "email": "user@kyskfilms.com",
            "firstName": "Test",
            "lastName": "User",
            "enabled": true,
            "emailVerified": true,
            "credentials": [{"type": "password", "value": "user123", "temporary": false}],
            "realmRoles": ["USER"]
        }' > /dev/null
    echo "✓ Test user created"
else
    echo "⚠️ Test user already exists. Skipping creation."
fi


echo ""
echo "=================================================="
echo "✅ Keycloak Realm Import and Initialization Completed!"
echo "=================================================="