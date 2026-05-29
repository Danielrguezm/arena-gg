package com.arena.gg.backend.controller;

import com.arena.gg.backend.model.Tournament;
import com.arena.gg.backend.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tournaments")
@CrossOrigin(origins = "*")
public class TournamentController {

    @Autowired
    private TournamentRepository tournamentRepository;

    @GetMapping
    public List<Tournament> getAll() {
        return tournamentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tournament> getById(@PathVariable UUID id) {
        return tournamentRepository.findById(id)
                .map(ResponseEntity::ok)
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
}
