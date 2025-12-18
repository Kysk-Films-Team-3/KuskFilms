package com.kyskfilms.player.dto

data class PlayerConfigDto(
    val title: String,
    val streamUrl: String,
    val posterUrl: String?,

    // UI Настройки
    val subtitles: List<SubtitleDto>,
    val qualities: List<String>,
    val playbackSpeeds: List<String>,

    // Навигация
    val type: String,
    val currentSeason: Int? = null,
    val currentEpisode: Int? = null,
    val nextEpisodeId: Int? = null,
    val seasons: List<PlayerSeasonDto> = emptyList()
)

data class SubtitleDto(
    val language: String,
    val url: String
)

data class PlayerSeasonDto(
    val seasonNumber: Int,
    val episodes: List<PlayerEpisodeDto>
)

data class PlayerEpisodeDto(
    val id: Int,
    val episodeNumber: Int,
    val title: String
)