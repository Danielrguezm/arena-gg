package com.arena.gg.backend.dto;

import com.arena.gg.backend.model.Tournament;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TournamentResponse {
    private UUID id;
    private String gameId;
    private String name;
    private String description;
    private Integer prize;
    private Integer fee;
    private Integer maxEntries;
    private String format;
    private String mode;
    private String level;
    private String status;
    private Boolean featured;
    private LocalDateTime startsAt;
    private LocalDateTime endsAt;
    private long entries;
    private boolean registered;

    public static TournamentResponse from(Tournament t, long entries, boolean registered) {
        TournamentResponse r = new TournamentResponse();
        r.setId(t.getId());
        r.setGameId(t.getGameId());
        r.setName(t.getName());
        r.setDescription(t.getDescription());
        r.setPrize(t.getPrize());
        r.setFee(t.getFee());
        r.setMaxEntries(t.getMaxEntries());
        r.setFormat(t.getFormat());
        r.setMode(t.getMode());
        r.setLevel(t.getLevel());
        r.setStatus(t.getStatus());
        r.setFeatured(t.getFeatured());
        r.setStartsAt(t.getStartsAt());
        r.setEndsAt(t.getEndsAt());
        r.setEntries(entries);
        r.setRegistered(registered);
        return r;
    }
}
