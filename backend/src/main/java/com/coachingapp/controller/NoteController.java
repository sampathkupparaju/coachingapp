package com.coachingapp.controller;

import com.coachingapp.model.Note;
import com.coachingapp.model.Problem;
import com.coachingapp.model.User;
import com.coachingapp.repository.NoteRepository;
import com.coachingapp.repository.ProblemRepository;
import com.coachingapp.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users/{userId}/problem-notes")
public class NoteController {

    @Autowired
    private NoteRepository noteRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProblemRepository problemRepo;

    @GetMapping
    public ResponseEntity<?> getUserNotes(@PathVariable Long userId, Authentication authentication) {
        String authEmail = (authentication != null ? authentication.getName() : null);
        Optional<User> maybeUser = userRepo.findById(userId);
        if (maybeUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }
        User user = maybeUser.get();
        if (!user.getEmail().equals(authEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Note> userNotes = noteRepo.findByUserId(userId);
        Map<String, String> result = userNotes.stream().collect(Collectors.toMap(
                note -> note.getProblem().getId().toString(), Note::getNote));
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{problemId}")
    public ResponseEntity<?> updateOrCreateNote(
            @PathVariable Long userId,
            @PathVariable Long problemId,
            @RequestBody @Valid Map<String, String> body,
            Authentication authentication
    ) {
        String authEmail = (authentication != null ? authentication.getName() : null);
        Optional<User> maybeUser = userRepo.findById(userId);
        if (maybeUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found."));
        }
        User user = maybeUser.get();
        if (!user.getEmail().equals(authEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Optional<Problem> maybeProb = problemRepo.findById(problemId);
        if (maybeProb.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Problem not found."));
        }
        Problem problem = maybeProb.get();

        String newNote = body.get("note");
        if (newNote == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing 'note' field."));
        }

        Optional<Note> maybeNote = noteRepo.findByUserIdAndProblemId(userId, problemId);
        if (maybeNote.isPresent()) {
            Note existing = maybeNote.get();
            existing.setNote(newNote);
            noteRepo.save(existing);
        } else {
            Note created = new Note(user, problem, newNote);
            noteRepo.save(created);
        }

        return ResponseEntity.ok(Map.of("status", "saved"));
    }
}
