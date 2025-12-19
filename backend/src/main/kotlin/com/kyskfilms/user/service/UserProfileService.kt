package com.kyskfilms.user.service

import com.kyskfilms.user.dto.UpdateUserProfileRequest
import com.kyskfilms.user.entity.UserProfile
import com.kyskfilms.user.repository.UserProfileRepository
import jakarta.persistence.EntityNotFoundException
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class UserProfileService(
    private val userProfileRepository: UserProfileRepository
) {
    private val log = LoggerFactory.getLogger(javaClass)

    /**
     * Убрали @Transactional с главного метода, чтобы исключение при вставке (Duplicate Key)
     * не помечало транзакцию как rollback-only.
     */
    fun findOrCreateUserProfile(jwt: Jwt): UserProfile {
        val userId = UUID.fromString(jwt.subject)

        // 1. Пытаемся найти
        val existingUser = userProfileRepository.findById(userId)
        if (existingUser.isPresent) {
            // Если нашли - обновляем данные (если изменились) в отдельной транзакции
            return updateExistingUser(existingUser.get(), jwt)
        }

        // 2. Если не нашли - создаем нового
        val newUser = UserProfile(
            keycloakId = userId,
            email = jwt.claims["email"] as? String,
            username = jwt.claims["preferred_username"] as? String,
            avatarUrl = null,
            isPremium = false,
            subscriptionEndsAt = null,
            createdAt = null,
            updatedAt = null
        )

        return try {
            // Пытаемся сохранить
            userProfileRepository.saveAndFlush(newUser)
        } catch (e: DataIntegrityViolationException) {
            log.warn("Race condition detected for user $userId. Returning existing profile.")
            // Если гонка потоков и юзер уже создан соседом — достаем его
            userProfileRepository.findById(userId).orElseThrow {
                IllegalStateException("User should exist but was not found after duplicate error")
            }
        } catch (e: Exception) {
            log.error("Error creating user profile", e)
            throw e
        }
    }

    /**
     * Вынесли обновление в отдельный транзакционный метод
     */
    @Transactional
    fun updateExistingUser(user: UserProfile, jwt: Jwt): UserProfile {
        val email = jwt.claims["email"] as? String
        val username = jwt.claims["preferred_username"] as? String
        var changed = false

        if (user.email != email) {
            user.email = email
            changed = true
        }
        if (user.username != username) {
            user.username = username
            changed = true
        }

        return if (changed) userProfileRepository.save(user) else user
    }

    @Transactional
    fun activatePremium(userId: UUID) {
        val user = userProfileRepository.findById(userId)
            .orElseThrow { EntityNotFoundException("User not found with id $userId") }

        user.isPremium = true
        userProfileRepository.save(user)
        log.info("Premium activated for user $userId")
    }

    @Transactional
    fun updateUserProfile(userId: UUID, req: UpdateUserProfileRequest): UserProfile {
        val user = userProfileRepository.findById(userId)
            .orElseThrow { EntityNotFoundException("User not found with id $userId") }

        req.username?.let { user.username = it }
        req.avatarUrl?.let { user.avatarUrl = it }

        return userProfileRepository.save(user)
    }

    @Transactional
    fun saveUserProfile(userProfile: UserProfile): UserProfile {
        return userProfileRepository.save(userProfile)
    }
}