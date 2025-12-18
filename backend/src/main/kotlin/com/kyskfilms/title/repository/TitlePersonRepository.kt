package com.kyskfilms.title.repository

import com.kyskfilms.title.entity.TitlePerson
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface TitlePersonRepository : JpaRepository<TitlePerson, Long> {

    // Старый метод (можно оставить, если нужен)
    fun findAllByPersonId(personId: Long): List<TitlePerson>

    // ИСПРАВЛЕНИЕ:
    // 1. Добавлена аннотация @Query для жадной загрузки (FETCH)
    // 2. Добавлен возвращаемый тип : List<TitlePerson>
    @Query("""
        SELECT tp FROM TitlePerson tp
        JOIN FETCH tp.title t
        LEFT JOIN FETCH t.genres g
        WHERE tp.person.id = :personId
        ORDER BY t.releaseDate DESC
    """)
    fun findAllByPersonIdWithTitlesAndGenres(@Param("personId") personId: Long): List<TitlePerson>
}