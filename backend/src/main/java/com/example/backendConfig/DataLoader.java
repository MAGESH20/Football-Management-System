
package com.example.backendConfig;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.backend.entity.Team;
import com.example.backendRepository.TeamRepository;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadTeams(
            TeamRepository teamRepository) {

        return args -> {
            if (teamRepository.count() == 0) {
                teamRepository.save(new Team("Chennai FC"));
                teamRepository.save(new Team("Madurai FC"));
                teamRepository.save(new Team("Coimbatore FC"));

                teamRepository.save(new Team("Chennai FC"));
                teamRepository.save(new Team("Mumbai FC"));
                teamRepository.save(new Team("Bengaluru FC"));
            }
        };
    }
}
