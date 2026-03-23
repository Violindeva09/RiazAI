package com.riazai.repository;

import com.riazai.model.PracticeSession;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PracticeSessionRepository extends JpaRepository<PracticeSession, Long> {

    @Query("SELECT ps.consistencyScore FROM PracticeSession ps ORDER BY ps.timestamp DESC")
    List<Double> findRecentConsistencyScores(Pageable pageable);
}
