package com.kyskfilms.payment

import com.kyskfilms.user.service.UserProfileService
import com.stripe.model.checkout.Session
import com.stripe.net.Webhook
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/payment")
class PaymentController(
    private val paymentService: PaymentService,
    private val userProfileService: UserProfileService
) {

    @Value("\${STRIPE_WEBHOOK_SECRET}")
    private lateinit var webhookSecret: String

    @PostMapping("/checkout")
    fun createCheckout(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<Map<String, String>> {
        val userId = jwt.subject
        val email = jwt.getClaimAsString("email")

        val paymentUrl = paymentService.createCheckoutSession(userId, email)

        return ResponseEntity.ok(mapOf("url" to paymentUrl))
    }

    @PostMapping("/webhook")
    fun handleStripeWebhook(
        @RequestBody payload: String,
        @RequestHeader("Stripe-Signature") sigHeader: String
    ): ResponseEntity<String> {
        return try {
            val event = Webhook.constructEvent(payload, sigHeader, webhookSecret)

            if ("checkout.session.completed" == event.type) {
                val session = event.data.`object` as Session
                // Используем оператор ?. для безопасного доступа к metadata (Java Map может вернуть null)
                val userId = session.metadata?.get("keycloak_user_id")

                if (userId != null) {
                    userProfileService.activatePremium(userId)
                    println("💰 Premium activated for user: $userId")
                }
            }

            ResponseEntity.ok("Received")
        } catch (e: Exception) {
            println("⚠️ Webhook Error: ${e.message}")
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook Error")
        }
    }
}