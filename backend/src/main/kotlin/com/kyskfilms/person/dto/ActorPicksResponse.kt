package com.kyskfilms.person.dto

import com.kyskfilms.title.dto.TitleDto

data class ActorPicksResponse(
    val title: String,      // "Кіану Рівз рекомендує"
    val quote: String,      // "Цитата актера..."
    val items: List<TitleDto>, // Список фильмов
    val ui: ActorPicksUiDto // Тексты для кнопок на карточках
)

data class ActorPicksUiDto(
    val saveLabel: String,   // "Зберегти"
    val shareLabel: String,  // "Поділитися"
    val moreLabel: String    // "Детальніше"
)