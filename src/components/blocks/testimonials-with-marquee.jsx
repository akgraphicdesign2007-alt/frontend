import { cn } from "@/lib/utils"
import { TestimonialCard } from "@/components/ui/testimonial-card"

export function TestimonialsSection({
    title,
    description,
    testimonials,
    className
}) {
    return (
        <section className={cn(
            "bg-[#050a07] text-white",
            "py-14 px-0 relative overflow-hidden",
            className
        )}>
            <div className="mx-auto flex w-full max-w-container flex-col items-center gap-4 text-center sm:gap-10">
                <div className="flex flex-col items-center gap-4 px-4">
                    <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl text-white font-['Oswald'] uppercase tracking-tight">
                        {title}
                    </h2>
                    <p className="max-w-[600px] text-base text-gray-400 font-['Inter']">
                        {description}
                    </p>
                </div>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mt-6">
                    <div className="group flex overflow-hidden p-4 [--gap:1.5rem] [gap:var(--gap)] flex-row [--duration:40s] w-full max-w-[100vw]">
                        <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
                            {[...Array(4)].map((_, setIndex) => (
                                testimonials.map((testimonial, i) => (
                                    <TestimonialCard
                                        key={`${setIndex}-${i}`}
                                        {...testimonial}
                                    />
                                ))
                            ))}
                        </div>
                    </div>

                    {/* Fade overlays to match dark UI background */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-[#050a07] to-transparent sm:block" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/4 bg-gradient-to-l from-[#050a07] to-transparent sm:block" />
                </div>
            </div>
        </section>
    )
}
