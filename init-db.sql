-- ============================================
-- KYSKFilms - Database Initialization Script
-- ============================================

-- Создаём базу для основного приложения
CREATE DATABASE kyskfilms_db
    WITH
    OWNER = kysk_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TEMPLATE = template0;

-- Создаём отдельную базу для Keycloak
CREATE DATABASE keycloak_db
    WITH
    OWNER = kysk_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TEMPLATE = template0;

-- Даём права пользователю на обе базы
GRANT ALL PRIVILEGES ON DATABASE kyskfilms_db TO kysk_user;
GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO kysk_user;

-- Подключаемся к базе приложения и создаём расширения
\c kyskfilms_db;

-- UUID extension для генерации уникальных ID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Полнотекстовый поиск
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Подключаемся к базе Keycloak
\c keycloak_db;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Возвращаемся к дефолтной базе
\c postgres;

-- Информационное сообщо
DO $$
BEGIN
    RAISE NOTICE '✓ Databases created successfully:';
    RAISE NOTICE '  - kyskfilms_db (main application)';
    RAISE NOTICE '  - keycloak_db (authentication)';
END $$;