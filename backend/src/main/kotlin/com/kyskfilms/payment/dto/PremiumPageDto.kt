package com.kyskfilms.payment.dto

data class PremiumPageDto(
    val planName: String,
    val price: String,
    val benefits: List<String>,
    val ui: PremiumUiLabelsDto
)

data class PremiumUiLabelsDto(
    val backButton: String,
    val pageTitle: String,
    val ctaButton: String
)