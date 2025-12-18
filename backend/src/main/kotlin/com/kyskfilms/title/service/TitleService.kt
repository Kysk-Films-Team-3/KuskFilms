package com.kyskfilms.title.service

import com.kyskfilms.title.dto.*
import com.kyskfilms.title.entity.*
import com.kyskfilms.title.repository.*
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal

@Service
class TitleService(
    private val titleRepository: TitleRepository,
    private val categoryRepository: CategoryRepository,
    private val genreRepository: GenreRepository,
    private val seasonRepository: SeasonRepository,
    private val personRepository: PersonRepository,
    private val episodeRepository: EpisodeRepository,

    // ДОБАВИЛИ РЕПОЗИТОРИЙ ДЛЯ СВЯЗЕЙ
    private val titlePersonRepository: TitlePersonRepository
) {

    @Transactional
    fun createCategory(req: CreateCategoryRequest): Category {
        val category = Category(name = req.name, slug = req.slug, description = req.description)
        return categoryRepository.save(category)
    }

    @Transactional
    fun createGenre(req: CreateGenreRequest): Genre {
        val category = categoryRepository.findById(req.categoryId)
            .orElseThrow { EntityNotFoundException("Category not found") }

        val genre = Genre(category = category, name = req.name, slug = req.slug)
        return genreRepository.save(genre)
    }

    @Transactional
    fun createTitle(req: TitleDtos): Title {
        val genres = genreRepository.findAllById(req.genreIds).toMutableSet()

        // Генерируем slug, если не пришел
        val finalSlug = req.slug?.takeIf { it.isNotBlank() }
            ?: (req.title.lowercase().replace(" ", "-") + "-" + System.currentTimeMillis())

        val title = Title(
            type = req.type,
            title = req.title,
            slug = finalSlug,
            description = req.description,
            releaseDate = req.releaseDate,
            rating = req.rating ?: BigDecimal.ZERO,
            posterUrl = req.posterUrl,
            logoUrl = req.logoUrl,
            backgroundUrl = req.backgroundUrl,
            genres = genres
        )

        val savedTitle = titleRepository.save(title)

        // === СОХРАНЕНИЕ АКТЕРОВ ===
        // req.actorIds теперь List<Long>, поэтому forEach работает корректно
        req.actorIds.forEach { actorId ->
            val person = personRepository.findById(actorId).orElse(null)
            if (person != null) {
                val titlePerson = TitlePerson(
                    title = savedTitle,
                    person = person,
                    role = "ACTOR" // Можно вынести в константу
                )
                titlePersonRepository.save(titlePerson)
            }
        }

        // === СОХРАНЕНИЕ РЕЖИССЕРОВ (если нужно) ===
        req.directorIds.forEach { directorId ->
            val person = personRepository.findById(directorId).orElse(null)
            if (person != null) {
                val titlePerson = TitlePerson(
                    title = savedTitle,
                    person = person,
                    role = "DIRECTOR"
                )
                titlePersonRepository.save(titlePerson)
            }
        }

        return savedTitle
    }

    @Transactional
    fun createSeason(req: CreateSeasonRequest): Season {
        val title = titleRepository.findById(req.titleId)
            .orElseThrow { EntityNotFoundException("Title not found") }

        val season = Season(
            title = title,
            seasonNumber = req.seasonNumber,
            seasonTitle = req.seasonTitle
        )
        return seasonRepository.save(season)
    }

    @Transactional
    fun createEpisode(req: CreateEpisodeRequest): Episode {
        val season = seasonRepository.findById(req.seasonId)
            .orElseThrow { EntityNotFoundException("Season not found") }

        val episode = Episode(
            season = season,
            episodeNumber = req.episodeNumber,
            title = req.title,
            description = req.description
        )
        return episodeRepository.save(episode)
    }

    @Transactional(readOnly = true)
    fun getAllGenres(): List<Genre> = genreRepository.findAll()

    @Transactional(readOnly = true)
    fun getAllPersons(search: String?): List<Person> {
        return if (search.isNullOrBlank()) {
            personRepository.findAll()
        } else {
            personRepository.findAllByNameContainingIgnoreCase(search)
        }
    }

    fun getAllTitles(): List<Title> = titleRepository.findAll()

    fun getTitleById(id: Int): Title = titleRepository.findById(id)
        .orElseThrow { EntityNotFoundException("Title not found") }
}