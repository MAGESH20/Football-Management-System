package com.example.backend.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.backend.entity.Player;
import com.example.backendService.PlayerService;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "*")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping
    public List<Player> getPlayers() {
        return playerService.getAllPlayers();
    }

    @GetMapping("/team/{teamId}")
    public List<Player> getPlayersByTeam(
            @PathVariable Long teamId) {
        return playerService.getPlayersByTeam(teamId);
    }

    @PostMapping("/team/{teamId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Player addPlayer(
            @PathVariable Long teamId,
            @RequestBody Player player) {
        return playerService.addPlayer(player, teamId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
    }
}
