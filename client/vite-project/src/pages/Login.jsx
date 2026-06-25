import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOtp } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                const data = await login(email, password, role);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } else {
                const data = await verifyOtp(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            if (err?.response?.data?.error === 'account not verified. A new OTP has been sent to your email' || err?.needsVerification) {
                setShowOTP(true);
                setError('Account not verified. A new OTP has been sent to your email.');
            } else {
                setError(err?.response?.data?.error || err?.message || err);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader message="Signing in, please wait..." />;

    return (
        <div className="max-w-md mx-auto mt-20 bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-800">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-100 mb-2">Welcome Back</h2>
                <p className="text-slate-400">Sign in to your Veno account</p>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
                <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`px-6 py-2 font-semibold rounded-lg transition ${role === 'user' ? 'bg-slate-700 text-slate-100' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                    User
                </button>
                <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`px-6 py-2 font-semibold rounded-lg transition ${role === 'admin' ? 'bg-slate-700 text-slate-100' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                    Admin
                </button>
            </div>

            {error && <div className="bg-red-950 text-red-300 p-3 rounded-lg mb-6 text-center shadow-inner border border-red-800">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {!showOTP ? (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-slate-200 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition shadow-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-200 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition shadow-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">Verification Code (OTP)</label>
                        <input
                            type="text"
                            required
                            placeholder="6-digit code"
                            className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-slate-500 transition shadow-sm font-bold tracking-widest text-center text-lg"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                        />
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-950 text-white font-bold py-3 rounded-lg hover:bg-slate-900 focus:ring-4 focus:ring-slate-600 transition shadow-md"
                >
                    {loading ? 'Processing...' : (showOTP ? 'Verify OTP & Log In' : 'Sign In')}
                </button>
            </form>

            <p className="text-center mt-8 text-slate-400">
                Don't have an account? <Link to="/register" className="text-slate-100 font-bold hover:underline">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;