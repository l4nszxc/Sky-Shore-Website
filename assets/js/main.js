/**
 * Sky & Shore Beach Resort - Local Database & Application Controller
 * Handles local storage for reservations, inquiries, reviews, and interactive UI
 */

const STORAGE_KEYS = {
    BOOKINGS: 'sky_shore_bookings',
    INQUIRIES: 'sky_shore_inquiries',
    REVIEWS: 'sky_shore_reviews'
};

// Initial Sample Data to populate if empty
const INITIAL_DATA = {
    bookings: [
        {
            id: 'BK-2026-001',
            fullName: 'Maria Santos',
            email: 'maria.santos@gmail.com',
            phone: '0917-123-4567',
            packageType: '3 Days & 2 Nights Package (₱2,999/pax)',
            guests: 4,
            checkIn: '2026-11-15',
            checkOut: '2026-11-17',
            specialRequests: 'Beachfront cottage near pool, 2 extra towels',
            totalEstimated: '₱11,996',
            status: 'Confirmed',
            createdAt: '2026-10-05 14:30'
        },
        {
            id: 'BK-2026-002',
            fullName: 'Engr. Juan Dela Cruz',
            email: 'jdelacruz.eng@yahoo.com',
            phone: '0928-888-9900',
            packageType: '2 Days & 1 Night Package (₱2,500/pax)',
            guests: 2,
            checkIn: '2026-11-20',
            checkOut: '2026-11-21',
            specialRequests: 'Anniversary bonfire setup and acoustic evening table',
            totalEstimated: '₱5,000',
            status: 'Pending Review',
            createdAt: '2026-10-08 09:15'
        }
    ],
    inquiries: [
        {
            id: 'INQ-101',
            name: 'Patricia Gomez',
            email: 'pat.gomez@deped.gov.ph',
            phone: '0919-456-7890',
            subject: 'Corporate Team Building & GAD Training Venue Inquiry',
            message: 'Good day! Can your resort accommodate 45 teachers for an overnight seminar and team building in December?',
            date: '2026-10-07'
        }
    ]
};

// Database Initializer
function initLocalDatabase() {
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_DATA.bookings));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_DATA.inquiries));
    }
}

// Fetch Records
function getBookings() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS)) || [];
    } catch (e) {
        return [];
    }
}

function getInquiries() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES)) || [];
    } catch (e) {
        return [];
    }
}

// Save Record
function saveBooking(booking) {
    const bookings = getBookings();
    bookings.unshift(booking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return bookings;
}

function saveInquiry(inquiry) {
    const inquiries = getInquiries();
    inquiries.unshift(inquiry);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    return inquiries;
}

// Render Bookings in Modal
function renderBookingsTable() {
    const container = document.getElementById('localBookingsList');
    if (!container) return;

    const bookings = getBookings();
    if (bookings.length === 0) {
        container.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No reservations recorded in local storage yet.</td></tr>`;
        return;
    }

    container.innerHTML = bookings.map(b => `
        <tr>
            <td><strong class="text-primary">${b.id}</strong></td>
            <td>
                <strong>${b.fullName}</strong><br>
                <small class="text-muted"><i class="bi bi-envelope"></i> ${b.email} | <i class="bi bi-phone"></i> ${b.phone}</small>
            </td>
            <td><span class="badge bg-light text-dark border">${b.packageType}</span></td>
            <td>${b.guests} Guests</td>
            <td>
                <small class="d-block">In: <strong>${b.checkIn}</strong></small>
                <small class="d-block">Out: <strong>${b.checkOut}</strong></small>
            </td>
            <td><span class="fw-bold text-success">${b.totalEstimated}</span></td>
            <td>
                <span class="badge ${b.status === 'Confirmed' ? 'bg-success' : 'bg-warning text-dark'}">${b.status}</span>
                <button class="btn btn-sm btn-outline-danger ms-1 py-0 px-1 delete-booking-btn" data-id="${b.id}" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join('');

    // Attach delete listeners
    document.querySelectorAll('.delete-booking-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            if (confirm(`Are you sure you want to delete reservation ${id}?`)) {
                deleteBooking(id);
                renderBookingsTable();
            }
        });
    });
}

function deleteBooking(id) {
    let bookings = getBookings();
    bookings = bookings.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
}

function clearAllBookings() {
    if (confirm('Clear all local reservations?')) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
        renderBookingsTable();
    }
}

// Budget Calculator Logic
function calculateEstimate() {
    const pkgSelect = document.getElementById('calcPackage');
    const paxInput = document.getElementById('calcPax');
    const display = document.getElementById('calcResult');
    if (!pkgSelect || !paxInput || !display) return;

    const pkgPrice = parseInt(pkgSelect.value) || 0;
    const pax = parseInt(paxInput.value) || 1;
    const envFee = 50 * pax; // P50 per person environmental fee as per brochure
    const subtotal = pkgPrice * pax;
    const total = subtotal + envFee;

    display.innerHTML = `
        <div class="p-3 bg-light rounded-3 border">
            <div class="d-flex justify-content-between mb-1">
                <span>Resort Package (${pax} pax):</span>
                <strong>₱${subtotal.toLocaleString()}</strong>
            </div>
            <div class="d-flex justify-content-between mb-1">
                <span>Mansalay Environmental Fee (₱50/pax):</span>
                <strong>₱${envFee.toLocaleString()}</strong>
            </div>
            <hr class="my-2">
            <div class="d-flex justify-content-between text-success fs-5 fw-bold">
                <span>Total Estimated Cost:</span>
                <span>₱${total.toLocaleString()}</span>
            </div>
            <small class="text-muted d-block mt-2"><i class="bi bi-info-circle"></i> Inclusions: Aircon room/cottage, meals (1B, 1L, 1D), welcome drinks, swimming pool & resort facilities access, life jackets, and itinerary activities.</small>
        </div>
    `;
}

