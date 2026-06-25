import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import Loader from '../components/Loader';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/events?search=${encodeURIComponent(search)}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-slate-950 text-white rounded-3xl overflow-hidden mb-12 shadow-2xl">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                <div className="relative p-10 md:p-20 text-center flex flex-col items-center z-10">
                    <span className="bg-slate-950/70 text-slate-100 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-slate-700/50">Welcome to Veno</span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">
                        Find Your Next <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">Unforgettable</span> Experience
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Discover the best tech conferences, late-night music festivals, and hands-on workshops happening directly in your area. Secure your spot today.
                    </p>

                    <form onSubmit={(e) => { e.preventDefault(); fetchEvents(); }} className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl group">
                        <FaSearch className="absolute left-6 text-slate-500 text-xl group-focus-within:text-slate-100 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search events by title..."
                            className="w-full pl-16 pr-32 py-5 rounded-full text-lg text-slate-100 bg-slate-900/95 backdrop-blur-sm border-2 border-slate-700 focus:border-slate-500 focus:outline-none transition-all placeholder-slate-500 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-4 bg-slate-800 text-white px-5 py-3 rounded-full text-sm font-semibold uppercase tracking-wider transition hover:bg-slate-900"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Why Choose Us / Features row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
                <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
                    <div className="w-16 h-16 bg-slate-700 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md shadow-slate-950/40">
                        <FaRegClock />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3">Fast Booking</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Secure your tickets instantly with our fast streamlined booking infrastructure built for speed.</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
                    <div className="w-16 h-16 bg-slate-700 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md shadow-slate-950/40">
                        <FaTicketAlt />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3">Seamless Access</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Download tickets instantly or manage them right from your personal dashboard with easily.</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
                    <div className="w-16 h-16 bg-slate-700 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md shadow-slate-950/40">
                        <FaShieldAlt />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3">Secure Platform</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">All transactions and registrations are bounded by cutting-edge security and 2FA OTP tech.</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8 px-2 border-b border-slate-800 pb-4">
                <h2 className="text-3xl font-extrabold text-slate-100">Upcoming Events</h2>
                <div className="text-slate-400 font-medium">{events.length} results found</div>
            </div>

            {loading ? (
                <Loader message="Fetching events, please wait..." />
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-xl text-slate-400">No events found matching your search.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <div key={event._id} className="bg-slate-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col">
                            <div className="h-48 bg-slate-800 overflow-hidden relative">
                                {event.imageUrl ? (
                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 font-bold text-2xl">
                                        {event.category || 'Event'}
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                    {event.ticketPrice === 0 ? <span className="text-green-400">FREE</span> : <span className="text-slate-100">₹{event.ticketPrice}</span>}
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{event.category}</div>
                                <h2 className="text-xl font-bold text-slate-100 mb-3">{event.title}</h2>
                                <div className="flex flex-col gap-2 mb-4 text-slate-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-slate-400" />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-slate-400" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                                        <div className="bg-slate-500 h-2 rounded-full" style={{ width: `${Math.max(0, (event.availableSeats / event.totalSeats) * 100)}%` }}></div>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-4">{event.availableSeats} of {event.totalSeats} seats remaining</p>
                                    {event.availableSeats <= 0 ? (
                                        <div className="inline-flex items-center justify-center w-full py-3 rounded-lg bg-red-600 text-white font-semibold text-sm uppercase tracking-wide">
                                            Sold Out
                                        </div>
                                    ) : (
                                        <Link to={`/events/${event._id}`} className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold py-2 rounded-lg transition">
                                            View Details
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Section */}
            <footer className="mt-auto pt-16 pb-8 border-t border-slate-800 text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <FaTicketAlt className="text-slate-100 text-2xl" />
                    <span className="text-xl font-bold text-slate-100">Veno</span>
                </div>
                <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                    The simplest, most dynamic way to manage, discover, and host world-class events in your local city. Let's make memories together.
                </p>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    &copy; {new Date().getFullYear()} Veno Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;