package com.kyskfilms.mapper

import com.kyskfilms.dto.UserProfileDto
import com.kyskfilms.user.entity.UserProfile

fun UserProfile.toDto(username: String, minioBaseUrl: String): UserProfileDto {
    val fullAvatarUrl = this.avatarUrl?.let { "$minioBaseUrl/$it" }

    return UserProfileDto(
        keycloakId = this.keycloakId,
        username = username,
        avatarUrl = fullAvatarUrl
    )
}