package com.kyskfilms.title.service

import com.kyskfilms.title.dto.SaveTitleRequest
import com.kyskfilms.title.entity.*
import com.kyskfilms.title.repository.*
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AdminTitleService(
    private val titleRepository: TitleRepository,
    private val genreRepository: GenreRepository,
    private val personRepository: PersonRepository,
    private val titlePersonRepository: TitlePersonRepository,
    private val seasonRepository: SeasonRepository // Добавил репозиторий сезонов
) {

    @Transactional
    fun saveFullTitle(req: SaveTitleRequest): Title {
        // 1. Генерация слага (если нет)
        val slug = req.slug?.takeIf { it.isNotBlank() }
            ?: (req.title.lowercase().replace(" ", "-") + "-" + System.currentTimeMillis())

        // 2. Создаем Entity
        val title = Title(
            type = req.type,
            title = req.title,
            slug = slug,
            description = req.description,
            releaseDate = req.releaseDate,
            rating = req.rating ?: java.math.BigDecimal.ZERO,
            posterUrl = req.posterUrl,
            logoUrl = req.logoUrl,
            backgroundUrl = req.backgroundUrl
        )

        // 3. Жанры
        if (req.genreIds.isNotEmpty()) {
            val genres = genreRepository.findAllById(req.genreIds).toMutableSet()
            title.genres = genres
        }

        // Сохраняем Title, чтобы получить ID
        val savedTitle = titleRepository.save(title)

        // 4. Актеры и Режиссеры
        if (req.persons.isNotEmpty()) {
            req.persons.forEach { personRel ->
                val person = personRepository.findById(personRel.personId).orElse(null)
                if (person != null) {
                    val relation = TitlePerson(
                        title = savedTitle,
                        person = person,
                        role = personRel.role
                    )
                    titlePersonRepository.save(relation)
                }
            }
        }

        // 5. Сезоны и Эпизоды (Если это Сериал)
        if (req.seasons.isNotEmpty()) {
            req.seasons.forEach { seasonDto ->
                val season = Season(
                    title = savedTitle,
                    seasonNumber = seasonDto.seasonNumber,
                    seasonTitle = seasonDto.seasonTitle
                )
                // Сохраняем сезон, чтобы получить ID для эпизодов
                val savedSeason = seasonRepository.save(season)

                seasonDto.episodes.forEach { epDto ->
                    val episode = Episode(
                        season = savedSeason,
                        episodeNumber = epDto.episodeNumber,
                        title = epDto.title,
                        description = epDto.description,
                        releaseDate = epDto.releaseDate,
                        posterUrl = epDto.posterUrl
                        // Видео эпизода загружается отдельно через EpisodeVideoController
                    )
                    // Episode сохраняется каскадно или нужно инжектить episodeRepository
                    // В Entity Season у тебя cascade = [CascadeType.ALL], поэтому достаточно добавить в список:
                    savedSeason.episodes.add(episode)
                }
                // Обновляем сезон с эпизодами (если Hibernate не подхватил автоматом, лучше сохранить явно)
                seasonRepository.save(savedSeason)
            }
        }

        return savedTitle
    }

    @Transactional
    fun deleteTitle(id: Int) {
        if (!titleRepository.existsById(id)) {
            throw EntityNotFoundException("Title not found with id $id")
        }
        titleRepository.deleteById(id)
    }
}