
#!/bin/bash

echo "⏳ Waiting for MinIO..."
until mc alias set myminio $MINIO_INTERNAL_URL $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD; do sleep 2; done

echo "⏳ Waiting for Postgres..."
until pg_isready -h postgres -U $POSTGRES_USER; do sleep 2; done

echo "📦 Setting up bucket..."
mc mb --ignore-existing myminio/$MINIO_BUCKET
mc anonymous set public myminio/$MINIO_BUCKET

# === 1. Генерация КАРТИНОК (Постеры) ===
echo "🎨 Generating images..."
FONT_PATH="/usr/share/fonts/ttf-dejavu/DejaVuSans-Bold.ttf"

generate_image() {
    NAME="$1"
    COLOR="$2"
    SIZE="$3"
    TEXT="$4"
    # Генерируем во временную папку
    ffmpeg -f lavfi -i color=c=$COLOR:s=$SIZE -frames:v 1 \
           -vf "drawtext=text='$TEXT':fontfile=$FONT_PATH:fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2" \
           -y "/tmp/$NAME" > /dev/null 2>&1
    mc cp "/tmp/$NAME" "myminio/$MINIO_BUCKET/images/$NAME" > /dev/null
    rm "/tmp/$NAME"
}

# Постеры фильмов
generate_image "cyberpunk_wide.jpg" "purple" "1920x800" "Cyberpunk"
generate_image "dune2_wide.jpg" "orange" "1920x800" "Dune Part Two"
generate_image "matrix_poster.jpg" "green" "500x750" "Matrix"
generate_image "dune2_poster.jpg" "orange" "500x750" "Dune 2"
generate_image "interstellar_promo.jpg" "black" "1920x1080" "Interstellar"
generate_image "keanu.jpg" "gray" "300x300" "Keanu"

# Иконки категорий
mkdir -p /tmp/icons
ffmpeg -f lavfi -i color=c=blue:s=100x100 -frames:v 1 -y /tmp/icons/movies.png > /dev/null 2>&1
ffmpeg -f lavfi -i color=c=red:s=100x100 -frames:v 1 -y /tmp/icons/series.png > /dev/null 2>&1
ffmpeg -f lavfi -i color=c=gray:s=100x100 -frames:v 1 -y /tmp/icons/doc.png > /dev/null 2>&1
ffmpeg -f lavfi -i color=c=pink:s=100x100 -frames:v 1 -y /tmp/icons/anime.png > /dev/null 2>&1
mc cp --recursive /tmp/icons/ myminio/$MINIO_BUCKET/images/icons/ > /dev/null
rm -rf /tmp/icons

# === 2. Генерация UI ИКОНОК (Кнопки) ===
echo "🎨 Generating UI Icons..."
mkdir -p /tmp/ui

# Share (Поделиться)
ffmpeg -f lavfi -i color=c=white:s=50x50 -frames:v 1 -vf "drawtext=text='Share':fontfile=$FONT_PATH:fontcolor=black:fontsize=10:x=(w-text_w)/2:y=(h-text_h)/2" -y /tmp/ui/share.png > /dev/null 2>&1
# Watch/Add (Плюс)
ffmpeg -f lavfi -i color=c=white:s=50x50 -frames:v 1 -vf "drawtext=text='+':fontfile=$FONT_PATH:fontcolor=black:fontsize=30:x=(w-text_w)/2:y=(h-text_h)/2" -y /tmp/ui/plus.png > /dev/null 2>&1
# Dislike (Минус/Дизлайк)
ffmpeg -f lavfi -i color=c=white:s=50x50 -frames:v 1 -vf "drawtext=text='-':fontfile=$FONT_PATH:fontcolor=black:fontsize=30:x=(w-text_w)/2:y=(h-text_h)/2" -y /tmp/ui/dislike.png > /dev/null 2>&1
# Info (Информация)
ffmpeg -f lavfi -i color=c=white:s=50x50 -frames:v 1 -vf "drawtext=text='i':fontfile=$FONT_PATH:fontcolor=black:fontsize=20:x=(w-text_w)/2:y=(h-text_h)/2" -y /tmp/ui/info.png > /dev/null 2>&1
# Play (Треугольник)
ffmpeg -f lavfi -i color=c=white:s=50x50 -frames:v 1 -vf "drawtext=text='>':fontfile=$FONT_PATH:fontcolor=black:fontsize=20:x=(w-text_w)/2:y=(h-text_h)/2" -y /tmp/ui/play.png > /dev/null 2>&1

