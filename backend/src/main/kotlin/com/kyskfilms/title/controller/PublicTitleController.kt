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
    private val videoFileRepository: VideoFileRepository,

    // Ссылка на сам бэкенд (например, http://localhost:8081)
    // Задается в application.yml или берется дефолт
    @Value("\${app.backend-url:http://localhost:8081}")
    private val backendUrl: String
) {

    // === КАТАЛОГ (Списком) ===
    @GetMapping
    @Transactional(readOnly = true)
    fun getAllTitles(@PageableDefault(size = 20) pageable: Pageable): Page<TitleDto> {
        val titlesPage = titleRepository.findAll(pageable)
        return titlesPage.map { it.toDto() }
    }

    // === ДЕТАЛЬНАЯ СТРАНИЦА ===
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    fun getTitleDetails(@PathVariable id: Int): TitleDetailsDto {
        val title = titleRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Title not found with id $id") }

        // Ищем видео только для ФИЛЬМОВ (для сериалов видео привязано к эпизодам)
        var streamUrl: String? = null

        // Оптимизированный запрос в БД
        val videoFile = videoFileRepository.findFirstByTitleIdAndTypeAndStatus(
            titleId = title.id!!,
            type = VideoType.FEATURE,
            status = VideoStatus.READY
        )

        // Формируем ссылку на прокси-контроллер (StreamingController)
        if (videoFile != null && videoFile.objectName != null) {
            // objectName в базе: "uuid-folder/master.m3u8"
            val parts = videoFile.objectName!!.split("/")

            if (parts.size == 2) {
                val folder = parts[0]   // uuid
                val filename = parts[1] // master.m3u8

                // Итоговая ссылка: http://localhost:8081/api/stream/uuid/master.m3u8
                streamUrl = "$backendUrl/api/stream/$folder/$filename"
            }
        }

        return title.toDetailsDto(streamUrl)
    }

    // --- MAPPERS (Преобразователи Entity -> DTO) ---

    private fun Title.toDto(): TitleDto {
        return TitleDto(
            id = this.id!!,
            title = this.title,
            slug = this.slug,
            posterUrl = this.posterUrl, // Если постеры тоже проксируются, здесь нужна похожая логика
            rating = this.rating,
            type = this.type,
            genres = this.genres.map { it.name }
        )
    }

    private fun Title.toDetailsDto(streamUrl: String?): TitleDetailsDto {
        val seasonDtos = this.seasons.map { season ->
            SeasonDto(
                id = season.id!!,
                seasonNumber = season.seasonNumber,
                title = season.seasonTitle,
                episodes = season.episodes.map { ep ->
                    // Здесь можно реализовать логику получения streamUrl для эпизода,
                    // используя videoFileRepository.findFirstByEpisodeIdAndTypeAndStatus(...)
                    EpisodeDto(
                        id = ep.id!!,
                        episodeNumber = ep.episodeNumber,
                        title = ep.title,
                        description = ep.description,
                        durationMinutes = ep.durationMinutes,
                        streamUrl = null // TODO: Реализовать, если нужно отдавать видео эпизодов сразу
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
            streamUrl = streamUrl, // Ссылка на воспроизведение (только для фильмов)
            seasons = seasonDtos
        )
    }
}