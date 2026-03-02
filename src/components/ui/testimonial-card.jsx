import { cn } from "@/lib/utils"

export function TestimonialCard({
    author,
    text,
    href,
    className
}) {
    const Card = href ? 'a' : 'div'

    return (
        <Card
            {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
            className={cn(
                "flex flex-col rounded-2xl border-t border-b border-l border-r",
                "bg-gradient-to-b from-white/5 to-transparent",
                "border-white/10",
                "p-6 text-start",
                "hover:from-white/10 hover:to-white/5",
                "hover:border-yellow-400/20",
                "max-w-[320px] sm:max-w-[320px]",
                "transition-all duration-300",
                className
            )}
        >
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-start">
                    <h3 className="text-md font-semibold leading-none text-white font-['Oswald'] uppercase tracking-wider">
                        {author.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                        {author.handle}
                    </p>
                </div>
            </div>
            <p className="sm:text-md mt-4 text-sm text-gray-300 leading-relaxed font-['Inter']">
                "{text}"
            </p>
        </Card>
    )
}
