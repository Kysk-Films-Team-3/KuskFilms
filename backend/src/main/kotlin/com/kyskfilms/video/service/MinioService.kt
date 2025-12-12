package com.kyskfilms.video.service

import io.minio.GetObjectArgs // <--- ЭТОГО НЕ ХВАТАЛО
import io.minio.MinioClient
import io.minio.PutObjectArgs
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.InputStream // <--- ЭТОГО НЕ ХВАТАЛО
import java.util.*

@Service
class MinioService(private val minioClient: MinioClient) {

    @Value("\${minio.bucket}")
    private lateinit var bucketName: String

    private val log = LoggerFactory.getLogger(javaClass)

    /**
     * Загрузка изображений (Аватарки, Постеры)
     */
    fun uploadImage(file: MultipartFile, targetDirectory: String): String {
        try {
            // Генерируем уникальное имя
            val extension = file.originalFilename?.substringAfterLast('.', "") ?: "jpg"
            val uniqueFileName = "${UUID.randomUUID()}.$extension"
            // Формируем путь: avatars/uuid.jpg
            val objectName = "$targetDirectory/$uniqueFileName"

            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucketName)
                    .`object`(objectName)
                    .stream(file.inputStream, file.size, -1)
                    .contentType(file.contentType ?: "image/jpeg")
                    .build()
            )

            log.info("Image {} uploaded successfully to {}/{}", file.originalFilename, bucketName, objectName)
            return objectName
        } catch (e: Exception) {
            log.error("Error uploading image to MinIO", e)
            throw IllegalStateException("Failed to upload image", e)
        }
    }

    /**
     * Загрузка HLS сегментов (видео)
     */
    fun uploadHlsFile(file: File, targetDirectory: String): String {
        try {
            val objectName = "$targetDirectory/${file.name}"

            file.inputStream().use { stream ->
                minioClient.putObject(
                    PutObjectArgs.builder()
                        .bucket(bucketName)
                        .`object`(objectName)
                        .stream(stream, file.length(), -1)
                        .build()
                )
            }

            log.debug("HLS file {} uploaded successfully...", file.name)
            return objectName
        } catch (e: Exception) {
            log.error("Error uploading HLS file {} to MinIO", file.name, e)
            throw IllegalStateException("Failed to upload HLS file", e)
        }
    }

    /**
     * Получение потока данных файла из MinIO (для стриминга)
     */
    fun getFileStream(objectName: String): InputStream {
        try {
            return minioClient.getObject(
                GetObjectArgs.builder()
                    .bucket(bucketName)
                    .`object`(objectName)
                    .build()
            )
        } catch (e: Exception) {
            throw IllegalStateException("Could not get file from MinIO: $objectName", e)
        }
    }
}