package com.kyskfilms.home.controller

import com.kyskfilms.home.dto.*
import com.kyskfilms.title.entity.Title
import com.kyskfilms.title.entity.enums.TitleType
import com.kyskfilms.title.repository.CategoryRepository
import com.kyskfilms.title.repository.TitleRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal
import java.time.LocalDate

@RestController
@RequestMapping("/api/public/home")
class PublicHomeController(
    private val titleRepository: TitleRepository,
    private val categoryRepository: CategoryRepository,

    @Value("\${minio.public.url}")
    private val minioUrl: String,

    @Value("\${minio.bucket-name:images}")
    private val folderName: String
) {

    @GetMapping
    fun getHomePage(): ResponseEntity<HomePageDto> {
        val allTitles = titleRepository.findAll()
        val allCategories = categoryRepository.findAll()

        return ResponseEntity.ok(
            HomePageDto(
                carousel = getCarouselFromDb(allTitles),
                categories = getCategoriesFromDb(allCategories),
                sections = getSectionsFromDb(allTitles),
                celebrities = getCelebritiesMock(),
                promo = getPromoFromDb(allTitles),
                // Добавляем иконки для UI (кнопки)
                icons = getUiIcons()
            )
        )
    }

    // --- UI ICONS ---
    private fun getUiIcons(): Map<String, String> {
        return mapOf(
            "share" to "$minioUrl/ui/share.png",
            "save" to "$minioUrl/ui/plus.png",
            "dislike" to "$minioUrl/ui/dislike.png",
            "info" to "$minioUrl/ui/info.png",
            "play" to "$minioUrl/ui/play.png"
        )
    }

    // --- HELPER ---
    private fun resolveImageUrl(path: String?): String {
        if (path.isNullOrBlank()) return ""
        if (path.startsWith("http")) return path
        return "$minioUrl/$folderName/$path"
    }

    private fun buildIconUrl(filename: String): String {
        return "$minioUrl/$folderName/icons/$filename"
    }

    // --- MAPPERS ---

    private fun getCarouselFromDb(titles: List<Title>): List<CarouselItemDto> {
        return titles.shuffled().take(5).map { title ->
            CarouselItemDto(
                id = title.id?.toLong() ?: 0L,
                imageUrl = resolveImageUrl(title.posterUrl),
                isNew = title.releaseDate?.year == LocalDate.now().year,
                title = title.title,
                rating = title.rating ?: BigDecimal.ZERO,
                year = title.releaseDate?.year ?: 2025,
                genre = title.genres.firstOrNull()?.name ?: "Кино",
                duration = if (title.type == TitleType.SERIES) "1 сезон" else "2ч"
            )
        }
    }

    private fun getCategoriesFromDb(categories: List<com.kyskfilms.title.entity.Category>): List<CategoryIconDto> {
        return categories.map { cat ->
            val iconName = when (cat.slug) {
                "movies" -> "movies.png"
                "series" -> "series.png"
                "documentary" -> "doc.png"
                "anime" -> "anime.png"
                else -> "movies.png"
            }

            CategoryIconDto(
                id = cat.id ?: 0,
                iconUrl = buildIconUrl(iconName),
                name = cat.name,
                slug = cat.slug
            )
        }
    }

    private fun getSectionsFromDb(titles: List<Title>): List<MovieSectionDto> {
        val sections = mutableListOf<MovieSectionDto>()

        if (titles.isNotEmpty()) {
            sections.add(
                MovieSectionDto(categoryId = 100, title = "Популярне на KyskFilms", items = titles.map { toMovieCard(it) })
            )
        }

        val movies = titles.filter { it.type == TitleType.MOVIE }
        if (movies.isNotEmpty()) {
            sections.add(
                MovieSectionDto(categoryId = 101, title = "Фільми", items = movies.map { toMovieCard(it) })
            )
        }

        val series = titles.filter { it.type == TitleType.SERIES }
        if (series.isNotEmpty()) {
            sections.add(
                MovieSectionDto(categoryId = 102, title = "Серіали", items = series.map { toMovieCard(it) })
            )
        }

        return sections
    }

    private fun toMovieCard(title: Title): MovieCardDto {
        return MovieCardDto(
            id = title.id?.toLong() ?: 0L,
            posterUrl = resolveImageUrl(title.posterUrl),
            title = title.title,
            rating = title.rating ?: BigDecimal.ZERO,
            year = title.releaseDate?.year ?: 2025,
            country = "США",
            genre = title.genres.firstOrNull()?.name ?: "Кіно",
            seasonsCount = if (title.type == TitleType.SERIES) 1 else null,
            isSaved = false
        )
    }

    private fun getPromoFromDb(titles: List<Title>): PromoBlockDto? {
        val promoTitle = titles.find { it.id == 4 } ?: titles.maxByOrNull { it.rating ?: BigDecimal.ZERO }

        return promoTitle?.let { title ->
            PromoBlockDto(
                id = title.id?.toLong() ?: 0L,
                imageUrl = resolveImageUrl(title.posterUrl),
                badgeText = "Вибір редакції",
                title = title.title,
                rating = title.rating ?: BigDecimal.ZERO,
                year = title.releaseDate?.year ?: 2025,
                genre = title.genres.firstOrNull()?.name ?: "Драма",
                duration = "2ч 49мин",
                description = title.description ?: "Смотрите лучший фильм в высоком качестве.",
                buttonText = "Дивитися",
                isSaved = false
            )
        }
    }

    private fun getCelebritiesMock(): List<CelebrityCollectionDto> {
        return listOf(
            CelebrityCollectionDto(
                collectionId = 101L,
                actorId = 55L,
                actorName = "Кіану Рівз",
                actorImageUrl = "$minioUrl/$folderName/actors/keanu.jpg",
                badgeText = "Колекція",
                description = "Всі фільми з Нео"
            )
        )
    }
}