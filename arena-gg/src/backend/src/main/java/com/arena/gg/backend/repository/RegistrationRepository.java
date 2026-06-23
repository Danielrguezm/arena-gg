package com.arena.gg.backend.repository;

import com.arena.gg.backend.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RegistrationRepository extends JpaRepository<Registration, UUID> {
    long countByTournamentId(UUID tournamentId);
    boolean existsByTournamentIdAndUserId(UUID tournamentId, String userId);
}
