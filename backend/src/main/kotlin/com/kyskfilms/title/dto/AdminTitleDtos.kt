package com.kyskfilms.title.dto

import com.kyskfilms.title.entity.enums.TitleType
import java.math.BigDecimal
import java.time.LocalDate

/**
 * DTO для сохранения всего дерева данных фильма/сериала из Админки.
 * Используется в AdminTitleController и AdminTitleService.
 */
data class SaveTitleRequest(
    val title: String,
    val originalTitle: String? = null,
    val slug: String? = null, // Если null, генерируем на бэке
    val description: String? = null,

    val type: TitleType,

    val releaseDate: LocalDate? = null,
    val rating: BigDecimal? = null,

    // Ссылки на картинки (уже загруженные в MinIO)
    val posterUrl: String? = null,
    val logoUrl: String? = null,
    val backgroundUrl: String? = null,

    // Жанры (список ID)
    val genreIds: List<Int> = emptyList(),

    // Актеры и Режиссеры (список объектов с ролями)
    val persons: List<PersonRelationDto> = emptyList(),

    // Сезоны (для сериалов)
    val seasons: List<SaveSeasonDto> = emptyList(),

    // Прямая ссылка на видео (для фильмов, если нужно сохранить сразу)
    val videoUrl: String? = null
)

data class PersonRelationDto(
    val personId: Long,
    val role: String // "ACTOR", "DIRECTOR"
)

data class SaveSeasonDto(
    val seasonNumber: Int,
    val seasonTitle: String? = null,
    val episodes: List<SaveEpisodeDto> = emptyList()
)

data class SaveEpisodeDto(
    val episodeNumber: Int,
    val title: String,
    val description: String? = null,
    val releaseDate: LocalDate? = null,
    val posterUrl: String? = null,
    val videoUrl: String? = null
)