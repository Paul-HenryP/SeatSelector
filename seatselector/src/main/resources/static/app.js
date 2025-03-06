// Global state.
let selectedFlight = null;
let recommendedSeats = [];
let selectedSeats = [];

// DOM Elements.
document.addEventListener('DOMContentLoaded', () => {
    // Initializes the application.
    fetchFlights();

    // event listeners.
    document.getElementById('flight-filter-form').addEventListener('submit', handleFlightSearch);
    document.getElementById('seat-preferences-form').addEventListener('submit', handleSeatPreferences);
    document.getElementById('confirm-booking').addEventListener('click', handleBookingConfirmation);
    document.getElementById('new-search').addEventListener('click', resetApplication);

    // Closes the modal when clicking the X.
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('booking-confirmation').classList.add('hidden');
    });
});


// Used AI (DeepSeek) to manage all the edge cases for time input handling and for a better UX.
document.addEventListener("DOMContentLoaded", function () {
    const timeInputs = document.querySelectorAll('input[type="text"][placeholder="HH:mm"]');

    timeInputs.forEach(input => {
        // Auto-correct and validate when the user leaves the input field.
        input.addEventListener("blur", () => {
            let value = input.value.trim();

            // Remove all non-digit characters (e.g., colons, spaces, etc.)
            value = value.replace(/\D/g, "");

            // Handle empty input
            if (value === "") {
                input.value = "";
                input.setCustomValidity("Please enter a valid time in 24-hour format (HH:mm).");
                return;
            }

            // Pad the input to at least 2 digits (e.g., "1" → "10")
            if (value.length === 1) {
                value = value.padEnd(2, "0");
            }

            // Split into hours and minutes
            let hours = value.slice(0, 2);
            let minutes = value.slice(2, 4) || "00"; // Default minutes to "00" if missing

            // Ensure hours are within 0-23
            hours = Math.min(23, Math.max(0, parseInt(hours, 10))).toString().padStart(2, "0");

            // Ensure minutes are within 0-59
            minutes = Math.min(59, Math.max(0, parseInt(minutes, 10))).toString().padStart(2, "0");

            // Combine into the final time string
            const correctedTime = `${hours}:${minutes}`;
            input.value = correctedTime;

            // Validate the time format
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(correctedTime)) {
                input.setCustomValidity("Please enter a valid time in 24-hour format (HH:mm).");
            } else {
                input.setCustomValidity("");
            }
        });

        // Prevent invalid input (e.g., letters, symbols) while typing
        input.addEventListener("input", () => {
            let value = input.value;

            // Allow only digits and colons
            value = value.replace(/[^0-9:]/g, "");

            // Auto-add a colon after two digits if missing
            if (value.length > 2 && !value.includes(":")) {
                value = value.slice(0, 2) + ":" + value.slice(2);
            }

            input.value = value;
        });
    });
});

// API Functions.
async function fetchFlights() {
    try {
        const response = await fetch('/api/flights');
        const flights = await response.json();
        displayFlights(flights);
    } catch (error) {
        console.error('Error fetching flights:', error);
        showError('Failed to load flights. Please try again later.');
    }
}

async function fetchFilteredFlights(filters) {
    try {
        // Builds query string from the users filters.
        const queryParams = new URLSearchParams();

        if (filters.destination) queryParams.append('destination', filters.destination);
        if (filters.date) queryParams.append('date', filters.date);
        if (filters.earliestTime) queryParams.append('earliestTime', filters.earliestTime);
        if (filters.latestTime) queryParams.append('latestTime', filters.latestTime);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

        const response = await fetch(`/api/flights/filter?${queryParams.toString()}`);
        const flights = await response.json();
        displayFlights(flights);
    } catch (error) {
        console.error('Error fetching filtered flights:', error);
        showError('Failed to filter flights. Please try again later.');
    }
}

async function fetchSeatsForFlight(flightId) {
    try {
        const response = await fetch(`/api/seats/${flightId}`);
        const seats = await response.json();
        displaySeatMap(seats);
    } catch (error) {
        console.error('Error fetching seats:', error);
        showError('Failed to load seat map. Please try again later.');
    }
}

async function fetchRecommendedSeats(flightId, preferences) {
    try {
        // Builds the query string from the users preferences.
        const queryParams = new URLSearchParams();

        queryParams.append('numSeats', preferences.numSeats);
        queryParams.append('preferWindow', preferences.preferWindow);
        queryParams.append('needExtraLegroom', preferences.needExtraLegroom);
        queryParams.append('nearExit', preferences.nearExit);
        queryParams.append('seatsTogetherRequired', preferences.seatsTogetherRequired);

        const response = await fetch(`/api/seats/${flightId}/recommend?${queryParams.toString()}`);
        recommendedSeats = await response.json();

        // Updates the seat map to highlight recommended seats.
        highlightRecommendedSeats();
    } catch (error) {
        console.error('Error fetching seat recommendations:', error);
        showError('Failed to get seat recommendations. Please try again later.');
    }
}

