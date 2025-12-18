package com.kyskfilms.user.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "user_profiles")
data class UserProfile(
    @Id
    @Column(name = "keycloak_id")
    var keycloakId: UUID,

    // --- ДОБАВЛЕНЫ ПОЛЯ (чтобы убрать ошибку в CommentService) ---
    var email: String? = null,
    var username: String? = null,

    @Column(name = "avatar_url")
    var avatarUrl: String? = null,

    @Column(name = "is_premium")
    var isPremium: Boolean = false,

    @Column(name = "subscription_ends_at")
    var subscriptionEndsAt: Instant? = null,

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    var createdAt: Instant? = null,

    @UpdateTimestamp
    @Column(name = "updated_at")
    var updatedAt: Instant? = null
) {
    // Конструктор по умолчанию (обязателен для JPA)
    constructor() : this(
        UUID.randomUUID(),
        null, // email
        null, // username
        null, // avatarUrl
        false, // isPremium
        null, // subscriptionEndsAt
        null, // createdAt
        null  // updatedAt
    )
}