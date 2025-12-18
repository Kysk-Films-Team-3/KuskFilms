package com.kyskfilms.auth.controller

import com.kyskfilms.auth.dto.LogoutRequest
import com.kyskfilms.auth.dto.LogoutUiDto
import com.kyskfilms.auth.service.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @GetMapping("/logout/ui")
    fun getLogoutUi(): ResponseEntity<LogoutUiDto> {
        return ResponseEntity.ok(LogoutUiDto(
            title = "Точно хочеш вийти з облікового запису?",
            description = "Акаунт буде видалено з устрою. Потрібен повторний вхід для доступу до рекомендацій, історії переглядів та управління підпискою",
            stayButton = "Залишитися",
            logoutButton = "Вийти"
        ))
    }

    @PostMapping("/logout")
    fun logout(@RequestBody request: LogoutRequest): ResponseEntity<Void> {
        authService.logout(request.refreshToken) // Логика в сервисе
        return ResponseEntity.noContent().build()
    }
}