package com.kyskfilms.video.repository

import com.kyskfilms.video.entity.VideoFile
import com.kyskfilms.video.entity.VideoStatus
import com.kyskfilms.video.entity.VideoType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.transaction.annotation.Transactional

interface VideoFileRepository : JpaRepository<VideoFile, Int> {


    fun findFirstByTitleIdAndTypeAndStatus(
        titleId: Int,
        type: VideoType,
        status: VideoStatus
    ): VideoFile?

    fun findFirstByEpisodeIdAndTypeAndStatus(
        episodeId: Int,
        type: VideoType,
        status: VideoStatus
    ): VideoFile?


    @Transactional
    @Modifying
    @Query("UPDATE VideoFile vf SET vf.status = 'READY', vf.objectName = :objectName, vf.updatedAt = CURRENT_TIMESTAMP WHERE vf.id = :id")
    fun updateOnSuccess(id: Int, objectName: String)

    @Transactional
    @Modifying
    @Query("UPDATE VideoFile vf SET vf.status = 'ERROR', vf.errorMessage = :errorMessage, vf.updatedAt = CURRENT_TIMESTAMP WHERE vf.id = :id")
    fun updateOnError(id: Int, errorMessage: String)
}