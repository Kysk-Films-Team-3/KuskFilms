package com.kyskfilms.promo.dto

data class PromoPageUiDto(
    val title: String,
    val inputPlaceholder: String,
    val buttonText: String,
    val footerText: String
)
data class ActivatePromoRequest(val code: String)
data class ActivatePromoResponse(val message: String, val isPremium: Boolean)