import { useState, useEffect } from 'react';
import { Save, Loader2, LayoutPanelTop, FileText } from 'lucide-react';
import api from '../../api/config';

const HeroManager = () => {
    const [content, setContent] = useState({
        badge: '',
        titleLine1: '',
        titleLine2: '',
        description: '',
        resumeUrl: '',
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await api.get('/pageContent');
            const data = res.data.data;
            const heroContent = data.find(item => item.section === 'hero_main');

            if (heroContent) {
                // Split title if it contains our separator
                const titles = (heroContent.title || '').split('||');

                setContent({
                    badge: heroContent.subtitle || '',
                    titleLine1: titles[0] || '',
                    titleLine2: titles[1] || '',
                    description: heroContent.content || '',
                    resumeUrl: heroContent.resume || '',
                });
            }
        } catch (error) {
            console.error('Error fetching hero content', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData();

        // Combine titles with separator
        const combinedTitle = `${content.titleLine1}||${content.titleLine2}`;

        formData.append('title', combinedTitle);
        formData.append('subtitle', content.badge);
        formData.append('content', content.description);
        if (resumeFile) {
            formData.append('resume', resumeFile);
        }

        try {
            await api.post('/pageContent/hero_main', formData);
            alert('Hero section updated successfully');
            fetchContent();
        } catch (error) {
            alert('Failed to update hero section');
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
                    <h2>Hero Management</h2>
                </div>
            </header>

            <div className="single-manager-container card">
                <form onSubmit={handleSubmit} className="about-edit-layout" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="about-fields-side">
                        <div className="input-field">
                            <label>Hero Badge Label</label>
                            <input
                                className="form-input premium-input"
                                type="text"
                                placeholder="e.g. Visual Artist & Brand Designer"
                                value={content.badge}
                                onChange={e => setContent({ ...content, badge: e.target.value })}
                                required
                            />
                        </div>

                        <div className="row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="input-field">
                                <label>Title (Solid Text)</label>
                                <input
                                    className="form-input premium-input"
                                    type="text"
                                    placeholder="e.g. CRAFTING BOLD"
                                    value={content.titleLine1}
                                    onChange={e => setContent({ ...content, titleLine1: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-field">
                                <label>Title (Outlined Text)</label>
                                <input
                                    className="form-input premium-input"
                                    type="text"
                                    placeholder="e.g. VISUAL EXPERIENCES"
                                    value={content.titleLine2}
                                    onChange={e => setContent({ ...content, titleLine2: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-field">
                            <label>Hero Description</label>
                            <textarea
                                className="form-input premium-textarea"
                                rows="5"
                                placeholder="Elevating brands through strategic design..."
                                value={content.description}
                                onChange={e => setContent({ ...content, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="input-field">
                            <label>CV / Resume Document (PDF)</label>
                            <div className="premium-input" style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', position: 'relative' }}>
                                <FileText size={20} />
                                <span>{resumeFile ? resumeFile.name : (content.resumeUrl ? 'Update existing PDF document...' : 'Upload new PDF document...')}</span>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={e => setResumeFile(e.target.files[0])}
                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                                />
                            </div>
                            {content.resumeUrl && !resumeFile && <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '8px' }}>Active Resume is currently live on your page.</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="btn-primary btn-premium-submit"
                            style={{ maxWidth: '300px' }}
                        >
                            {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Deploy Hero Updates</>}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .admin-loader-container { height: 60vh; display: flex; align-items: center; justify-content: center; color: var(--primary); }
                .content-badge { background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 8px 16px; border-radius: 50px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 8px; }
                
                .single-manager-container { padding: 40px; margin-top: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
                .about-edit-layout { display: grid; gap: 50px; }
                
                .input-field { margin-bottom: 30px; }
                .input-field label { display: block; font-size: 0.85rem; font-weight: 700; color: rgba(255,255,255,0.5); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
                
                .premium-input, .premium-textarea { width: 100%; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 18px 24px; color: #fff; font-size: 1rem; transition: all 0.3s ease; }
                .premium-input:focus, .premium-textarea:focus { outline: none; border-color: var(--primary); background: rgba(251, 191, 36, 0.03); }
                
                .btn-premium-submit { width: 100%; padding: 16px 20px; background: var(--primary); color: #000; border-radius: 12px; font-weight: 700; font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 2px; display: flex; align-items: center; justify-content: center; gap: 12px; border: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .btn-premium-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(251, 191, 36, 0.2); }
                .btn-premium-submit:disabled { opacity: 0.7; cursor: not-allowed; }
            `}</style>
        </div>
    );
};

export default HeroManager;
