// src/main/java/com/coachingapp/model/Problem.java
package com.coachingapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "problems")
public class Problem {

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(nullable = false)
    private String topic;

    @Column(name = "leetcode_url", nullable = false)
    private String leetcodeUrl;

    @Column(name = "neetcode_url", nullable = false)
    private String neetCodeUrl;

    // ***** New fields *****
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(name = "is_solved", nullable = false)
    private boolean isSolved = false;

    @Column(name = "is_starred", nullable = false)
    private boolean isStarred = false;
    // *************************

    public Problem() { }

    /**
     * Constructor used by StartupDataLoader.
     * We accept difficulty, and default solved/starred to false.
     */
    public Problem(String title,
                   String topic,
                   String leetcodeUrl,
                   String neetCodeUrl,
                   Difficulty difficulty) {
        this.title = title;
        this.topic = topic;
        this.leetcodeUrl = leetcodeUrl;
        this.neetCodeUrl = neetCodeUrl;
        this.difficulty = difficulty;
        this.isSolved = false;
        this.isStarred = false;
    }

    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }
    public String getTitle() {
        return title;
    }
    public String getTopic() {
        return topic;
    }
    public String getLeetcodeUrl() {
        return leetcodeUrl;
    }
    public String getNeetCodeUrl() {
        return neetCodeUrl;
    }
    public Difficulty getDifficulty() {
        return difficulty;
    }
    public boolean isSolved() {
        return isSolved;
    }
    public boolean isStarred() {
        return isStarred;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public void setTopic(String topic) {
        this.topic = topic;
    }
    public void setLeetcodeUrl(String leetcodeUrl) {
        this.leetcodeUrl = leetcodeUrl;
    }
    public void setNeetCodeUrl(String neetCodeUrl) {
        this.neetCodeUrl = neetCodeUrl;
    }
    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }
    public void setSolved(boolean solved) {
        isSolved = solved;
    }
    public void setStarred(boolean starred) {
        isStarred = starred;
    }
}
