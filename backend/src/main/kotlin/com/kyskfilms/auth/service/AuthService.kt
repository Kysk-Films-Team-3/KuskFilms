package com.kyskfilms.auth.service

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.client.RestClient

@Service
class AuthService(
    @Value("\${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private val issuerUri: String,

    @Value("\${KEYCLOAK_CLIENT_ID}")
    private val clientId: String,

    // Если клиент конфиденциальный (есть secret), раскомментируй:
    // @Value("\${KEYCLOAK_CLIENT_SECRET}")
    // private val clientSecret: String
) {
    private val log = LoggerFactory.getLogger(javaClass)
    private val restClient = RestClient.create()

    fun logout(refreshToken: String) {
        // Формируем URL логаута Keycloak
        // issuerUri обычно выглядит как: http://localhost:8080/auth/realms/kyskfilms
        val logoutUrl = "$issuerUri/protocol/openid-connect/logout"

        val map = LinkedMultiValueMap<String, String>()
        map.add("client_id", clientId)
        map.add("refresh_token", refreshToken)
        // map.add("client_secret", clientSecret) // Если нужен

        try {
            restClient.post()
                .uri(logoutUrl)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(map)
                .retrieve()
                .toBodilessEntity()

            log.info("Successfully logged out session in Keycloak")
        } catch (e: Exception) {
            log.error("Error logging out from Keycloak", e)
            // Не выбрасываем ошибку наружу, чтобы пользователю показалось, что выход прошел успешно
        }
    }
}