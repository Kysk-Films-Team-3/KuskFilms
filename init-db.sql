SELECT 'Creating keycloak_db...' as status;

SELECT 'CREATE DATABASE keycloak_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'keycloak_db')\gexec

GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO kysk_user;

SELECT 'Creating kyskfilms_db...' as status;

SELECT 'CREATE DATABASE kyskfilms_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'kyskfilms_db')\gexec

GRANT ALL PRIVILEGES ON DATABASE kyskfilms_db TO kysk_user;

\c kyskfilms_db;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TABLE IF NOT EXISTS user_profiles (
    keycloak_id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT keycloak_id_not_empty CHECK (keycloak_id IS NOT NULL)
);

COMMENT ON TABLE user_profiles IS 'Профілі користувачів (зберігає тільки Keycloak ID + метадані)';
COMMENT ON COLUMN user_profiles.keycloak_id IS 'UUID користувача з Keycloak (Primary Key)';
COMMENT ON COLUMN user_profiles.preferences IS 'JSON з налаштуваннями: {theme, language, notifications, etc}';

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    release_date DATE,
    duration_minutes INTEGER,
    poster_url VARCHAR(500),
    trailer_url VARCHAR(500),
    rating DECIMAL(3,1) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT positive_duration CHECK (duration_minutes > 0),
    CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 10)
);

CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

CREATE TABLE IF NOT EXISTS watchlist (
    keycloak_id UUID REFERENCES user_profiles(keycloak_id) ON DELETE CASCADE,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (keycloak_id, movie_id)
);

COMMENT ON TABLE watchlist IS 'Список фільмів "Хочу подивитись"';

CREATE TABLE IF NOT EXISTS favorites (
    keycloak_id UUID REFERENCES user_profiles(keycloak_id) ON DELETE CASCADE,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (keycloak_id, movie_id)
);

COMMENT ON TABLE favorites IS 'Улюблені фільми користувача';

CREATE TABLE IF NOT EXISTS user_ratings (
    keycloak_id UUID REFERENCES user_profiles(keycloak_id) ON DELETE CASCADE,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    rated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (keycloak_id, movie_id),
    CONSTRAINT valid_user_rating CHECK (rating >= 1 AND rating <= 10)
);

COMMENT ON TABLE user_ratings IS 'Оцінки фільмів користувачами (1-10)';

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    keycloak_id UUID REFERENCES user_profiles(keycloak_id) ON DELETE CASCADE,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_movie_review UNIQUE (keycloak_id, movie_id)
);

COMMENT ON TABLE reviews IS 'Рецензії користувачів на фільми';

CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_movies_title ON movies USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_movies_slug ON movies(slug);
CREATE INDEX IF NOT EXISTS idx_movies_rating ON movies(rating DESC);
CREATE INDEX IF NOT EXISTS idx_movies_release_date ON movies(release_date DESC);

CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(keycloak_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_movie ON watchlist(movie_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_added_at ON watchlist(added_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(keycloak_id);
CREATE INDEX IF NOT EXISTS idx_favorites_movie ON favorites(movie_id);

CREATE INDEX IF NOT EXISTS idx_ratings_user ON user_ratings(keycloak_id);
CREATE INDEX IF NOT EXISTS idx_ratings_movie ON user_ratings(movie_id);

CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(keycloak_id);
CREATE INDEX IF NOT EXISTS idx_reviews_movie ON reviews(movie_id);


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movies_updated_at
    BEFORE UPDATE ON movies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


CREATE OR REPLACE FUNCTION update_movie_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE movies
    SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM user_ratings
        WHERE movie_id = COALESCE(NEW.movie_id, OLD.movie_id)
    )
    WHERE id = COALESCE(NEW.movie_id, OLD.movie_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_movie_rating_on_insert
    AFTER INSERT ON user_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_movie_rating();

CREATE TRIGGER update_movie_rating_on_update
    AFTER UPDATE ON user_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_movie_rating();

CREATE TRIGGER update_movie_rating_on_delete
    AFTER DELETE ON user_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_movie_rating();

INSERT INTO genres (name, slug) VALUES
    ('Action', 'action'),
    ('Drama', 'drama'),
    ('Comedy', 'comedy'),
    ('Thriller', 'thriller'),
    ('Sci-Fi', 'sci-fi'),
    ('Horror', 'horror')
ON CONFLICT (slug) DO NOTHING;

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
    RAISE NOTICE '  • user_profiles → Only Keycloak ID + preferences';
    RAISE NOTICE '  • movies        → Movie catalog';
    RAISE NOTICE '  • genres        → Movie genres';
    RAISE NOTICE '  • watchlist     → Watch later list';
    RAISE NOTICE '  • favorites     → Favorite movies';
    RAISE NOTICE '  • user_ratings  → User ratings (1-10)';
    RAISE NOTICE '  • reviews       → User reviews';
    RAISE NOTICE '';
END $$;