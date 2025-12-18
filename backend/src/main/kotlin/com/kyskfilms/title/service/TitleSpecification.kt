package com.kyskfilms.title.service

import com.kyskfilms.title.entity.Genre
import com.kyskfilms.title.entity.Title
import jakarta.persistence.criteria.Join
import org.springframework.data.jpa.domain.Specification
import java.math.BigDecimal
import java.time.LocalDate

object TitleSpecification {
    fun filter(
        search: String?,
        genre: String?,
        year: Int?,
        ratingFrom: BigDecimal?
    ): Specification<Title> {
        return Specification { root, query, cb ->
            val predicates = mutableListOf<jakarta.persistence.criteria.Predicate>()

            // 1. Поиск по названию
            if (!search.isNullOrBlank()) {
                val likePattern = "%${search.lowercase()}%"
                predicates.add(cb.like(cb.lower(root.get("title")), likePattern))
            }

            // 2. Фильтр по жанру
            if (!genre.isNullOrBlank()) {
                val genreJoin: Join<Title, Genre> = root.join("genres")
                predicates.add(cb.equal(genreJoin.get<String>("name"), genre))
            }

            // 3. Фильтр по году
            if (year != null) {
                val startOfYear = LocalDate.of(year, 1, 1)
                val endOfYear = LocalDate.of(year, 12, 31)
                predicates.add(cb.between(root.get("releaseDate"), startOfYear, endOfYear))
            }

            // 4. Фильтр по рейтингу (>=)
            if (ratingFrom != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), ratingFrom))
            }

            cb.and(*predicates.toTypedArray())
        }
    }
}