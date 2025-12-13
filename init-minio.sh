#!/bin/sh

# === 1. Установка утилит ===
echo "🔧 Installing dependencies..."
apk add --no-cache curl postgresql-client bash ffmpeg

# MinIO Client
curl -L -o /usr/bin/mc https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x /usr/bin/mc

# Переменные для удобства (предполагаем, что они есть в .env)
DB_NAME="kyskfilms_db"

# === 2. Ожидание сервисов ===
echo "⏳ Waiting for MinIO..."
until mc alias set myminio $MINIO_INTERNAL_URL $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD; do sleep 2; done

echo "⏳ Waiting for Postgres to start..."
until pg_isready -h postgres -U $POSTGRES_USER; do sleep 2; done

echo "⏳ Waiting for Database '$DB_NAME' to be ready (waiting for init.sql)..."
# Цикл ждет, пока появится таблица titles, которую создает ваш init.sql
until psql -h postgres -U $POSTGRES_USER -d $DB_NAME -c "SELECT 1 FROM titles LIMIT 1" > /dev/null 2>&1; do
  echo "   ... waiting for schema initialization ..."
  sleep 3
done

# === 3. Настройка Бакету ===
echo "📦 Setting up bucket..."
mc mb --ignore-existing myminio/$MINIO_BUCKET
mc anonymous set download myminio/$MINIO_BUCKET

# === 4. Функция Генерации ===
generate_movie() {
    SLUG="$1"
    TITLE="$2"
    IMG="$3"
    GENRE_ID="$4"

    # Проверка на существование
    EXISTS=$(psql -h postgres -U $POSTGRES_USER -d $DB_NAME -tAc "SELECT 1 FROM titles WHERE slug='$SLUG'")

    if [ "$EXISTS" != "1" ]; then
        echo "🎬 Generating virtual movie: '$TITLE'..."

        UUID=$(cat /proc/sys/kernel/random/uuid)
        WORK_DIR="/tmp/$UUID"
        mkdir -p $WORK_DIR

        # Генерируем 30 сек видео + звук
        ffmpeg -f lavfi -i testsrc=duration=30:size=1280x720:rate=30 \
               -f lavfi -i sine=frequency=1000:duration=30 \
               -c:v libx264 -preset ultrafast -c:a aac \
               -f hls -hls_time 10 -hls_list_size 0 \
               -hls_segment_filename "$WORK_DIR/segment%03d.ts" \
               "$WORK_DIR/master.m3u8" > /dev/null 2>&1

        if [ $? -eq 0 ]; then
            # Заливаем в MinIO
            mc cp --recursive $WORK_DIR/ myminio/$MINIO_BUCKET/$UUID/ > /dev/null

            # --- ЗАПИСЬ В ВАШУ БАЗУ ---

            # 1. Вставляем Title (type='MOVIE' обязательно, т.к. у вас constraint)
            psql -h postgres -U $POSTGRES_USER -d $DB_NAME -c \
            "INSERT INTO titles (type, title, slug, poster_url, rating, release_date) VALUES ('MOVIE', '$TITLE', '$SLUG', '$IMG', 8.5, NOW());"

            # Получаем ID
            TITLE_ID=$(psql -h postgres -U $POSTGRES_USER -d $DB_NAME -tAc "SELECT id FROM titles WHERE slug='$SLUG'" | tr -d '[:space:]')

            # 2. Вставляем Video File (status='READY', type='FEATURE')
            psql -h postgres -U $POSTGRES_USER -d $DB_NAME -c \
            "INSERT INTO video_files (title_id, status, type, object_name) VALUES ($TITLE_ID, 'READY', 'FEATURE', '$UUID/master.m3u8');"

            # 3. Привязываем Жанр
            psql -h postgres -U $POSTGRES_USER -d $DB_NAME -c \
            "INSERT INTO title_genres (title_id, genre_id) VALUES ($TITLE_ID, $GENRE_ID) ON CONFLICT DO NOTHING;"

            echo "   ✅ Done!"
        else
            echo "   ❌ FFmpeg error"
        fi
        rm -rf $WORK_DIR
    else
        echo "⏭️  Skipped: $TITLE (exists)"
    fi
}

# === 5. Подготовка Данных ===

echo "🚀 Starting Data Population..."

# 1. Получаем ID категории 'feature-films' (создается в вашем init.sql)
# Если вдруг init.sql еще не отработал (хотя мы ждали), создадим категорию, чтобы скрипт не упал.
CAT_ID=$(psql -h postgres -U $POSTGRES_USER -d $DB_NAME -tAc "SELECT id FROM categories WHERE slug='feature-films'")

if [ -z "$CAT_ID" ]; then
   echo "⚠️ Category not found, creating..."
   psql -h postgres -U $POSTGRES_USER -d $DB_NAME -c "INSERT INTO categories (name, slug) VALUES ('Movies', 'feature-films');"
   CAT_ID=$(psql -h postgres -U $POSTGRES_USER -d $DB_NAME -tAc "SELECT id FROM categories WHERE slug='feature-films'")
fi

# 2. Создаем жанр Sci-Fi
psql -h postgres -U $POSTGRES_USER -d $DB_NAME -c \
"INSERT INTO genres (category_id, name, slug) VALUES ($CAT_ID, 'Sci-Fi', 'sci-fi') ON CONFLICT DO NOTHING;"

GENRE_ID=$(psql -h postgres -U $POSTGRES_USER -d $DB_NAME -tAc "SELECT id FROM genres WHERE slug='sci-fi'")

# 3. Генерируем фильмы (передаем ID жанра)

generate_movie "12-angry-men" "12 Angry Men" "https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hFZkLqCFjHA.jpg" "$GENRE_ID"

generate_movie "superman" "Superman" "https://image.tmdb.org/t/p/w500/d7px1FQxZB4ls4GLaPtGdAuQ4u.jpg" "$GENRE_ID"

generate_movie "fantastic-four" "Fantastic Four" "https://image.tmdb.org/t/p/w500/8yoFjgHuxxgSm9lpjtGowF5ztng.jpg" "$GENRE_ID"

generate_movie "spider-man" "Spider-Man" "https://image.tmdb.org/t/p/w500/gh4cZbhZxyTbgxQPxD0dOudNPTn.jpg" "$GENRE_ID"

echo "🏁 Setup Complete! Your friend is ready to go."

