package com.kyskfilms.video.repository

import com.kyskfilms.video.entity.VideoFile // <-- Вот этот импорт
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.transaction.annotation.Transactional

interface VideoFileRepository : JpaRepository<VideoFile, Int> {

    @Transactional
    @Modifying
    @Query("UPDATE VideoFile vf SET vf.status = 'READY', vf.objectName = :objectName, vf.updatedAt = CURRENT_TIMESTAMP WHERE vf.id = :id")
    fun updateOnSuccess(id: Int, objectName: String)

    @Transactional
    @Modifying
    @Query("UPDATE VideoFile vf SET vf.status = 'ERROR', vf.errorMessage = :errorMessage, vf.updatedAt = CURRENT_TIMESTAMP WHERE vf.id = :id")
    fun updateOnError(id: Int, errorMessage: String)
}