const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'pending'],
        default: 'pending',
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'not_paid'],
        default: 'not_paid',
    },
    amount: {
        type: Number,
        required: true,
    },
    bookedAt: {
        type: Date,
        default: Date.now,
    },

}, { timestamps: true })


const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;