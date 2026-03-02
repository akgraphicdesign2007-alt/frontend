import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import api from '../api/config';
import './About.css';

const About = () => {
    const [content, setContent] = useState({
        title: 'Who I Am',
        subtitle: 'Bridging the gap between art and functionality.',
        content: 'I am a multidisciplinary visual designer with a passion for creating immersive digital experiences. My philosophy is simple: design is not just about how it looks, but how it makes you feel. Every pixel is crafted with intention, ensuring your brand tells a compelling story.',
        image: ''
    });
    const [loading, setLoading] = useState(true);

    const strengths = [
        "Brand Identity",
        "UI/UX Design",
        "Interaction Design",
        "Art Direction"
    ];

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await api.get('/pageContent');
                const data = res.data.data || [];
                const aboutContent = data.find(item => item.section === 'hero') || data.find(item => item.section === 'about_me');

                if (aboutContent) {
                    setContent({
                        title: aboutContent.title || 'Who I Am',
                        subtitle: aboutContent.subtitle || 'Bridging the gap between art and functionality.',
                        content: aboutContent.content || 'I am a multidisciplinary visual designer...',
                        image: aboutContent.image || ''
                    });
                }
            } catch (error) {
                console.error('Failed to load about content');
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    return (
        <section id="about" className="about-section">
            <div className="container about-container">
                <motion.div
                    className="about-image-side"
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                >
                    <div className="about-image-container">
                        {content.image ? (
                            <img src={content.image} alt="Studio Work" className="about-img" />
                        ) : (
                            <div className="about-img-fallback">PORTFOLIO</div>
                        )}
                    </div>
                    <div className="about-experience-badge">
                        <h4>02+</h4>
                        <p>Years of Vision</p>
                    </div>
                </motion.div>

                <motion.div
                    className="about-content-side"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <span className="about-tag">About Me</span>
                    <h2 className="about-heading">{content.title}</h2>
                    <p className="about-description">
                        {content.content}
                    </p>

                    <div className="about-stats">
                        <div className="stat-item">
                            <h4><CheckCircle size={20} className="icon-check" /> Brand Mastery</h4>
                            <p>Architecting identities that resonate across global markets.</p>
                        </div>
                        <div className="stat-item">
                            <h4><CheckCircle size={20} className="icon-check" /> Interaction UX</h4>
                            <p>Redefining how users experience the digital web space.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