// UI Functions.
function displayFlights(flights) {
    const flightResults = document.getElementById('flight-results');

    if (flights.length === 0) {
        flightResults.innerHTML = '<p class="no-results">No flights found matching your criteria. Please try different search parameters.</p>';
        return;
    }

    flightResults.innerHTML = flights.map(flight => `
        <div class="flight-card" data-flight-id="${flight.id}">
            <div class="flight-header">
                <span class="flight-destination">${flight.origin} → ${flight.destination}</span>
                <span class="flight-price">€${flight.price.toFixed(2)}</span>
            </div>
            <div class="flight-details">
                <span>Flight: ${flight.flightNumber}</span>
                <span>Aircraft: ${flight.aircraft}</span>
            </div>
            <div class="flight-details">
                <span>Date: ${formatDate(flight.date)}</span>
            </div>
            <div class="flight-details">
                <span>Departure: ${formatTime(flight.departureTime)}</span>
                <span>Arrival: ${formatTime(flight.arrivalTime)}</span>
            </div>
            <div class="flight-action">
                <button class="btn primary select-flight-btn">Select Flight</button>
            </div>
        </div>
    `).join('');

    // Event listeners for the flight selection buttons.
    document.querySelectorAll('.select-flight-btn').forEach(button => {
        button.addEventListener('click', handleFlightSelection);
    });
}

function displaySeatMap(seats) {
    // First, groups the seats by row.
    const seatsByRow = {};
    const columnSet = new Set();

    // Collects all rows and columns.
    seats.forEach(seat => {
        if (!seatsByRow[seat.row]) {
            seatsByRow[seat.row] = [];
        }
        seatsByRow[seat.row].push(seat);
        columnSet.add(seat.column);
    });

    // Sorts the rows and columns.
    const rows = Object.keys(seatsByRow).sort((a, b) => parseInt(a) - parseInt(b));
    const columns = Array.from(columnSet).sort();

    // Creates the seat map HTML.
    const seatMapElement = document.getElementById('seat-map');
    seatMapElement.innerHTML = '';

    rows.forEach(rowNum => {
        const rowSeats = seatsByRow[rowNum];
        const rowElement = document.createElement('div');
        rowElement.className = 'seat-row';

        // Adds the row number.
        const rowNumberElement = document.createElement('div');
        rowNumberElement.className = 'row-number';
        rowNumberElement.textContent = rowNum;
        rowElement.appendChild(rowNumberElement);

        // Creates a map of column to seat for this row.
        const columnToSeat = {};
        rowSeats.forEach(seat => {
            columnToSeat[seat.column] = seat;
        });

        // Adds seats in column order with placeholders for aisles.
        let previousColumn = null;
        columns.forEach(column => {
            // Checks if we need to add an aisle.
            if (previousColumn) {
                const prevCharCode = previousColumn.charCodeAt(0);
                const currCharCode = column.charCodeAt(0);

                if (currCharCode - prevCharCode > 1) {
                    // There's a gap in columns, add an aisle.
                    const aisleElement = document.createElement('div');
                    aisleElement.className = 'aisle';
                    rowElement.appendChild(aisleElement);
                }
            }

            const seat = columnToSeat[column];
            if (seat) {
                const seatElement = document.createElement('div');
                seatElement.className = `seat ${seat.occupied ? 'occupied' : 'available'}`;
                seatElement.dataset.seatId = seat.id;

                // Adds additional classes for seat features.
                if (seat.seatClass === 'First') seatElement.classList.add('first-class');
                else if (seat.seatClass === 'Business') seatElement.classList.add('business-class');
                else seatElement.classList.add('economy-class');

                if (seat.nearExit) seatElement.classList.add('exit-row');
                if (seat.hasExtraLegroom) seatElement.classList.add('extra-legroom');

                seatElement.textContent = seat.getSeatNumber || (seat.row + seat.column);

                // Add click handler for available seats.
                if (!seat.occupied) {
                    seatElement.addEventListener('click', () => toggleSeatSelection(seat));
                }

                rowElement.appendChild(seatElement);
            }

            previousColumn = column;
        });

        seatMapElement.appendChild(rowElement);
    });
}

function highlightRecommendedSeats() {
    // First, resets all current recommendations.
    document.querySelectorAll('.seat.recommended').forEach(seatElement => {
        seatElement.classList.remove('recommended');
    });

    // Highlights recommended seats.
    recommendedSeats.forEach(seat => {
        const seatElement = document.querySelector(`.seat[data-seat-id="${seat.id}"]`);
        if (seatElement && !seatElement.classList.contains('selected')) {
            seatElement.classList.add('recommended');
        }
    });
}

function toggleSeatSelection(seat) {
    const seatElement = document.querySelector(`.seat[data-seat-id="${seat.id}"]`);

    if (seatElement.classList.contains('selected')) {
        // Deselects the seat.
        seatElement.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s.id !== seat.id);
    } else {
        // Selects the seat.
        seatElement.classList.add('selected');
        seatElement.classList.remove('recommended');
        selectedSeats.push(seat);
    }

    updateSelectedSeatsDisplay();
}

