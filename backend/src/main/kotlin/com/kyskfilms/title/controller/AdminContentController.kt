package com.kyskfilms.title.controller

import com.kyskfilms.title.dto.*
import com.kyskfilms.title.entity.*
import com.kyskfilms.title.service.TitleService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
class AdminContentController(
    private val titleService: TitleService
) {

    @PostMapping("/categories")
    fun createCategory(@RequestBody req: CreateCategoryRequest): ResponseEntity<Category> {
        return ResponseEntity.ok(titleService.createCategory(req))
    }

    @PostMapping("/genres")
    fun createGenre(@RequestBody req: CreateGenreRequest): ResponseEntity<Genre> {
        return ResponseEntity.ok(titleService.createGenre(req))
    }

    @PostMapping("/titles")
    fun createTitle(@RequestBody req: CreateTitleRequest): ResponseEntity<Title> {
        return ResponseEntity.ok(titleService.createTitle(req))
    }

    @PostMapping("/seasons")
    fun createSeason(@RequestBody req: CreateSeasonRequest): ResponseEntity<Season> {
        return ResponseEntity.ok(titleService.createSeason(req))
    }

    @PostMapping("/episodes")
    fun createEpisode(@RequestBody req: CreateEpisodeRequest): ResponseEntity<Episode> {
        return ResponseEntity.ok(titleService.createEpisode(req))
    }
}