package com.kyskfilms.video.service

import com.kyskfilms.video.repository.VideoFileRepository
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import java.io.File
import java.nio.file.Files
import java.util.UUID
import java.util.concurrent.TimeUnit

@Service
class VideoProcessingService(
    private val videoFileRepository: VideoFileRepository,
    private val minioService: MinioService
) {

    private val log = LoggerFactory.getLogger(javaClass)

    @Async
    fun processAndUpload(videoFileId: Int, inputFile: File) {
        val uniqueFolderName = UUID.randomUUID().toString()
        val outputDir = Files.createTempDirectory("video-processing-").toFile()


        try {
            log.info("Starting video processing for videoFileId: $videoFileId")

            val process = ProcessBuilder(
                "ffmpeg", "-i", inputFile.absolutePath,
                "-c:a", "aac", "-ar", "48000", "-b:a", "128k",
                "-c:v", "libx264", "-profile:v", "main", "-crf", "20", "-g", "48", "-keyint_min", "48",
                "-hls_time", "10",
                "-hls_playlist_type", "vod",
                "-hls_segment_filename", "${outputDir.absolutePath}/segment%03d.ts",
                "${outputDir.absolutePath}/master.m3u8"
            ).redirectErrorStream(true).start()

            process.inputStream.bufferedReader().forEachLine { log.info("FFMPEG: $it") }

            val finished = process.waitFor(60, TimeUnit.MINUTES)
            if (!finished || process.exitValue() != 0) {
                throw RuntimeException("FFmpeg failed or timed out. Exit code: ${process.exitValue()}")
            }

            log.info("FFmpeg conversion successful. Uploading to MinIO...")

            outputDir.listFiles()?.forEach { segmentFile ->
                minioService.uploadHlsFile(segmentFile, uniqueFolderName)
            }

            val manifestObjectName = "$uniqueFolderName/master.m3u8"
            videoFileRepository.updateOnSuccess(videoFileId, manifestObjectName)
            log.info("Finished videoFileId: $videoFileId")

        } catch (e: Exception) {
            log.error("Error processing videoFileId: $videoFileId", e)
            videoFileRepository.updateOnError(videoFileId, e.message ?: "Unknown error")
        } finally {

            outputDir.deleteRecursively()
            if (inputFile.exists()) {
                inputFile.delete()
            }
            log.info("Cleaned up temp files")
        }
    }
}