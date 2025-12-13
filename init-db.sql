-- =================================================================
-- == 1. Базовая настройка
-- =================================================================

SELECT 'Creating keycloak_db...' as status;
SELECT 'CREATE DATABASE keycloak_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'keycloak_db')\gexec
GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO kysk_user;

SELECT 'Creating kyskfilms_db...' as status;
SELECT 'CREATE DATABASE kyskfilms_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'kyskfilms_db')\gexec
GRANT ALL PRIVILEGES ON DATABASE kyskfilms_db TO kysk_user;

\c kyskfilms_db;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =================================================================
-- == 2. Создание ENUM типов (Это то, чего хотел бэкенд!)
-- =================================================================

-- Создаем типы, если их нет
DO $$ BEGIN
    CREATE TYPE title_type AS ENUM ('MOVIE', 'SERIES');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE video_status AS ENUM ('PROCESSING', 'READY', 'ERROR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE video_type AS ENUM ('FEATURE', 'EPISODE', 'TRAILER', 'TEASER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =================================================================
-- == 3. Создание таблиц
-- =================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
    keycloak_id UUID PRIMARY KEY,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS titles (
    id SERIAL PRIMARY KEY,
    -- Используем созданный ENUM
    type title_type NOT NULL DEFAULT 'MOVIE',
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    release_date DATE,
    poster_url VARCHAR(500),
    rating DECIMAL(3,1) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS title_genres (
    title_id INTEGER REFERENCES titles(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (title_id, genre_id)
);

CREATE TABLE IF NOT EXISTS seasons (
    id SERIAL PRIMARY KEY,
    title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL,
    title VARCHAR(255),
    release_date DATE,
    poster_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (title_id, season_number)
);

CREATE TABLE IF NOT EXISTS episodes (
    id SERIAL PRIMARY KEY,
    season_id INTEGER NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_date DATE,
    duration_minutes INTEGER,
    poster_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (season_id, episode_number)
);

CREATE TABLE IF NOT EXISTS video_files (
    id SERIAL PRIMARY KEY,
    title_id INTEGER REFERENCES titles(id) ON DELETE CASCADE,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE CASCADE,

    -- Используем созданные ENUMs
    status video_status NOT NULL DEFAULT 'PROCESSING',
    type video_type NOT NULL,

    object_name VARCHAR(500),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_video_link CHECK (
        (title_id IS NOT NULL AND episode_id IS NULL) OR
        (title_id IS NULL AND episode_id IS NOT NULL)
    )
);

CREATE TABLE IF NOT EXISTS watchlist (
    keycloak_id UUID REFERENCES user_profiles(keycloak_id) ON DELETE CASCADE,
    title_id INTEGER REFERENCES titles(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (keycloak_id, title_id)
);

CREATE TABLE IF NOT EXISTS favorites (
    keycloak_id UUID REFERENCES user_profiles(keycloak_id) ON DELETE CASCADE,
    title_id INTEGER REFERENCES titles(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (keycloak_id, title_id)
);

CREATE TABLE IF NOT EXISTS user_ratings (
    keycloak_id UUID REFERENCES user_profiles(keycloak_id) ON DELETE CASCADE,
    title_id INTEGER REFERENCES titles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    rated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (keycloak_id, title_id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    keycloak_id UUID REFERENCES user_profiles(keycloak_id) ON DELETE CASCADE,
    title_id INTEGER REFERENCES titles(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_title_review UNIQUE (keycloak_id, title_id)
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_titles_title ON titles USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_titles_slug ON titles(slug);
CREATE INDEX IF NOT EXISTS idx_titles_rating ON titles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_video_files_links ON video_files(title_id, episode_id);

-- Начальные данные
INSERT INTO categories (name, slug) VALUES
    ('Художественное кино', 'feature-films'),
    ('Документалистика', 'documentaries'),
    ('Мультипликация', 'animation'),
    ('Телевизионные шоу', 'tv-shows')
ON CONFLICT (slug) DO NOTHING;