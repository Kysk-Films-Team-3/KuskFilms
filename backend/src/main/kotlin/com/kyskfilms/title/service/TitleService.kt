package com.kyskfilms.title.service

import com.kyskfilms.title.dto.*
import com.kyskfilms.title.entity.*
import com.kyskfilms.title.repository.*
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TitleService(
    private val titleRepository: TitleRepository,
    private val categoryRepository: CategoryRepository,
    private val genreRepository: GenreRepository,
    private val seasonRepository: SeasonRepository,
    private val episodeRepository: EpisodeRepository
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
    fun createTitle(req: CreateTitleRequest): Title {
        val genres = genreRepository.findAllById(req.genreIds).toMutableSet()

        val title = Title(
            type = req.type,
            title = req.title,
            slug = req.slug,
            description = req.description,
            releaseDate = req.releaseDate,
            genres = genres
        )
        return titleRepository.save(title)
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

    fun getAllTitles(): List<Title> = titleRepository.findAll()
    fun getTitleById(id: Int): Title = titleRepository.findById(id)
        .orElseThrow { EntityNotFoundException("Title not found") }
}