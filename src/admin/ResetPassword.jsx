import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import api from '../api/config';
import '../components/Contact.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [otp, setOtp] = useState(searchParams.get('otp') || '');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await api.put('/auth/resetpassword', { email, otp, password });
            setMessage('Password reset successfully!');
            setTimeout(() => {
                navigate('/admin/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. OTP may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-color)',
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: 'var(--card-bg)',
                padding: '40px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative'
            }}>
                <Link to="/admin/login" style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                }}>
                    <ArrowLeft size={16} /> Back
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'rgba(230, 234, 26, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        color: 'var(--accent-color)'
                    }}>
                        <KeyRound size={28} />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '10px' }}>Reset Password</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Enter the 6-digit OTP and your new password</p>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="6-Digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength="6"
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                            style={{ width: '100%' }}
                        />
                    </div>

                    {error && <p className="error-msg" style={{ textAlign: 'center', color: '#ff4d4d', marginTop: '10px' }}>{error}</p>}
                    {message && <p style={{ textAlign: 'center', color: '#4CAF50', marginTop: '10px' }}>{message}</p>}

                    <button type="submit" className="submit-btn" disabled={loading} style={{ width: '100%', marginTop: '20px' }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
