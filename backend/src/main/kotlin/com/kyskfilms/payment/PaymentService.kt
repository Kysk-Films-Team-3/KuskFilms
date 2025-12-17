package com.kyskfilms.payment

import com.stripe.Stripe
import com.stripe.model.checkout.Session
import com.stripe.param.checkout.SessionCreateParams
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class PaymentService {

    @Value("\${STRIPE_API_KEY}")
    private lateinit var apiKey: String

    @Value("\${APP_FRONTEND_URL}")
    private lateinit var frontendUrl: String

    @PostConstruct
    fun init() {
        Stripe.apiKey = apiKey
    }

    fun createCheckoutSession(userId: String, userEmail: String?): String {
        val params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl("$frontendUrl/payment/success")
            .setCancelUrl("$frontendUrl/payment/cancel")
            .setCustomerEmail(userEmail)
            .putMetadata("keycloak_user_id", userId)
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("usd")
                            .setUnitAmount(999L)
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName("KyskFilms Premium")
                                    .setDescription("Access to all movies")
                                    .build()
                            )
                            .build()
                    )
                    .build()
            )
            .build()

        val session = Session.create(params)
        return session.url
    }
}