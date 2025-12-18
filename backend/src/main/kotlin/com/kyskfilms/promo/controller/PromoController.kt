package com.kyskfilms.promo.controller

import com.kyskfilms.promo.dto.*
import com.kyskfilms.promo.service.PromoService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/promo")
class PromoController(private val promoService: PromoService) {

    @GetMapping("/ui")
    fun getPromoUi(): ResponseEntity<PromoPageUiDto> {
        return ResponseEntity.ok(PromoPageUiDto(
            title = "Промокод",
            inputPlaceholder = "Введіть промокод",
            buttonText = "Активувати",
            footerText = "Нижняя приписка (условия и правила)"
        ))
    }

    @PostMapping("/activate")
    fun activate(@RequestBody req: ActivatePromoRequest): ResponseEntity<Any> {
        return try {
            val message = promoService.activatePromo(req.code) // Логика в сервисе
            ResponseEntity.ok(ActivatePromoResponse(message, true))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
}