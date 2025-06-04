package com.coachingapp.repository;

import com.coachingapp.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserId(Long userId);
    Optional<Note> findByUserIdAndProblemId(Long userId, Long problemId);
}
