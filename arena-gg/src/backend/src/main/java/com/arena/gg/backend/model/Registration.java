package com.arena.gg.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "registrations", uniqueConstraints = @UniqueConstraint(columnNames = {"tournament_id", "user_id"}))
@Data
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tournament_id", nullable = false)
    private UUID tournamentId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt = LocalDateTime.now();
}
