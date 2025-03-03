package com.example.seatselector.service;

import com.example.seatselector.model.Flight;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * FlightService class with hardcoded flight data and some service functions to get or filter the flight data.
 *
 */
@Service
public class FlightService {

    private final List<Flight> flights = new ArrayList<>();

    public FlightService() {
        // Initializes with sample flight data.
        initializeFlights();
    }

    private void initializeFlights() {
        flights.add(new Flight(1L, "Tallinn", "London", LocalDate.now().plusDays(1),
                LocalTime.of(10, 0), LocalTime.of(12, 0),
                299.99, "EE123", "Airbus A320"));
        flights.add(new Flight(2L, "Tallinn", "Paris", LocalDate.now().plusDays(2),
                LocalTime.of(14, 30), LocalTime.of(16, 30),
                349.99, "EE124", "Boeing 737"));
        flights.add(new Flight(3L, "Tallinn", "Berlin", LocalDate.now().plusDays(3),
                LocalTime.of(8, 15), LocalTime.of(9, 45),
                249.99, "EE125", "Airbus A320"));
        flights.add(new Flight(4L, "Tallinn", "Stockholm", LocalDate.now().plusDays(1),
                LocalTime.of(16, 0), LocalTime.of(17, 0),
                199.99, "EE126", "Bombardier CRJ900"));
        flights.add(new Flight(5L, "Tallinn", "Helsinki", LocalDate.now().plusDays(1),
                LocalTime.of(9, 0), LocalTime.of(9, 40),
                129.99, "EE127", "ATR 72"));
        flights.add(new Flight(6L, "Tallinn", "Riga", LocalDate.now(),
                LocalTime.of(11, 30), LocalTime.of(12, 20),
                99.99, "EE128", "ATR 72"));
        flights.add(new Flight(7L, "Tallinn", "Warsaw", LocalDate.now().plusDays(4),
                LocalTime.of(13, 45), LocalTime.of(15, 15),
                229.99, "EE129", "Airbus A319"));
        flights.add(new Flight(8L, "Tallinn", "Oslo", LocalDate.now().plusDays(2),
                LocalTime.of(18, 0), LocalTime.of(19, 30),
                269.99, "EE130", "Boeing 737"));
        flights.add(new Flight(9L, "Tallinn", "Copenhagen", LocalDate.now().plusDays(3),
                LocalTime.of(12, 0), LocalTime.of(13, 15),
                239.99, "EE131", "Boeing 737"));
        flights.add(new Flight(10L, "Tallinn", "Vienna", LocalDate.now().plusDays(5),
                LocalTime.of(7, 30), LocalTime.of(9, 30),
                329.99, "EE132", "Airbus A320"));
    }

    public List<Flight> getAllFlights() {
        return flights;
    }

    public List<Flight> filterFlights(String destination, LocalDate date,
                                      LocalTime earliestTime, LocalTime latestTime,
                                      Double minPrice, Double maxPrice) {

        return flights.stream()
                .filter(flight -> destination == null || flight.getDestination().equalsIgnoreCase(destination))
                .filter(flight -> date == null || flight.getDate().equals(date))
                .filter(flight -> earliestTime == null || flight.getDepartureTime().isAfter(earliestTime)
                        || flight.getDepartureTime().equals(earliestTime))
                .filter(flight -> latestTime == null || flight.getDepartureTime().isBefore(latestTime)
                        || flight.getDepartureTime().equals(latestTime))
                .filter(flight -> minPrice == null || flight.getPrice() >= minPrice)
                .filter(flight -> maxPrice == null || flight.getPrice() <= maxPrice)
                .collect(Collectors.toList());
    }

    public Flight getFlightById(Long id) {
        return flights.stream()
                .filter(flight -> flight.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}