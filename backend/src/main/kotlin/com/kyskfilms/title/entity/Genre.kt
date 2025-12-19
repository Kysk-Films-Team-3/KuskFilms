package com.kyskfilms.title.entity

import com.fasterxml.jackson.annotation.JsonIgnore // <--- ДОБАВИТЬ ИМПОРТ
import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(name = "genres")
class Genre(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    // Category обычно не циклит, но можно оставить как есть
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    var category: Category,

    @Column(unique = true, nullable = false)
    var name: String,

    @Column(unique = true, nullable = false)
    var slug: String,

    @JsonIgnore // <--- ДОБАВИТЬ СЮДА
    @ManyToMany(mappedBy = "genres", fetch = FetchType.LAZY)
    val titles: Set<Title> = HashSet(),

    val createdAt: OffsetDateTime = OffsetDateTime.now()
)