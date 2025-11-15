package com.kyskfilms.video.service

import io.minio.MinioClient
import io.minio.PutObjectArgs
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.FileInputStream
import java.util.*

@Service
class MinioService(private val minioClient: MinioClient) {

    @Value("\${minio.bucket}")
    private lateinit var bucketName: String

    private val log = LoggerFactory.getLogger(javaClass)


    fun uploadImage(file: MultipartFile, targetDirectory: String): String {
        try {
            val extension = file.originalFilename?.substringAfterLast('.', "")
            val uniqueFileName = "${UUID.randomUUID()}.$extension"
            val objectName = "$targetDirectory/$uniqueFileName"

            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucketName)
                    .`object`(objectName) // Используем обратные кавычки
                    .stream(file.inputStream, file.size, -1)
                    .contentType(file.contentType)
                    .build()
            )

            log.info("Image {} uploaded successfully to {}/{}", file.originalFilename, bucketName, objectName)
            return objectName
        } catch (e: Exception) {
            log.error("Error uploading image to MinIO", e)
            throw IllegalStateException("Failed to upload image", e)
        }
    }


    fun uploadHlsFile(file: File, targetDirectory: String): String {
        try {
            val objectName = "$targetDirectory/${file.name}"

            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucketName)
                    .`object`(objectName) // Используем обратные кавычки
                    .stream(FileInputStream(file), file.length(), -1)
                    .build()
            )

            log.debug("HLS file {} uploaded successfully to {}/{}", file.name, bucketName, objectName)
            return objectName
        } catch (e: Exception) {
            log.error("Error uploading HLS file {} to MinIO", file.name, e)
            throw IllegalStateException("Failed to upload HLS file", e)
        }
    }
}