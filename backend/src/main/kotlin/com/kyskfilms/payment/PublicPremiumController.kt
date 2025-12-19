package com.kyskfilms.payment.controller

import com.kyskfilms.payment.dto.PremiumPageDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/public/premium")
class PublicPremiumController {

    // Оставляем старый на всякий случай
    @GetMapping("/ui")
    fun getPremiumUi(): ResponseEntity<PremiumPageDto> {
        return ResponseEntity.ok(createDto())
    }

    // Добавляем обработку корня /api/public/premium
    @GetMapping
    fun getPremiumRoot(): ResponseEntity<PremiumPageDto> {
        return ResponseEntity.ok(createDto())
    }

    private fun createDto() = PremiumPageDto(
        backButton = "До налаштувань",
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