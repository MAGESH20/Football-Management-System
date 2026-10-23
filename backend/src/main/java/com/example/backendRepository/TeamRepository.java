package com.example.backendRepository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Team;

public interface TeamRepository
        extends JpaRepository<Team, Long> {
}