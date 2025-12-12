package com.kyskfilms.home.controller

import com.kyskfilms.home.dto.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal

@RestController
@RequestMapping("/api/public/home")
class PublicHomeController {

    @GetMapping
    fun getHomePage(): ResponseEntity<HomePageDto> {
        return ResponseEntity.ok(
            HomePageDto(
                carousel = getCarousel(),
                categories = getCategories(),
                sections = getSections(),
                celebrities = getCelebrities(),
                promo = getPromo()
            )
        )
    }


    @GetMapping("/carousel")
    fun getCarouselEndpoint(): List<CarouselItemDto> = getCarousel()

    @GetMapping("/sections")
    fun getSectionsEndpoint(): List<MovieSectionDto> = getSections()


    // --- Private Methods (MOCK DATA) ---

    private fun getCarousel(): List<CarouselItemDto> {
        return listOf(
            CarouselItemDto(
                id = 1,
                imageUrl = "https://image.tmdb.org/t/p/original/m7oMjVEwX0k0Qfx818MEkM3Z7J.jpg",
                isNew = true,
                title = "Cyberpunk: Edgerunners",
                rating = BigDecimal("8.7"),
                year = 2022,
                genre = "Аниме, Фантастика",
                duration = "1 сезон"
            ),
            CarouselItemDto(
                id = 2,
                imageUrl = "https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
                isNew = false,
                title = "Dune: Part Two",
                rating = BigDecimal("8.5"),
                year = 2024,
                genre = "Фантастика, Боевик",
                duration = "2ч 46мин"
            )
        )
    }

    private fun getCategories(): List<CategoryIconDto> {
        return listOf(
            CategoryIconDto(1, "https://img.icons8.com/color/96/movie-projector.png", "Фильмы", "movies"),
            CategoryIconDto(2, "https://img.icons8.com/color/96/tv-show.png", "Сериалы", "series"),
            CategoryIconDto(3, "https://img.icons8.com/color/96/documentary.png", "Док", "documentary"),
            CategoryIconDto(4, "https://img.icons8.com/color/96/farr.png", "Аниме", "anime")
        )
    }

    private fun getSections(): List<MovieSectionDto> {
        val matrix = MovieCardDto(1, "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", "The Matrix", BigDecimal("8.7"), 1999, "USA", "Sci-Fi", null, true)
        val dune = MovieCardDto(2, "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", "Dune 2", BigDecimal("8.5"), 2024, "USA", "Sci-Fi", null, false)
        val cyberpunk = MovieCardDto(5, "https://image.tmdb.org/t/p/w500/m7oMjVEwX0k0Qfx818MEkM3Z7J.jpg", "Cyberpunk", BigDecimal("8.6"), 2022, "Japan", "Anime", 1, false)

        return listOf(
            MovieSectionDto(10, "Популярное сейчас", listOf(matrix, dune, cyberpunk)),
            MovieSectionDto(11, "Новинки фантастики", listOf(dune, matrix)),
            MovieSectionDto(12, "Лучшие сериалы", listOf(cyberpunk))
        )
    }

    private fun getCelebrities(): List<CelebrityCollectionDto> {
        return listOf(
            CelebrityCollectionDto(
                collectionId = 101,
                actorId = 55,
                actorName = "Киану Ривз",
                actorImageUrl = "https://image.tmdb.org/t/p/w500/4D0PpNI0km39liNrCbk90u54l7O.jpg",
                badgeText = "Колекція",
                description = "Що дивиться Нео?"
            )
        )
    }

    private fun getPromo(): PromoBlockDto {
        return PromoBlockDto(
            id = 4,
            imageUrl = "https://image.tmdb.org/t/p/original/gEU2QniL6C8z1dY4cvBTsIw0kM1.jpg",
            badgeText = "Премьера на ТВ",
            title = "Интерстеллар",
            rating = BigDecimal("8.9"),
            year = 2014,
            genre = "Фантастика, Драма",
            duration = "2ч 49мин",
            description = "Когда засуха приводит человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь кротовую нору...",
            buttonText = "Оформити Premium",
            isSaved = false
        )
    }
}