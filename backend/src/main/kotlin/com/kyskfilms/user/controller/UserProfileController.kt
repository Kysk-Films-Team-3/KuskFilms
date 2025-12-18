package com.kyskfilms.user.controller

import com.kyskfilms.user.dto.UserProfileDto
import com.kyskfilms.video.service.MinioService
import com.kyskfilms.user.mapper.toDto
import com.kyskfilms.user.service.UserProfileService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/users/profile")
@Tag(name = "User Profile", description = "Эндпоинты для управления профилем пользователя")
class UserProfileController(
    private val userProfileService: UserProfileService,
    private val minioService: MinioService
) {
    @Value("\${minio.public.url}")
    private lateinit var minioPublicUrl: String

    @Value("\${minio.bucket}")
    private lateinit var bucketName: String

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Получить профиль текущего пользователя", security = [SecurityRequirement(name = "bearerAuth")])
    fun getMyProfile(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<UserProfileDto> {
        val userProfile = userProfileService.findOrCreateUserProfile(jwt)
        val username = jwt.getClaimAsString("preferred_username")

        val minioBaseUrl = minioPublicUrl

        return ResponseEntity.ok(userProfile.toDto(username, minioBaseUrl))
    }

    @PostMapping("/avatar", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Загрузить или обновить аватар пользователя", security = [SecurityRequirement(name = "bearerAuth")])
    fun uploadAvatar(
        @AuthenticationPrincipal jwt: Jwt,
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<UserProfileDto> {

        val userProfile = userProfileService.findOrCreateUserProfile(jwt)

        val avatarPath = minioService.uploadImage(file, "avatars")

        userProfile.avatarUrl = avatarPath
        val updatedProfile = userProfileService.updateUserProfile(userProfile)

        val username = jwt.getClaimAsString("preferred_username")

        val minioBaseUrl = minioPublicUrl

        return ResponseEntity.ok(updatedProfile.toDto(username, minioBaseUrl))
    }
}