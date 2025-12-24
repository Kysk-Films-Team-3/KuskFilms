package com.kyskfilms.person.controller

import com.kyskfilms.person.dto.*
import com.kyskfilms.title.dto.TitleDto
import com.kyskfilms.title.repository.PersonRepository
import com.kyskfilms.title.repository.TitlePersonRepository
import com.kyskfilms.title.repository.TitleRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.PageRequest
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import java.time.Period
import java.time.format.DateTimeParseException

@RestController
@RequestMapping("/api/public/persons")
class PublicPersonController(
    private val personRepository: PersonRepository,
    private val titlePersonRepository: TitlePersonRepository,
    private val titleRepository: TitleRepository,
    @Value("\${minio.public.url}") private val minioUrl: String,
    @Value("\${minio.bucket-name:images}") private val folderName: String
) {

    // Helper для чистки путей
    private fun resolveUrl(path: String?): String? {
        if (path == null) return null
        if (path.startsWith("http")) return path
        val cleanPath = path.removePrefix("$folderName/").removePrefix("/")
        return "$minioUrl/$folderName/$cleanPath"
    }

    // 1. ДЕТАЛИ АКТЕРА
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    fun getPersonDetails(@PathVariable id: Long): ResponseEntity<PersonDetailsDto> {
        val person = personRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Person not found with id $id") }

        val birthDateParsed: LocalDate? = try {
            person.birthDate?.let { LocalDate.parse(it.toString()) }
        } catch (e: DateTimeParseException) {
            null
        }

        val age = birthDateParsed?.let { Period.between(it, LocalDate.now()).years }

        val titlePersons = titlePersonRepository.findAllByPersonIdWithTitlesAndGenres(id)
        val filmography = titlePersons.map { tp ->
            val title = tp.title
            val poster = resolveUrl(title.posterUrl) // FIX HERE
            PersonFilmographyDto(
                id = title.id!!, title = title.title, posterUrl = poster,
                rating = title.rating.toDouble(), releaseDate = title.releaseDate,
                role = tp.role, genres = title.genres.map { it.name }
            )
        }.distinctBy { it.id }

        val ui = PersonUiDto(
            filmographyTitle = "Фільмографія",
            sortLabel = "Сортувати",
            genreLabel = "Жанр",
            ageLabel = "Вік",
            ageUnit = "років",
            birthDateLabel = "Дата народження:",
            genderLabel = "Стать:",
            genderMale = "Чоловіча",
            genderFemale = "Жіноча",
            relativesLabel = "Родичі:",
            birthPlaceLabel = "Місце народження:"
        )

        return ResponseEntity.ok(
            PersonDetailsDto(
                id = person.id!!,
                name = person.name,
                photoUrl = resolveUrl(person.photoUrl), // FIX HERE
                activityType = person.activityType,
                gender = person.gender,
                age = age,
                birthDate = birthDateParsed,
                birthPlace = person.birthPlace,
                relatives = listOf(),
                filmography = filmography,
                ui = ui
            )
        )
    }

    // 2. РЕКОМЕНДАЦИИ
    @GetMapping("/{id}/recommendations")
    @Transactional(readOnly = true)
    fun getRecommendations(@PathVariable id: Long): ResponseEntity<List<PersonRecommendationDto>> {
        val person = personRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Person not found") }

        val type = person.activityType ?: "Актор"
        val recommendations = personRepository.findRandomRecommendations(type, id)

        val dtos = recommendations.map { p ->
            PersonRecommendationDto(
                id = p.id!!,
                name = p.name,
                photoUrl = resolveUrl(p.photoUrl), // FIX HERE
                activityType = p.activityType
            )
        }
        return ResponseEntity.ok(dtos)
    }

    // 3. ФИЛЬМЫ С УЧАСТИЕМ
    @GetMapping("/{id}/titles")
    @Transactional(readOnly = true)
    fun getPersonTitles(@PathVariable id: Long): ResponseEntity<List<TitleDto>> {
        if (!personRepository.existsById(id)) {
            throw EntityNotFoundException("Person not found")
        }

        val titles = titleRepository.findTopTitlesByPersonId(id, PageRequest.of(0, 10))

        val dtos = titles.map { t ->
            TitleDto(
                id = t.id!!,
                title = t.title,
                slug = t.slug,
                posterUrl = resolveUrl(t.posterUrl), // FIX HERE
                rating = t.rating,
                type = t.type,
                genres = t.genres.map { it.name },
                isSaved = false
            )
        }
        return ResponseEntity.ok(dtos)
    }

    // 4. ВЫБОР АКТЕРА
    @GetMapping("/{id}/picks")
    @Transactional(readOnly = true)
    fun getActorPicks(@PathVariable id: Long): ResponseEntity<ActorPicksResponse> {
        val person = personRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Person not found") }

        val topMovies = titleRepository.findTop50ByOrderByRatingDesc()
        val picks = topMovies.shuffled().take(8)

        val items = picks.map { t ->
            TitleDto(
                id = t.id!!,
                title = t.title,
                slug = t.slug,
                posterUrl = resolveUrl(t.posterUrl), // FIX HERE
                rating = t.rating,
                type = t.type,
                genres = t.genres.map { it.name },
                isSaved = false
            )
        }

        val quote = when {
            person.name.contains("Кіану", ignoreCase = true) || person.name.contains("Keanu", ignoreCase = true) ->
                "Мистецтво — це спроба знайти хороше в людях і зробити світ співчутливішим."
            person.name.contains("Леонардо", ignoreCase = true) ->
                "Якщо ти робиш те, що у тебе виходить найкраще, ти будеш щасливим."
            else -> "Кіно повинно змусити вас забути, що ви сидите в кінотеатрі."
        }

        return ResponseEntity.ok(
            ActorPicksResponse(
                title = "${person.name} рекомендує",
                quote = quote,
                items = items,
                ui = ActorPicksUiDto(
                    saveLabel = "До обраного",
                    shareLabel = "Поділитися",
                    moreLabel = "Детальніше"
                )
            )
        )
    }
}