package com.kyskfilms.title.dto

import java.time.LocalDate

data class PersonDetailsDto(
    val id: Long,
    val name: String,
    val enName: String?, // Поле для английского имени (пока будет null или транслит)
    val photoUrl: String?,
    val activityType: String?,
    val gender: String?,
    val birthDate: LocalDate?,
    val age: Int?, // Рассчитываем на бэке
    val birthPlace: String?,
    val relatives: List<RelativeDto>, // Список родственников
    val filmography: List<PersonFilmographyDto>
)

data class RelativeDto(
    val id: Long,
    val name: String,
    val relationship: String // "брат", "сестра" и т.д.
)

data class PersonFilmographyDto(
    val id: Int,
    val title: String,
    val posterUrl: String?,
    val rating: Double?,
    val releaseDate: LocalDate?,
    val role: String, // Роль в фильме (Актор, Режиссер) из таблицы title_persons
    val genres: List<String> // Для фильтрации на фронте
)