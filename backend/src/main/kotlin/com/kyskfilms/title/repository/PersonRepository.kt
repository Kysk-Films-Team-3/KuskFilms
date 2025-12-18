package com.kyskfilms.title.repository

import com.kyskfilms.title.entity.Person
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PersonRepository : JpaRepository<Person, Long> {
    // Поиск по части имени (без учета регистра)
    fun findAllByNameContainingIgnoreCase(name: String): List<Person>
}