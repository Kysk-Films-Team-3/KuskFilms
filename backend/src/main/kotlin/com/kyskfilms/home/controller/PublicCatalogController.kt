package com.kyskfilms.home.controller

import com.kyskfilms.home.dto.*
import com.kyskfilms.title.dto.TitleDto
import com.kyskfilms.title.entity.Title
import com.kyskfilms.title.repository.GenreRepository
import com.kyskfilms.title.repository.TitleRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.PageRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/public/catalog")
class PublicCatalogController(
    private val titleRepository: TitleRepository,
    private val genreRepository: GenreRepository,
    @Value("\${minio.public.url}") private val minioUrl: String,
    @Value("\${minio.bucket-name:images}") private val folderName: String
) {

    @GetMapping
    fun getCatalogPage(): ResponseEntity<CatalogPageDto> {
        // 1. Берем РЕАЛЬНЫЕ жанры из базы
        val allGenres = genreRepository.findAll()

        val catalogGenres = allGenres.map { genre ->
            CatalogGenreDto(
                name = genre.name,
                slug = genre.slug,
                // Иконка: если есть в MinIO файл "icons/drama.png", он подтянется
                iconUrl = "$minioUrl/$folderName/icons/${genre.slug}.png"
            )
        }

        // 2. Формируем коллекции.
        // Ищем фильмы по названиям жанров. Если жанра "Антиутопия" нет в базе — коллекция не покажется.
        val targetCollections = listOf(
            "Антиутопія" to "Світ майбутнього, який пішов не туди",
            "Антигерої" to "Коли зло рятує світ",
            "Сила Дружби" to "Разом ми сильніші",
            "Романтика" to "Історії про кохання"
        )

        val collections = targetCollections.mapNotNull { (genreName, desc) ->
            val titles = titleRepository.findTopByGenre(genreName, PageRequest.of(0, 10))
            if (titles.isNotEmpty()) {
                CollectionDto(genreName, desc, titles.map { it.toDto() })
            } else null
        }

        return ResponseEntity.ok(
            CatalogPageDto(
                title = "Каталог",
                genres = catalogGenres,
                collectionsTitle = "Добірки та Колекції",
                collections = collections
            )
        )
    }

    private fun Title.toDto(): TitleDto {
        val poster = this.posterUrl?.let { if(it.startsWith("http")) it else "$minioUrl/$folderName/$it" }
        return TitleDto(
            id = this.id!!, title = this.title, slug = this.slug, posterUrl = poster,
            rating = this.rating, type = this.type, genres = this.genres.map { it.name }
        )
    }
}