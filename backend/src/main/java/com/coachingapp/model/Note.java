package com.coachingapp.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "notes",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "problem_id"})}
)
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(nullable = false, length = 2000)
    private String note;

    public Note() { }
    public Note(User user, Problem problem, String note) {
        this.user = user;
        this.problem = problem;
        this.note = note;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Problem getProblem() { return problem; }
    public String getNote() { return note; }
    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setProblem(Problem problem) { this.problem = problem; }
    public void setNote(String note) { this.note = note; }
}
