package com.example.seatselector.service;

import com.example.seatselector.model.Flight;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class FlightServiceTest {
    private FlightService flightService;

    @BeforeEach
    void setUp() {
        flightService = new FlightService();
    }
    @Test
    void getAllFlights_ShouldReturnAllFlights() {
        List<Flight> flights = flightService.getAllFlights();
        assertNotNull(flights);
        assertEquals(10, flights.size());
    }

    @Test
    void getFlightById_ShouldReturnNullForInvalidId() {
        Flight flight = flightService.getFlightById(999L);
        assertNull(flight);
    }
}