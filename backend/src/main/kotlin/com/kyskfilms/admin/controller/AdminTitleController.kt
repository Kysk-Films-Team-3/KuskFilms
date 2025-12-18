package com.kyskfilms.admin.controller

import com.kyskfilms.title.dto.SaveTitleRequest
import com.kyskfilms.title.entity.Title
import com.kyskfilms.title.service.AdminTitleService
import com.kyskfilms.video.service.MinioService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/admin/titles")
@PreAuthorize("hasRole('ADMIN')")
class AdminTitleController(
    private val adminTitleService: AdminTitleService,
    private val minioService: MinioService
) {

    // 1. СОЗДАНИЕ / РЕДАКТИРОВАНИЕ ФИЛЬМА
    @PostMapping
    @Operation(summary = "Save movie metadata", security = [SecurityRequirement(name = "bearerAuth")])
    fun createTitle(@RequestBody req: SaveTitleRequest): ResponseEntity<Title> {
        return ResponseEntity.ok(adminTitleService.saveFullTitle(req))
    }

    // 2. УДАЛЕНИЕ ФИЛЬМА (Добавлено!)
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete movie by ID", security = [SecurityRequirement(name = "bearerAuth")])
    fun deleteTitle(@PathVariable id: Int): ResponseEntity<Void> {
        adminTitleService.deleteTitle(id)
        return ResponseEntity.noContent().build()
    }

    // 3. ЗАГРУЗКА КАРТИНОК
    @PostMapping(value = ["/upload-image"], consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun uploadImage(
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<Map<String, String>> {
        val path = minioService.uploadImage(file, "images")
        return ResponseEntity.ok(mapOf("url" to path))
    }
}