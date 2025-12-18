package com.kyskfilms.title.controller

import com.kyskfilms.title.entity.Person
import com.kyskfilms.title.service.TitleService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/persons")
class PersonController(private val titleService: TitleService) {

    @GetMapping
    fun getPersons(@RequestParam(required = false) search: String?): List<Person> {
        return titleService.getAllPersons(search)
    }
}