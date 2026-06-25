import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800 shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-slate-100">
                    <FaTicketAlt className="text-slate-100" />
                    <span>Veno</span>
                </Link>
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-300">
                    <Link to="/" className="transition hover:text-slate-900">Events</Link>
                    {user ? (
                        <>
                            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="transition hover:text-slate-900">Dashboard</Link>
                            <button onClick={handleLogout} className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="transition hover:text-slate-900">Login</Link>
                            <Link to="/register" className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;