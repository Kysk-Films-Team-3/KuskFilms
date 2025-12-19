package com.kyskfilms.title.repository

import com.kyskfilms.title.entity.Person
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.data.domain.Pageable

@Repository
interface PersonRepository : JpaRepository<Person, Long> {

    // Старые методы оставляем...
    fun findAllByNameContainingIgnoreCase(name: String): List<Person>

    @Query("SELECT p FROM Person p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.surname) LIKE LOWER(CONCAT('%', :query, '%'))")
    fun searchByName(@Param("query") query: String, pageable: Pageable): List<Person>

    // --- НОВЫЙ МЕТОД ДЛЯ РЕКОМЕНДАЦИЙ ---
    // Ищет людей той же профессии, исключая текущего, сортирует случайно, берет 10 штук
    @Query(
        value = "SELECT * FROM persons WHERE activity_type = :activityType AND id != :excludeId ORDER BY RANDOM() LIMIT 10",
        nativeQuery = true
    )
    fun findRandomRecommendations(
        @Param("activityType") activityType: String,
        @Param("excludeId") excludeId: Long
    ): List<Person>
}