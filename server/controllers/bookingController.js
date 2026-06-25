    const User = require("../models/user");
const Booking = require("../models/booking");
const Event = require("../models/event");
const OTP = require("../models/otp");
const { sendBookingEmail, sendOtpEmail } = require("../utils/email")


const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();


const sendBookingOTP = async (req, res) => {
    try {
        const otp = generateOtp();
        await OTP.findOneAndDelete({ email: req.user.email, action: "event_booking" });
        await OTP.create({ email: req.user.email, otp, action: "event_booking" });
        await sendOtpEmail(req.user.email, otp, "event_booking");
        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        res.status(500).json({ message: 'Error sending OTP', error: err.message });
    }
}

const bookEvent = async (req, res) => {
    const { eventId, otp, quantity = 1 } = req.body;
    const requestedQuantity = Number(quantity);
    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
        return res.status(400).json({ message: 'Please select a valid number of seats' });
    }

    const validOTP = await OTP.findOne({ email: req.user.email, otp, action: "event_booking" });
    if (!validOTP) {
        return res.status(400).json({ message: 'Invalid or expired OTP for booking' });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const existingBooking = await Booking.findOne({
        userId: req.user._id,
        eventId,
        status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
        const message = existingBooking.status === 'confirmed'
            ? 'You have already registered for this event.'
            : 'You already have a pending booking for this event.';
        return res.status(400).json({ message });
    }

    if (event.availableSeats < requestedQuantity) return res.status(400).json({ message: `Only ${event.availableSeats} seat(s) are available` });

    const paymentStatus = event.ticketPrice === 0 ? 'paid' : 'not_paid';
    const booking = await Booking.create({
        userId: req.user._id,
        eventId,
        status: "pending",
        paymentStatus,
        quantity: requestedQuantity,
        amount: event.ticketPrice * requestedQuantity
    });

    await OTP.deleteMany({ email: req.user.email, action: 'event_booking' });
    res.status(201).json({ message: "Booking created! Please check your email for further details" });
}

const confirmBooking = async (req, res) => {
    try {
        const paymentStatus = req.body.paymentStatus;
        if (!['paid', 'not_paid'].includes(paymentStatus)) {
            return res.status(400).json({ error: 'Invalid payment status' });
        }
        const booking = await Booking.findById(req.params.id).populate("eventId");
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        if (booking.status === "confirmed") {
            return res.status(400).json({ error: "booking already done" });
        }

        if (!booking.eventId) {
            return res.status(404).json({ error: "Event not found or has been deleted" });
        }

        const event = booking.eventId;
        if (event.availableSeats < booking.quantity) return res.status(404).json({ error: "Not enough seats available" });
        booking.status = "confirmed";
        if (paymentStatus) {
            booking.paymentStatus = paymentStatus;
        }
        await booking.save();
        event.availableSeats -= booking.quantity;
        await event.save();
        const customer = await User.findById(booking.userId);
        if (customer) {
            await sendBookingEmail(customer.email, event.title, booking._id);
        }

        res.json({ message: "Booking confirmed" });
    } catch (err) {
        console.error("Error in confirmBooking:", err);
        res.status(500).json({ error: "Error confirming booking", details: err.message });
    }
}

const getMyBookings = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .populate("userId", "name email")
            .populate("eventId");
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings", error: err.message });
    }
}

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("eventId");
        if (!booking) {
            return res.status(400).json({ error: "Booking not found" });
        }

        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Unauthorised Booking" });
        }

        if (booking.status === "confirmed" && booking.eventId) {
            const event = await Event.findById(booking.eventId._id);
            if (event) {
                event.availableSeats += booking.quantity;
                await event.save();
            }
        }

        await booking.deleteOne();
        res.json({ message: "Booking Cancelled" });
    } catch (err) {
        res.status(500).json({ message: "Error cancelling booking", error: err.message });
    }
}


module.exports = { bookEvent, confirmBooking, getMyBookings, cancelBooking, sendBookingOTP }