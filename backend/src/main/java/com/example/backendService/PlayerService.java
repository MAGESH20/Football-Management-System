
package com.example.backendService;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.entity.Player;
import com.example.backend.entity.Team;
import com.example.backendRepository.PlayerRepository;
import com.example.backendRepository.TeamRepository;

import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;

    public PlayerService(
            PlayerRepository playerRepository,
            TeamRepository teamRepository) {
        this.playerRepository = playerRepository;
        this.teamRepository = teamRepository;
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public List<Player> getPlayersByTeam(Long teamId) {
        return playerRepository.findByTeamId(teamId);
    }

    public Player addPlayer(Player player, Long teamId) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Team not found"
                    )
                );

        player.setTeam(team);

        return playerRepository.save(player);
    }

    public void deletePlayer(Long id) {
        if (!playerRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found");
        }
        playerRepository.deleteById(id);
    }
}

