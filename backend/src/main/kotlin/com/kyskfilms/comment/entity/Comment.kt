package com.kyskfilms.comment.entity

import com.kyskfilms.user.entity.UserProfile
import com.kyskfilms.title.entity.Title
import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(name = "reviews")
class Comment(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keycloak_id", nullable = false)
    var userProfile: UserProfile,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "title_id", nullable = false)
    var title: Title,

    @Column(name = "title")
    var commentTitle: String? = null,

    @Column(columnDefinition = "TEXT", nullable = false)
    var content: String,

    val createdAt: OffsetDateTime = OffsetDateTime.now(),
    var updatedAt: OffsetDateTime = OffsetDateTime.now()
)