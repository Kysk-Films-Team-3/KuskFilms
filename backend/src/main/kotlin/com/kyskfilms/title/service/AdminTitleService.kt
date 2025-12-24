package com.kyskfilms.title.service

import com.kyskfilms.comment.repository.CommentRepository
import com.kyskfilms.title.dto.SaveTitleRequest
import com.kyskfilms.title.entity.*
import com.kyskfilms.title.repository.*
import com.kyskfilms.video.repository.VideoFileRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AdminTitleService(
    private val titleRepository: TitleRepository,
    private val genreRepository: GenreRepository,
    private val personRepository: PersonRepository,
    private val titlePersonRepository: TitlePersonRepository,
    private val seasonRepository: SeasonRepository,
    // Новые инжекты для очистки
    private val videoFileRepository: VideoFileRepository,
    private val commentRepository: CommentRepository
) {

    @Transactional
    fun saveFullTitle(req: SaveTitleRequest): Title {
        // Логика создания/обновления (без изменений, скопирована из предыдущих версий)
        val slug = req.slug?.takeIf { it.isNotBlank() }
            ?: (req.title.lowercase().replace(" ", "-") + "-" + System.currentTimeMillis())

        val title = Title(
            id = req.id, // Важно передать ID если это обновление
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

        if (req.genreIds.isNotEmpty()) {
            title.genres = genreRepository.findAllById(req.genreIds as Iterable<Int?>).toMutableSet()
        }

        val savedTitle = titleRepository.save(title)

        // Пересохраняем актеров (простой вариант: удаляем старые связи, пишем новые,
        // но для Create это ок. Для Update лучше проверять, но пока оставим append)
        if (req.persons.isNotEmpty()) {
            // Если это update, по хорошему надо почистить старые связи
            if (req.id != null) titlePersonRepository.deleteAllByTitleId(req.id)

            req.persons.forEach { personRel ->
                val person = personRepository.findById(personRel.personId).orElse(null)
                if (person != null) {
                    titlePersonRepository.save(TitlePerson(title = savedTitle, person = person, role = personRel.role))
                }
            }
        }

        if (req.seasons.isNotEmpty()) {
            req.seasons.forEach { seasonDto ->
                val season = Season(title = savedTitle, seasonNumber = seasonDto.seasonNumber, seasonTitle = seasonDto.seasonTitle)
                val savedSeason = seasonRepository.save(season)
                seasonDto.episodes.forEach { epDto ->
                    val episode = Episode(
                        season = savedSeason,
                        episodeNumber = epDto.episodeNumber,
                        title = epDto.title,
                        description = epDto.description,
                        releaseDate = epDto.releaseDate,
                        posterUrl = epDto.posterUrl
                    )
                    savedSeason.episodes.add(episode)
                }
                seasonRepository.save(savedSeason)
            }
        }
        return savedTitle
    }

    // ИСПРАВЛЕННОЕ УДАЛЕНИЕ
    @Transactional
    fun deleteTitle(id: Int) {
        if (!titleRepository.existsById(id)) {
            throw EntityNotFoundException("Title not found with id $id")
        }

        // 1. Удаляем связи с актерами
        titlePersonRepository.deleteAllByTitleId(id)

        // 2. Удаляем видео файлы (ссылки в БД)
        videoFileRepository.deleteAllByTitleId(id)

        // 3. Удаляем комментарии
        commentRepository.deleteAllByTitleId(id)

        // 4. Удаляем сам фильм (Сезоны и Эпизоды удалятся сами благодаря CascadeType.ALL в Entity Title)
        titleRepository.deleteById(id)
    }
}