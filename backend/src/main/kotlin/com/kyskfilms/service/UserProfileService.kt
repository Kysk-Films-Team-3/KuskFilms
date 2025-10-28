package com.kyskfilms.service

import com.kyskfilms.model.UserProfile
import com.kyskfilms.repository.UserProfileRepository
import org.slf4j.LoggerFactory
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
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