import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/config';
import './Hero.css';

const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const [content, setContent] = useState({
        badge: 'Visual Artist & Brand Designer',
        titleLine1: 'CRAFTING BOLD',
        titleLine2: 'VISUAL EXPERIENCES',
        description: 'Elevating brands through strategic design, high-end visual systems, and immersive digital narratives.',
        resumeUrl: ''
    });

    useEffect(() => {
        const fetchHeroContent = async () => {
            try {
                const res = await api.get('/pageContent');
                const pageDataList = Array.isArray(res.data.data) ? res.data.data : [];
                const heroData = pageDataList.find(item => item.section === 'hero_main');

                if (heroData) {
                    const titles = (heroData.title || '').split('||');

                    setContent({
                        badge: heroData.subtitle || content.badge,
                        titleLine1: titles[0] || content.titleLine1,
                        titleLine2: titles[1] || content.titleLine2,
                        description: heroData.content || content.description,
                        resumeUrl: heroData.resume || ''
                    });
                }
            } catch (error) {
                console.error('Failed to fetch hero content:', error);
            }
        };

        fetchHeroContent();
    }, []);

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section className="hero" ref={ref} style={{ position: 'relative' }}>
            <div className="hero-background"></div>
            <div className="hero-glow"></div>

            <motion.div
                className="container hero-content"
                style={{ opacity }}
            >
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-badge"
                >
                    {content.badge}
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hero-title"
                >
                    {content.titleLine1} <br />
                    <span className="outline-text">{content.titleLine2}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="hero-description"
                >
                    {content.description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="hero-actions"
                >
                    <a href={content.resumeUrl || "#"} target={content.resumeUrl ? "_blank" : "_self"} rel="noreferrer" className="hero-btn-primary">
                        View Resume
                    </a>
                    <a href="/contact" className="hero-btn-secondary">
                        Initiate Project <ArrowRight size={20} />
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
