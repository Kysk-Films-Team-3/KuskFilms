package com.kyskfilms.video.controller

import com.kyskfilms.video.service.MinioService
import org.springframework.core.io.InputStreamResource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/stream")
class StreamingController(
    private val minioService: MinioService
) {

    @GetMapping("/{folder}/{filename}")
    fun streamVideo(
        @PathVariable folder: String,
        @PathVariable filename: String
    ): ResponseEntity<InputStreamResource> {

        // 1. Формируем путь к файлу в бакете MinIO
        // Например: "550e8400-e29b.../master.m3u8"
        val objectName = "$folder/$filename"

        // 2. Определяем Content-Type
        val mediaType = when {
            filename.endsWith(".m3u8") -> MediaType.parseMediaType("application/vnd.apple.mpegurl")
            filename.endsWith(".ts") -> MediaType.parseMediaType("video/mp2t")
            else -> MediaType.APPLICATION_OCTET_STREAM
        }

        // 3. Получаем поток из MinIO
        // Примечание: Spring сам закроет InputStream после передачи данных клиенту
        val inputStream = minioService.getFileStream(objectName)

        return ResponseEntity.ok()
            .contentType(mediaType)
            .header(HttpHeaders.CACHE_CONTROL, "no-cache") // Для HLS манифестов лучше не кэшировать жестко
            .body(InputStreamResource(inputStream))
    }
}