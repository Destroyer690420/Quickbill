import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronRight } from 'lucide-react';

export const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const shimmerRef = useRef<HTMLSpanElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // Initial Setup
            gsap.set([textRef.current, ctaRef.current], { opacity: 0, y: 30 });
            gsap.set(shimmerRef.current, { backgroundPosition: '-100% 0' });

            // Animation Sequence
            tl.to(textRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                delay: 0.2,
            })
                .to(shimmerRef.current, {
                    backgroundPosition: '200% 0',
                    duration: 2.5,
                    ease: 'none',
                    repeat: -1,
                    repeatDelay: 1,
                }, '-=0.5')
                .to(ctaRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                }, '-=0.8');

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20"
        >
            {/* Abstract dark gradient background with overlay */}
            <div
                className="absolute inset-0 z-0 bg-[var(--color-indigo-midnight)]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(204, 255, 0, 0.08) 0%, transparent 60%)'
                }}
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2548&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-indigo-midnight)] via-transparent to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col items-center text-center max-w-5xl">
                <h1
                    ref={textRef}
                    className="flex flex-col gap-4 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
                >
                    <span className="text-[var(--color-pearl)] drop-shadow-sm font-sans">
                        Invoicing at the
                    </span>
                    <span className="font-playfair italic text-[var(--color-pearl)] pb-2 relative inline-block">
                        Speed of <span className="relative">
                            Thought.
                            {/* Shimmer Effect */}
                            <span
                                ref={shimmerRef}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-green-volt)]/50 to-transparent bg-[length:200%_100%] bg-clip-text text-transparent pointer-events-none mix-blend-screen"
                            >
                                Thought.
                            </span>
                        </span>
                    </span>
                </h1>

                <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-6">
                    <button className="group relative px-8 py-4 bg-[var(--color-green-volt)] text-[var(--color-indigo-midnight)] rounded-full font-semibold text-lg overflow-hidden transition-transform duration-300 hover:scale-105 shadow-[0_0_30px_rgba(204,255,0,0.2)] hover:shadow-[0_0_50px_rgba(204,255,0,0.4)] flex items-center gap-2">
                        <span className="relative z-10">Deploy Ledger</span>
                        <ChevronRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    </button>

                    <div className="flex items-center gap-3 text-[var(--color-pearl)]/70 font-jetbrains text-sm">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-green-volt)] animate-pulse" />
                        <span>Systems Online • 12ms</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
