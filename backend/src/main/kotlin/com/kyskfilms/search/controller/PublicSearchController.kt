package com.kyskfilms.search.controller

import com.kyskfilms.search.dto.*
import com.kyskfilms.title.repository.PersonRepository
import com.kyskfilms.title.repository.TitleRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.PageRequest
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/public/search")
class PublicSearchController(
    private val personRepository: PersonRepository,
    private val titleRepository: TitleRepository,
    @Value("\${minio.public.url}") private val minioUrl: String,
    @Value("\${minio.bucket-name:images}") private val folderName: String
) {
    @GetMapping
    @Transactional(readOnly = true)
    fun search(@RequestParam("q") query: String): ResponseEntity<GlobalSearchResponse> {
        val trimmedQuery = query.trim()
        val pageable = PageRequest.of(0, 20)

        // Логика поиска
        val persons = if (trimmedQuery.length >= 2) personRepository.searchByName(trimmedQuery, pageable).map {
            SearchPersonDto(it.id!!, it.name, it.photoUrl?.let { url -> if(url.startsWith("http")) url else "$minioUrl/$folderName/$url" }, it.activityType)
        } else emptyList()

        val titles = if (trimmedQuery.length >= 2) titleRepository.searchByTitle(trimmedQuery, pageable).map {
            SearchTitleDto(it.id!!, it.title, it.posterUrl?.let { url -> if(url.startsWith("http")) url else "$minioUrl/$folderName/$url" }, it.rating?.toDouble(), it.releaseDate?.year, it.type.name)
        } else emptyList()

        // UI Тексты
        val ui = SearchUiDto(
            resultsTitlePrefix = "Результат пошуку",
            personsSection = "Актори та режисери:",
            titlesSection = "Фільми та серіали:",
            emptyTitle = "Увага, виявлена помилка",
            emptyDescription = "Нічого не знайдено! Для точного пошуку, введіть оригінальну назву."
        )

        return ResponseEntity.ok(GlobalSearchResponse(trimmedQuery, persons, titles, ui))
    }
}