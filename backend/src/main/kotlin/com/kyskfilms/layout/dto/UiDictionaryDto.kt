package com.kyskfilms.layout.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class UiDictionaryDto(
    // Общие кнопки (Home, Movie, Lists...)
    val common: CommonUiDto,

    // Секции
    val profile: ProfileUiDto,
    val list: ListUiDto,
    val editActor: EditActorUiDto,
    val editMovie: EditMovieUiDto,
    val searchMovie: SearchMovieUiDto,
    val searchActor: SearchActorUiDto,
    val confirmDelete: ConfirmDeleteUiDto
)

data class CommonUiDto(
    val watchLater: String,   // Дивитимуся
    val share: String,        // Поділитися
    val dislike: String,      // Не подобається
    val newBadge: String,     // Новинка (Home)
    val starsRecommend: String, // Зірки рекомендують (Home)
    val newAndPopular: String, // Нове & Популярне
    val favorites: String,    // Обране
    val deleteBtn: String,    // Видалити (Films)
    val ratingLabel: String   // рейтинг (Films)
)

data class ProfileUiDto(
    val editTitle: String,
    val firstName: String,
    val lastName: String,
    val nickname: String,
    val exit: String,
    val save: String,
    val premiumActive: String,
    val premiumInactive: String
)

data class ListUiDto(
    val title: String,
    val persons: String,
    val movies: String,
    val edit: String,
    val delete: String,
    val save: String,
    val exit: String,
    val create: String,
    val addMovie: String,
    val searchMoviePlaceholder: String,
    val searchPersonPlaceholder: String,
    val emptyStateTitle: String,
    val emptyStateMessage: String
)

data class EditActorUiDto(
    val title: String,
    val mainInfo: String,
    val name: String,
    val surname: String,
    val activityType: String,
    val gender: String,
    val birthDate: String,
    val day: String,
    val month: String,
    val year: String,
    val birthPlace: String,
    val country: String,
    val city: String,
    val filmography: String,
    val addMovie: String,
    val relatives: String,
    val add: String,
    val delete: String,
    val save: String
)

data class EditMovieUiDto(
    val title: String,
    val images: String,
    val cover: String,
    val logo: String,
    val background: String,
    val reload: String,
    val delete: String,
    val upload: String,
    val movieTitle: String,
    val shortDescription: String,
    val director: String,
    val directors: String,
    val addNewDirector: String,
    val actors: String,
    val movieActors: String,
    val year: String,
    val duration: String,
    val genres: String,
    val categories: String,
    val seasons: String,
    val episodes: String,
    val episodeCover: String,
    val episodeTitle: String,
    val reviews: String,
    val save: String,
    val deleteMovie: String
)

data class SearchMovieUiDto(
    val title: String,
    val placeholder: String,
    val addMovie: String,
    val delete: String,
    val save: String,
    val emptyStateTitle: String,
    val emptyStateMessage: String
)

data class SearchActorUiDto(
    val title: String,
    val placeholder: String,
    val create: String,
    val delete: String,
    val save: String,
    val emptyStateTitle: String,
    val emptyStateMessage: String
)

data class ConfirmDeleteUiDto(
    val deleteMovies: String,
    val deletePersons: String,
    val confirmDeleteMovies: String,
    val confirmDeletePersons: String,
    val exit: String,
    val delete: String
)