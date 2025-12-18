package com.kyskfilms.promo.entity

import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(name = "promo_codes")
class PromoCode(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    @Column(unique = true, nullable = false)
    val code: String,

    @Column(name = "duration_days", nullable = false)
    val durationDays: Int = 30,

    @Column(name = "is_active")
    var isActive: Boolean = true,

    val createdAt: OffsetDateTime = OffsetDateTime.now()
)