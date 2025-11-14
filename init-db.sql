-- =================================================================
-- == Базовая настройка баз данных (Keycloak и основного приложения)
-- =================================================================

SELECT 'Creating keycloak_db...' as status;
SELECT 'CREATE DATABASE keycloak_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'keycloak_db')\gexec
GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO kysk_user;

SELECT 'Creating kyskfilms_db...' as status;
SELECT 'CREATE DATABASE kyskfilms_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'kyskfilms_db')\gexec
GRANT ALL PRIVILEGES ON DATABASE kyskfilms_db TO kysk_user;

\c kyskfilms_db;

-- =================================================================
-- == Включение необходимых расширений PostgreSQL
-- =================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =================================================================
-- == Создание пользовательских ENUM типов для статусов и контента
-- =================================================================
-- NEW: ENUM для типа произведения (фильм или сериал)
CREATE TYPE title_type AS ENUM ('MOVIE', 'SERIES');
-- NEW: ENUM'ы для видеофайлов
CREATE TYPE video_status AS ENUM ('PROCESSING', 'READY', 'ERROR');
CREATE TYPE video_type AS ENUM ('FEATURE', 'EPISODE', 'TRAILER', 'TEASER');

-- =================================================================
-- == Создание таблиц
-- =================================================================

-- Таблица профилей пользователей (без изменений)
CREATE TABLE IF NOT EXISTS user_profiles (
    keycloak_id UUID PRIMARY KEY,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT keycloak_id_not_empty CHECK (keycloak_id IS NOT NULL)
);
COMMENT ON TABLE user_profiles IS 'Профили пользователей (Keycloak ID + метаданные)';

-- NEW: Таблица верхнего уровня для "захардкоженных" категорий
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
COMMENT ON TABLE categories IS 'Высокоуровневые категории контента (Документалистика, Мультипликация)';

-- MODIFIED: Таблица жанров, теперь привязана к категориям
CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
COMMENT ON TABLE genres IS 'Жанры, управляемые админом и принадлежащие к определенной категории';
COMMENT ON COLUMN genres.category_id IS 'Ссылка на родительскую категорию';

-- MODIFIED: Бывшая таблица 'movies', теперь универсальная 'titles'
CREATE TABLE IF NOT EXISTS titles (
    id SERIAL PRIMARY KEY,
    type title_type NOT NULL DEFAULT 'MOVIE', -- NEW: тип контента
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    release_date DATE,
    poster_url VARCHAR(500),
    rating DECIMAL(3,1) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 10)
);
COMMENT ON TABLE titles IS 'Центральная таблица произведений (фильмы и сериалы)';

-- MODIFIED: Бывшая 'movie_genres', теперь 'title_genres'
CREATE TABLE IF NOT EXISTS title_genres (
    title_id INTEGER REFERENCES titles(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (title_id, genre_id)
);

-- NEW: Таблицы для иерархии сериалов
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
COMMENT ON TABLE seasons IS 'Сезоны для произведений типа SERIES';

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
    UNIQUE (season_id, episode_number),
    CONSTRAINT positive_duration CHECK (duration_minutes > 0)
);
COMMENT ON TABLE episodes IS 'Эпизоды для сезонов';
COMMENT ON COLUMN episodes.duration_minutes IS 'Длительность конкретного эпизода в минутах';

-- NEW: Универсальная таблица для всех видеофайлов
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
COMMENT ON TABLE video_files IS 'Все видеофайлы системы (фильмы, эпизоды, трейлеры)';
COMMENT ON COLUMN video_files.type IS 'Тип видео: FEATURE (полный метр), EPISODE (эпизод), TRAILER';
COMMENT ON COLUMN video_files.title_id IS 'Ссылка на произведение (для трейлеров или фильмов)';
COMMENT ON COLUMN video_files.episode_id IS 'Ссылка на эпизод (для видео самого эпизода)';


