import { useState, useEffect } from 'react';
import { Save, Loader2, Image as ImageIcon, User } from 'lucide-react';
import api from '../../api/config';

const AboutManager = () => {
    const [content, setContent] = useState({
        title: '',
        subtitle: '',
        content: '',
        image: ''
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newImage, setNewImage] = useState(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await api.get('/pageContent');
            const data = res.data.data;
            const aboutMe = data.find(item => item.section === 'about_me') ||
                data.find(item => item.section === 'hero');

            if (aboutMe) {
                setContent({
                    title: aboutMe.title || '',
                    subtitle: aboutMe.subtitle || '',
                    content: aboutMe.content || '',
                    image: aboutMe.image || ''
                });
            }
        } catch (error) {
            console.error('Error fetching about content');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData();
        formData.append('title', content.title);
        formData.append('subtitle', content.subtitle);
        formData.append('content', content.content);
        if (newImage) formData.append('image', newImage);

        try {
            // We use 'about_me' as the primary section identifier
            await api.post('/pageContent/about_me', formData);
            alert('About section updated successfully');
            fetchContent();
            setNewImage(null);
        } catch (error) {
            alert('Failed to update about section');
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
                    <h2>About Management</h2>
                </div>
            </header>

            <div className="single-manager-container card">
                <form onSubmit={handleSubmit} className="about-edit-layout">
                    <div className="about-fields-side">
                        <div className="input-field">
                            <label>Section Header</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="e.g. Who I Am"
                                value={content.title}
                                onChange={e => setContent({ ...content, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="input-field">
                            <label>Sub-Headline / Catchphrase</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="e.g. Bridging the gap between art and functionality"
                                value={content.subtitle}
                                onChange={e => setContent({ ...content, subtitle: e.target.value })}
                            />
                        </div>

                        <div className="input-field">
                            <label>The Professional Bio</label>
                            <textarea
                                className="form-input"
                                rows="10"
                                placeholder="Tell your story..."
                                value={content.content}
                                onChange={e => setContent({ ...content, content: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="btn-primary"
                        >
                            {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Deploy Changes</>}
                        </button>
                    </div>

                    <div className="about-visual-side">
                        <label>Profile Portrait</label>
                        <div className="premium-image-uploader">
                            {content.image || newImage ? (
                                <img
                                    src={newImage ? URL.createObjectURL(newImage) : content.image}
                                    alt="Profile Preview"
                                />
                            ) : (
                                <div className="image-placeholder-icon">
                                    <ImageIcon size={48} />
                                    <span>No Image Selected</span>
                                </div>
                            )}

                            <div className="uploader-overlay">
                                <label className="image-action-trigger">
                                    <ImageIcon size={20} />
                                    <span>{newImage ? 'Change Selection' : 'Upload New Photo'}</span>
                                    <input
                                        type="file"
                                        onChange={e => setNewImage(e.target.files[0])}
                                        hidden
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                        </div>
                        <p className="helper-text">Recommended: High-quality portrait with a clean background.</p>
                    </div>
                </form>
            </div>

            <style>{`
                .admin-loader-container { height: 60vh; display: flex; align-items: center; justify-content: center; color: var(--primary); }
                .content-badge { background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 8px 16px; border-radius: 50px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 8px; }
                
                .single-manager-container { padding: 40px; margin-top: 20px; }
                .about-edit-layout { display: grid; grid-template-columns: 1fr 340px; gap: 50px; }
                
                .input-field { margin-bottom: 30px; }
                .input-field label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
                
                .about-visual-side { display: flex; flex-direction: column; gap: 15px; }
                .about-visual-side label { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
                
                .premium-image-uploader { position: relative; width: 100%; aspect-ratio: 3/4; border-radius: 24px; overflow: hidden; background: rgba(0,0,0,0.3); border: 2px dashed var(--border); transition: all 0.3s; }
                .premium-image-uploader:hover { border-color: var(--primary); }
                .premium-image-uploader img { width: 100%; height: 100%; object-fit: cover; }
                
                .image-placeholder-icon { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; color: var(--text-muted); }
                .image-placeholder-icon span { font-size: 0.8rem; font-weight: 600; }
                
                .uploader-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); opacity: 0; transition: opacity 0.3s; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
                .premium-image-uploader:hover .uploader-overlay { opacity: 1; }
                
                .image-action-trigger { display: flex; flex-direction: column; align-items: center; gap: 12px; cursor: pointer; color: #fff; text-align: center; }
                .image-action-trigger span { font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }
                
                .helper-text { font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; font-style: italic; }
                
                @media (max-width: 992px) {
                    .about-edit-layout { grid-template-columns: 1fr; }
                    .about-visual-side { order: -1; }
                    .premium-image-uploader { aspect-ratio: 16/9; }
                }
            `}</style>
        </div>
    );
};

export default AboutManager;
