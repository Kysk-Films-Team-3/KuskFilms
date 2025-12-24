package com.kyskfilms.payment.controller

import com.kyskfilms.payment.dto.PremiumPageDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/public/premium")
class PublicPremiumController {

    // Основной эндпоинт для UI
    @GetMapping("/ui")
    fun getPremiumUi(): ResponseEntity<PremiumPageDto> {
        return ResponseEntity.ok(createDto())
    }

    // Запасной эндпоинт (корень), если фронт стучится сюда
    @GetMapping
    fun getPremiumRoot(): ResponseEntity<PremiumPageDto> {
        return ResponseEntity.ok(createDto())
    }

    private fun createDto() = PremiumPageDto(
        backButton = "Назад",
        title = "Підтвердіть вибір",
        features = listOf(
            "Більше 70 000 фільмів, серіалів та мультфільмів",
            "Каталог фільмів і серіалів Viju і Paramount",
            "Батьківський контроль",
            "Завантаження та перегляд без інтернету"
        ),
        planName = "Kysk преміум",
        price = "15€",
        buttonText = "Оформити"
    )
}