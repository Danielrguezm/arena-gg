package com.arena.gg.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tournaments")
@Data
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "game_id")
    private String gameId;

    private String name;
    private String description;
    private Integer prize;
    private Integer fee;

    @Column(name = "max_entries")
    private Integer maxEntries;

    private String format;
    private String mode;
    private String level;
    private String status;
    private Boolean featured;

    @Column(name = "starts_at")
    private LocalDateTime startsAt;

    @Column(name = "ends_at")
    private LocalDateTime endsAt;
}
