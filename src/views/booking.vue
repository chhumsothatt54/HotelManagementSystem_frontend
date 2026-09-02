<template>
    <div class="booking-page">

        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
            <div class="container">

                <RouterLink to="/" class="navbar-brand fw-bold brand">
                    AngkorStay
                </RouterLink>

                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3">

                        <li class="nav-item">
                            <RouterLink to="/" class="nav-link">
                                Home
                            </RouterLink>
                        </li>

                        <li class="nav-item">
                            <RouterLink to="/destinations" class="nav-link">
                                Destinations
                            </RouterLink>
                        </li>

                        <li class="nav-item">
                            <RouterLink to="/stays" class="nav-link">
                                Stays
                            </RouterLink>
                        </li>

                        <li class="nav-item">
                            <RouterLink to="/bookings" class="nav-link active">
                                My Bookings
                            </RouterLink>
                        </li>

                        <li class="nav-item">
                            <button class="btn btn-login">
                                Login
                            </button>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>


        <!-- Main -->
        <main class="container py-5">

            <!-- Back -->
            <RouterLink
                to="/stays"
                class="back-link text-decoration-none d-inline-flex align-items-center gap-2 mb-4"
            >
                <i class="bi bi-arrow-left"></i>
                Back to stays
            </RouterLink>


            <div class="row g-4">

                <!-- LEFT SIDE -->
                <div class="col-lg-7">

                    <div class="mb-4">
                        <h1 class="fw-bold mb-2">
                            Complete Your Booking
                        </h1>

                        <p class="text-muted">
                            Enter your information to reserve your stay.
                        </p>
                    </div>


                    <!-- Hotel Card -->
                    <div class="card border-0 shadow-sm hotel-card mb-4">

                        <div class="row g-0">

                            <div class="col-md-5">
                                <img
                                    :src="hotel.image"
                                    :alt="hotel.name"
                                    class="hotel-image"
                                >
                            </div>

                            <div class="col-md-7">
                                <div class="p-4">

                                    <span class="badge">
                                        {{ hotel.type }}
                                    </span>

                                    <h3 class="fw-bold mt-2 mb-2">
                                        {{ hotel.name }}
                                    </h3>

                                    <p class="text-muted mb-2">
                                        <i class="bi bi-geo-alt"></i>
                                        {{ hotel.location }}
                                    </p>

                                    <div class="rating">
                                        <i class="bi bi-star-fill"></i>
                                        {{ hotel.rating }}
                                        <span class="text-muted">
                                            ({{ hotel.reviews }} reviews)
                                        </span>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>


                    <!-- Booking Details -->
                    <div class="card border-0 shadow-sm p-4 mb-4">

                        <h4 class="fw-bold mb-4">
                            Stay Details
                        </h4>

                        <div class="row g-3">

                            <!-- Check in -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">
                                    Check-in
                                </label>

                                <input
                                    v-model="booking.checkin"
                                    type="date"
                                    class="form-control form-control-lg"
                                >
                            </div>


                            <!-- Check out -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">
                                    Check-out
                                </label>

                                <input
                                    v-model="booking.checkout"
                                    type="date"
                                    class="form-control form-control-lg"
                                >
                            </div>


                            <!-- Guests -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">
                                    Guests
                                </label>

                                <select
                                    v-model="booking.guests"
                                    class="form-select form-select-lg"
                                >
                                    <option :value="1">1 Guest</option>
                                    <option :value="2">2 Guests</option>
                                    <option :value="3">3 Guests</option>
                                    <option :value="4">4 Guests</option>
                                    <option :value="5">5 Guests</option>
                                    <option :value="6">6 Guests</option>
                                </select>
                            </div>


                            <!-- Room -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">
                                    Room Type
                                </label>

                                <select
                                    v-model="booking.room"
                                    class="form-select form-select-lg"
                                >
                                    <option value="Deluxe Room">
                                        Deluxe Room
                                    </option>

                                    <option value="Superior Room">
                                        Superior Room
                                    </option>

                                    <option value="Family Room">
                                        Family Room
                                    </option>
                                </select>
                            </div>

                        </div>

                    </div>


                    <!-- Guest Information -->
                    <div class="card border-0 shadow-sm p-4">

                        <h4 class="fw-bold mb-4">
                            Guest Information
                        </h4>

                        <div class="row g-3">

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">
                                    First Name
                                </label>

                                <input
                                    v-model="guest.firstName"
                                    type="text"
                                    class="form-control form-control-lg"
                                    placeholder="Enter first name"
                                >
                            </div>


                            <div class="col-md-6">
                                <label class="form-label fw-semibold">
                                    Last Name
                                </label>

                                <input
                                    v-model="guest.lastName"
                                    type="text"
                                    class="form-control form-control-lg"
                                    placeholder="Enter last name"
                                >
                            </div>


                            <div class="col-md-6">
                                <label class="form-label fw-semibold">
                                    Email
                                </label>

                                <input
                                    v-model="guest.email"
                                    type="email"
                                    class="form-control form-control-lg"
                                    placeholder="example@email.com"
                                >
                            </div>


                            <div class="col-md-6">
                                <label class="form-label fw-semibold">
                                    Phone
                                </label>

                                <input
                                    v-model="guest.phone"
                                    type="tel"
                                    class="form-control form-control-lg"
                                    placeholder="+855 xx xxx xxx"
                                >
                            </div>


                            <div class="col-12">
                                <label class="form-label fw-semibold">
                                    Special Request
                                </label>

                                <textarea
                                    v-model="guest.request"
                                    class="form-control"
                                    rows="4"
                                    placeholder="Any special requests?"
                                ></textarea>
                            </div>

                        </div>

                    </div>

                </div>


                <!-- RIGHT SIDE -->
                <div class="col-lg-5">

                    <div class="card border-0 shadow-sm summary-card">

                        <div class="p-4">

                            <h4 class="fw-bold mb-4">
                                Booking Summary
                            </h4>


                            <!-- Room -->
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted">
                                    Room
                                </span>

                                <span class="fw-semibold">
                                    {{ booking.room }}
                                </span>
                            </div>


                            <!-- Price -->
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted">
                                    Price per night
                                </span>

                                <span>
                                    ${{ hotel.price }}
                                </span>
                            </div>


                            <!-- Nights -->
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted">
                                    Nights
                                </span>

                                <span>
                                    {{ nights }}
                                </span>
                            </div>


                            <hr>


                            <!-- Subtotal -->
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted">
                                    Subtotal
                                </span>

                                <span>
                                    ${{ subtotal }}
                                </span>
                            </div>


                            <!-- Service fee -->
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted">
                                    Service fee
                                </span>

                                <span>
                                    ${{ serviceFee }}
                                </span>
                            </div>


                            <hr>


                            <!-- Total -->
                            <div class="d-flex justify-content-between align-items-center mb-4">

                                <span class="fw-bold fs-5">
                                    Total
                                </span>

                                <span class="fw-bold fs-3 total">
                                    ${{ total }}
                                </span>

                            </div>


                            <!-- Confirm -->
                            <button
                                @click="confirmBooking"
                                class="btn btn-book w-100 btn-lg"
                            >
                                <i class="bi bi-check-circle me-2"></i>
                                Confirm Booking
                            </button>


                            <p class="text-muted text-center small mt-3 mb-0">
                                You won't be charged until your booking is confirmed.
                            </p>

                        </div>

                    </div>


                    <!-- Secure Box -->
                    <div class="secure-box mt-3">

                        <div class="d-flex gap-3">

                            <i class="bi bi-shield-check fs-4"></i>

                            <div>
                                <h6 class="fw-bold mb-1">
                                    Secure Booking
                                </h6>

                                <p class="small text-muted mb-0">
                                    Your personal information is protected.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </main>


        <!-- Footer -->
        <footer class="footer mt-5">
            <div class="container py-4">

                <div class="row">

                    <div class="col-md-6">
                        <h5 class="fw-bold">
                            AngkorStay
                        </h5>

                        <p class="text-muted mb-0">
                            Discover beautiful stays across Cambodia.
                        </p>
                    </div>

                    <div class="col-md-6 text-md-end mt-3 mt-md-0">
                        <span class="text-muted">
                            © 2026 AngkorStay
                        </span>
                    </div>

                </div>

            </div>
        </footer>

    </div>
