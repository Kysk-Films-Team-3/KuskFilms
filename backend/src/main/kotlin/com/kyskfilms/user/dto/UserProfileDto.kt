package com.kyskfilms.user.dto

import java.util.UUID

data class UserProfileDto(
    val keycloakId: UUID,
    val username: String,
    val avatarUrl: String?
)