package com.kyskfilms.home.dto

import java.math.BigDecimal

data class HomePageDto(
    val carousel: List<CarouselItemDto>,
    val categories: List<CategoryIconDto>,
    val sections: List<MovieSectionDto>,
    val celebrities: List<CelebrityCollectionDto>,
    val promo: PromoBlockDto?, // Промо может не быть

    val icons: Map<String, String>
)

data class CarouselItemDto(
    val id: Long,
    val imageUrl: String?, // Картинки может не быть
    val isNew: Boolean,
    val title: String,
    val rating: BigDecimal?,
    val year: Int?,
    val genre: String?,
    val duration: String?
)

data class CategoryIconDto(
    val id: Int,
    val iconUrl: String, // Фронт мапит это в 'icon'
    val name: String,
    val slug: String
)

data class MovieSectionDto(
    // ВАЖНО: Фронт ищет поле "categoryId" в transformSections
    val categoryId: Int,
    val title: String,
    val items: List<MovieCardDto>
)

data class MovieCardDto(
    val id: Long,
    val posterUrl: String?, // Фронт ищет posterUrl
    val title: String,
    val rating: BigDecimal?,
    val year: Int?,
    val country: String?, // Фронт кладет это в line2
    val genre: String?,   // Фронт кладет это в line1
    val seasonsCount: Int?, // Nullable, так как у фильмов нет сезонов
    val isSaved: Boolean = false
)

data class CelebrityCollectionDto(
    val collectionId: Long,
    val actorId: Long,
    val actorName: String,
    val actorImageUrl: String?,
    val badgeText: String?, // Текста может не быть
    val description: String? // Описания может не быть
)

data class PromoBlockDto(
    val id: Long,
    val imageUrl: String,
    val badgeText: String?,
    val title: String,
    val rating: BigDecimal?,
    val year: Int?,
    val genre: String?,
    val duration: String?,
    val description: String?,
    val buttonText: String?,
    val isSaved: Boolean = false
)