package com.kyskfilms.title.controller

import com.kyskfilms.title.dto.CreateGenreRequest
import com.kyskfilms.title.entity.Genre
import com.kyskfilms.title.service.TitleService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/genres")
class GenreController(private val titleService: TitleService) {

    @GetMapping
    fun getAllGenres(): List<Genre> {
        return titleService.getAllGenres()
    }

    @PostMapping
    fun createGenre(@RequestBody req: CreateGenreRequest): Genre {
        return titleService.createGenre(req)
    }
}