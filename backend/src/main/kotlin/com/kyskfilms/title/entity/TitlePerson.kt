package com.kyskfilms.title.entity

import jakarta.persistence.*

@Entity
@Table(name = "title_persons")
class TitlePerson(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "title_id")
    var title: Title,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id")
    var person: Person,

    var role: String
)