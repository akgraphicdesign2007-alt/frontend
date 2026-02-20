import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import api from '../../api/config';
import '../../components/Contact.css'; // Re-use contact form styling

const SettingsManager = () => {
    const [settings, setSettings] = useState({
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
        contactEmail: '',
        contactPhone: '',
        location: '',
        socialLinks: {
            instagram: '',
            twitter: '',
            linkedin: '',
            dribbble: '',
            behance: ''
        }
    });

    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            if (res.data.data) {
                setSettings(res.data.data);
            }
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('social_')) {
            const platform = name.split('_')[1];
            setSettings(prev => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [platform]: value
                }
            }));
        } else {
            setSettings(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        setMessage('');

        try {
            await api.put('/settings', settings);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to save settings', error);
            setMessage('Failed to save settings.');
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) return <div style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}><Loader2 className="animate-spin" /> Loading settings...</div>;

    return (
        <div style={{ paddingBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#fff', fontFamily: 'Oswald', margin: 0 }}>Site Settings</h2>
                {message && <span style={{ color: message.includes('Failed') ? '#ff4d4d' : '#E6EA1A', fontWeight: '500' }}>{message}</span>}
            </div>

            <form onSubmit={handleSubmit} className="contact-form" style={{ background: '#0a0f0c', padding: '30px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>

                {/* SEO Configuration */}
                <h3 style={{ color: '#fff', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>SEO Configuration</h3>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>Global Meta Title</label>
                    <input type="text" name="seoTitle" value={settings.seoTitle} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>Global Meta Keywords</label>
                    <input type="text" name="seoKeywords" value={settings.seoKeywords} onChange={handleChange} placeholder="Comma separated keywords" style={{ width: '100%' }} />
                </div>
                <div className="form-group" style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>Global Meta Description</label>
                    <textarea name="seoDescription" value={settings.seoDescription} onChange={handleChange} rows="3" style={{ width: '100%' }}></textarea>
                </div>

                {/* Primary Contact Details */}
                <h3 style={{ color: '#fff', marginBottom: '20px', marginTop: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Contact Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '20px', marginBottom: '30px' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>Public Email Address</label>
                        <input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} style={{ width: '100%' }} />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>Public Phone Number</label>
                        <input type="text" name="contactPhone" value={settings.contactPhone} onChange={handleChange} style={{ width: '100%' }} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>Business Location</label>
                        <input type="text" name="location" value={settings.location} onChange={handleChange} style={{ width: '100%' }} />
                    </div>
                </div>

                {/* Social Media Links */}
                <h3 style={{ color: '#fff', marginBottom: '20px', marginTop: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Social Media Links</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '40px' }}>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <label style={{ width: '100px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Instagram</label>
                        <input type="url" name="social_instagram" value={settings.socialLinks?.instagram || ''} onChange={handleChange} placeholder="https://instagram.com/..." style={{ flex: 1 }} />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <label style={{ width: '100px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Twitter (X)</label>
                        <input type="url" name="social_twitter" value={settings.socialLinks?.twitter || ''} onChange={handleChange} placeholder="https://twitter.com/..." style={{ flex: 1 }} />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <label style={{ width: '100px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>LinkedIn</label>
                        <input type="url" name="social_linkedin" value={settings.socialLinks?.linkedin || ''} onChange={handleChange} placeholder="https://linkedin.com/..." style={{ flex: 1 }} />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <label style={{ width: '100px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Dribbble</label>
                        <input type="url" name="social_dribbble" value={settings.socialLinks?.dribbble || ''} onChange={handleChange} placeholder="https://dribbble.com/..." style={{ flex: 1 }} />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <label style={{ width: '100px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Behance</label>
                        <input type="url" name="social_behance" value={settings.socialLinks?.behance || ''} onChange={handleChange} placeholder="https://behance.net/..." style={{ flex: 1 }} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                    <button type="submit" className="submit-btn" disabled={saveLoading} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: 'auto', padding: '12px 30px' }}>
                        {saveLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save All Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsManager;
