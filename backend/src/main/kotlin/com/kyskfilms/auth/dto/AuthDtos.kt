package com.kyskfilms.auth.dto

data class LogoutUiDto(
    val title: String,
    val description: String,
    val stayButton: String,
    val logoutButton: String
)
data class LogoutRequest(val refreshToken: String)