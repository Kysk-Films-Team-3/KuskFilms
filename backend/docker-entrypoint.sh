#!/bin/sh
set -e

echo "=================================================="
echo "KYSKFilms Backend Starting..."
echo "=================================================="
echo "Profile: ${SPRING_PROFILES_ACTIVE:-prod}"
echo "Java Opts: ${JAVA_OPTS}"
echo "=================================================="

if [ "${WAIT_FOR_POSTGRES:-false}" = "true" ]; then
    echo "Waiting for PostgreSQL..."
    until nc -z postgres 5432 2>/dev/null; do
        echo "   Postgres unavailable - sleeping 2s..."
        sleep 2
    done
    echo "✓ PostgreSQL is ready"
fi

if [ "${WAIT_FOR_KEYCLOAK:-false}" = "true" ]; then
    echo "Waiting for Keycloak..."
    until curl -sf http://keycloak:8080/health/ready > /dev/null 2>&1; do
        echo "   Keycloak unavailable - sleeping 2s..."
        sleep 2
    done
    echo "✓ Keycloak is ready"
fi

if [ ! -f /app/app.jar ]; then
    echo "ERROR: app.jar not found!"
    ls -la /app/
    exit 1
fi

echo "✓ Starting Spring Boot application..."
echo "=================================================="

exec java \
    ${JAVA_OPTS} \
    -Djava.security.egd=file:/dev/./urandom \
    -Dspring.profiles.active="${SPRING_PROFILES_ACTIVE:-prod}" \
    -jar /app/app.jar \
    "$@"