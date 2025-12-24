package com.kyskfilms.title.controller

import com.kyskfilms.title.dto.SaveTitleRequest
import com.kyskfilms.title.entity.Title
import com.kyskfilms.title.repository.PersonRepository
import com.kyskfilms.title.repository.TitleRepository // Не забудь добавить импорт
import com.kyskfilms.title.service.AdminTitleService
import jakarta.persistence.EntityNotFoundException
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin")
class AdminTitleController(
    private val adminTitleService: AdminTitleService,
    private val personRepository: PersonRepository,
    private val titleRepository: TitleRepository // Инжектим репозиторий
) {

    // --- НОВЫЙ МЕТОД: ПОЛУЧИТЬ ФИЛЬМ ДЛЯ РЕДАКТИРОВАНИЯ ---
    @GetMapping("/titles/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun getTitleForEdit(@PathVariable id: Int): ResponseEntity<Title> {
        val title = titleRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Title not found with id $id") }
        return ResponseEntity.ok(title)
    }

    // --- Остальные методы (Create, Delete) остаются как были ---
    @PostMapping("/titles")
    @PreAuthorize("hasRole('ADMIN')")
    fun createTitle(@RequestBody req: SaveTitleRequest): ResponseEntity<Title> {
        val title = adminTitleService.saveFullTitle(req)
        return ResponseEntity.ok(title)
    }

    @DeleteMapping("/titles/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun deleteTitle(@PathVariable id: Int): ResponseEntity<Void> {
        adminTitleService.deleteTitle(id)
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping("/persons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun deletePerson(@PathVariable id: Long): ResponseEntity<Void> {
        if (!personRepository.existsById(id)) {
            throw EntityNotFoundException("Person not found with id $id")
        }
        personRepository.deleteById(id)
        return ResponseEntity.noContent().build()
    }
}