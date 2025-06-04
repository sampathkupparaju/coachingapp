// src/main/java/com/coachingapp/config/StartupDataLoader.java
package com.coachingapp.config;

import com.coachingapp.model.Problem;
import com.coachingapp.model.User;
import com.coachingapp.repository.ProblemRepository;
import com.coachingapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupDataLoader implements CommandLineRunner {

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        // --- Seed Users (unchanged except now passwords are hashed elsewhere) ---
        if (userRepository.count() == 0) {
            userRepository.save(new User("alice@example.com", "password1"));
            userRepository.save(new User("bob@example.com", "password2"));
            userRepository.save(new User("carol@example.com", "password3"));
            userRepository.save(new User("dave@example.com", "password4"));
            userRepository.save(new User("eve@example.com", "password5"));
        }

        // --- Seed Problems with difficulty, and leave isSolved/isStarred = false by default ---
        if (problemRepository.count() == 0) {
            problemRepository.save(new Problem(
                    "Two Sum",
                    "arrays",
                    "https://leetcode.com/problems/two-sum/",
                    "https://www.youtube.com/watch?v=KLlXCFG5TnA",
                    Problem.Difficulty.EASY
            ));
            problemRepository.save(new Problem(
                    "Valid Parentheses",
                    "stacks",
                    "https://leetcode.com/problems/valid-parentheses/",
                    "https://www.youtube.com/watch?v=WTzjTskDFMg",
                    Problem.Difficulty.EASY
            ));
            problemRepository.save(new Problem(
                    "Invert Binary Tree",
                    "trees",
                    "https://leetcode.com/problems/invert-binary-tree/",
                    "https://www.youtube.com/watch?v=ONHBaC-pfsk",
                    Problem.Difficulty.MEDIUM
            ));
            // Add more seeded problems here, specifying difficulty as EASY, MEDIUM, or HARD
        }
    }
}
