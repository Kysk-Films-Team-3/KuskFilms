package com.kyskfilms.title.repository

import com.kyskfilms.title.entity.Title
import com.kyskfilms.title.entity.TitlePerson
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface TitleRepository : JpaRepository<Title, Int>, JpaSpecificationExecutor<Title> {

    // 1. Получить список всех уникальных годов, которые есть в базе
    @Query("SELECT DISTINCT CAST(EXTRACT(YEAR FROM t.releaseDate) AS int) FROM Title t WHERE t.releaseDate IS NOT NULL ORDER BY 1 DESC")
    fun findDistinctYears(): List<Int>

    // 2. Найти топ фильмов по названию жанра (для коллекций)
    @Query("SELECT t FROM Title t JOIN t.genres g WHERE LOWER(g.name) = LOWER(:genreName) ORDER BY t.rating DESC")
    fun findTopByGenre(@Param("genreName") genreName: String, pageable: Pageable): List<Title>

    // 3. Получить топ-10 новинок определенного типа (Фильмы или Сериалы)
    fun findTop10ByTypeOrderByReleaseDateDesc(type: com.kyskfilms.title.entity.enums.TitleType): List<Title>

    // 4. Получить самый рейтинговый контент определенного типа (Для Промо)
    fun findFirstByTypeOrderByRatingDesc(type: com.kyskfilms.title.entity.enums.TitleType): Title?

    @Query("SELECT DISTINCT t FROM Title t JOIN t.genres g WHERE g IN (SELECT g2 FROM Title t2 JOIN t2.genres g2 WHERE t2.id = :originalId) AND t.id != :originalId ORDER BY t.rating DESC")
    fun findRecommendations(@Param("originalId") originalId: Int, pageable: Pageable): List<Title>

    @Query("""
    SELECT tp FROM TitlePerson tp JOIN FETCH tp.title t LEFT JOIN FETCH t.genres WHERE tp.person.id = :personId""")
    fun findFilmographyByPersonId(@Param("personId") personId: Long): List<TitlePerson>

    // Поиск по названию фильма
    @Query("SELECT t FROM Title t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    fun searchByTitle(@Param("query") query: String, pageable: Pageable): List<Title>
}