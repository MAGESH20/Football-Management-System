package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "jersey_number", nullable = false)
    private Integer jerseyNumber;

    @Column(nullable = false)
    private String position;

    @ManyToOne(optional = false)
    @JoinColumn(name = "team_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Team team;

    public Player() {
    }

    public Player(String name, Integer jerseyNumber, String position, Team team) {
        this.name = name;
        this.jerseyNumber = jerseyNumber;
        this.position = position;
        this.team = team;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getJerseyNumber() {
        return jerseyNumber;
    }

    public void setJerseyNumber(Integer jerseyNumber) {
        this.jerseyNumber = jerseyNumber;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }
}
