package com.kyskfilms.title.controller

import com.kyskfilms.title.entity.Genre
import com.kyskfilms.title.service.TitleService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/genres")
class GenreController(private val titleService: TitleService) {

    @GetMapping
    fun getAllGenres(): List<Genre> {
        return titleService.getAllGenres()
    }
}