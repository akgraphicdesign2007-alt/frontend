import { useState, useEffect } from 'react';
import { Save, Loader2, Upload, User } from 'lucide-react';
import api from '../../api/config';
import '../../components/Contact.css'; // Re-use contact form styles

const AboutManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        content: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await api.get('/content');
            const allContent = res.data.data || {};
            const aboutContent = allContent['about_me'] || {};

            setFormData({
                title: aboutContent.title || 'Who I Am',
                subtitle: aboutContent.subtitle || 'Bridging the gap between art and functionality.',
                content: aboutContent.content || '',
            });
            if (aboutContent.image) {
                setPreviewUrl(aboutContent.image);
            }
        } catch (error) {
            console.error('Failed to load content', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        data.append('content', formData.content);
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            const res = await api.post('/content/about_me', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('About Me content updated successfully!');
            // Update preview with returned URL if needed, though local preview is fine
        } catch (error) {
            console.error('Failed to save', error);
            alert('Failed to save content');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ color: '#fff' }}><Loader2 className="animate-spin" /> Loading content...</div>;

    return (
        <div>
            <h2 style={{ color: '#fff', fontFamily: 'Oswald', marginBottom: '30px' }}>Manage About Page</h2>

            <div style={{ background: '#151f19', padding: '30px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <form onSubmit={handleSubmit} className="contact-form">
                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                        {/* Image Upload Section */}
                        <div style={{ flex: '0 0 250px' }}>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '15px' }}>Profile Picture</label>

                            <div style={{
                                width: '100%',
                                aspectRatio: '3/4',
                                background: '#050a07',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '2px dashed rgba(255,255,255,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                marginBottom: '15px'
                            }}>
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                        <User size={40} style={{ marginBottom: '10px' }} />
                                        <p>No Image</p>
                                    </div>
                                )}
                            </div>

                            <label className="submit-btn" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                background: 'rgba(255,255,255,0.05)',
                                color: '#fff',
                                width: '100%'
                            }}>
                                <Upload size={18} /> Upload New
                                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                            </label>
                        </div>

                        {/* Text Fields */}
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Section Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Who I Am"
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Subtitle / Brand Statement</label>
                                <textarea
                                    rows="2"
                                    value={formData.subtitle}
                                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                    placeholder="Bridging the gap betwen..."
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Bio Content</label>
                                <textarea
                                    rows="10"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="I am a multidisciplinary..."
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-btn" disabled={saving}>
                                {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AboutManager;
