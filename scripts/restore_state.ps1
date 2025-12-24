# Налаштування
$backupDir = "../backups"
$dbContainer = "kyskfilms-postgres"
$minioContainer = "kyskfilms-minio"
$dbUser = "kysk_user"
$dbName = "kyskfilms_db"

Write-Host "🔄 Починаю відновлення даних..." -ForegroundColor Cyan

# 1. Відновлення PostgreSQL
if (Test-Path "$backupDir/db/dump.sql") {
    Write-Host "📥 Відновлення бази даних..."
    try {
        # Читаємо файл і передаємо в psql всередині контейнера
        Get-Content "$backupDir/db/dump.sql" | docker exec -i $dbContainer psql -U $dbUser -d $dbName
        Write-Host "✅ База даних відновлена!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Помилка при відновленні БД" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️ Файл бекапу БД не знайдено." -ForegroundColor Yellow
}

# 2. Відновлення MinIO
if (Test-Path "$backupDir/minio/kyskfilms") {
    Write-Host "📥 Відновлення файлів MinIO..."
    try {
        # Копіюємо файли назад у контейнер
        docker cp "$backupDir/minio/kyskfilms" "$minioContainer`:/data/"
        Write-Host "✅ Файли MinIO відновлені!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Помилка при відновленні MinIO" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️ Файли бекапу MinIO не знайдено." -ForegroundColor Yellow
}

Write-Host "🎉 Відновлення завершено! Перезавантажте сторінку." -ForegroundColor Cyan