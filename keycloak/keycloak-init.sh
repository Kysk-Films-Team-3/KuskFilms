#!/bin/sh
set -e

echo "=================================================="
echo " Keycloak Realm Initialization Script Starting..."
echo "=================================================="

# Устанавливаем переменные окружения по умолчанию
KEYCLOAK_URL="${KEYCLOAK_URL:-http://keycloak:8080}"
ADMIN_USER="${KEYCLOAK_ADMIN:-admin}"
ADMIN_PASSWORD="${KEYCLOAK_ADMIN_PASSWORD:-admin_secure}"
REALM_NAME="${KEYCLOAK_REALM:-kyskfilms}"
CONFIG_FILE="/keycloak/import/keycloak-realm-config.json" # Путь к вашему новому конфигу

# Проверяем, что конфиг существует
if [ ! -f "$CONFIG_FILE" ]; then
    echo " ERROR: Config file not found: $CONFIG_FILE"
    exit 1
fi

echo "✓ Config file found: $CONFIG_FILE"

# --- Шаг 1: Ожидание Keycloak ---
echo " Waiting for Keycloak to be ready..."
for i in $(seq 1 30); do
    if curl -sf "$KEYCLOAK_URL/health/ready" > /dev/null 2>&1; then
        echo "✓ Keycloak is ready"
        break
    fi
    echo "   Attempt $i/30: Keycloak not ready yet..."
    sleep 3
    if [ $i -eq 30 ]; then
        echo " ERROR: Keycloak did not start within 90 seconds"
        exit 1
    fi
done

# --- Шаг 2: Получение токена ---
echo " Getting admin token..."
TOKEN_RESPONSE=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=$ADMIN_USER" \
    -d "password=$ADMIN_PASSWORD" \
    -d "grant_type=password" \
    -d "client_id=admin-cli")

TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo " ERROR: Failed to obtain access token"
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