function updateSelectedSeatsDisplay() {
    const selectedSeatsContainer = document.querySelector('.selected-seats-summary');
    const selectedSeatsList = document.getElementById('selected-seats-list');

    if (selectedSeats.length > 0) {
        selectedSeatsContainer.classList.remove('hidden');

        selectedSeatsList.innerHTML = selectedSeats.map(seat => `
            <div class="selected-seat-item">
                <span>Seat ${seat.getSeatNumber || (seat.row + seat.column)}</span>
                <span>${seat.seatClass} Class</span>
                <span>
                    ${seat.window ? 'Window ' : ''}
                    ${seat.hasExtraLegroom ? 'Extra Legroom ' : ''}
                    ${seat.nearExit ? 'Near Exit' : ''}
                </span>
            </div>
        `).join('');
    } else {
        selectedSeatsContainer.classList.add('hidden');
    }
}

// Event Handlers.
function handleFlightSearch(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const filters = {
        destination: formData.get('destination'),
        date: formatInputDate(formData.get("date")),
        earliestTime: formatInputTime(formData.get("earliestTime")),
        latestTime: formatInputTime(formData.get("latestTime")),
        minPrice: formData.get('minPrice'),
        maxPrice: formData.get('maxPrice')
    };

    // Filters empty values.
    Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
    });

    fetchFilteredFlights(filters);
}

function formatInputDate(dateString) {
    if (!dateString) return "";

    // Checks if the format is already yyyy-MM-dd (from <input type="date">).
    if (dateString.includes("-")) return dateString;

    // dd.MM.yyyy → yyyy-MM-dd.
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`;
}


function formatInputTime(timeString) {
    if (!timeString) return "";
    let [hours, minutes] = timeString.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}

function handleFlightSelection(event) {
    // Gets the flight card element.
    const flightCard = event.target.closest('.flight-card');
    const flightId = flightCard.dataset.flightId;

    // Removes selection from all flight cards.
    document.querySelectorAll('.flight-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Adds selected class to the chosen flight.
    flightCard.classList.add('selected');

    // Sets the selected flight.
    selectedFlight = flightId;

    // Resets seat selection.
    selectedSeats = [];
    recommendedSeats = [];

    // Shows the seat selection section.
    document.getElementById('seat-selection').classList.remove('hidden');

    // Scrolls to seat selection section.
    document.getElementById('seat-selection').scrollIntoView({ behavior: 'smooth' });

    fetchSeatsForFlight(flightId);
}

function handleSeatPreferences(event) {
    event.preventDefault();

    if (!selectedFlight) {
        showError('Please select a flight first!');
        return;
    }

    const formData = new FormData(event.target);
    const preferences = {
        numSeats: formData.get('numSeats') || 1,
        preferWindow: formData.get('preferWindow') === 'on',
        needExtraLegroom: formData.get('needExtraLegroom') === 'on',
        nearExit: formData.get('nearExit') === 'on',
        seatsTogetherRequired: formData.get('seatsTogetherRequired') === 'on'
    };

    fetchRecommendedSeats(selectedFlight, preferences);
}

function handleBookingConfirmation() {
    if (selectedSeats.length === 0) {
        showError('Please select at least one seat to confirm your booking.');
        return;
    }

    // Gets the selected flight details.
    const flightCard = document.querySelector(`.flight-card[data-flight-id="${selectedFlight}"]`);
    const destination = flightCard.querySelector('.flight-destination').textContent;
    const flightNumber = flightCard.querySelector('.flight-details span:first-child').textContent;
    const date = flightCard.querySelectorAll('.flight-details')[1].querySelector('span').textContent;
    const time = flightCard.querySelectorAll('.flight-details')[2].querySelector('span:first-child').textContent;

    // Displays the booking confirmation.
    document.getElementById('booking-details').innerHTML = `
        <p><strong>${destination}</strong></p>
        <p>${flightNumber}</p>
        <p>${date} | ${time}</p>
        <p>Selected Seats: ${selectedSeats.map(seat => seat.getSeatNumber || (seat.row + seat.column)).join(', ')}</p>
    `;

    // Shows the confirmation modal.
    document.getElementById('booking-confirmation').classList.remove('hidden');
}

function resetApplication() {
    // Hides the booking confirmation.
    document.getElementById('booking-confirmation').classList.add('hidden');

    // Resets the state.
    selectedFlight = null;
    recommendedSeats = [];
    selectedSeats = [];

    // Resets the UI.
    document.getElementById('flight-filter-form').reset();
    document.getElementById('seat-preferences-form').reset();
    document.getElementById('seat-selection').classList.add('hidden');
    document.querySelector('.selected-seats-summary').classList.add('hidden');

    fetchFlights();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Utility Functions.
function formatDate(dateString) {
    if (!dateString) return "";
    return dateString;
}

function formatTime(timeString) {
    if (!timeString) return "";
    let [hours, minutes] = timeString.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}




function showError(message) {
    alert(message);
}