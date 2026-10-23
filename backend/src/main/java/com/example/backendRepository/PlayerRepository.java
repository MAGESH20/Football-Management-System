package com.example.backendRepository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Player;

import java.util.List;

public interface PlayerRepository
        extends JpaRepository<Player, Long> {

    List<Player> findByTeamId(Long teamId);
}