package com.finedge.controller;

import com.finedge.dto.CardControlsRequest;
import com.finedge.dto.PinChangeRequest;
import com.finedge.model.Card;
import com.finedge.service.CardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
public class CardController {
    
    @Autowired
    private CardService cardService;
    
    @GetMapping
    public ResponseEntity<Map<String, List<Card>>> getMyCards() {
        List<Card> cards = cardService.getMyCards();
        return ResponseEntity.ok(Map.of("cards", cards));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Card>> getCard(@PathVariable String id) {
        Card card = cardService.getCard(id);
        return ResponseEntity.ok(Map.of("card", card));
    }
    
    @PatchMapping("/{id}/freeze")
    public ResponseEntity<Map<String, Card>> toggleFreeze(@PathVariable String id,
                                                           @RequestParam Boolean freeze) {
        Card card = cardService.toggleFreeze(id, freeze);
        return ResponseEntity.ok(Map.of("card", card));
    }
    
    @PutMapping("/{id}/controls")
    public ResponseEntity<Map<String, Card>> updateControls(@PathVariable String id,
                                                            @Valid @RequestBody CardControlsRequest request) {
        Card card = cardService.updateControls(id, request);
        return ResponseEntity.ok(Map.of("card", card));
    }
    
    @PostMapping("/{id}/change-pin")
    public ResponseEntity<Map<String, String>> changePin(@PathVariable String id,
                                                         @Valid @RequestBody PinChangeRequest request) {
        cardService.changePin(id, request);
        return ResponseEntity.ok(Map.of("message", "PIN changed successfully"));
    }
    
    @PostMapping("/{id}/report")
    public ResponseEntity<Map<String, Card>> reportCard(@PathVariable String id,
                                                         @RequestParam String reason) {
        Card card = cardService.reportCard(id, reason);
        return ResponseEntity.ok(Map.of("card", card));
    }
}

