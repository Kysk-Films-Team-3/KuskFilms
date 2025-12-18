package com.kyskfilms.admin.controller

import com.kyskfilms.title.dto.SavePersonRequest
import com.kyskfilms.title.entity.Person
import com.kyskfilms.title.repository.PersonRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/persons")
@PreAuthorize("hasRole('ADMIN')")
class AdminPersonController(
    private val personRepository: PersonRepository
) {

    // СОЗДАНИЕ ИЛИ ОБНОВЛЕНИЕ ПЕРСОНЫ
    @PostMapping
    fun savePerson(@RequestBody req: SavePersonRequest): ResponseEntity<Person> {
        val person = if (req.id != null) {
            // Обновление существующего
            personRepository.findById(req.id)
                .orElseThrow { EntityNotFoundException("Person not found with id ${req.id}") }
                .apply {
                    this.name = "${req.name} ${req.surname ?: ""}".trim()
                    this.surname = req.surname
                    this.activityType = req.activityType
                    this.gender = req.gender
                    this.photoUrl = req.photoUrl
                    this.birthPlace = req.birthPlace
                    this.birthDate = req.birthDate
                }
        } else {
            // Создание нового
            Person(
                name = "${req.name} ${req.surname ?: ""}".trim(),
                surname = req.surname,
                activityType = req.activityType,
                gender = req.gender,
                photoUrl = req.photoUrl,
                birthPlace = req.birthPlace,
                birthDate = req.birthDate
            )
        }

        val savedPerson = personRepository.save(person)
        return ResponseEntity.ok(savedPerson)
    }

    // УДАЛЕНИЕ
    @DeleteMapping("/{id}")
    fun deletePerson(@PathVariable id: Long): ResponseEntity<Void> {
        if (!personRepository.existsById(id)) {
            throw EntityNotFoundException("Person not found with id $id")
        }
        personRepository.deleteById(id)
        return ResponseEntity.noContent().build()
    }
}