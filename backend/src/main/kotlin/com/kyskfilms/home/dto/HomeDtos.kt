package com.kyskfilms.home.dto

import java.math.BigDecimal

data class CarouselItemDto(
    val id: Int,
    val imageUrl: String,
    val isNew: Boolean,
    val title: String,
    val rating: BigDecimal,
    val year: Int,
    val genre: String,
    val duration: String
)

data class CategoryIconDto(
    val id: Int,
    val iconUrl: String,
    val name: String,
    val slug: String
)

data class MovieSectionDto(
    val categoryId: Int,
    val title: String,
    val items: List<MovieCardDto>
)

data class MovieCardDto(
    val id: Int,
    val posterUrl: String,
    val title: String,
    val rating: BigDecimal,
    val year: Int,
    val country: String,
    val genre: String,
    val seasonsCount: Int?,
    val isSaved: Boolean

)

data class CelebrityCollectionDto(
    val collectionId: Int,
    val actorId: Int,
    val actorName: String,
    val actorImageUrl: String,
    val badgeText: String,
    val description: String
)


data class PromoBlockDto(
    val id: Int,
    val imageUrl: String,
    val badgeText: String?,
    val title: String,
    val rating: BigDecimal,
    val year: Int,
    val genre: String,
    val duration: String,
    val description: String,
    val buttonText: String,
    val isSaved: Boolean
)


data class HomePageDto(
    val carousel: List<CarouselItemDto>,
    val categories: List<CategoryIconDto>,
    val sections: List<MovieSectionDto>,
    val celebrities: List<CelebrityCollectionDto>,
    val promo: PromoBlockDto?
)