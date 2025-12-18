package com.kyskfilms.home.dto

import com.kyskfilms.title.dto.TitleDto

// --- ДЛЯ СТРАНИЦЫ "КАТАЛОГ" ---
data class CatalogPageDto(
    val title: String,
    val genres: List<CatalogGenreDto>,
    val collectionsTitle: String,
    val collections: List<CollectionDto>
)

data class CatalogGenreDto(
    val name: String,
    val slug: String,
    val iconUrl: String? = null
)

data class CollectionDto(
    val title: String,
    val description: String? = null,
    val items: List<TitleDto>
)

// --- ДЛЯ СТРАНИЦЫ "ФИЛЬМЫ" (Фильтры) ---
data class MoviesPageMetaDto(
    val title: String,
    val description: String,
    val filters: FilterOptionsDto
)

data class FilterOptionsDto(
    val genres: List<String>, // Список названий жанров
    val years: List<Int>,     // Реальные года из базы
    val sortOptions: Map<String, String>
)

data class NewPopularPageDto(
    val promo1: PromoBlockDto?,          // Реклама 1 (Сериал)
    val collectionsTitle: String,        // "Добірка / Колекція"
    val collections: List<CollectionDto>,// Антиутопия, Антигерои...
    val newSeriesTitle: String,          // "Новинки серіалів"
    val newSeries: List<TitleDto>,       // Список новых сериалов
    val promo2: PromoBlockDto?,          // Реклама 2 (Фильм)
    val newMoviesTitle: String,          // "Новинки фільмів"
    val newMovies: List<TitleDto>        // Список новых фильмов
)