package com.kyskfilms.user.mapper

import com.kyskfilms.user.dto.UserProfileDto
import com.kyskfilms.user.entity.UserProfile

fun UserProfile.toDto(username: String?, minioBaseUrl: String): UserProfileDto {
    val finalAvatarUrl = when {
        this.avatarUrl.isNullOrBlank() -> null
        this.avatarUrl!!.startsWith("http") -> this.avatarUrl

        else -> "$minioBaseUrl/${this.avatarUrl}"
    }

    return UserProfileDto(
        keycloakId = this.keycloakId,
        username = username,
        avatarUrl = finalAvatarUrl,
        isPremium = this.isPremium,
        subscriptionEndsAt = this.subscriptionEndsAt
    )
}