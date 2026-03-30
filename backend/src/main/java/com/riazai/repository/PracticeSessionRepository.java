package com.riazai.repository;

import com.riazai.model.PracticeSession;
import com.riazai.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PracticeSessionRepository extends JpaRepository<PracticeSession, Long> {

    @Query("SELECT ps.consistencyScore FROM PracticeSession ps WHERE ps.user = :user ORDER BY ps.timestamp DESC")
    List<Double> findRecentConsistencyScoresByUser(@Param("user") User user, Pageable pageable);
}
