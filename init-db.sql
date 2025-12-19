-- =================================================================
-- 1. БАЗОВАЯ НАСТРОЙКА И СОЗДАНИЕ БД
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
-- 2. ТИПЫ (ENUMS) И КОСТЫЛИ (CASTS)
-- =================================================================

DO $$ BEGIN
    CREATE TYPE title_type AS ENUM ('MOVIE', 'SERIES');
    CREATE TYPE video_status AS ENUM ('PROCESSING', 'READY', 'ERROR');
    CREATE TYPE video_type AS ENUM ('FEATURE', 'EPISODE', 'TRAILER', 'TEASER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Fix for Spring Data / Hibernate
DO $$ BEGIN
    CREATE CAST (character varying AS title_type) WITH INOUT AS IMPLICIT;
    CREATE CAST (character varying AS video_status) WITH INOUT AS IMPLICIT;
    CREATE CAST (character varying AS video_type) WITH INOUT AS IMPLICIT;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =================================================================
-- 3. СОЗДАНИЕ ТАБЛИЦ
-- =================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
    keycloak_id UUID PRIMARY KEY,
    email VARCHAR(255),
    username VARCHAR(255),
    avatar_url VARCHAR(500),
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставим тестовый промокод: KYSK2025 (на 30 дней)
INSERT INTO promo_codes (code, duration_days) VALUES ('KYSK2025', 30) ON CONFLICT DO NOTHING;

-- Категории (Глобальные разделы)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Жанры (Привязаны к конкретной категории)
CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS persons (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255),
    activity_type VARCHAR(100),
    gender VARCHAR(50),
    photo_url VARCHAR(500),
    birth_date DATE,
    birth_place VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS titles (
    id SERIAL PRIMARY KEY,
    type title_type NOT NULL DEFAULT 'MOVIE',
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    release_date DATE,
    poster_url VARCHAR(500),
    background_url VARCHAR(500),
    logo_url VARCHAR(500),
    rating DECIMAL(3,1) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS title_genres (
    title_id INTEGER REFERENCES titles(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (title_id, genre_id)
);

CREATE TABLE IF NOT EXISTS title_persons (
    id BIGSERIAL PRIMARY KEY,
    title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    person_id BIGINT NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS seasons (
    id SERIAL PRIMARY KEY,
    title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL,
    season_title VARCHAR(255),
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (season_id, episode_number)
);

CREATE TABLE IF NOT EXISTS video_files (
    id SERIAL PRIMARY KEY,
    title_id INTEGER REFERENCES titles(id) ON DELETE CASCADE,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, title_id)
);

CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title_id INTEGER NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_titles_rating ON titles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_titles_date ON titles(release_date DESC);

-- =================================================================
-- 4. НАПОЛНЕНИЕ ДАННЫМИ (ИЕРАРХИЯ КАТЕГОРИЙ И ЖАНРОВ)
-- =================================================================

-- 1. Создаем КАТЕГОРИИ
INSERT INTO categories (name, slug, description) VALUES
('Кіно та Розваги', 'entertainment', 'Фільми, серіали, шоу'),
('Фітнес та Спорт', 'fitness', 'Тренування, йога, здоров''я'),
('Освіта та Лекції', 'education', 'Наука, історія, курси'),
('Музика та Мистецтво', 'music-art', 'Концерти, опера, виставки')
ON CONFLICT (slug) DO NOTHING;

-- 2. Создаем ЖАНРЫ (подразделы) для каждой категории

-- === Категория: Кіно та Розваги (entertainment) ===
INSERT INTO genres (name, slug, category_id, created_at) VALUES
('Бойовик', 'action', (SELECT id FROM categories WHERE slug='entertainment'), NOW()),
('Драма', 'drama', (SELECT id FROM categories WHERE slug='entertainment'), NOW()),
('Комедія', 'comedy', (SELECT id FROM categories WHERE slug='entertainment'), NOW()),
('Фантастика', 'sci-fi', (SELECT id FROM categories WHERE slug='entertainment'), NOW()),
('Детектив', 'detective', (SELECT id FROM categories WHERE slug='entertainment'), NOW()),
('Жахи', 'horror', (SELECT id FROM categories WHERE slug='entertainment'), NOW()),
('Мультфільми', 'cartoons', (SELECT id FROM categories WHERE slug='entertainment'), NOW()),
('Аніме', 'anime', (SELECT id FROM categories WHERE slug='entertainment'), NOW()),
('Реаліті-шоу', 'reality-show', (SELECT id FROM categories WHERE slug='entertainment'), NOW()),
('Кулінарія', 'cooking', (SELECT id FROM categories WHERE slug='entertainment'), NOW()),
('Інтерв''ю', 'interview', (SELECT id FROM categories WHERE slug='entertainment'), NOW()),
-- Спец. жанры для коллекций на главной
('Антиутопія', 'dystopia', (SELECT id FROM categories WHERE slug='entertainment'), NOW()),
('Антигерої', 'antiheroes', (SELECT id FROM categories WHERE slug='entertainment'), NOW()),
('Сила Дружби', 'friendship', (SELECT id FROM categories WHERE slug='entertainment'), NOW()),
('Романтика', 'romance', (SELECT id FROM categories WHERE slug='entertainment'), NOW())
ON CONFLICT (slug) DO NOTHING;

-- === Категория: Фітнес (fitness) ===
INSERT INTO genres (name, slug, category_id, created_at) VALUES
('Єдиноборства', 'martial-arts', (SELECT id FROM categories WHERE slug='fitness'), NOW()),
('Йога', 'yoga', (SELECT id FROM categories WHERE slug='fitness'), NOW()),
('Кардіо', 'cardio', (SELECT id FROM categories WHERE slug='fitness'), NOW()),
('Силові тренування', 'strength', (SELECT id FROM categories WHERE slug='fitness'), NOW()),
('Медитація', 'meditation', (SELECT id FROM categories WHERE slug='fitness'), NOW())
ON CONFLICT (slug) DO NOTHING;

-- === Категория: Лекції (education) ===
INSERT INTO genres (name, slug, category_id, created_at) VALUES
('Історія', 'history', (SELECT id FROM categories WHERE slug='education'), NOW()),
('IT та Програмування', 'it-tech', (SELECT id FROM categories WHERE slug='education'), NOW()),
('Фізика та Космос', 'science', (SELECT id FROM categories WHERE slug='education'), NOW()),
('Іноземні мови', 'languages', (SELECT id FROM categories WHERE slug='education'), NOW()),
('Психологія', 'psychology', (SELECT id FROM categories WHERE slug='education'), NOW())
ON CONFLICT (slug) DO NOTHING;

-- === Категория: Музика (music-art) ===
INSERT INTO genres (name, slug, category_id, created_at) VALUES
('Концерти', 'concerts', (SELECT id FROM categories WHERE slug='music-art'), NOW()),
('Опера', 'opera', (SELECT id FROM categories WHERE slug='music-art'), NOW()),
('Класика', 'classic', (SELECT id FROM categories WHERE slug='music-art'), NOW()),
('Живопис', 'painting', (SELECT id FROM categories WHERE slug='music-art'), NOW())
ON CONFLICT (slug) DO NOTHING;