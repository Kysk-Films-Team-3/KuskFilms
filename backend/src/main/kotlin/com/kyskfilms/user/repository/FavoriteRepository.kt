package com.kyskfilms.user.repository

import com.kyskfilms.user.entity.Favorite
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface FavoriteRepository : JpaRepository<Favorite, Long> {

    // Проверить, лайкнул ли юзер конкретный фильм (для точечной проверки)
    fun existsByUserIdAndTitleId(userId: String, titleId: Int): Boolean

    // Найти/Удалить для переключения
    fun findByUserIdAndTitleId(userId: String, titleId: Int): Favorite?

    // Получить список ID фильмов, которые лайкнул юзер (чтобы покрасить сердечки в списках)
    @Query("SELECT f.title.id FROM Favorite f WHERE f.userId = :userId")
    fun findAllTitleIdsByUserId(userId: String): Set<Int>

    // Получить сами фильмы для страницы "Избранное"
    @Query("SELECT f FROM Favorite f WHERE f.userId = :userId ORDER BY f.createdAt DESC")
    fun findAllByUserId(userId: String, pageable: Pageable): Page<Favorite>
}