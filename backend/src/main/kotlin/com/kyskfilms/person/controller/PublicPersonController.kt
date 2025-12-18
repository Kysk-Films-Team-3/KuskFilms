package com.kyskfilms.person.controller

import com.kyskfilms.person.dto.*
import com.kyskfilms.title.repository.PersonRepository
import com.kyskfilms.title.repository.TitlePersonRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Value
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
    @Value("\${minio.public.url}") private val minioUrl: String,
    @Value("\${minio.bucket-name:images}") private val folderName: String
) {

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    fun getPersonDetails(@PathVariable id: Long): ResponseEntity<PersonDetailsDto> {
        val person = personRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Person not found with id $id") }

        // Логика: Парсинг даты и расчет возраста
        val birthDateParsed: LocalDate? = try {
            person.birthDate?.let { LocalDate.parse(it.toString()) }
        } catch (e: DateTimeParseException) { null }

        val age = birthDateParsed?.let { Period.between(it, LocalDate.now()).years }

        // Логика: Получение фильмов и жанров
        val titlePersons = titlePersonRepository.findAllByPersonIdWithTitlesAndGenres(id)
        val filmography = titlePersons.map { tp ->
            val title = tp.title!!
            val poster = title.posterUrl?.let { if(it.startsWith("http")) it else "$minioUrl/$folderName/$it" }
            PersonFilmographyDto(
                id = title.id!!, title = title.title, posterUrl = poster,
                rating = title.rating?.toDouble() ?: 0.0, releaseDate = title.releaseDate,
                role = tp.role, genres = title.genres.map { it.name }
            )
        }.distinctBy { it.id }

        // UI: Тексты
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

        return ResponseEntity.ok(PersonDetailsDto(
            id = person.id!!, name = person.name, photoUrl = person.photoUrl?.let { if(it.startsWith("http")) it else "$minioUrl/$folderName/$it" },
            activityType = person.activityType, gender = person.gender, age = age,
            birthDate = birthDateParsed, birthPlace = person.birthPlace,
            relatives = listOf(), // Заглушка
            filmography = filmography,
            ui = ui
        ))
    }
}