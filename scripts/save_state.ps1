# Налаштування
$backupDir = "../backups"
$dbContainer = "kyskfilms-postgres"
$minioContainer = "kyskfilms-minio"
$dbUser = "kysk_user"
$dbName = "kyskfilms_db"

# Створення папок, якщо немає
if (!(Test-Path "$backupDir/db")) { New-Item -ItemType Directory -Force -Path "$backupDir/db" }
if (!(Test-Path "$backupDir/minio")) { New-Item -ItemType Directory -Force -Path "$backupDir/minio" }

Write-Host "🔄 Починаю створення бекапу..." -ForegroundColor Cyan

# 1. Бекап PostgreSQL
Write-Host "📦 Експорт бази даних..."
try {
    # Використовуємо --clean --if-exists, щоб при відновленні стара база очищувалась
    docker exec -t $dbContainer pg_dump -U $dbUser -d $dbName --clean --if-exists > "$backupDir/db/dump.sql"
    Write-Host "✅ База даних збережена в backups/db/dump.sql" -ForegroundColor Green
} catch {
    Write-Host "❌ Помилка при експорті БД" -ForegroundColor Red
}

# 2. Бекап MinIO
Write-Host "📦 Експорт файлів MinIO..."
try {
    # Копіюємо вміст бакета
    docker cp "$minioContainer`:/data/kyskfilms" "$backupDir/minio/"
    Write-Host "✅ Файли MinIO збережені в backups/minio/kyskfilms" -ForegroundColor Green
} catch {
    Write-Host "❌ Помилка при експорті MinIO (можливо, папка порожня)" -ForegroundColor Yellow
}

Write-Host "🎉 Бекап завершено!" -ForegroundColor Cyan