-- MODIFIED: Все пользовательские таблицы теперь ссылаются на 'titles'
CREATE TABLE IF NOT EXISTS watchlist (
    keycloak_id UUID REFERENCES user_profiles(keycloak_id) ON DELETE CASCADE,
    title_id INTEGER REFERENCES titles(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (keycloak_id, title_id)
);
COMMENT ON TABLE watchlist IS 'Список произведений "Хочу подивитись"';

CREATE TABLE IF NOT EXISTS favorites (
    keycloak_id UUID REFERENCES user_profiles(keycloak_id) ON DELETE CASCADE,
    title_id INTEGER REFERENCES titles(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (keycloak_id, title_id)
);
COMMENT ON TABLE favorites IS 'Улюблені произведения користувача';

CREATE TABLE IF NOT EXISTS user_ratings (
    keycloak_id UUID REFERENCES user_profiles(keycloak_id) ON DELETE CASCADE,
    title_id INTEGER REFERENCES titles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    rated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (keycloak_id, title_id),
    CONSTRAINT valid_user_rating CHECK (rating >= 1 AND rating <= 10)
);
COMMENT ON TABLE user_ratings IS 'Оцінки произведений користувачами (1-10)';

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
COMMENT ON TABLE reviews IS 'Рецензії користувачів на произведения';

-- =================================================================
-- == Индексы
-- =================================================================

-- Индексы для новой структуры
CREATE INDEX IF NOT EXISTS idx_titles_title ON titles USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_titles_slug ON titles(slug);
CREATE INDEX IF NOT EXISTS idx_titles_rating ON titles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_titles_release_date ON titles(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_seasons_title_id ON seasons(title_id);
CREATE INDEX IF NOT EXISTS idx_episodes_season_id ON episodes(season_id);
CREATE INDEX IF NOT EXISTS idx_video_files_links ON video_files(title_id, episode_id);

-- Индексы для пользовательских таблиц (обновленные)
CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(keycloak_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_title ON watchlist(title_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(keycloak_id);
CREATE INDEX IF NOT EXISTS idx_favorites_title ON favorites(title_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON user_ratings(keycloak_id);
CREATE INDEX IF NOT EXISTS idx_ratings_title ON user_ratings(title_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(keycloak_id);
CREATE INDEX IF NOT EXISTS idx_reviews_title ON reviews(title_id);


-- =================================================================
-- == Функции и триггеры
-- =================================================================

-- Универсальная функция для обновления поля updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_titles_updated_at BEFORE UPDATE ON titles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_video_files_updated_at BEFORE UPDATE ON video_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Функция для пересчета рейтинга произведения
CREATE OR REPLACE FUNCTION update_title_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE titles
    SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM user_ratings
        WHERE title_id = COALESCE(NEW.title_id, OLD.title_id)
    )
    WHERE id = COALESCE(NEW.title_id, OLD.title_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Триггеры для пересчета рейтинга при изменении оценок
CREATE TRIGGER update_title_rating_on_insert AFTER INSERT ON user_ratings FOR EACH ROW EXECUTE FUNCTION update_title_rating();
CREATE TRIGGER update_title_rating_on_update AFTER UPDATE ON user_ratings FOR EACH ROW EXECUTE FUNCTION update_title_rating();
CREATE TRIGGER update_title_rating_on_delete AFTER DELETE ON user_ratings FOR EACH ROW EXECUTE FUNCTION update_title_rating();


-- =================================================================
-- == Начальное заполнение данных (Seeding)
-- =================================================================

-- NEW: Заполняем "захардкоженные" категории. Жанры теперь добавляет админ.
INSERT INTO categories (name, slug) VALUES
    ('Художественное кино', 'feature-films'),
    ('Документалистика', 'documentaries'),
    ('Мультипликация', 'animation'),
    ('Телевизионные шоу', 'tv-shows')
ON CONFLICT (slug) DO NOTHING;


-- =================================================================
-- == Информационное сообщение о завершении
-- =================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✓ Database initialization completed successfully!';
    RAISE NOTICE '';
    RAISE NOTICE 'Created databases:';
    RAISE NOTICE '  • keycloak_db   → Keycloak authentication data';
    RAISE NOTICE '  • kyskfilms_db  → Application data';
    RAISE NOTICE '';
    RAISE NOTICE 'Application tables:';
    RAISE NOTICE '  • categories    → Hardcoded site categories';
    RAISE NOTICE '  • genres        → Admin-managed genres';
    RAISE NOTICE '  • titles        → Main content table (movies & series)';
    RAISE NOTICE '  • seasons, episodes → Structure for series';
    RAISE NOTICE '  • video_files   → All playable video content';
    RAISE NOTICE '  • And user interaction tables (watchlist, ratings, etc.)';
    RAISE NOTICE '';
END $$;