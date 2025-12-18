package com.kyskfilms.comment.entity

import com.kyskfilms.title.entity.Title
import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(name = "comments")
class Comment(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "user_id", nullable = false)
    val userId: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "title_id", nullable = false)
    val title: Title,

    @Column(columnDefinition = "TEXT", nullable = false)
    val text: String,

    val rating: Int? = null,

    @Column(name = "created_at")
    val createdAt: OffsetDateTime = OffsetDateTime.now()
)