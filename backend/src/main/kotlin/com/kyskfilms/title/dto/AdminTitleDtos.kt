package com.kyskfilms.title.dto

import com.kyskfilms.title.entity.enums.TitleType
import java.math.BigDecimal
import java.time.LocalDate

data class SaveTitleRequest(
    val id: Int? = null,
    val title: String,
    val slug: String? = null,
    val description: String? = null,
    val type: TitleType,
    val releaseDate: LocalDate? = null,
    val rating: BigDecimal? = null,
    val duration: Int? = null, // Минуты
    val posterUrl: String? = null,
    val logoUrl: String? = null,
    val backgroundUrl: String? = null,

    // Списки ID или вложенных объектов
    val genreIds: List<Long> = emptyList(),
    val persons: List<TitlePersonRelationDto> = emptyList(),
    val seasons: List<AdminSeasonDto> = emptyList(),

    val videoUrl: String? = null
)

data class TitlePersonRelationDto(
    val personId: Long,
    val role: String // "ACTOR" или "DIRECTOR"
)

data class AdminSeasonDto(
    val seasonNumber: Int,
    val seasonTitle: String,
    val episodes: List<AdminEpisodeDto> = emptyList()
)

data class AdminEpisodeDto(
    val episodeNumber: Int,
    val title: String,
    val description: String? = null,
    val releaseDate: LocalDate? = null,
    val posterUrl: String? = null
)