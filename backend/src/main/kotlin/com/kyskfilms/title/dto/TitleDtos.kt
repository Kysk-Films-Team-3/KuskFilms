package com.kyskfilms.title.dto

import com.kyskfilms.title.entity.enums.TitleType
import java.time.LocalDate
import java.math.BigDecimal

// DTO для создания фильма из админки
data class TitleDtos(
    val title: String,
    val description: String? = null,
    val type: TitleType,
    val rating: BigDecimal? = null,
    val releaseDate: LocalDate? = null,

    // Ссылки на картинки (приходят после загрузки)
    val posterUrl: String? = null,
    val logoUrl: String? = null,
    val backgroundUrl: String? = null,

    // ID связанных сущностей
    val genreIds: List<Int> = emptyList(),
    val directorIds: List<Long> = emptyList(),
    val actorIds: List<Long> = emptyList(),

    // Слаг можно генерировать автоматически на бэке, но если фронт шлет - ок
    val slug: String? = null
)