package com.kyskfilms.user.repository

import com.kyskfilms.user.entity.Favorite
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface FavoriteRepository : JpaRepository<Favorite, Long> {

    // ВАЖНО: userId здесь String, так как в Entity это String (из Keycloak токена)

    fun existsByUserIdAndTitleId(userId: String, titleId: Int): Boolean

    fun findByUserIdAndTitleId(userId: String, titleId: Int): Favorite?

    @Query("SELECT f.title.id FROM Favorite f WHERE f.userId = :userId")
    fun findAllTitleIdsByUserId(userId: String): Set<Int>

    @Query("SELECT f FROM Favorite f WHERE f.userId = :userId ORDER BY f.createdAt DESC")
    fun findAllByUserId(userId: String, pageable: Pageable): Page<Favorite>
}