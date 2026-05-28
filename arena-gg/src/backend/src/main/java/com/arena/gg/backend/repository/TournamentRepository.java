package com.arenagg.backend.repository;

import com.arenagg.backend.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, UUID> {
    // Aquí puedes añadir métodos personalizados si los necesitas después
}