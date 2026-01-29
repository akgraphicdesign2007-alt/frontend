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
                const res = await api.get('/content');
                const allContent = res.data.data || {};
                const aboutContent = allContent['about_me'];

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
                    className="about-image_wrapper"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="about-image-placeholder">
                        {content.image ? (
                            <img src={content.image} alt="About Me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div className="overlay-text">PORTRAIT</div>
                        )}
                    </div>
                    <div className="decorative-box"></div>
                </motion.div>

                <motion.div
                    className="about-content"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-title">{content.title}</h2>
                    <h3 className="brand-statement">
                        {content.subtitle}
                    </h3>
                    <p className="about-text" style={{ whiteSpace: 'pre-line' }}>
                        {content.content}
                    </p>

                    <div className="core-strengths">
                        {strengths.map((item, index) => (
                            <div key={index} className="strength-item">
                                <CheckCircle size={20} className="icon" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
