package com.kyskfilms.title.repository

import com.kyskfilms.title.entity.Episode
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EpisodeRepository : JpaRepository<Episode, Int> {

}