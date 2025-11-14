package com.kyskfilms.service

import io.minio.MinioClient
import io.minio.PutObjectArgs
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.util.*

@Service
class MinioService(private val minioClient: MinioClient) {

    @Value("\${minio.bucket}")
    private lateinit var bucketName: String

    private val log = LoggerFactory.getLogger(javaClass)

    fun uploadFile(file: MultipartFile, objectDirectory: String): String {
        try {
            val extension = file.originalFilename?.substringAfterLast('.', "")
            val uniqueFileName = "${UUID.randomUUID()}.$extension"
            val objectName = "$objectDirectory/$uniqueFileName"

            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucketName)
                    // ========= НАЧАЛО ИСПРАВЛЕНИЯ ==========
                    // БЫЛО: .object(objectName) <-- Вызывало ошибку компиляции
                    // СТАЛО: Имя метода `object` обернуто в обратные кавычки для экранирования
                    .`object`(objectName)
                    // ========= КОНЕЦ ИСПРАВЛЕНИЯ ============
                    .stream(file.inputStream, file.size, -1)
                    .contentType(file.contentType)
                    .build()
            )

            log.info("File {} uploaded successfully to {}/{}", file.originalFilename, bucketName, objectName)
            return objectName // Возвращаем только путь к объекту
        } catch (e: Exception) {
            log.error("Error uploading file to MinIO", e)
            throw IllegalStateException("Failed to upload file", e)
        }
    }
}