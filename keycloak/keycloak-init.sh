#!/bin/sh
set -e

echo "=================================================="
echo " Keycloak Realm Import Starting..."
echo "=================================================="

KEYCLOAK_URL="${KEYCLOAK_URL:-http://keycloak:8080}"
ADMIN_USER="${ADMIN_USER:-admin}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin_secure}"
REALM_NAME="${KEYCLOAK_REALM:-kyskfilms}"
CONFIG_FILE="/keycloak/import/keycloak-realm-config.json"

# Проверяем что конфиг существует
if [ ! -f "$CONFIG_FILE" ]; then
    echo " ERROR: Config file not found: $CONFIG_FILE"
    exit 1
fi

echo "✓ Config file found"
echo " Waiting for Keycloak to be ready..."

# Ждём Keycloak (30 попыток)
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

echo " Getting admin token..."

# Получаем токен
TOKEN_RESPONSE=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=$ADMIN_USER" \
    -d "password=$ADMIN_PASSWORD" \
    -d "grant_type=password" \
    -d "client_id=admin-cli")

TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo " ERROR: Failed to get admin token"
    echo "Response: $TOKEN_RESPONSE"
    exit 1
fi

echo " Admin token obtained"

# Проверяем существует ли realm
echo " Checking if realm '$REALM_NAME' exists..."

REALM_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $TOKEN" \
    "$KEYCLOAK_URL/admin/realms/$REALM_NAME")

if [ "$REALM_STATUS" = "200" ]; then
    echo "  Realm '$REALM_NAME' already exists. Skipping import."
    exit 0
fi

# Импортируем realm
echo " Importing realm '$REALM_NAME'..."

IMPORT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$KEYCLOAK_URL/admin/realms" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d @"$CONFIG_FILE")

if [ "$IMPORT_STATUS" = "201" ]; then
    echo "=================================================="
    echo " Realm '$REALM_NAME' imported successfully!"
    echo "=================================================="
    echo " Configuration:"
    echo "   Realm: $REALM_NAME"
    echo "   Clients: kyskfilms-frontend, kyskfilms-backend"
    echo "   Users:"
    echo "     - admin@kyskfilms.com (password: admin123)"
    echo "     - user@kyskfilms.com (password: user123)"
    echo "=================================================="
    exit 0
else
    echo " WARNING: Import returned HTTP $IMPORT_STATUS"
    echo "   Realm may already exist or import had issues"
    exit 0
fi