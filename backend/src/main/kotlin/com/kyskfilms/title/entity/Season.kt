package com.kyskfilms.title.entity

import com.fasterxml.jackson.annotation.JsonIgnore // <--- ДОБАВИТЬ ИМПОРТ
import jakarta.persistence.*
import java.time.LocalDate
import java.time.OffsetDateTime

@Entity
@Table(name = "seasons")
class Season(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    @JsonIgnore // <--- ДОБАВИТЬ СЮДА. Чтобы не тянуть Title при запросе сезона
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "title_id", nullable = false)
    var title: Title,

    @Column(nullable = false)
    var seasonNumber: Int,

    var seasonTitle: String? = null,
    var releaseDate: LocalDate? = null,
    var posterUrl: String? = null,

    @OneToMany(mappedBy = "season", cascade = [CascadeType.ALL], orphanRemoval = true)
    var episodes: MutableList<Episode> = mutableListOf(),

    val createdAt: OffsetDateTime = OffsetDateTime.now()
)