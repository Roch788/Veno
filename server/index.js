const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const app = express();
const mongoose = require("mongoose")
const authRoute = require("./routes/auth.js")
const eventRoute = require("./routes/event.js")
const bookingRoute = require("./routes/booking.js")
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected to mongoDB");
    }).catch((err) => {
        console.log(`error in DB ${err}`);
    })

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;

//routes
app.use("/api/auth", authRoute)
app.use("/api/bookings", bookingRoute)
app.use("/api/events", eventRoute)
app.listen(port, () => {
    console.log(`server listening to the port ${port}`);
})