// src/main/java/com/coachingapp/config/StartupDataLoader.java
package com.coachingapp.config;

import com.coachingapp.model.Problem;
import com.coachingapp.model.Problem.Difficulty;
import com.coachingapp.model.User;
import com.coachingapp.repository.ProblemRepository;
import com.coachingapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class StartupDataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ProblemRepository problemRepository;

    @Override
    public void run(String... args) throws Exception {
        // --- 1) Seed Users (only if none exist) ---
        if (userRepository.count() == 0) {
            userRepository.save(new User("alice@example.com", passwordEncoder.encode("password1")));
            userRepository.save(new User("bob@example.com",   passwordEncoder.encode("password2")));
            userRepository.save(new User("carol@example.com", passwordEncoder.encode("password3")));
            userRepository.save(new User("dave@example.com",  passwordEncoder.encode("password4")));
            userRepository.save(new User("eve@example.com",   passwordEncoder.encode("password5")));
        }

        // --- 2) Seed Problems (only if none exist) ---
        if (problemRepository.count() == 0) {

            problemRepository.save(new Problem(
                    "1480. Running Sum of 1d Array",
                    "Arrays",
                    "https://leetcode.com/problems/running-sum-of-1d-array/",
                    "",                           // no video link found
                    Difficulty.EASY
            ));

            problemRepository.save(new Problem(
                    "1929. Concatenation of Array",
                    "Arrays",
                    "https://leetcode.com/problems/concatenation-of-array/",
                    "",                           // no video link found
                    Difficulty.EASY
            ));

            problemRepository.save(new Problem(
                    "1295. Find Numbers with Even Number of Digits",
                    "Arrays",
                    "https://leetcode.com/problems/find-numbers-with-even-number-of-digits/",
                    "",                           // no video link found
                    Difficulty.EASY
            ));

            problemRepository.save(new Problem(
                    "1672. Richest Customer Wealth",
                    "Arrays",
                    "https://leetcode.com/problems/richest-customer-wealth/",
                    "",                           // no video link found
                    Difficulty.EASY
            ));

            problemRepository.save(new Problem(
                    "1470. Shuffle the Array",
                    "Arrays",
                    "https://leetcode.com/problems/shuffle-the-array/",
                    "",                           // no video link found
                    Difficulty.EASY
            ));

            problemRepository.save(new Problem(
                    "1431. Kids With the Greatest Number of Candies",
                    "Arrays",
                    "https://leetcode.com/problems/kids-with-the-greatest-number-of-candies/",
                    "",                           // no video link found
                    Difficulty.EASY
            ));

            problemRepository.save(new Problem(
                    "1365. How Many Numbers Are Smaller Than the Current Number",
                    "Arrays",
                    "https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/",
                    "",                           // no video link found
                    Difficulty.EASY
            ));

            problemRepository.save(new Problem(
                    "1773. Count Items Matching a Rule",
                    "Arrays",
                    "https://leetcode.com/problems/count-items-matching-a-rule/",
                    "",                           // no video link found
                    Difficulty.EASY
            ));

            problemRepository.save(new Problem(
                    "1752. Check if Array Is Sorted and Rotated",
                    "Arrays",
                    "https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/",
                    "",                           // no video link found
                    Difficulty.MEDIUM             // this one is Medium
            ));

            problemRepository.save(new Problem(
                    "1920. Build Array from Permutation",
                    "Arrays",
                    "https://leetcode.com/problems/build-array-from-permutation/",
                    "",                           // no video link found
                    Difficulty.EASY
            ));

            problemRepository.save(new Problem(
                    "1299. Replace Elements with Greatest Element on Right Side",
                    "Arrays",
                    "https://leetcode.com/problems/replace-elements-with-greatest-element-on-right-side/",
                    "",                           // no video link found
                    Difficulty.EASY
            ));

            problemRepository.save(new Problem(
                    "283. Move Zeroes",
                    "Arrays",
                    "https://leetcode.com/problems/move-zeroes/",
                    "",                           // no video link found
                    Difficulty.EASY
            ));

            problemRepository.save(new Problem(
                    "414. Third Maximum Number",
                    "Arrays",
                    "https://leetcode.com/problems/third-maximum-number/",
                    "",                           // no video link found
                    Difficulty.EASY
            ));

            problemRepository.save(new Problem(
                    "977. Squares of a Sorted Array",
                    "Arrays",
                    "https://leetcode.com/problems/squares-of-a-sorted-array/",
                    "",                           // no video link found
                    Difficulty.EASY
            ));

            problemRepository.save(new Problem(
                    "1389. Create Target Array in the Given Order",
                    "Arrays",
                    "https://leetcode.com/problems/create-target-array-in-the-given-order/",
                    "",                           // no video link found
                    Difficulty.EASY
            ));
        }
    }
}
