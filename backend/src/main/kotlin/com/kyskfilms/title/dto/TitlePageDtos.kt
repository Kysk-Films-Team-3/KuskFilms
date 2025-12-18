package com.kyskfilms.title.dto

import java.math.BigDecimal

data class TitlePageResponse(
    // Данные фильма
    val id: Int,
    val title: String,
    val posterUrl: String?,
    val backgroundUrl: String?,
    val logoUrl: String?,
    val rating: BigDecimal,
    val year: Int,
    val genre: String,
    val duration: String,
    val shortDescription: String,

    // Списки имен одной строкой
    val directorsText: String,
    val actorsText: String,

    // UI Тексты и Кнопки (ВСЕ С БЭКА)
    val subscriptionPrice: String, // "15€/місяць"
    val subscriptionLabel: String, // "у підписці Kysk"
    val hasPremium: Boolean,       // Если false -> показать кнопку купить
    val isSaved: Boolean,          // Если true -> иконка закрашена

    val streamUrl: String?,        // Ссылка на фильм (если есть права)
    val trailerUrl: String?,       // Ссылка на трейлер

    // Тексты блоков
    val fullDescriptionTitle: String, // "Опис"
    val fullDescription: String,

    // Списки объектов
    val cast: List<PersonDto>,
    val reviews: List<ReviewDto>,
    val recommendations: List<TitleDto>
)

data class PersonDto(
    val id: Long,
    val name: String,
    val photoUrl: String?,
    val role: String // "Актор" или "Режисер"
)

data class ReviewDto(
    val id: Long,
    val author: String,
    val text: String,
    val rating: Int,
    val date: String
)