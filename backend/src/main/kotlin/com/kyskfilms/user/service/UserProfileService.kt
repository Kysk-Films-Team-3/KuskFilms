package com.kyskfilms.user.service

import com.kyskfilms.user.entity.UserProfile
import com.kyskfilms.user.repository.UserProfileRepository // <-- ДОБАВЛЕН ИМПОРТ
import org.springframework.security.oauth2.jwt.Jwt
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

@Service
class UserProfileService(
    private val userProfileRepository: UserProfileRepository
) {
    private val log = LoggerFactory.getLogger(javaClass)


    @Transactional
    fun findOrCreateUserProfile(jwt: Jwt): UserProfile {

        val keycloakId = UUID.fromString(jwt.subject)

        return userProfileRepository.findById(keycloakId).orElseGet {
            log.info("User with keycloakId {} not found. Creating new profile.", keycloakId)
            val newUserProfile = UserProfile(keycloakId = keycloakId)
            userProfileRepository.save(newUserProfile)
        }
    }

    @Transactional
    fun updateUserProfile(userProfile: UserProfile): UserProfile {
        return userProfileRepository.save(userProfile)
    }

    @Transactional
    fun activatePremium(userIdStr: String) {
        val userId = UUID.fromString(userIdStr)
        val profile = userProfileRepository.findById(userId)
            .orElseThrow { RuntimeException("User not found") }

        // Активируем премиум на 30 дней
        profile.isPremium = true
        profile.subscriptionEndsAt = Instant.now().plus(30, ChronoUnit.DAYS)

        userProfileRepository.save(profile)
        println("✅ Подписка активирована для пользователя: $userIdStr")
    }

    fun hasAccess(userId: UUID): Boolean {
        val profile = userProfileRepository.findById(userId).orElse(null) ?: return false

        // Если флаг false - доступа нет
        if (!profile.isPremium) return false

        // Если дата истекла - доступа нет (и снимаем флаг для чистоты)
        if (profile.subscriptionEndsAt != null && profile.subscriptionEndsAt!!.isBefore(Instant.now())) {
            // Можно тут же обновить базу, но пока просто вернем false
            return false
        }

        return true
    }
}
