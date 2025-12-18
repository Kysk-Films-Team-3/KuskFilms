package com.kyskfilms.title.controller

import com.kyskfilms.comment.repository.CommentRepository
import com.kyskfilms.home.dto.FilterOptionsDto
import com.kyskfilms.home.dto.MoviesPageMetaDto
import com.kyskfilms.title.dto.*
import com.kyskfilms.title.entity.Title
import com.kyskfilms.title.entity.enums.TitleType
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

@RestController
@RequestMapping("/api/public/titles")
class PublicTitleController(
    private val titleRepository: TitleRepository,
    private val genreRepository: GenreRepository,
    private val videoFileRepository: VideoFileRepository,
    private val favoriteRepository: FavoriteRepository,
    private val commentRepository: CommentRepository,
    @Value("\${app.backend-url:http://localhost:8081}") private val backendUrl: String,
    @Value("\${minio.public.url}") private val minioUrl: String,
    @Value("\${minio.bucket-name:images}") private val folderName: String
) {

    // 1. Метаданные для каталога (фильтры)
    @GetMapping("/page-meta")
    fun getMoviesPageMeta(): ResponseEntity<MoviesPageMetaDto> {
        val genres = genreRepository.findAll().map { it.name }.sorted()
        val years = titleRepository.findDistinctYears()
        return ResponseEntity.ok(MoviesPageMetaDto(
            title = "Фільми",
            description = "Колекція фільмів KYSK.",
            filters = FilterOptionsDto(genres, years, mapOf("newest" to "Новинки", "rating_desc" to "Високий рейтинг"))
        ))
    }

    // 2. Каталог
    @GetMapping
    fun getAllTitles(
        @RequestParam(required = false) search: String?,
        @RequestParam(required = false) genre: String?,
        @RequestParam(required = false) year: Int?,
        @RequestParam(required = false) ratingFrom: BigDecimal?,
        @RequestParam(required = false) sort: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): Page<TitleDto> {
        val sortOrder = if (sort == "oldest") Sort.by("releaseDate").ascending() else Sort.by("releaseDate").descending()
        val pageable = PageRequest.of(page, size, sortOrder)
        val spec = TitleSpecification.filter(search, genre, year, ratingFrom)
        val titlesPage = titleRepository.findAll(spec, pageable)
        val savedIds = getCurrentUserId()?.let { favoriteRepository.findAllTitleIdsByUserId(it) } ?: emptySet()
        return titlesPage.map { it.toDto(savedIds.contains(it.id)) }
    }

    // 3. СТРАНИЦА ФИЛЬМА (Полная сборка с UI текстами)
    @GetMapping("/{id}/page")
    @Transactional(readOnly = true)
    fun getTitlePage(@PathVariable id: Int): ResponseEntity<TitlePageResponse> {
        val title = titleRepository.findById(id).orElseThrow { EntityNotFoundException("Title not found") }

        // Логика данных
        val userId = getCurrentUserId()
        val isSaved = if (userId != null) favoriteRepository.existsByUserIdAndTitleId(userId, id) else false

        // Видео
        val movieFile = videoFileRepository.findFirstByTitleIdAndTypeAndStatus(title.id!!, VideoType.FEATURE, VideoStatus.READY)
        val streamUrl = movieFile?.objectName?.let { "$backendUrl/api/stream/${it.split("/")[0]}/${it.split("/")[1]}" }
        val trailerFile = videoFileRepository.findFirstByTitleIdAndTypeAndStatus(title.id!!, VideoType.TRAILER, VideoStatus.READY)
        val trailerUrl = trailerFile?.objectName?.let { "$backendUrl/api/stream/${it.split("/")[0]}/${it.split("/")[1]}" }

        // Люди
        val directors = title.persons.filter { it.role == "DIRECTOR" }
        val actors = title.persons.filter { it.role == "ACTOR" }
        val directorsText = directors.joinToString(", ") { it.person!!.name }
        val actorsText = actors.take(3).joinToString(", ") { it.person!!.name } + if (actors.size > 3) "..." else ""

        val castDto = (directors + actors).map {
            PersonDto(it.person!!.id!!, it.person.name, resolveUrl(it.person.photoUrl), if(it.role=="ACTOR") "Актор" else "Режисер")
        }

        // Отзывы и Рекомендации
        val reviews = commentRepository.findAllByTitleIdOrderByCreatedAtDesc(id, PageRequest.of(0, 5))
            .map { ReviewDto(it.id!!, "Користувач", it.text, it.rating ?: 10, it.createdAt.toLocalDate().toString()) }
        val recommendations = titleRepository.findRecommendations(id, PageRequest.of(0, 5)).map { it.toDto(false) }

        return ResponseEntity.ok(TitlePageResponse(
            id = title.id!!,
            title = title.title,
            posterUrl = resolveUrl(title.posterUrl),
            backgroundUrl = resolveUrl(title.backgroundUrl ?: title.posterUrl),
            logoUrl = resolveUrl(title.logoUrl),
            rating = title.rating ?: BigDecimal.ZERO,
            year = title.releaseDate?.year ?: 2025,
            genre = title.genres.joinToString(", ") { it.name },
            duration = if (title.type == TitleType.MOVIE) "2г 15хв" else "${title.seasons.size} сезони",
            shortDescription = title.description?.take(150)?.plus("...") ?: "",

            // UI ТЕКСТЫ (Хардкод с бэка)
            directorsText = directorsText,
            actorsText = actorsText,
            subscriptionPrice = "15€/місяць",
            subscriptionLabel = "у підписці Kysk",
            hasPremium = false, // Заглушка
            isSaved = isSaved,
            streamUrl = streamUrl,
            trailerUrl = trailerUrl,
            fullDescriptionTitle = "Опис",
            fullDescription = title.description ?: "Опис відсутній",
            cast = castDto,
            reviews = reviews,
            recommendations = recommendations
        ))
    }

    private fun resolveUrl(path: String?): String? = path?.let { if(it.startsWith("http")) it else "$minioUrl/$folderName/$it" }
    private fun getCurrentUserId(): String? = (SecurityContextHolder.getContext().authentication?.principal as? Jwt)?.subject
    private fun Title.toDto(isSaved: Boolean) = TitleDto(this.id!!, this.title, this.slug, resolveUrl(this.posterUrl), this.rating, this.type, this.genres.map { it.name }, isSaved)
}