</template>


<script setup>
import { ref, computed } from 'vue'

const hotel = ref({
    name: 'Angkor Paradise Hotel',
    type: 'Popular Stay',
    location: 'Siem Reap, Cambodia',
    rating: 4.8,
    reviews: 328,
    price: 45,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80'
})

const booking = ref({
    checkin: '',
    checkout: '',
    guests: 2,
    room: 'Deluxe Room'
})

const guest = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    request: ''
})


const nights = computed(() => {
    if (!booking.value.checkin || !booking.value.checkout) {
        return 1
    }

    const checkin = new Date(booking.value.checkin)
    const checkout = new Date(booking.value.checkout)

    const difference = checkout - checkin

    const days = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    )

    return days > 0 ? days : 1
})


const subtotal = computed(() => {
    return hotel.value.price * nights.value
})


const serviceFee = computed(() => {
    return Math.round(subtotal.value * 0.05)
})


const total = computed(() => {
    return subtotal.value + serviceFee.value
})


const confirmBooking = () => {

    if (
        !booking.value.checkin ||
        !booking.value.checkout ||
        !guest.value.firstName ||
        !guest.value.lastName ||
        !guest.value.email ||
        !guest.value.phone
    ) {
        alert('Please complete all required information.')
        return
    }

    alert(
        `Booking confirmed!\n\n` +
        `${hotel.value.name}\n` +
        `${booking.value.room}\n` +
        `${booking.value.checkin} → ${booking.value.checkout}\n` +
        `Total: $${total.value}`
    )
}
</script>


