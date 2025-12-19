package com.kyskfilms.video.entity

import com.fasterxml.jackson.annotation.JsonIgnore // <--- ДОБАВИТЬ ИМПОРТ
import com.kyskfilms.title.entity.Episode
import com.kyskfilms.title.entity.Title
import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(name = "video_files")
class VideoFile(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    @JsonIgnore // <--- ДОБАВИТЬ СЮДА
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "title_id")
    val title: Title? = null,

    @JsonIgnore // <--- ДОБАВИТЬ СЮДА
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "episode_id")
    val episode: Episode? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "video_status")
    var status: VideoStatus = VideoStatus.PROCESSING,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "video_type")
    var type: VideoType,

    var objectName: String? = null,
    var errorMessage: String? = null,

    val createdAt: OffsetDateTime = OffsetDateTime.now(),
    var updatedAt: OffsetDateTime = OffsetDateTime.now()
)

enum class VideoStatus {
    PROCESSING, READY, ERROR
}

enum class VideoType {
    FEATURE, EPISODE, TRAILER, TEASER
}