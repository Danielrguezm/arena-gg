package com.arena.gg.backend.repository;

import com.arena.gg.backend.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface TournamentRepository extends JpaRepository<Tournament, UUID> {
}