<style scoped>

:global(:root) {
    --primary: #198754;
    --primary-dark: #146c43;
    --light-green: #eaf7ef;
}


.booking-page {
    min-height: 100vh;
    background: #f8faf9;
}


/* Navbar */

.brand {
    color: var(--primary);
    font-size: 1.5rem;
}

.nav-link {
    color: #555;
    font-weight: 500;
}

.nav-link:hover,
.nav-link.active {
    color: var(--primary);
}

.btn-login {
    border: 1px solid var(--primary);
    color: var(--primary);
    border-radius: 8px;
    padding: 8px 20px;
}

.btn-login:hover {
    background: var(--primary);
    color: white;
}


/* Back */

.back-link {
    color: var(--primary);
    font-weight: 500;
}

.back-link:hover {
    color: var(--primary-dark);
}


/* Hotel */

.hotel-card {
    overflow: hidden;
    border-radius: 16px;
}

.hotel-image {
    width: 100%;
    height: 100%;
    min-height: 230px;
    object-fit: cover;
}

.badge {
    background: var(--light-green);
    color: var(--primary);
    padding: 7px 12px;
    border-radius: 20px;
}

.rating {
    color: #e09b00;
    font-weight: 600;
}

.rating .text-muted {
    font-weight: 400;
}


/* Cards */

.card {
    border-radius: 16px;
}

.form-control,
.form-select {
    border-radius: 10px;
    border: 1px solid #dee2e6;
}

.form-control:focus,
.form-select:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.12);
}


/* Summary */

.summary-card {
    position: sticky;
    top: 90px;
}

.total {
    color: var(--primary);
}

.btn-book {
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
}

.btn-book:hover {
    background: var(--primary-dark);
    color: white;
}


/* Secure */

.secure-box {
    background: white;
    border-radius: 14px;
    padding: 18px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.secure-box i {
    color: var(--primary);
}


/* Footer */

.footer {
    background: white;
    border-top: 1px solid #eee;
}


/* Responsive */

@media (max-width: 991px) {
    .summary-card {
        position: static;
    }
}

</style>