package com.kyskfilms.promo.service

import com.kyskfilms.promo.repository.PromoCodeRepository
import com.kyskfilms.user.repository.UserProfileRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID // <-- Не забудь добавить импорт

@Service
class PromoService(
    private val promoCodeRepository: PromoCodeRepository,
    private val userProfileRepository: UserProfileRepository
) {

    @Transactional
    fun activatePromo(code: String): String {
        // 1. Получаем текущего юзера из токена
        val auth = SecurityContextHolder.getContext().authentication
        val jwt = auth.principal as Jwt

        // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
        // Преобразуем String (из JWT) в UUID (для базы данных)
        val userId = UUID.fromString(jwt.subject)

        // 2. Ищем промокод
        val promo = promoCodeRepository.findByCode(code)
            .orElseThrow { IllegalArgumentException("Невірний промокод") }

        if (!promo.isActive) {
            throw IllegalArgumentException("Цей промокод більше не активний")
        }

        // 3. Обновляем пользователя
        val user = userProfileRepository.findById(userId)
            .orElseThrow { EntityNotFoundException("User not found") }

        if (user.isPremium) {
            return "У вас вже активовано Premium!"
        }

        user.isPremium = true
        // В будущем здесь можно добавить логику expires_at = now() + promo.durationDays
        userProfileRepository.save(user)

        return "Premium успішно активовано на ${promo.durationDays} днів!"
    }
}