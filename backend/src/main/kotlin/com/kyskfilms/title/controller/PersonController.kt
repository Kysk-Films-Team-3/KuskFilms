package com.kyskfilms.title.controller

import com.kyskfilms.title.entity.Person
import com.kyskfilms.title.service.TitleService
import org.springframework.web.bind.annotation.*

// Простой DTO для создания
data class CreatePersonSimpleDto(
    val name: String,
    val photoUrl: String? = null
)

@RestController
@RequestMapping("/api/persons")
class PersonController(private val titleService: TitleService) {

    @GetMapping
    fun getPersons(@RequestParam(required = false) search: String?): List<Person> {
        return titleService.getAllPersons(search)
    }

    @PostMapping
    fun createPerson(@RequestBody dto: CreatePersonSimpleDto): Person {
        return titleService.createPerson(dto.name, dto.photoUrl)
    }
}