package com.kyskfilms.video.controller

import com.kyskfilms.video.entity.VideoType
import com.kyskfilms.video.service.VideoService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/titles/{titleId}")
class TitleVideoController(private val videoService: VideoService) {


    @PostMapping("/feature-video")
    @PreAuthorize("hasRole('ADMIN')")
    fun uploadFeatureVideo(@PathVariable titleId: Int, @RequestParam("file") file: MultipartFile): ResponseEntity<Any> {
        val videoFileDto = videoService.startVideoProcessingForTitle(titleId, file, VideoType.FEATURE)
        return ResponseEntity.accepted().body(videoFileDto)
    }

    @PostMapping("/trailer")
    @PreAuthorize("hasRole('ADMIN')")
    fun uploadTrailer(@PathVariable titleId: Int, @RequestParam("file") file: MultipartFile): ResponseEntity<Any> {
        val videoFileDto = videoService.startVideoProcessingForTitle(titleId, file, VideoType.TRAILER)
        return ResponseEntity.accepted().body(videoFileDto)
    }
}
