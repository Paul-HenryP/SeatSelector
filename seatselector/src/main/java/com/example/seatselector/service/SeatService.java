package com.example.seatselector.service;

import com.example.seatselector.model.Seat;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * SeatService class with hardcoded seat data and some service functions to get or filter the flight data.
 *
 */
@Service
public class SeatService {

    private final Map<Long, List<Seat>> flightSeats = new HashMap<>();
    private final Random random = new Random();

    public SeatService() {
        // Initializes the example seat layouts for each flight.
        initializeSeats();
    }

    private void initializeSeats() {
        // Initializes the seats for the first 10 flights.
        for (long flightId = 1; flightId <= 10; flightId++) {
            flightSeats.put(flightId, generateSeatsForFlight(flightId));
        }
    }

    private List<Seat> generateSeatsForFlight(Long flightId) {
        List<Seat> seats = new ArrayList<>();

        // Different seat layouts based on aircraft type (determined by flight ID for simplicity).
        int rows;
        String[] columns;
        boolean hasFirstClass = flightId % 5 == 0; // Every 5th flight has first class.
        boolean hasBusiness = flightId % 3 == 0;   // Every 3rd flight has business class.

        // Determines aircraft size based on the flight ID.
        if (flightId % 3 == 0) { // Larger aircraft.
            rows = 30;
            columns = new String[]{"A", "B", "C", "", "D", "E", "F"};
        } else if (flightId % 2 == 0) { // Medium aircraft.
            rows = 25;
            columns = new String[]{"A", "B", "", "C", "D"};
        } else { // Smaller aircraft.
            rows = 20;
            columns = new String[]{"A", "B", "C"};
        }

        // Generates seats for each row.
        for (int row = 1; row <= rows; row++) {
            String seatClass;
            boolean extraLegroom = false;

            // Determines seat class based on the row.
            if (hasFirstClass && row <= 2) {
                seatClass = "First";
                extraLegroom = true;
            } else if (hasBusiness && row <= 5) {
                seatClass = "Business";
                extraLegroom = true;
            } else {
                seatClass = "Economy";
                // Extra legroom for emergency exit rows.
                extraLegroom = row == 10 || row == 20;
            }

            // Creates seats for each column in this row.
            for (String col : columns) {
                // Skips empty columns (aisle position).
                if (col.isEmpty()) continue;

                boolean isWindow = col.equals("A") ||
                        (columns.length >= 3 && col.equals(columns[columns.length - 1]));
                boolean isNearExit = row == 1 || row == rows || row == 10 || row == 20;
                boolean isOccupied = random.nextDouble() < 0.4; // 40% chance for a seat to be occupied.

                Seat seat = new Seat(
                        row + col,
                        String.valueOf(row),
                        col,
                        isWindow,
                        extraLegroom,
                        isNearExit,
                        isOccupied,
                        seatClass
                );

                seats.add(seat);
            }
        }

        return seats;
    }

    public List<Seat> getSeatsForFlight(Long flightId) {
        return flightSeats.getOrDefault(flightId, new ArrayList<>());
    }

    public List<Seat> recommendSeats(Long flightId, int numSeats, boolean preferWindow,
                                     boolean needExtraLegroom, boolean nearExit, boolean seatsTogetherRequired) {

        List<Seat> availableSeats = flightSeats.getOrDefault(flightId, new ArrayList<>()).stream()
                .filter(seat -> !seat.isOccupied())
                .collect(Collectors.toList());

        // Filters based on preferences.
        List<Seat> filteredSeats = availableSeats.stream()
                .filter(seat -> !preferWindow || seat.isWindow())
                .filter(seat -> !needExtraLegroom || seat.hasExtraLegroom())
                .filter(seat -> !nearExit || seat.isNearExit())
                .collect(Collectors.toList());

        if (filteredSeats.isEmpty() && !availableSeats.isEmpty()) {
            // If no seats match all preferences, returns the best effort.
            filteredSeats = availableSeats;
        }

        if (seatsTogetherRequired && numSeats > 1) {
            return findSeatsNextToEachOther(filteredSeats, numSeats);
        } else {
            // Returns the best seats based on the users filters.
            return filteredSeats.stream()
                    .limit(numSeats)
                    .collect(Collectors.toList());
        }
    }

    private List<Seat> findSeatsNextToEachOther(List<Seat> seats, int numSeats) {
        // Groups seats by row.
        Map<String, List<Seat>> seatsByRow = seats.stream()
                .collect(Collectors.groupingBy(Seat::getRow));

        // Looks for consecutive seats in the same row.
        for (String row : seatsByRow.keySet()) {
            List<Seat> rowSeats = seatsByRow.get(row);

            // Sorts seats by column to find the consecutive ones.
            rowSeats.sort(Comparator.comparing(Seat::getColumn));

            for (int i = 0; i <= rowSeats.size() - numSeats; i++) {
                boolean consecutive = true;
                for (int j = 0; j < numSeats - 1; j++) {
                    char currentCol = rowSeats.get(i + j).getColumn().charAt(0);
                    char nextCol = rowSeats.get(i + j + 1).getColumn().charAt(0);

                    // Checks if columns are consecutive letters.
                    if (nextCol - currentCol != 1) {
                        consecutive = false;
                        break;
                    }
                }

                if (consecutive) {
                    return rowSeats.subList(i, i + numSeats);
                }
            }
        }

        // If no consecutive seats are found, it will return best individual seats.
        return seats.stream().limit(numSeats).collect(Collectors.toList());
    }
}