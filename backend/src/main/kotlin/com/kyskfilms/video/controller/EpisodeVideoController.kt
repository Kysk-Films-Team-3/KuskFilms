package com.kyskfilms.video.controller

import com.kyskfilms.video.service.VideoService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/episodes/{episodeId}")
class EpisodeVideoController(private val videoService: VideoService) {

    @PostMapping("/video")
    @PreAuthorize("hasRole('ADMIN')")
    fun uploadEpisodeVideo(@PathVariable episodeId: Int, @RequestParam("file") file: MultipartFile): ResponseEntity<Any> {
        val videoFileDto = videoService.startVideoProcessingForEpisode(episodeId, file)
        return ResponseEntity.accepted().body(videoFileDto)
    }
}