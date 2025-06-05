// src/main/java/com/coachingapp/controller/ProblemNoteController.java
package com.coachingapp.controller;

import com.coachingapp.model.Note;
import com.coachingapp.model.Problem;
import com.coachingapp.model.User;
import com.coachingapp.repository.NoteRepository;
import com.coachingapp.repository.ProblemRepository;
import com.coachingapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true",
        // We must explicitly allow PUT (and any other HTTP verbs you need):
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        },
        // Tell Spring to accept these headers from the browser’s preflight:
        allowedHeaders = {
                "Authorization",
                "Content-Type"
        }
)
public class ProblemNoteController {

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NoteRepository noteRepository;

    /**
     * 1) GET all problems (now returns difficulty, isSolved, isStarred)
     */
    @GetMapping("/problems")
    public ResponseEntity<List<Problem>> getAllProblems() {
        List<Problem> allProblems = problemRepository.findAll();
        return ResponseEntity.ok(allProblems);
    }

    /**
     * 2) Toggle the 'isSolved' flag for a given problem.
     *    PUT /api/problems/{problemId}/solve
     *    Body: none (we simply flip the boolean).
     */
    @PutMapping("/problems/{problemId}/solve")
    public ResponseEntity<?> toggleSolved(@PathVariable Long problemId) {
        Optional<Problem> problemOpt = problemRepository.findById(problemId);
        if (problemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Problem problem = problemOpt.get();
        problem.setSolved(!problem.isSolved());
        problemRepository.save(problem);
        // Return the updated problem so front end can re‐render if desired:
        return ResponseEntity.ok(problem);
    }

    /**
     * 3) Toggle the 'isStarred' flag for a given problem.
     *    PUT /api/problems/{problemId}/star
     */
    @PutMapping("/problems/{problemId}/star")
    public ResponseEntity<?> toggleStar(@PathVariable Long problemId) {
        Optional<Problem> problemOpt = problemRepository.findById(problemId);
        if (problemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Problem problem = problemOpt.get();
        problem.setStarred(!problem.isStarred());
        problemRepository.save(problem);
        return ResponseEntity.ok(problem);
    }

    /**
     * 4) (Existing) - Fetch all notes for a user
     */
    @GetMapping("/users/{userId}/notes")
    public ResponseEntity<Map<Long, String>> getUserNotes(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        List<Note> notesList = noteRepository.findByUserId(userId);
        Map<Long, String> notesMap = new HashMap<>();
        for (Note n : notesList) {
            notesMap.put(n.getProblem().getId(), n.getNote());
        }
        return ResponseEntity.ok(notesMap);
    }

    /**
     * 5) (Existing) - Create or update a user’s note on a problem
     */
    @PutMapping("/users/{userId}/notes/{problemId}")
    public ResponseEntity<?> updateUserNote(
            @PathVariable Long userId,
            @PathVariable Long problemId,
            @Valid @RequestBody Map<String, String> body
    ) {
        String newNoteText = body.get("note");
        if (newNoteText == null) {
            return ResponseEntity.badRequest().body("Missing 'note' field");
        }
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Optional<Problem> problemOpt = problemRepository.findById(problemId);
        if (!problemOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        User user = userOpt.get();
        Problem problem = problemOpt.get();
        Optional<Note> existingNoteOpt = noteRepository.findByUserIdAndProblemId(userId, problemId);

        Note noteEntity;
        if (existingNoteOpt.isPresent()) {
            noteEntity = existingNoteOpt.get();
            noteEntity.setNote(newNoteText);
        } else {
            noteEntity = new Note();
            noteEntity.setUser(user);
            noteEntity.setProblem(problem);
            noteEntity.setNote(newNoteText);
        }
        noteRepository.save(noteEntity);
        return ResponseEntity.ok().build();
    }
}
