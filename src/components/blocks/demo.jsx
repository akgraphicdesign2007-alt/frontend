import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee"

const testimonials = [
    {
        author: {
            name: "Emma Thompson",
            handle: "Creative Director",
        },
        text: "Working with this agency fundamentally shifted our brand trajectory. The design language is not just beautiful—it commands attention.",
    },
    {
        author: {
            name: "David Park",
            handle: "Tech Founder",
        },
        text: "An unparalleled eye for modern aesthetics. They delivered a cohesive visual identity that immediately elevated our market position.",
    },
    {
        author: {
            name: "Sofia Rodriguez",
            handle: "Marketing VP",
        },
        text: "The web experiences they craft are immersive and perfectly engineered. Our conversion rates soared within weeks of launching."
    }
]

export function TestimonialsSectionDemo() {
    return (
        <TestimonialsSection
            title="Global Voices"
            description="Join visionary leaders who trust us to architect their digital presence and define their industry standard."
            testimonials={testimonials}
        />
    )
}