// Lightbox Preview
function openLightbox(imgSrc, title, desc) {
    const modalImg = document.getElementById('lightboxImg');
    const modalTitle = document.getElementById('lightboxTitle');
    const modalDesc = document.getElementById('lightboxDesc');
    
    if (modalImg) modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;

    const modal = new bootstrap.Modal(document.getElementById('lightboxModal'));
    modal.show();
}

// DOM Ready initialization
document.addEventListener('DOMContentLoaded', function() {
    initLocalDatabase();

    // Auto calculate initial cost
    if (document.getElementById('calcPackage')) {
        calculateEstimate();
        document.getElementById('calcPackage').addEventListener('change', calculateEstimate);
        document.getElementById('calcPax').addEventListener('input', calculateEstimate);
    }

    // Reservation Form Handler
    const bookingForm = document.getElementById('reservationForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const fullName = document.getElementById('bookName').value.trim();
            const email = document.getElementById('bookEmail').value.trim();
            const phone = document.getElementById('bookPhone').value.trim();
            const packageElem = document.getElementById('bookPackage');
            const packageType = packageElem.options[packageElem.selectedIndex].text;
            const guests = parseInt(document.getElementById('bookGuests').value) || 1;
            const checkIn = document.getElementById('bookCheckIn').value;
            const checkOut = document.getElementById('bookCheckOut').value;
            const specialRequests = document.getElementById('bookRequests').value.trim();

            if (!fullName || !email || !phone || !checkIn || !checkOut) {
                alert('Please fill out all required fields.');
                return;
            }

            // Calculate cost estimate
            const pricePerPax = parseInt(packageElem.value) || 2500;
            const estimatedTotal = `₱${((pricePerPax * guests) + (50 * guests)).toLocaleString()}`;
            const refId = `SS-${Math.floor(100000 + Math.random() * 900000)}`;

            const newBooking = {
                id: refId,
                fullName,
                email,
                phone,
                packageType,
                guests,
                checkIn,
                checkOut,
                specialRequests: specialRequests || 'None',
                totalEstimated: estimatedTotal,
                status: 'Confirmed',
                createdAt: new Date().toLocaleString()
            };

            saveBooking(newBooking);

            // Show Confirmation
            const alertBox = document.getElementById('bookingAlert');
            if (alertBox) {
                alertBox.className = 'alert alert-success d-block fade show shadow-sm mt-3';
                alertBox.innerHTML = `
                    <div class="d-flex align-items-center">
                        <i class="bi bi-check-circle-fill fs-2 me-3 text-success"></i>
                        <div>
                            <h5 class="alert-heading mb-1 fw-bold">Reservation Successfully Recorded!</h5>
                            <p class="mb-1">Thank you, <strong>${fullName}</strong>. Your Booking Reference is <strong class="badge bg-primary fs-6">${refId}</strong>.</p>
                            <small class="text-muted">Stored securely in your local browser storage. A digital confirmation receipt has been simulated. See "View Database Records" below to view or manage stored bookings.</small>
                        </div>
                    </div>
                `;
            }

            bookingForm.reset();
            renderBookingsTable();

            // Scroll to alert
            alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // Contact / Inquiry Form Handler
    const inquiryForm = document.getElementById('contactForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('inqName').value.trim();
            const email = document.getElementById('inqEmail').value.trim();
            const phone = document.getElementById('inqPhone').value.trim();
            const subject = document.getElementById('inqSubject').value.trim();
            const message = document.getElementById('inqMessage').value.trim();

            const inquiryObj = {
                id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
                name,
                email,
                phone,
                subject,
                message,
                date: new Date().toLocaleDateString()
            };

            saveInquiry(inquiryObj);

            const alertBox = document.getElementById('inquiryAlert');
            if (alertBox) {
                alertBox.className = 'alert alert-success d-block fade show shadow-sm mt-3';
                alertBox.innerHTML = `
                    <div class="d-flex align-items-center">
                        <i class="bi bi-envelope-check-fill fs-2 me-3 text-success"></i>
                        <div>
                            <h5 class="alert-heading mb-1 fw-bold">Message Sent Successfully!</h5>
                            <p class="mb-0">Thank you for contacting <strong>Sky & Shore Beach Resort</strong>. Our guest relations team in Mansalay, Oriental Mindoro will get back to you shortly.</p>
                        </div>
                    </div>
                `;
            }

            inquiryForm.reset();
        });
    }

    // Modal Events
    const databaseModal = document.getElementById('databaseModal');
    if (databaseModal) {
        databaseModal.addEventListener('show.bs.modal', renderBookingsTable);
    }

    const clearDbBtn = document.getElementById('clearDatabaseBtn');
    if (clearDbBtn) {
        clearDbBtn.addEventListener('click', clearAllBookings);
    }
});
