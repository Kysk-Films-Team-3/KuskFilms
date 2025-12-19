package com.kyskfilms.title.entity

import com.fasterxml.jackson.annotation.JsonIgnore // <--- Импорт
import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(name = "categories")
class Category(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    @Column(unique = true, nullable = false)
    var name: String,

    @Column(unique = true, nullable = false)
    var slug: String,

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @JsonIgnore // <--- ВАЖНО: Разрываем цикл здесь.
    @OneToMany(mappedBy = "category", cascade = [CascadeType.ALL], orphanRemoval = true)
    val genres: List<Genre> = ArrayList(),

    val createdAt: OffsetDateTime = OffsetDateTime.now()
)