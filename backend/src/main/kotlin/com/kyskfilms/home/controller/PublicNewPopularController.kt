package com.kyskfilms.home.controller

import com.kyskfilms.home.dto.*
import com.kyskfilms.title.dto.TitleDto
import com.kyskfilms.title.entity.Title
import com.kyskfilms.title.entity.enums.TitleType
import com.kyskfilms.title.repository.TitleRepository
import com.kyskfilms.user.repository.FavoriteRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.PageRequest
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal

@RestController
@RequestMapping("/api/public/new-popular")
class PublicNewPopularController(
    private val titleRepository: TitleRepository,
    private val favoriteRepository: FavoriteRepository,
    @Value("\${minio.public.url}") private val minioUrl: String,
    @Value("\${minio.bucket-name:images}") private val folderName: String
) {

    @GetMapping
    @Transactional(readOnly = true)
    fun getNewPopularPage(): ResponseEntity<NewPopularPageDto> {

        // 1. Получаем ID пользователя для проверки "Избранного"
        val userId = getCurrentUserId()
        val savedIds = if (userId != null) favoriteRepository.findAllTitleIdsByUserId(userId) else emptySet()

        // === БЛОК 1: РЕКЛАМА (Лучший Сериал) ===
        val topSeries = titleRepository.findFirstByTypeOrderByRatingDesc(TitleType.SERIES)
        val promo1 = topSeries?.toPromoDto(savedIds.contains(topSeries.id), "Новий сезон")

        // === БЛОК 2: КОЛЛЕКЦИИ ===
        val targetCollections = listOf(
            "Антиутопія" to "Світ майбутнього, який пішов не туди",
            "Антигерої" to "Коли зло рятує світ",
            "Сила Дружби" to "Разом ми сильніші",
            "Романтика" to "Історії про кохання"
        )
        val collections = targetCollections.mapNotNull { (genre, desc) ->
            val titles = titleRepository.findTopByGenre(genre, PageRequest.of(0, 10))
            if (titles.isNotEmpty()) {
                CollectionDto(genre, desc, titles.map { it.toTitleDto(savedIds.contains(it.id)) })
            } else null
        }

        // === БЛОК 3: НОВИНКИ СЕРИАЛОВ ===
        val newSeries = titleRepository.findTop10ByTypeOrderByReleaseDateDesc(TitleType.SERIES)
            .map { it.toTitleDto(savedIds.contains(it.id)) }

        // === БЛОК 4: РЕКЛАМА ВТОРАЯ (Лучший Фильм) ===
        val topMovie = titleRepository.findFirstByTypeOrderByRatingDesc(TitleType.MOVIE)
        val promo2 = topMovie?.toPromoDto(savedIds.contains(topMovie.id), "Прем'єра")

        // === БЛОК 5: НОВИНКИ ФИЛЬМОВ ===
        val newMovies = titleRepository.findTop10ByTypeOrderByReleaseDateDesc(TitleType.MOVIE)
            .map { it.toTitleDto(savedIds.contains(it.id)) }

        return ResponseEntity.ok(
            NewPopularPageDto(
                promo1 = promo1,
                collectionsTitle = "Добірка / Колекція",
                collections = collections,
                newSeriesTitle = "Новинки серіалів",
                newSeries = newSeries,
                promo2 = promo2,
                newMoviesTitle = "Новинки фільмів",
                newMovies = newMovies
            )
        )
    }

    // --- HELPERS & MAPPERS ---

    private fun getCurrentUserId(): String? {
        val auth = SecurityContextHolder.getContext().authentication
        return if (auth != null && auth.principal is Jwt) (auth.principal as Jwt).subject else null
    }

    private fun Title.toTitleDto(isSaved: Boolean): TitleDto {
        val poster = this.posterUrl?.let { if(it.startsWith("http")) it else "$minioUrl/$folderName/$it" }
        return TitleDto(
            id = this.id!!, title = this.title, slug = this.slug, posterUrl = poster,
            rating = this.rating, type = this.type, genres = this.genres.map { it.name },
            isSaved = isSaved
        )
    }

    private fun Title.toPromoDto(isSaved: Boolean, badge: String): PromoBlockDto {
        // Для промо используем backgroundUrl (широкая картинка), если есть, иначе posterUrl
        val bgImage = (this.backgroundUrl ?: this.posterUrl)?.let {
            if(it.startsWith("http")) it else "$minioUrl/$folderName/$it"
        } ?: ""

        return PromoBlockDto(
            id = this.id!!.toLong(),
            imageUrl = bgImage,
            badgeText = badge, // "Новий сезон" или "Прем'єра"
            title = this.title,
            rating = this.rating,
            year = this.releaseDate?.year ?: 2025,
            genre = this.genres.firstOrNull()?.name ?: "Кіно",
            duration = if (this.type == TitleType.SERIES) "1 сезон" else "2г 30хв", // Можно высчитывать реально
            description = this.description,
            buttonText = "Оформити преміум", // Как в ТЗ
            isSaved = isSaved
        )
    }
}