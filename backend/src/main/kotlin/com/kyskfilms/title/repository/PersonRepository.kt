package com.kyskfilms.title.repository

import com.kyskfilms.title.entity.Person
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.data.domain.Pageable

@Repository
interface PersonRepository : JpaRepository<Person, Long> {
    // Поиск по части имени (без учета регистра)
    fun findAllByNameContainingIgnoreCase(name: String): List<Person>

    @Query("SELECT p FROM Person p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.surname) LIKE LOWER(CONCAT('%', :query, '%'))")
    fun searchByName(@Param("query") query: String, pageable: Pageable): List<Person>
}