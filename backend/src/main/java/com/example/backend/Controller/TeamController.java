package com.example.backend.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.backend.entity.Player;
import com.example.backend.entity.Team;
import com.example.backendRepository.TeamRepository;
import com.example.backendService.PlayerService;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class TeamController {

    private final TeamRepository teamRepository;
    private final PlayerService playerService;

    public TeamController(TeamRepository teamRepository, PlayerService playerService) {
        this.teamRepository = teamRepository;
        this.playerService = playerService;
    }

    @GetMapping
    public List<Team> getTeams() {
        return teamRepository.findAll();
    }

    @GetMapping("/{teamId}/players")
    public List<Player> getPlayersByTeam(@PathVariable Long teamId) {
        return playerService.getPlayersByTeam(teamId);
    }

    @PostMapping("/{teamId}/players")
    @ResponseStatus(HttpStatus.CREATED)
    public Player addPlayer(@PathVariable Long teamId, @RequestBody Player player) {
        return playerService.addPlayer(player, teamId);
    }
}