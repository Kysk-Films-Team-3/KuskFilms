package com.kyskfilms.comment.repository

import com.kyskfilms.comment.entity.Comment
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface CommentRepository : JpaRepository<Comment, Long> {

    // Здесь мы не ищем по userId, но если будем — userId должен быть String

    fun findAllByTitleIdOrderByCreatedAtDesc(titleId: Int, pageable: Pageable): List<Comment>

    @Query("SELECT c FROM Comment c WHERE c.title.id = :titleId ORDER BY c.createdAt DESC")
    fun findAllByTitleId(@Param("titleId") titleId: Int): List<Comment>
}