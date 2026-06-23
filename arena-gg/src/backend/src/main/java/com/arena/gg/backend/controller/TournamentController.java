package com.arena.gg.backend.controller;

import com.arena.gg.backend.dto.TournamentResponse;
import com.arena.gg.backend.model.Registration;
import com.arena.gg.backend.model.Tournament;
import com.arena.gg.backend.repository.RegistrationRepository;
import com.arena.gg.backend.repository.TournamentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    private final TournamentRepository tournamentRepository;
    private final RegistrationRepository registrationRepository;

    public TournamentController(TournamentRepository tournamentRepository, RegistrationRepository registrationRepository) {
        this.tournamentRepository = tournamentRepository;
        this.registrationRepository = registrationRepository;
    }

    @GetMapping
    public List<TournamentResponse> getAll(@RequestParam(required = false) String userId) {
        return tournamentRepository.findAll().stream()
                .map(t -> TournamentResponse.from(t,
                        registrationRepository.countByTournamentId(t.getId()),
                        userId != null && registrationRepository.existsByTournamentIdAndUserId(t.getId(), userId)))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TournamentResponse> getById(
            @PathVariable UUID id,
            @RequestParam(required = false) String userId) {
        return tournamentRepository.findById(id)
                .map(t -> ResponseEntity.ok(TournamentResponse.from(t,
                        registrationRepository.countByTournamentId(t.getId()),
                        userId != null && registrationRepository.existsByTournamentIdAndUserId(t.getId(), userId))))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Tournament create(@RequestBody Tournament tournament) {
        tournament.setId(null);
        return tournamentRepository.save(tournament);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tournament> update(@PathVariable UUID id, @RequestBody Tournament tournament) {
        if (!tournamentRepository.existsById(id)) return ResponseEntity.notFound().build();
        tournament.setId(id);
        return ResponseEntity.ok(tournamentRepository.save(tournament));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!tournamentRepository.existsById(id)) return ResponseEntity.notFound().build();
        tournamentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<Map<String, Object>> register(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {

        String userId = body.get("userId");
        if (userId == null || userId.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "userId requerido"));

        Tournament t = tournamentRepository.findById(id).orElse(null);
        if (t == null) return ResponseEntity.notFound().build();

        long entries = registrationRepository.countByTournamentId(id);
        if (entries >= t.getMaxEntries())
            return ResponseEntity.badRequest().body(Map.of("error", "Torneo lleno"));

        if (registrationRepository.existsByTournamentIdAndUserId(id, userId))
            return ResponseEntity.badRequest().body(Map.of("error", "Ya estás inscrito"));

        Registration reg = new Registration();
        reg.setTournamentId(id);
        reg.setUserId(userId);
        registrationRepository.save(reg);

        return ResponseEntity.ok(Map.of(
                "message", "Inscripción exitosa",
                "entries", entries + 1
        ));
    }
}
