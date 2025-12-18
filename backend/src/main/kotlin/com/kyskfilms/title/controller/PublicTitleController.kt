package com.kyskfilms.title.controller

import com.kyskfilms.home.dto.FilterOptionsDto
import com.kyskfilms.home.dto.MoviesPageMetaDto
import com.kyskfilms.title.dto.*
import com.kyskfilms.title.entity.Title
import com.kyskfilms.title.repository.GenreRepository
import com.kyskfilms.title.repository.TitleRepository
import com.kyskfilms.title.service.TitleSpecification
import com.kyskfilms.user.repository.FavoriteRepository
import com.kyskfilms.video.entity.VideoStatus
import com.kyskfilms.video.entity.VideoType
import com.kyskfilms.video.repository.VideoFileRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal
import com.kyskfilms.comment.repository.CommentRepository // <-- Добавь
import com.kyskfilms.user.service.UserProfileService // <-- Если нужно проверять премиум


@RestController
@RequestMapping("/api/public/titles")
class PublicTitleController(
    private val titleRepository: TitleRepository,
    private val genreRepository: GenreRepository,
    private val videoFileRepository: VideoFileRepository,
    private val favoriteRepository: FavoriteRepository,
    private val commentRepository: CommentRepository,

    @Value("\${app.backend-url:http://localhost:8081}")
    private val backendUrl: String,

    @Value("\${minio.public.url}")
    private val minioUrl: String,

    @Value("\${minio.bucket-name:images}")
    private val folderName: String
) {

    // === 1. МЕТАДАННЫЕ ДЛЯ СТРАНИЦЫ ФИЛЬМОВ (Дропдауны) ===
    @GetMapping("/page-meta")
    fun getMoviesPageMeta(): ResponseEntity<MoviesPageMetaDto> {
        val genres = genreRepository.findAll().map { it.name }.sorted()
        val years = titleRepository.findDistinctYears()

        return ResponseEntity.ok(
            MoviesPageMetaDto(
                title = "Фільми",
                description = "Онлайн-кінотеатр KYSK зібрав для своїх передплатників колекцію з тисяч фільмів різних жанрів і напрямків.",
                filters = FilterOptionsDto(
                    genres = genres,
                    years = years,
                    sortOptions = mapOf(
                        "newest" to "Новинки",
                        "rating_desc" to "Високий рейтинг",
                        "rating_asc" to "Низький рейтинг",
                        "oldest" to "Старіші"
                    )
                )
            )
        )
    }

    // === 2. КАТАЛОГ С ФИЛЬТРАЦИЕЙ ===
    @GetMapping
    @Transactional(readOnly = true)
    fun getAllTitles(
        @RequestParam(required = false) search: String?,
        @RequestParam(required = false) genre: String?,
        @RequestParam(required = false) year: Int?,
        @RequestParam(required = false) ratingFrom: BigDecimal?,
        @RequestParam(required = false) sort: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): Page<TitleDto> {

        val sortOrder = when (sort) {
            "newest" -> Sort.by("releaseDate").descending()
            "oldest" -> Sort.by("releaseDate").ascending()
            "rating_desc" -> Sort.by("rating").descending()
            "rating_asc" -> Sort.by("rating").ascending()
            else -> Sort.by("id").descending()
        }

        val pageable = PageRequest.of(page, size, sortOrder)
        val spec = TitleSpecification.filter(search, genre, year, ratingFrom)

        val titlesPage = titleRepository.findAll(spec, pageable)

        // --- ЛОГИКА ИЗБРАННОГО ---
        val currentUserId = getCurrentUserId()
        val savedIds = if (currentUserId != null) {
            // Если юзер залогинен, берем все ID его лайков
            favoriteRepository.findAllTitleIdsByUserId(currentUserId)
        } else {
            emptySet()
        }

        // Проставляем isSaved для каждого фильма
        return titlesPage.map { it.toDto(isSaved = savedIds.contains(it.id)) }
    }

    // === 3. ДЕТАЛЬНАЯ СТРАНИЦА ===
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    fun getTitleDetails(@PathVariable id: Int): TitleDetailsDto {
        val title = titleRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Title not found with id $id") }

        var streamUrl: String? = null

        val videoFile = videoFileRepository.findFirstByTitleIdAndTypeAndStatus(
            titleId = title.id!!,
            type = VideoType.FEATURE,
            status = VideoStatus.READY
        )

        if (videoFile != null && videoFile.objectName != null) {
            val parts = videoFile.objectName!!.split("/")
            if (parts.size == 2) {
                streamUrl = "$backendUrl/api/stream/${parts[0]}/${parts[1]}"
            }
        }

        // Проверяем лайк для конкретного фильма
        val currentUserId = getCurrentUserId()
        val isSaved = if (currentUserId != null) {
            favoriteRepository.existsByUserIdAndTitleId(currentUserId, title.id!!)
        } else false

        return title.toDetailsDto(streamUrl, isSaved)
    }

    // --- HELPER: Получить ID юзера из токена ---
    private fun getCurrentUserId(): String? {
        val auth = SecurityContextHolder.getContext().authentication
        if (auth != null && auth.principal is Jwt) {
            return (auth.principal as Jwt).subject
        }
        return null
    }

    // --- MAPPERS ---

    private fun Title.toDto(isSaved: Boolean = false): TitleDto {
        val poster = this.posterUrl?.let { if(it.startsWith("http")) it else "$minioUrl/$folderName/$it" }

        return TitleDto(
            id = this.id!!,
            title = this.title,
            slug = this.slug,
            posterUrl = poster,
            rating = this.rating,
            type = this.type,
            genres = this.genres.map { it.name },
            isSaved = isSaved // <-- Передаем статус избранного
        )
    }

    private fun Title.toDetailsDto(streamUrl: String?, isSaved: Boolean = false): TitleDetailsDto {
        val seasonDtos = this.seasons.map { season ->
            SeasonDto(
                id = season.id!!,
                seasonNumber = season.seasonNumber,
                title = season.seasonTitle,
                episodes = season.episodes.map { ep ->
                    EpisodeDto(
                        id = ep.id!!,
                        episodeNumber = ep.episodeNumber,
                        title = ep.title,
                        description = ep.description,
                        durationMinutes = ep.durationMinutes,
                        streamUrl = null
                    )
                }
            )
        }

        val poster = this.posterUrl?.let { if(it.startsWith("http")) it else "$minioUrl/$folderName/$it" }

        return TitleDetailsDto(
            id = this.id!!,
            title = this.title,
            slug = this.slug,
            description = this.description,
            releaseDate = this.releaseDate,
            posterUrl = poster,
            rating = this.rating,
            type = this.type,
            genres = this.genres.map { it.name },
            streamUrl = streamUrl,
            seasons = seasonDtos,

        )
    }
}