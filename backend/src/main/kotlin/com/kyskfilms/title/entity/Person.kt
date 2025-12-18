package com.kyskfilms.title.entity

import jakarta.persistence.*

@Entity
@Table(name = "persons")
class Person(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    var name: String,
    var photoUrl: String? = null,

    var surname: String? = null,
    var activityType: String? = null, // "Актор", "Режисер"
    var gender: String? = null,
    var birthDate: String? = null,
    var birthPlace: String? = null
)