package com.kyskfilms.title.dto

import com.kyskfilms.title.entity.TitleType
import java.math.BigDecimal
import java.time.LocalDate

data class CreateCategoryRequest(
    val name: String,
    val slug: String,
    val description: String? = null
)

data class CreateGenreRequest(
    val categoryId: Int,
    val name: String,
    val slug: String
)

data class CreateTitleRequest(
    val type: TitleType,
    val title: String,
    val slug: String,
    val description: String? = null,
    val releaseDate: LocalDate? = null,
    val genreIds: List<Int> = emptyList()
)

data class CreateSeasonRequest(
    val titleId: Int,
    val seasonNumber: Int,
    val seasonTitle: String? = null
)

data class CreateEpisodeRequest(
    val seasonId: Int,
    val episodeNumber: Int,
    val title: String,
    val description: String? = null
)

data class TitleDto(
    val id: Int,
    val title: String,
    val slug: String,
    val posterUrl: String?,
    val rating: BigDecimal,
    val type: TitleType,
    val genres: List<String>
)

data class TitleDetailsDto(
    val id: Int,
    val title: String,
    val slug: String,
    val description: String?,
    val releaseDate: LocalDate?,
    val posterUrl: String?,
    val rating: BigDecimal,
    val type: TitleType,
    val genres: List<String>,

    val streamUrl: String? = null,

    val seasons: List<SeasonDto> = emptyList()
)

data class SeasonDto(
    val id: Int,
    val seasonNumber: Int,
    val title: String?,
    val episodes: List<EpisodeDto>
)

data class EpisodeDto(
    val id: Int,
    val episodeNumber: Int,
    val title: String,
    val description: String?,
    val durationMinutes: Int?,
    val streamUrl: String? = null
)