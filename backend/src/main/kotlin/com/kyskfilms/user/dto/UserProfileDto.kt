package com.kyskfilms.user.dto

import java.time.Instant
import java.util.UUID

data class UserProfileDto(
    val keycloakId: UUID? = null,
    val username: String?,
    val avatarUrl: String?,
    val isPremium: Boolean,
    val subscriptionEndsAt: Instant?
)

data class UpdateUserProfileRequest(
    val username: String?,
    val avatarUrl: String?
)