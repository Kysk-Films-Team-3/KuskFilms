package com.kyskfilms.user.entity

import com.kyskfilms.title.entity.Title
import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(name = "favorites", uniqueConstraints = [UniqueConstraint(columnNames = ["user_id", "title_id"])])
class Favorite(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "user_id", nullable = false)
    val userId: String, // ID пользователя из Keycloak (UUID string)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "title_id", nullable = false)
    val title: Title,

    val createdAt: OffsetDateTime = OffsetDateTime.now()
)