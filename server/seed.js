const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Event = require('./models/event');
const Booking = require('./models/booking')
dotenv.config();

const users = [
    { name: 'Admin User', email: 'admin@veno.com', password: 'password123', role: 'admin' },
    { name: 'Demo User', email: 'user@veno.com', password: 'password123', role: 'user' },
    { name: 'Alice Smith', email: 'alice@veno.com', password: 'password123', role: 'user' },
    { name: 'Bob Johnson', email: 'bob@veno.com', password: 'password123', role: 'user' },
    { name: 'Charlie Dave', email: 'charlie@veno.com', password: 'password123', role: 'user' },
    { name: 'Diana Prince', email: 'diana@veno.com', password: 'password123', role: 'user' },
    { name: 'Ethan Hunt', email: 'ethan@veno.com', password: 'password123', role: 'user' },
    { name: 'Fiona Gallagher', email: 'fiona@veno.com', password: 'password123', role: 'user' },
    { name: 'George Miller', email: 'george@veno.com', password: 'password123', role: 'user' },
    { name: 'Hannah Montana', email: 'hannah@veno.com', password: 'password123', role: 'user' },
    { name: 'Ivy Carter', email: 'ivy@veno.com', password: 'password123', role: 'user' },
    { name: 'Jack Turner', email: 'jack@veno.com', password: 'password123', role: 'user' },
    { name: 'Karen Blake', email: 'karen@veno.com', password: 'password123', role: 'user' },
    { name: 'Leo Wu', email: 'leo@veno.com', password: 'password123', role: 'user' },
    { name: 'Maya Patel', email: 'maya@veno.com', password: 'password123', role: 'user' }
];

const events = [
    {
        title: 'React & Node.js Developer Retreat',
        description: 'Join us for a 3-day deep dive into modern full-stack web development. Perfect for developers looking to take their skills to the next level.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        location: 'Silicon Valley Innovation Center, CA',
        category: 'Technology',
        totalSeats: 200,
        ticketPrice: 0,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Neon Nights EDM Festival',
        description: 'Experience an unforgettable night of EDM, techno, and dazzling light shows with top DJs from around the globe.',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        location: 'Grand Arena, New York',
        category: 'Music',
        totalSeats: 500,
        ticketPrice: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Global Leaders Business Summit',
        description: 'A premium gathering of CEOs, founders, and investors discussing the future of global commerce and AI integration.',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        location: 'The Ritz-Carlton, London',
        category: 'Business',
        totalSeats: 150,
        ticketPrice: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Modern Art Expo 2024',
        description: 'Discover breathtaking contemporary and modern arts from underground and trending artists this season.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        location: 'Downtown Art Museum',
        category: 'Art',
        totalSeats: 300,
        ticketPrice: 200,
        imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Startup Pitch & Pitch Competition',
        description: 'Watch 25 startups pitch for 1 million dollars in seed funding. Great networking for entrepreneurs and angel investors.',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        location: 'Convention Center, Miami',
        category: 'Business',
        totalSeats: 250,
        ticketPrice: 100,
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Cloud Computing Architecture Seminar',
        description: 'A purely technical breakdown of scalable cloud solutions, multi-region routing, and serverless compute processing.',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        location: 'Tech Hub, Seattle',
        category: 'Technology',
        totalSeats: 100,
        ticketPrice: 600,
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Soulful Jazz Night',
        description: 'An intimate evening featuring world-class jazz artists and soulful vocals under the stars.',
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
        location: 'Harbor Jazz Club, New Orleans',
        category: 'Music',
        totalSeats: 120,
        ticketPrice: 750,
        imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Vegan Food Truck Festival',
        description: 'Taste the best plant-based street food, attend chef demos, and enjoy live music with the whole family.',
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
        location: 'Downtown Market Square, Austin',
        category: 'Food',
        totalSeats: 350,
        ticketPrice: 50,
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Women in Tech Leadership Conference',
        description: 'A conference dedicated to empowering female technology leaders with keynote speakers, workshops, and networking.',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
        location: 'Metropolitan Convention Center, Chicago',
        category: 'Business',
        totalSeats: 280,
        ticketPrice: 2200,
        imageUrl: 'https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Outdoor Yoga & Mindfulness Retreat',
        description: 'Reconnect with your body and mind in a lush outdoor retreat with morning yoga, meditation, and wellness talks.',
        date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 16 days from now
        location: 'Redwood Grove, California',
        category: 'Wellness',
        totalSeats: 90,
        ticketPrice: 400,
        imageUrl: 'https://images.unsplash.com/photo-1518622358380-a4f3d4a01404?auto=format&fit=crop&q=80&w=800'
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/veno');
        console.log('\n✅ MongoDB connection open...');

        await User.deleteMany();
        await Event.deleteMany();
        await Booking.deleteMany();
        console.log('🗑️  Cleared existing data.');

        // Hash user passwords
        const salt = await bcrypt.genSalt(10);
        const hashedUsers = users.map(u => ({
            ...u,
            password: bcrypt.hashSync(u.password, salt),
            isVerified: true
        }));

        const createdUsers = await User.insertMany(hashedUsers);
        const adminUser = createdUsers.find(u => u.role === 'admin');
        const normalUsers = createdUsers.filter(u => u.role === 'user');
        console.log(`👤 Created ${createdUsers.length} total dummy users.`);

        // Link events to admin
        const eventsWithAdmin = events.map(e => ({
            ...e,
            availableSeats: e.totalSeats,
            createdBy: adminUser._id
        }));

        const createdEvents = await Event.insertMany(eventsWithAdmin);
        console.log(`🎉 Created ${createdEvents.length} distinct events with Unsplash images.`);

        // Generate Bookings Data
        const bookingsData = [];

        for (const event of createdEvents) {
            // Assign 3-6 random users to each event
            const randomCount = Math.floor(Math.random() * 4) + 3;
            // Shuffle and pick random users
            const shuffledUsers = [...normalUsers].sort(() => 0.5 - Math.random());
            const selectedUsers = shuffledUsers.slice(0, randomCount);

            for (const user of selectedUsers) {
                // Randomize statuses
                const statuses = ['pending', 'confirmed', 'cancelled'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];

                let paymentStatus = 'not_paid';
                if (status === 'confirmed' && event.ticketPrice > 0) {
                    // Usually confirmed tickets are marked paid (90% of the time)
                    paymentStatus = Math.random() > 0.1 ? 'paid' : 'not_paid';
                } else if (event.ticketPrice === 0) {
                    paymentStatus = 'paid';
                }

                bookingsData.push({
                    userId: user._id,
                    eventId: event._id,
                    status: status,
                    paymentStatus: paymentStatus,
                    amount: event.ticketPrice
                });

                // Deduct available seats specifically for confirmed tickets!
                if (status === 'confirmed') {
                    event.availableSeats -= 1;
                    await event.save();
                }
            }
        }

        await Booking.insertMany(bookingsData);
        console.log(`🎫 Inserted ${bookingsData.length} randomized dummy bookings (confirmed, pending, cancelled, paid, not_paid).`);

        console.log('\n🚀 Database seeded successfully!');
        console.log('-------------------------------------------');
        console.log('Admin Email: admin@veno.com');
        console.log('User Email:  user@veno.com');
        console.log('Password for all users: password123');
        console.log('-------------------------------------------\n');

        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedDatabase();