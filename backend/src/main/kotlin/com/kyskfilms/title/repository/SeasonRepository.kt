package com.kyskfilms.title.repository

import com.kyskfilms.title.entity.Season
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SeasonRepository : JpaRepository<Season, Int>

