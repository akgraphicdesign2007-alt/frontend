import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import api from '../api/config';
import '../components/Contact.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await api.post('/auth/forgotpassword', { email });
            setMessage(res.data.data || 'OTP has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please ensure the email is correct.');
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
                        <Mail size={28} />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '10px' }}>Forgot Password</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Enter your email to receive a reset OTP</p>
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

                    {error && <p className="error-msg" style={{ textAlign: 'center', color: '#ff4d4d', marginTop: '10px' }}>{error}</p>}
                    {message && <p style={{ textAlign: 'center', color: 'var(--accent-color)', marginTop: '10px' }}>{message}</p>}

                    <button type="submit" className="submit-btn" disabled={loading} style={{ width: '100%', marginTop: '20px' }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send OTP'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Link to="/admin/reset-password" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.9rem' }}>
                            Have an OTP? Reset Password
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