mc cp --recursive /tmp/ui/ myminio/$MINIO_BUCKET/ui/ > /dev/null
rm -rf /tmp/ui

# === 3. Генерация ВИДЕО (HLS Stream) ===
echo "🎬 Generating HLS Video..."
mkdir -p /tmp/video

# Генерируем 10 секунд видео + звук + HLS плейлист
ffmpeg -f lavfi -i testsrc=duration=10:size=1280x720:rate=30 \
       -f lavfi -i sine=frequency=1000:duration=10 \
       -c:v libx264 -preset ultrafast -g 60 -sc_threshold 0 \
       -c:a aac \
       -f hls -hls_time 4 -hls_list_size 0 \
       -hls_segment_filename "/tmp/video/segment%03d.ts" \
       "/tmp/video/dummy.m3u8" > /dev/null 2>&1

# Загружаем папку video в MinIO
mc cp --recursive /tmp/video/ myminio/$MINIO_BUCKET/video/ > /dev/null
rm -rf /tmp/video

# === 4. Обновление БД ===
echo "💾 Updating Database..."

# ВАЖНО: Формируем полный URL к видео
VIDEO_URL="$MINIO_EXTERNAL_URL/video/dummy.m3u8"

psql -h postgres -U $POSTGRES_USER -d $POSTGRES_APP_DB <<EOF
-- Фикс типов
DO \$\$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_cast WHERE castsource = 'character varying'::regtype AND casttarget = 'video_type'::regtype) THEN
        CREATE CAST (character varying AS video_type) WITH INOUT AS IMPLICIT;
    END IF;
EXCEPTION WHEN OTHERS THEN NULL; END \$\$;

-- Категории
INSERT INTO categories (id, name, slug) VALUES (1, 'Фильмы', 'movies') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, slug) VALUES (2, 'Сериалы', 'series') ON CONFLICT (id) DO NOTHING;

-- Фильмы (Картинки оставляем короткими, их клеит контроллер)
INSERT INTO titles (id, title, slug, type, rating, release_date, poster_url)
VALUES (1, 'The Matrix', 'the-matrix', 'MOVIE', 8.7, NOW(), 'matrix_poster.jpg')
ON CONFLICT (id) DO UPDATE SET poster_url = 'matrix_poster.jpg';

INSERT INTO titles (id, title, slug, type, rating, release_date, poster_url)
VALUES (2, 'Dune: Part Two', 'dune-2', 'MOVIE', 8.5, NOW(), 'dune2_poster.jpg')
ON CONFLICT (id) DO UPDATE SET poster_url = 'dune2_poster.jpg';

INSERT INTO titles (id, title, slug, type, rating, release_date, poster_url)
VALUES (4, 'Interstellar', 'interstellar', 'MOVIE', 8.9, NOW(), 'interstellar_promo.jpg')
ON CONFLICT (id) DO UPDATE SET poster_url = 'interstellar_promo.jpg';

INSERT INTO titles (id, title, slug, type, rating, release_date, poster_url)
VALUES (5, 'Cyberpunk: Edgerunners', 'cyberpunk', 'SERIES', 8.6, NOW(), 'cyberpunk_wide.jpg')
ON CONFLICT (id) DO UPDATE SET poster_url = 'cyberpunk_wide.jpg';

-- !!! ВИДЕО: Пишем ПОЛНЫЙ путь (http://localhost/kyskfilms/video/dummy.m3u8) !!!
INSERT INTO video_files (title_id, status, type, object_name, created_at, updated_at)
VALUES
(1, 'READY', 'FEATURE', '$VIDEO_URL', NOW(), NOW()),
(2, 'READY', 'FEATURE', '$VIDEO_URL', NOW(), NOW()),
(4, 'READY', 'FEATURE', '$VIDEO_URL', NOW(), NOW()),
(5, 'READY', 'FEATURE', '$VIDEO_URL', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET object_name = '$VIDEO_URL';

-- На всякий случай обновляем старые записи, если ID не совпали
UPDATE video_files SET object_name = '$VIDEO_URL' WHERE object_name LIKE '%dummy.m3u8';

SELECT setval('titles_id_seq', (SELECT MAX(id) FROM titles));
EOF

echo "🏁 Done. UI Icons, Video & DB updated."

