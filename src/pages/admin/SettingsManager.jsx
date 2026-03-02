import { useState, useEffect } from 'react';
import { Save, Globe, Phone, Mail, Instagram, Twitter, Linkedin, Facebook, Send, Loader2, MapPin, Hash, ExternalLink } from 'lucide-react';
import api from '../../api/config';

const SettingsManager = () => {
    const [settings, setSettings] = useState({
        siteName: '', email: '', phone: '', address: '',
        socialLinks: { instagram: '', twitter: '', linkedin: '', behance: '', facebook: '', telegram: '' }
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            if (res.data.data) setSettings(res.data.data);
        } catch (error) {
            console.error('Error fetching settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.put('/settings', settings);
            alert('Global configuration deployed successfully');
        } catch (error) {
            alert('Failed to update platform settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="admin-loader-container">
            <Loader2 className="animate-spin" size={40} />
        </div>
    );

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div>
                    <h2>System Config</h2>
                </div>
             
            </header>

            <form onSubmit={handleSave} className="settings-grid-layout">
                <div className="settings-main-column">
                    <div className="card glass-card-premium">
                        <div className="settings-card-header">
                            <Globe size={18} />
                            <h3>Core Identity</h3>
                        </div>

                        <div className="input-field">
                            <label>Platform Branding Name</label>
                            <div className="input-with-icon">
                                <Hash size={16} />
                                <input type="text" placeholder="e.g. AK Designs" value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} required />
                            </div>
                        </div>

                        <div className="settings-row-grid">
                            <div className="input-field">
                                <label>Support & Inquiry Email</label>
                                <div className="input-with-icon">
                                    <Mail size={16} />
                                    <input type="email" placeholder="hello@akdesigns.space" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} required />
                                </div>
                            </div>
                            <div className="input-field">
                                <label>Business Contact Line</label>
                                <div className="input-with-icon">
                                    <Phone size={16} />
                                    <input type="text" placeholder="+91 000 000 0000" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="input-field">
                            <label>Physical Studio Address (Optional)</label>
                            <div className="input-with-icon">
                                <MapPin size={16} />
                                <input type="text" placeholder="City, Country" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="action-footer-floating">
                        <p>Changes will affect all public-facing modules instantly.</p>
                        <button type="submit" disabled={isSaving} className="btn-primary btn-expand">
                            {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Deploy Configuration</>}
                        </button>
                    </div>
                </div>

                <div className="settings-side-column">
                    <div className="card social-config-card">
                        <div className="settings-card-header">
                            <ExternalLink size={18} />
                            <h3>Social Matrix</h3>
                        </div>
                        <p className="side-description">Connect your creative ecosystem to your profile footer.</p>

                        <div className="social-input-stack">
                            <div className="social-field">
                                <div className="social-icon-box ig"><Instagram size={18} /></div>
                                <input type="text" placeholder="Instagram URL" value={settings.socialLinks.instagram} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })} />
                            </div>

                            <div className="social-field">
                                <div className="social-icon-box ln"><Linkedin size={18} /></div>
                                <input type="text" placeholder="LinkedIn URL" value={settings.socialLinks.linkedin} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })} />
                            </div>

                            <div className="social-field">
                                <div className="social-icon-box tw"><Twitter size={18} /></div>
                                <input type="text" placeholder="X (Twitter) URL" value={settings.socialLinks?.twitter || ''} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, twitter: e.target.value } })} />
                            </div>

                            <div className="social-field">
                                <div className="social-icon-box fb"><Facebook size={18} /></div>
                                <input type="text" placeholder="Facebook URL" value={settings.socialLinks?.facebook || ''} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })} />
                            </div>

                            <div className="social-field">
                                <div className="social-icon-box tg"><Send size={18} /></div>
                                <input type="text" placeholder="Telegram URL" value={settings.socialLinks?.telegram || ''} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, telegram: e.target.value } })} />
                            </div>

                            <div className="social-field">
                                <div className="social-icon-box bh"><Globe size={18} /></div>
                                <input type="text" placeholder="Behance URL" value={settings.socialLinks?.behance || ''} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, behance: e.target.value } })} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <style>{`
                .bh { background: #1769ff; }
                .admin-loader-container { height: 60vh; display: flex; align-items: center; justify-content: center; color: var(--primary); }
                .live-status-tag { display: flex; align-items: center; gap: 10px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 8px 16px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
                .live-dot { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }

                .settings-grid-layout { display: grid; grid-template-columns: 1fr 380px; gap: 30px; margin-top: 20px; }
                
                .settings-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 25px; color: var(--primary); }
                .settings-card-header h3 { margin: 0; font-size: 1.1rem; color: #fff; letter-spacing: 0.5px; }

                .input-with-icon { display: flex; align-items: center; gap: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 12px; padding: 0 15px; }
                .input-with-icon svg { color: var(--text-muted); }
                .input-with-icon input { background: transparent; border: none; padding: 14px 0; color: #fff; width: 100%; outline: none; }

                .settings-row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                
                .action-footer-floating { margin-top: 30px; display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface); padding: 25px 30px; border-radius: 20px; border: 1px solid var(--border); }
                .action-footer-floating p { margin: 0; font-size: 0.85rem; color: var(--text-muted); font-style: italic; }
                .btn-expand { padding: 15px 35px; }

                .social-config-card { height: fit-content; }
                .side-description { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 25px; }
                
                .social-input-stack { display: flex; flex-direction: column; gap: 15px; }
                .social-field { display: flex; align-items: center; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
                .social-icon-box { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
                .social-field input { background: transparent; border: none; padding: 10px 15px; color: #fff; width: 100%; outline: none; font-size: 0.85rem; }
                
                .ig { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); }
                .tw { background: #000; border: 1px solid #333; }
                .ln { background: #0077b5; }
                .fb { background: #1877F2; }
                .tg { background: #0088cc; }

                @media (max-width: 1000px) { .settings-grid-layout { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

export default SettingsManager;
