package com.example.seatselector.controller;

import com.example.seatselector.model.Seat;
import com.example.seatselector.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatService seatService;

    @Autowired
    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/{flightId}")
    public List<Seat> getSeatsForFlight(@PathVariable Long flightId) {
        return seatService.getSeatsForFlight(flightId);
    }

    @GetMapping("/{flightId}/recommend")
    public List<Seat> recommendSeats(
            @PathVariable Long flightId,
            @RequestParam(defaultValue = "1") int numSeats,
            @RequestParam(defaultValue = "false") boolean preferWindow,
            @RequestParam(defaultValue = "false") boolean needExtraLegroom,
            @RequestParam(defaultValue = "false") boolean nearExit,
            @RequestParam(defaultValue = "false") boolean seatsTogetherRequired) {

        return seatService.recommendSeats(flightId, numSeats, preferWindow,
                needExtraLegroom, nearExit, seatsTogetherRequired);
    }
}