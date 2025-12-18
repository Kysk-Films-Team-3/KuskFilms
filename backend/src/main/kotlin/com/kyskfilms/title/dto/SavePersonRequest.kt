package com.kyskfilms.title.dto

data class SavePersonRequest(
    val id: Long? = null,
    val name: String,
    val surname: String? = null,
    val activityType: String? = null,
    val gender: String? = null,
    val photoUrl: String? = null,
    val birthPlace: String? = null,
    val birthDate: String? = null // Принимаем как строку пока
)