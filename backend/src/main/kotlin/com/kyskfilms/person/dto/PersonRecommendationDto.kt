package com.kyskfilms.person.dto

data class PersonRecommendationDto(
    val id: Long,
    val name: String,
    val photoUrl: String?,
    val activityType: String?
)