package com.example.seatselector.model;

/**
 * Seat class, constructor, getters & setters.
 *
 */
public class Seat {
    private String id;
    private String row;
    private String column;
    private boolean isWindow;
    private boolean hasExtraLegroom;
    private boolean isNearExit;
    private boolean isOccupied;
    private String seatClass; // First, Business, Economy.

    public Seat() {}

    public Seat(String id, String row, String column, boolean isWindow,
                boolean hasExtraLegroom, boolean isNearExit,
                boolean isOccupied, String seatClass) {
        this.id = id;
        this.row = row;
        this.column = column;
        this.isWindow = isWindow;
        this.hasExtraLegroom = hasExtraLegroom;
        this.isNearExit = isNearExit;
        this.isOccupied = isOccupied;
        this.seatClass = seatClass;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRow() {
        return row;
    }

    public void setRow(String row) {
        this.row = row;
    }

    public String getColumn() {
        return column;
    }

    public void setColumn(String column) {
        this.column = column;
    }

    public String getSeatNumber() {
        return row + column;
    }

    public boolean isWindow() {
        return isWindow;
    }

    public void setWindow(boolean window) {
        isWindow = window;
    }

    public boolean hasExtraLegroom() {
        return hasExtraLegroom;
    }

    public void setHasExtraLegroom(boolean hasExtraLegroom) {
        this.hasExtraLegroom = hasExtraLegroom;
    }

    public boolean isNearExit() {
        return isNearExit;
    }

    public void setNearExit(boolean nearExit) {
        isNearExit = nearExit;
    }

    public boolean isOccupied() {
        return isOccupied;
    }

    public void setOccupied(boolean occupied) {
        isOccupied = occupied;
    }

    public String getSeatClass() {
        return seatClass;
    }

    public void setSeatClass(String seatClass) {
        this.seatClass = seatClass;
    }
}