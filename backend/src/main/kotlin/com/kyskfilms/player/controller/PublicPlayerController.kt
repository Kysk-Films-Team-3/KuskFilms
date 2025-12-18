package com.kyskfilms.player.controller

import com.kyskfilms.player.dto.*
import com.kyskfilms.title.entity.enums.TitleType
import com.kyskfilms.title.repository.EpisodeRepository
import com.kyskfilms.title.repository.TitleRepository
import com.kyskfilms.video.entity.VideoStatus
import com.kyskfilms.video.entity.VideoType
import com.kyskfilms.video.repository.VideoFileRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/public/player")
class PublicPlayerController(
    private val titleRepository: TitleRepository,
    private val episodeRepository: EpisodeRepository,
    private val videoFileRepository: VideoFileRepository,

    @Value("\${app.backend-url:http://localhost:8081}") private val backendUrl: String,
    @Value("\${minio.public.url}") private val minioUrl: String,
    @Value("\${minio.bucket-name:images}") private val folderName: String
) {

    @GetMapping("/config")
    @Transactional(readOnly = true)
    fun getPlayerConfig(
        @RequestParam titleId: Int,
        @RequestParam(required = false) episodeId: Int?
    ): ResponseEntity<PlayerConfigDto> {

        val title = titleRepository.findById(titleId)
            .orElseThrow { EntityNotFoundException("Title not found") }

        // Общие настройки для всех (статические)
        val defaultSpeeds = listOf("0.5x", "0.75x", "1x", "1.25x", "1.5x", "2x")
        val defaultQualities = listOf("Auto", "1080p", "720p", "480p")
        val mockSubtitles = getMockSubtitles()

        if (title.type == TitleType.MOVIE) {
            val streamUrl = getStreamUrl(titleId = title.id!!, type = VideoType.FEATURE)

            return ResponseEntity.ok(
                PlayerConfigDto(
                    title = title.title,
                    streamUrl = streamUrl,
                    posterUrl = resolvePoster(title.posterUrl),
                    subtitles = mockSubtitles,
                    qualities = defaultQualities,
                    playbackSpeeds = defaultSpeeds, // <--- Передаем скорости
                    type = "MOVIE"
                )
            )
        } else {
            if (episodeId == null) throw IllegalArgumentException("Episode ID required for Series")

            val currentEpisode = episodeRepository.findById(episodeId)
                .orElseThrow { EntityNotFoundException("Episode not found") }

            val streamUrl = getStreamUrl(episodeId = currentEpisode.id!!, type = VideoType.EPISODE)

            val seasonsDto = title.seasons.map { season ->
                PlayerSeasonDto(
                    seasonNumber = season.seasonNumber,
                    episodes = season.episodes.sortedBy { it.episodeNumber }.map { ep ->
                        PlayerEpisodeDto(ep.id!!, ep.episodeNumber, ep.title)
                    }
                )
            }.sortedBy { it.seasonNumber }

            val nextEpisode = title.seasons
                .flatMap { it.episodes }
                .filter {
                    (it.season.seasonNumber == currentEpisode.season.seasonNumber && it.episodeNumber > currentEpisode.episodeNumber) ||
                            (it.season.seasonNumber > currentEpisode.season.seasonNumber)
                }
                .minByOrNull { it.season.seasonNumber * 1000 + it.episodeNumber }

            return ResponseEntity.ok(
                PlayerConfigDto(
                    title = "${title.title}: С${currentEpisode.season.seasonNumber} Е${currentEpisode.episodeNumber}",
                    streamUrl = streamUrl,
                    posterUrl = resolvePoster(currentEpisode.posterUrl ?: title.posterUrl),
                    subtitles = mockSubtitles,
                    qualities = defaultQualities,
                    playbackSpeeds = defaultSpeeds, // <--- Передаем скорости
                    type = "SERIES",
                    currentSeason = currentEpisode.season.seasonNumber,
                    currentEpisode = currentEpisode.episodeNumber,
                    nextEpisodeId = nextEpisode?.id,
                    seasons = seasonsDto
                )
            )
        }
    }

    private fun getStreamUrl(titleId: Int? = null, episodeId: Int? = null, type: VideoType): String {
        val videoFile = if (titleId != null) {
            videoFileRepository.findFirstByTitleIdAndTypeAndStatus(titleId, type, VideoStatus.READY)
        } else {
            videoFileRepository.findFirstByEpisodeIdAndTypeAndStatus(episodeId!!, type, VideoStatus.READY)
        }

        return if (videoFile?.objectName != null) {
            val parts = videoFile.objectName!!.split("/")
            "$backendUrl/api/stream/${parts[0]}/${parts[1]}"
        } else {
            ""
        }
    }

    private fun resolvePoster(path: String?): String? {
        return path?.let { if(it.startsWith("http")) it else "$minioUrl/$folderName/$it" }
    }

    private fun getMockSubtitles(): List<SubtitleDto> {
        return listOf(
            SubtitleDto("Українська", "$minioUrl/subtitles/dummy_ua.vtt"),
            SubtitleDto("English", "$minioUrl/subtitles/dummy_en.vtt")
        )
    }
}