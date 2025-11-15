package com.kyskfilms.title.entity

import com.kyskfilms.comment.entity.Comment
import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDate
import java.time.OffsetDateTime

@Entity
@Table(name = "titles")
class Title(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "title_type")
    var type: TitleType,

    @Column(nullable = false)
    var title: String,

    @Column(unique = true, nullable = false)
    var slug: String,

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    var releaseDate: LocalDate? = null,
    var posterUrl: String? = null,

    @Column(precision = 3, scale = 1)
    var rating: BigDecimal = BigDecimal.ZERO,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "title_genres",
        joinColumns = [JoinColumn(name = "title_id")],
        inverseJoinColumns = [JoinColumn(name = "genre_id")]
    )
    var genres: MutableSet<Genre> = mutableSetOf(),

    @OneToMany(mappedBy = "title", cascade = [CascadeType.ALL], orphanRemoval = true)
    var seasons: MutableList<Season> = mutableListOf(),

    @OneToMany(mappedBy = "title", cascade = [CascadeType.ALL], orphanRemoval = true)
    var reviews: MutableList<Comment> = mutableListOf(),

    val createdAt: OffsetDateTime = OffsetDateTime.now(),
    var updatedAt: OffsetDateTime = OffsetDateTime.now()
)

enum class TitleType {
    MOVIE, SERIES
}