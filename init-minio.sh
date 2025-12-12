
#!/bin/sh

# === 1. Установка зависимостей ===
echo "🔧 Installing dependencies (curl, psql, ffmpeg)..."
# Добавляем ffmpeg для обработки видео
apk add --no-cache curl postgresql-client bash ffmpeg

# Скачиваем MinIO Client
echo "📥 Downloading MC..."
curl -L -o /usr/bin/mc https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x /usr/bin/mc

# === 2. Ожидание сервисов ===
echo "⏳ Waiting for MinIO..."
until mc alias set myminio $MINIO_INTERNAL_URL $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD; do
    sleep 2
done

echo "⏳ Waiting for Postgres..."
until pg_isready -h postgres -U $POSTGRES_USER; do
    sleep 2
done

# === 3. Настройка бакета ===
echo "📦 Setting up bucket..."
mc mb --ignore-existing myminio/$MINIO_BUCKET
mc anonymous set download myminio/$MINIO_BUCKET

# === 4. Функция создания фильма (с конвертацией) ===
create_movie() {
    SLUG="$1"
    TITLE="$2"
    FILENAME="$3" # Имя файла в папке /videos
    IMG="$4"

    # Проверка на существование
    EXISTS=$(psql -h postgres -U $POSTGRES_USER -d $POSTGRES_APP_DB -tAc "SELECT 1 FROM titles WHERE slug='$SLUG'")

    if [ "$EXISTS" != "1" ]; then
        echo "🎬 Processing '$TITLE' (File: $FILENAME)..."

        # Генерируем UUID
        UUID=$(cat /proc/sys/kernel/random/uuid)
        WORK_DIR="/tmp/$UUID"
        mkdir -p $WORK_DIR

        # --- КОНВЕРТАЦИЯ ВИДЕО (FFMPEG) ---
        if [ -f "/videos/$FILENAME" ]; then
            # Конвертируем в HLS.
            # -preset ultrafast (чтобы быстрее запускалось)
            # -hls_time 10 (длина сегмента 10 сек)
            ffmpeg -i "/videos/$FILENAME" \
                   -c:v libx264 -preset ultrafast -c:a aac \
                   -f hls -hls_time 10 -hls_list_size 0 \
                   -hls_segment_filename "$WORK_DIR/segment%03d.ts" \
                   "$WORK_DIR/master.m3u8" > /dev/null 2>&1

            if [ $? -eq 0 ]; then
                echo "✅ FFmpeg done for $TITLE"
            else
                echo "❌ FFmpeg failed for $TITLE. Using fake video."
                # Фолбэк на случай ошибки ffmpeg (чтобы скрипт не упал)
                echo "" > $WORK_DIR/segment000.ts
                echo "#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:10\n#EXTINF:10.0,\nsegment000.ts\n#EXT-X-ENDLIST" > $WORK_DIR/master.m3u8
            fi
        else
            echo "⚠️ File /videos/$FILENAME not found! Creating fake."
            echo "" > $WORK_DIR/segment000.ts
            echo "#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:10\n#EXTINF:10.0,\nsegment000.ts\n#EXT-X-ENDLIST" > $WORK_DIR/master.m3u8
        fi

        # --- ЗАГРУЗКА В MINIO ---
        # Копируем всю папку (там будет master.m3u8 и куча .ts файлов)
        mc cp --recursive $WORK_DIR/ myminio/$MINIO_BUCKET/$UUID/ > /dev/null

        # --- ЗАПИСЬ В БД ---
        psql -h postgres -U $POSTGRES_USER -d $POSTGRES_APP_DB -c "INSERT INTO titles (type, title, slug, poster_url, rating, release_date) VALUES ('MOVIE', '$TITLE', '$SLUG', '$IMG', 8.5, NOW())"

        TITLE_ID=$(psql -h postgres -U $POSTGRES_USER -d $POSTGRES_APP_DB -tAc "SELECT id FROM titles WHERE slug='$SLUG'" | tr -d '[:space:]')

        psql -h postgres -U $POSTGRES_USER -d $POSTGRES_APP_DB -c "INSERT INTO video_files (title_id, status, type, object_name) VALUES ($TITLE_ID, 'READY', 'FEATURE', '$UUID/master.m3u8')"

        psql -h postgres -U $POSTGRES_USER -d $POSTGRES_APP_DB -c "INSERT INTO title_genres (title_id, genre_id) VALUES ($TITLE_ID, 1) ON CONFLICT DO NOTHING"

        # Чистим временные файлы
        rm -rf $WORK_DIR
        echo "🎉 Created: $TITLE"
    else
        echo "⚠️  Skipped: $TITLE (exists)"
    fi
}

# === 5. Запуск ===
psql -h postgres -U $POSTGRES_USER -d $POSTGRES_APP_DB -c "INSERT INTO genres (category_id, name, slug) VALUES (1, 'Sci-Fi', 'sci-fi') ON CONFLICT DO NOTHING"

echo "🚀 Starting Video Processing..."

# MAP ВАШИХ ФАЙЛОВ К ФИЛЬМАМ
# 1. Matrix -> 324243.mp4
create_movie "matrix" "The Matrix" "324243.mp4" "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"

# 2. Dune 2 -> IMG_9770.MP4
create_movie "dune-2" "Dune: Part Two" "IMG_9770.MP4" "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"

# 3. Inception -> video_2025-12-02_09-39-01.mp4
create_movie "inception" "Inception" "video_2025-12-02_09-39-01.mp4" "https://image.tmdb.org/t/p/w500/9gk7admal4zlWH9AJ46r87876c6.jpg"

# 4. Interstellar -> video_2025-12-03_21-15-24.mp4
create_movie "interstellar" "Interstellar" "video_2025-12-03_21-15-24.mp4" "https://image.tmdb.org/t/p/w500/gEU2QniL6C8z1dY4cvBTsIw0kM1.jpg"

# 5. Cyberpunk -> юрист-юрфак.mp4
create_movie "cyberpunk" "Cyberpunk: Edgerunners" "юрист-юрфак.mp4" "https://image.tmdb.org/t/p/w500/m7oMjVEwX0k0Qfx818MEkM3Z7J.jpg"

echo "🏁 All Done!"

