package com.kyskfilms.title.controller

import com.kyskfilms.title.dto.*
import com.kyskfilms.title.entity.Episode
import com.kyskfilms.title.entity.Season
import com.kyskfilms.title.entity.Title
import com.kyskfilms.title.entity.TitleType
import com.kyskfilms.title.repository.TitleRepository
import com.kyskfilms.video.entity.VideoStatus
import com.kyskfilms.video.entity.VideoType
import com.kyskfilms.video.repository.VideoFileRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Value
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/public/titles")
class PublicTitleController(
    private val titleRepository: TitleRepository,
    private val videoFileRepository: VideoFileRepository,

    @Value("\${minio.public.url}") private val minioPublicUrl: String,
    @Value("\${minio.bucket}") private val bucketName: String
) {

    @GetMapping
    @Transactional(readOnly = true)
    fun getAllTitles(): List<TitleDto> {
        val titles = titleRepository.findAll()
        return titles.map { it.toDto() }
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    fun getTitleDetails(@PathVariable id: Int): TitleDetailsDto {
        val title = titleRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Title not found with id $id") }

        return when (title.type) {
            TitleType.MOVIE -> {

                val videoFile = videoFileRepository.findAll().firstOrNull {
                    it.title?.id == title.id &&
                            it.type == VideoType.FEATURE &&
                            it.status == VideoStatus.READY
                }

                val streamUrl = videoFile?.objectName?.let { "$minioPublicUrl/$bucketName/$it" }

                title.toDetailsDto(streamUrl = streamUrl)
            }

            TitleType.SERIES -> {

                val seasonDtos = title.seasons.sortedBy { it.seasonNumber }.map { season ->
                    season.toDto(videoFileRepository, minioPublicUrl, bucketName)
                }
                title.toDetailsDto(seasons = seasonDtos)
            }
        }
    }



    private fun Title.toDto(): TitleDto {
        return TitleDto(
            id = this.id!!,
            title = this.title,
            slug = this.slug,
            posterUrl = this.posterUrl,
            rating = this.rating,
            type = this.type,
            genres = this.genres.map { it.name }
        )
    }

    private fun Title.toDetailsDto(streamUrl: String? = null, seasons: List<SeasonDto> = emptyList()): TitleDetailsDto {
        return TitleDetailsDto(
            id = this.id!!,
            title = this.title,
            slug = this.slug,
            description = this.description,
            releaseDate = this.releaseDate,
            posterUrl = this.posterUrl,
            rating = this.rating,
            type = this.type,
            genres = this.genres.map { it.name },
            streamUrl = streamUrl,
            seasons = seasons
        )
    }

    private fun Season.toDto(
        videoRepo: VideoFileRepository,
        minioUrl: String,
        bucket: String
    ): SeasonDto {
        return SeasonDto(
            id = this.id!!,
            seasonNumber = this.seasonNumber,
            title = this.seasonTitle,
            episodes = this.episodes.sortedBy { it.episodeNumber }.map { episode ->
                episode.toDto(videoRepo, minioUrl, bucket)
            }
        )
    }

    private fun Episode.toDto(
        videoRepo: VideoFileRepository,
        minioUrl: String,
        bucket: String
    ): EpisodeDto {
        // Ищем видео для конкретного ЭПИЗОДА
        val videoFile = videoRepo.findAll().firstOrNull {
            it.episode?.id == this.id &&
                    it.type == VideoType.EPISODE &&
                    it.status == VideoStatus.READY
        }
        val streamUrl = videoFile?.objectName?.let { "$minioUrl/$bucket/$it" }

        return EpisodeDto(
            id = this.id!!,
            episodeNumber = this.episodeNumber,
            title = this.title,
            description = this.description,
            durationMinutes = this.durationMinutes,
            streamUrl = streamUrl
        )
    }
}