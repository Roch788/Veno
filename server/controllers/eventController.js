const Event = require("../models/event")


const getAllEvents = async (req, res) => {
    try {
        const filters = {};
        if (req.query.category) {
            filters.category = req.query.category;
        }

        if (req.query.location) {
            filters.location = req.query.location;
        }

        if (req.query.ticketPrice) {
            filters.ticketPrice = req.query.ticketPrice;
        }

        if (req.query.search) {
            const searchTerm = req.query.search.trim();
            if (searchTerm.length > 0) {
                filters.$or = [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } },
                    { location: { $regex: searchTerm, $options: 'i' } },
                    { category: { $regex: searchTerm, $options: 'i' } }
                ];
            }
        }

        const events = await Event.find(filters);
        res.json(events);
    } catch (err) {
        res.status(500).json({ errorMessage: err.message });
    }
}


const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "event not found" });
        res.json(event);
    } catch (err) {
        res.status(404).json({ errorMessage: "err.message" });

    }
}

const createEvent = async (req, res) => {
    const { title, description, date, location, category, totalSeats, ticketPrice, availableSeats, imageUrl, createdBy, image } = req.body;
    try {
        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats: Number(totalSeats),
            ticketPrice: Number(ticketPrice),
            availableSeats: availableSeats ? Number(availableSeats) : Number(totalSeats),
            imageUrl: imageUrl || image,
            createdBy: createdBy || req.user._id
        });
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ message: 'Error creating event', error: err.message });
    }
}

const updateEvent = async (req, res) => {
    const { title, description, date, location, category, totalSeats, availableSeats, imageUrl, createdBy } = req.body;
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, {
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats,
            imageUrl,
            createdBy,
        })
        if (!event) {
            return res.status(404).json({ error: "event not found   " })
        }
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json({ message: "Event deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent }