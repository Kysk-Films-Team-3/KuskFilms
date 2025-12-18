package com.kyskfilms.user.controller

import com.kyskfilms.title.dto.TitleDto
import com.kyskfilms.title.entity.Title
import com.kyskfilms.title.repository.TitleRepository
import com.kyskfilms.user.entity.Favorite
import com.kyskfilms.user.repository.FavoriteRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/favorites")
class FavoriteController(
    private val favoriteRepository: FavoriteRepository,
    private val titleRepository: TitleRepository,
    @Value("\${minio.public.url}") private val minioUrl: String,
    @Value("\${minio.bucket-name:images}") private val folderName: String
) {

    // 1. ПОЛУЧИТЬ СПИСОК ИЗБРАННОГО (Страница "Обране")
    @GetMapping
    @Transactional(readOnly = true)
    fun getFavorites(
        @AuthenticationPrincipal jwt: Jwt,
        @PageableDefault(size = 20) pageable: Pageable
    ): Page<TitleDto> {
        val userId = jwt.subject // ID из токена Keycloak
        val favoritesPage = favoriteRepository.findAllByUserId(userId, pageable)

        return favoritesPage.map { fav -> fav.title.toDto(isSaved = true) }
    }

    // 2. ДОБАВИТЬ / УДАЛИТЬ (Toggle)
    @PostMapping("/{titleId}")
    @Transactional
    fun toggleFavorite(
        @PathVariable titleId: Int,
        @AuthenticationPrincipal jwt: Jwt
    ): ResponseEntity<Map<String, Boolean>> {
        val userId = jwt.subject
        val existing = favoriteRepository.findByUserIdAndTitleId(userId, titleId)

        return if (existing != null) {
            favoriteRepository.delete(existing)
            ResponseEntity.ok(mapOf("isSaved" to false))
        } else {
            val title = titleRepository.findById(titleId)
                .orElseThrow { EntityNotFoundException("Title not found") }
            favoriteRepository.save(Favorite(userId = userId, title = title))
            ResponseEntity.ok(mapOf("isSaved" to true))
        }
    }

    // Маппер
    private fun Title.toDto(isSaved: Boolean): TitleDto {
        val poster = this.posterUrl?.let { if(it.startsWith("http")) it else "$minioUrl/$folderName/$it" }
        return TitleDto(
            id = this.id!!, title = this.title, slug = this.slug, posterUrl = poster,
            rating = this.rating, type = this.type, genres = this.genres.map { it.name }
            // Тут важно добавить поле isSaved в TitleDto, если его еще нет (см. шаг ниже)
        )
    }
}