package com.arenagg.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tournaments")
@Data 
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;
    private String description;
    private Integer prize;
    private Integer fee;
    
    @Column(name = "max_entries")
    private Integer maxEntries;
    
    private String format;
    private String mode;
    
    @Column(name = "starts_at")
    private OffsetDateTime startsAt;
    
    private String status;
}