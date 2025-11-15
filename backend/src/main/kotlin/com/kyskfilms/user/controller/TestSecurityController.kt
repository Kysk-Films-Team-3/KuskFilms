package com.kyskfilms.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/test")
@Tag(name = "Test Security", description = "Эндпоинты для проверки безопасности")
class TestSecurityController {


    @GetMapping("/public")
    @Operation(summary = "Публичный доступ", description = "Этот эндпоинт доступен любому пользователю.")
    fun getPublicData(): ResponseEntity<String> {
        return ResponseEntity.ok("Это публичные данные!")
    }

    @GetMapping("/private")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Приватный доступ",
        description = "Доступно любому залогиненному пользователю. Возвращает ID и имя пользователя из токена.",
        security = [SecurityRequirement(name = "bearerAuth")]
    )
    fun getPrivateData(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<Map<String, Any>> {
        val userInfo = mapOf(
            "message" to "Это приватные данные. Вы успешно аутентифицированы!",
            "keycloakId (sub)" to jwt.subject,
            "username" to jwt.getClaimAsString("preferred_username")
        )
        return ResponseEntity.ok(userInfo)
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Админский доступ",
        description = "Доступно только пользователям с ролью 'ADMIN'.",
        security = [SecurityRequirement(name = "bearerAuth")]
    )
    fun getAdminData(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<String> {
        val username = jwt.getClaimAsString("preferred_username")
        return ResponseEntity.ok("Привет, админ $username! Это секретные админские данные.")
    }
}