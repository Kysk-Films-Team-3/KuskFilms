package com.kyskfilms.title.controller

import com.kyskfilms.title.dto.*
import com.kyskfilms.title.entity.Title
import com.kyskfilms.title.repository.TitleRepository
import com.kyskfilms.video.entity.VideoStatus
import com.kyskfilms.video.entity.VideoType
import com.kyskfilms.video.repository.VideoFileRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/public/titles")
class PublicTitleController(
    private val titleRepository: TitleRepository,
    private val videoFileRepository: VideoFileRepository, // <-- Добавь репозиторий видео
    @Value("\${minio.public.url}") private val minioPublicUrl: String,
    @Value("\${minio.bucket}") private val bucketName: String
) {

    // === ОБНОВЛЕННЫЙ МЕТОД ДЛЯ КАТАЛОГА (С ПАГИНАЦИЕЙ) ===
    @GetMapping
    @Transactional(readOnly = true)
    fun getAllTitles(@PageableDefault(size = 20) pageable: Pageable): Page<TitleDto> {
        val titlesPage = titleRepository.findAll(pageable)
        return titlesPage.map { it.toDto() }
    }

    // === ДЕТАЛЬНАЯ СТРАНИЦА ФИЛЬМА ===
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    fun getTitleDetails(@PathVariable id: Int): TitleDetailsDto {
        val title = titleRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Title not found with id $id") }

        // Логика поиска видео (фильм или сериал)
        var streamUrl: String? = null

        // Если это ФИЛЬМ (MOVIE), ищем feature-video
        val videoFile = videoFileRepository.findAll().firstOrNull {
            it.title?.id == title.id &&
                    it.type == VideoType.FEATURE &&
                    it.status == VideoStatus.READY
        }

        if (videoFile != null) {
            // Формируем ссылку: http://localhost/kyskfilms/bucket/uuid/master.m3u8
            streamUrl = "$minioPublicUrl/$bucketName/${videoFile.objectName}"
        }

        return title.toDetailsDto(streamUrl)
    }

    // --- MAPPERS ---

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

    private fun Title.toDetailsDto(streamUrl: String?): TitleDetailsDto {
        // Если это сериал, мапим сезоны
        val seasonDtos = this.seasons.map { season ->
            SeasonDto(
                id = season.id!!,
                seasonNumber = season.seasonNumber,
                title = season.seasonTitle,
                episodes = season.episodes.map { ep ->
                    // Здесь можно поискать видео для каждого эпизода, если нужно
                    EpisodeDto(
                        id = ep.id!!,
                        episodeNumber = ep.episodeNumber,
                        title = ep.title,
                        description = ep.description,
                        durationMinutes = ep.durationMinutes,
                        streamUrl = null // Пока null, фронт запрашивает эпизоды отдельно или играет фильм
                    )
                }
            )
        }

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
            streamUrl = streamUrl, // <-- Главная ссылка на видео (для MOVIE)
            seasons = seasonDtos
        )
    }
}