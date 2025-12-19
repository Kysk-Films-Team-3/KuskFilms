package com.kyskfilms.title.entity

import com.fasterxml.jackson.annotation.JsonIgnore // <--- ДОБАВИТЬ ИМПОРТ
import jakarta.persistence.*
import java.time.LocalDate
import java.time.OffsetDateTime

@Entity
@Table(name = "episodes")
class Episode(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    @JsonIgnore // <--- ДОБАВИТЬ СЮДА
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    var season: Season,

    @Column(nullable = false)
    var episodeNumber: Int,

    @Column(nullable = false)
    var title: String,

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    var releaseDate: LocalDate? = null,
    var durationMinutes: Int? = null,
    var posterUrl: String? = null,

    val createdAt: OffsetDateTime = OffsetDateTime.now(),
    var updatedAt: OffsetDateTime = OffsetDateTime.now()
)