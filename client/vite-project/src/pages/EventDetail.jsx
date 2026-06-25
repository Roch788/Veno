import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [existingBooking, setExistingBooking] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    useEffect(() => {
        const fetchExistingBooking = async () => {
            if (!user) {
                setExistingBooking(null);
                return;
            }
            try {
                const { data } = await api.get('/bookings/my');
                const booking = data.find((b) => b.eventId?._id === id);
                setExistingBooking(booking || null);
                if (booking && booking.status === 'confirmed') {
                    setSuccessMsg('You have already registered for this event.');
                } else if (booking && booking.status === 'pending') {
                    setSuccessMsg('Booking requested! Awaiting admin confirmation.');
                }
            } catch (err) {
                console.error('Error fetching existing booking:', err);
            }
        };

        fetchExistingBooking();
    }, [user, id]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (existingBooking?.status === 'confirmed') {
            setError('You have already registered for this event.');
            return;
        }

        if (existingBooking?.status === 'pending') {
            setError('You already have a pending booking for this event.');
            return;
        }

        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (!showOTP) {
                await api.post('/bookings/send-otp');
                setShowOTP(true);
                setSuccessMsg('OTP sent to your email. Please verify to confirm booking.');
            } else {
                await api.post('/bookings', { eventId: event._id, otp });
                setExistingBooking({ status: 'pending' });
                setShowOTP(false);
                setSuccessMsg('Booking requested! Awaiting admin confirmation.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <Loader message="Loading event details..." />;
    if (error && !event) return <div className="text-center py-20 text-xl text-red-500">{error || 'Event not found'}</div>;

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl shadow-xl overflow-hidden mt-8">
            {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.title} className="w-full h-80 object-cover" />
            ) : (
                <div className="w-full h-64 bg-slate-950 flex items-center justify-center text-slate-400 text-6xl font-black uppercase tracking-widest">
                    {event.category}
                </div>
            )}

            <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                    <div>
                        <div className="inline-block bg-slate-800 text-slate-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                            {event.category}
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-100 mb-4">{event.title}</h1>
                        <p className="text-slate-400 text-lg leading-relaxed mb-6">{event.description}</p>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 min-w-[300px] w-full md:w-auto shrink-0 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-100 mb-6">Booking Details</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4 text-slate-400">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-100 shrink-0">
                                    <FaMoneyBillWave />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-400 uppercase">Ticket Price</p>
                                    <p className="font-bold text-slate-100 text-lg">{event.ticketPrice === 0 ? <span className="text-green-400">Free</span> : `₹${event.ticketPrice}`}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-slate-400">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-100 shrink-0">
                                    <FaChair />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-400 uppercase">Availability</p>
                                    <p className="font-bold text-slate-100">
                                        <span className={event.availableSeats < 10 ? 'text-orange-500' : ''}>{event.availableSeats}</span> / {event.totalSeats}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-slate-400">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-100 shrink-0">
                                    <FaCalendarAlt />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-400 uppercase">Date</p>
                                    <p className="font-bold text-slate-100">{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-slate-400">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-100 shrink-0">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-400 uppercase">Location</p>
                                    <p className="font-bold text-slate-100">{event.location}</p>
                                </div>
                            </div>
                        </div>

                        {showOTP && (
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-slate-200 mb-2">Enter OTP to Confirm</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="6-digit code"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-slate-500 transition shadow-sm font-bold tracking-widest text-center text-lg"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleBooking}
                            disabled={isSoldOut || bookingLoading || (showOTP && !otp) || existingBooking?.status === 'pending' || existingBooking?.status === 'confirmed'}
                            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition shadow-lg ${isSoldOut || existingBooking?.status === 'pending' || existingBooking?.status === 'confirmed'
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-800 text-slate-100 hover:bg-slate-700 hover:shadow-xl hover:-translate-y-1'
                                }`}
                        >
                            {bookingLoading ? 'Processing...' :
                                showOTP ? 'Verify OTP & Confirm' :
                                existingBooking?.status === 'confirmed' ? 'Already Registered' :
                                existingBooking?.status === 'pending' ? 'Request Sent' :
                                isSoldOut ? 'Sold Out' :
                                'Confirm Registration'}
                        </button>
                        {error && <p className="text-red-300 mt-4 text-center font-medium bg-red-950 p-2 rounded border border-red-800">{error}</p>}
                        {successMsg && <p className="text-green-300 mt-4 text-center font-medium bg-green-950 p-2 rounded border border-green-800">{successMsg}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;