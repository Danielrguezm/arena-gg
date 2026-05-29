package com.arena.gg.backend.repository;

import com.arena.gg.backend.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, UUID> {
    long countByTournamentId(UUID tournamentId);
    boolean existsByTournamentIdAndUserId(UUID tournamentId, String userId);
}
