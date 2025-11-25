package com.kyskfilms.video.service

import com.kyskfilms.title.repository.EpisodeRepository
import com.kyskfilms.title.repository.TitleRepository
import com.kyskfilms.video.entity.VideoFile
import com.kyskfilms.video.entity.VideoType
import com.kyskfilms.video.repository.VideoFileRepository
import jakarta.persistence.EntityNotFoundException

import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.util.UUID

@Service
class VideoService(
    private val videoFileRepository: VideoFileRepository,
    private val titleRepository: TitleRepository,
    private val episodeRepository: EpisodeRepository,
    private val videoProcessingService: VideoProcessingService
) {

    private val tempUploadDir = File(System.getProperty("java.io.tmpdir"))

    fun startVideoProcessingForTitle(titleId: Int, file: MultipartFile, videoType: VideoType): Any {
        val title = titleRepository.findById(titleId).orElseThrow { EntityNotFoundException("Title not found") }
        val videoFile = VideoFile(title = title, type = videoType)
        val savedVideoFile = videoFileRepository.save(videoFile)


        val tempFile = File(tempUploadDir, "upload-${UUID.randomUUID()}.tmp")
        file.transferTo(tempFile)


        videoProcessingService.processAndUpload(savedVideoFile.id!!, tempFile)

        return savedVideoFile
    }

    fun startVideoProcessingForEpisode(episodeId: Int, file: MultipartFile): Any {
        val episode = episodeRepository.findById(episodeId).orElseThrow { EntityNotFoundException("Episode not found") }
        val videoFile = VideoFile(episode = episode, type = VideoType.EPISODE)
        val savedVideoFile = videoFileRepository.save(videoFile)

        val tempFile = File(tempUploadDir, "upload-${UUID.randomUUID()}.tmp")
        file.transferTo(tempFile)

        videoProcessingService.processAndUpload(savedVideoFile.id!!, tempFile)

        return savedVideoFile
    }
}