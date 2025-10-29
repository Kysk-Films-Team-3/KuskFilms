package com.kyskfilms.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
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

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    var createdAt: Instant? = null,

    @UpdateTimestamp
    @Column(name = "updated_at")
    var updatedAt: Instant? = null
) {

    constructor() : this(UUID.randomUUID(), null, null)
}