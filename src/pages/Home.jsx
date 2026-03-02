import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Blog from '../components/Blog';
import Cta from '../components/Cta';
import Testimonials from '../components/Testimonials';
import { useSEO } from '../hooks/useSEO';

const Home = () => {
    useSEO({
        title: 'Visual Artist & Brand Designer',
        description: 'AK Designs — crafting bold visual experiences, premium logo design, brand identity systems, and high-end digital narratives that elevate brands worldwide.',
        url: 'https://www.akdesigns.space/',
        type: 'website',
        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'AK Designs',
            url: 'https://www.akdesigns.space',
            image: 'https://www.akdesigns.space/og-image.png',
            description: 'Premium brand design and visual identity services — logos, brand systems, and digital narratives.',
            priceRange: '$$',
            areaServed: 'Worldwide',
            serviceType: ['Brand Identity', 'Logo Design', 'Graphic Design', 'Website Design'],
            contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', url: 'https://www.akdesigns.space/contact' },
            sameAs: [
                'https://www.instagram.com/akcreative._',
                'https://www.behance.net/akdesign_hub',
                'https://www.linkedin.com/in/ak-design-9bb1173a1',
                'https://www.facebook.com/share/1GUwsErRAH/',
                'https://t.me/Akcreativex',
            ],
        },
    });

    return (
        <main>
            <Hero />
            <About />
            <Services />
            <Projects />
            <Blog limit={3} />
            <Testimonials />
            <Cta />
        </main>
    );
};

export default Home;

