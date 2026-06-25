const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/auth")
const { bookEvent, confirmBooking, getMyBookings, cancelBooking, sendBookingOTP } = require('../controllers/bookingController');

router.post("/send-otp", protect, sendBookingOTP);
router.post("/", protect, bookEvent);
router.put("/:id/confirm", protect, admin, confirmBooking);
router.get("/my", protect, getMyBookings);
router.delete("/:id", protect, cancelBooking);

module.exports = router;