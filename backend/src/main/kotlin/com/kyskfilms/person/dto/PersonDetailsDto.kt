package com.kyskfilms.person.dto

import java.time.LocalDate

data class PersonDetailsDto(
    // Данные
    val id: Long,
    val name: String,
    val photoUrl: String?,
    val activityType: String?,
    val gender: String?,
    val age: Int?,
    val birthDate: LocalDate?,
    val birthPlace: String?,
    val relatives: List<RelativeDto>,
    val filmography: List<PersonFilmographyDto>,
    // UI Тексты
    val ui: PersonUiDto
)

data class PersonUiDto(
    val filmographyTitle: String,
    val sortLabel: String,
    val genreLabel: String,
    val ageLabel: String,
    val ageUnit: String,
    val birthDateLabel: String,
    val genderLabel: String,
    val genderMale: String,
    val genderFemale: String,
    val relativesLabel: String,
    val birthPlaceLabel: String
)

data class RelativeDto(val id: Long, val name: String, val relationship: String)
data class PersonFilmographyDto(val id: Int, val title: String, val posterUrl: String?, val rating: Double?, val releaseDate: LocalDate?, val role: String, val genres: List<String>)