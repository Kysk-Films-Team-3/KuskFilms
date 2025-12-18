package com.kyskfilms.title.dto

import java.math.BigDecimal

data class TitlePageResponse(
    // --- Шапка (Header) ---
    val id: Int,
    val title: String,
    val posterUrl: String?,
    val backgroundUrl: String?, // Для фона шапки
    val logoUrl: String?,       // Логотип названия (если есть)

    // Инфо
    val rating: BigDecimal,
    val year: Int,
    val genre: String,
    val duration: String,       // "2г 15хв" или "2 Сезони"
    val shortDescription: String,

    // --- Подписка и Кнопки ---
    val subscriptionPrice: String,  // "15€/місяць"
    val subscriptionLabel: String,  // "у підписці Kysk"
    val hasPremium: Boolean,        // Если true -> Кнопка "Дивитися", иначе -> "Оформити"
    val isSaved: Boolean,           // Для кнопки "Сохранить/Удалить"

    // --- Контент ---
    val trailerUrl: String?,
    val fullDescriptionTitle: String, // "Опис"
    val fullDescription: String,

    // --- Люди ---
    val directors: List<PersonDto>,
    val actors: List<PersonDto>,

    // --- Отзывы ---
    val reviews: List<ReviewDto>,

    // --- Рекомендации ("Дивіться також") ---
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