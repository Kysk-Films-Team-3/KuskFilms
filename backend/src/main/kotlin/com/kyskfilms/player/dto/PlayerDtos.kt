package com.kyskfilms.player.dto

data class PlayerConfigDto(
    val title: String,
    val streamUrl: String,
    val posterUrl: String?,
    val subtitles: List<SubtitleDto>,
    val qualities: List<String>,
    val playbackSpeeds: List<String>,
    val type: String, // "MOVIE" or "SERIES"

    // Для сериалов
    val currentSeason: Int? = null,
    val currentEpisode: Int? = null,
    val nextEpisodeId: Int? = null,
    val seasons: List<PlayerSeasonDto>? = null,

    // --- НОВОЕ ПОЛЕ: Тексты интерфейса ---
    val ui: PlayerUiDto
)

data class PlayerUiDto(
    val speedLabel: String,     // "Швидкість"
    val subtitlesLabel: String, // "Субтитри"
    val qualityLabel: String,   // "Якість"
    val seasonLabel: String,    // "Сезон"
    val episodeLabel: String    // "Серія"
)

data class SubtitleDto(val label: String, val src: String)
data class PlayerSeasonDto(val seasonNumber: Int, val episodes: List<PlayerEpisodeDto>)
data class PlayerEpisodeDto(val id: Int, val episodeNumber: Int, val title: String)