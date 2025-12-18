package com.kyskfilms.payment.dto

data class PremiumPageDto(
    val backButton: String,      // "До налаштувань"
    val title: String,           // "Підтвердіть вибір"
    val features: List<String>,  // Список ("Більше 70 000...", "Каталог...", "Батьківський...")
    val planName: String,        // "Kysk преміум"
    val price: String,           // "15€"
    val buttonText: String       // "Оформити"
)

data class PremiumUiLabelsDto(
    val backButton: String,
    val pageTitle: String,
    val ctaButton: String
)