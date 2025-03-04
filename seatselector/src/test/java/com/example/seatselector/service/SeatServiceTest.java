package com.example.seatselector.service;

import com.example.seatselector.model.Seat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SeatServiceTest {

    private SeatService seatService;

    @BeforeEach
    void setUp() {
        seatService = new SeatService();
    }
    @Test
    void getSeatsForFlight_ShouldReturnSeatsForValidFlightId() {
        List<Seat> seats = seatService.getSeatsForFlight(1L);
        assertNotNull(seats);
        assertFalse(seats.isEmpty());
    }

    @Test
    void getSeatsForFlight_ShouldReturnEmptyListForWrongFlightId() {
        List<Seat> seats = seatService.getSeatsForFlight(999L);
        assertNotNull(seats);
        assertTrue(seats.isEmpty());
    }

    @Test
    void recommendSeats_ShouldReturnSeatsBasedOnPreferences() {
        List<Seat> recommendedSeats = seatService.recommendSeats(1L, 2, true, false, false, true);
        assertNotNull(recommendedSeats);
        assertTrue(recommendedSeats.size() <= 2); // Cant be more than requested.
    }
}