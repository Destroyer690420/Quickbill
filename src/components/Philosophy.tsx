import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Philosophy = () => {
    const containerRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const text1Ref = useRef<HTMLHeadingElement>(null);
    const text2Ref = useRef<HTMLHeadingElement>(null);
    const subtextRef = useRef<HTMLParagraphElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Background Parallax
            gsap.to(bgRef.current, {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Split Text Comparison Reveal
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 60%',
                    end: 'top 20%',
                    toggleActions: 'play none none reverse',
                },
            });

            gsap.set([text1Ref.current, text2Ref.current, subtextRef.current], {
                opacity: 0,
                y: 40
            });

            gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' });

            tl.to(text1Ref.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
            })
                .to(lineRef.current, {
                    scaleX: 1,
                    duration: 0.8,
                    ease: 'power4.inOut',
                }, '-=0.4')
                .to(text2Ref.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    color: 'var(--color-indigo-midnight)', // Ensures stark contrast switch
                }, '-=0.2')
                .to(subtextRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                }, '-=0.4');

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="philosophy"
            ref={containerRef}
            className="relative min-h-screen bg-[var(--color-pearl)] flex items-center justify-center overflow-hidden py-32"
        >
            {/* Parallax Architecture Background */}
            <div
                ref={bgRef}
                className="absolute inset-x-0 -top-[20%] h-[140%] z-0"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) contrast(120%) brightness(1.4) opacity(0.15)'
                }}
            />

            <div className="relative z-10 container mx-auto px-6 lg:px-12">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24 items-start md:items-center">

                    <div className="flex-1">
                        <h2
                            ref={text1Ref}
                            className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-[var(--color-slate)]/50 tracking-tight leading-tight"
                        >
                            Spreadsheets ask:<br />
                            <span className="font-playfair italic text-[var(--color-slate)]/70">Where is the money?</span>
                        </h2>
                    </div>

                    <div
                        ref={lineRef}
                        className="hidden md:block w-px h-32 bg-[var(--color-slate)]/30 mx-auto"
                    />

                    <div className="flex-1">
                        <h2
                            ref={text2Ref}
                            className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-[var(--color-indigo-midnight)] tracking-tight leading-tight"
                        >
                            Quickbill shows:<br />
                            <span className="font-playfair italic text-[var(--color-indigo-midnight)] relative inline-block">
                                This is the future.
                                <div className="absolute -bottom-2 left-0 w-full h-1 bg-[var(--color-green-volt)]" />
                            </span>
                        </h2>

                        <p
                            ref={subtextRef}
                            className="mt-8 text-lg font-medium text-[var(--color-slate)] max-w-sm"
                        >
                            The Ledger Manifesto dictates absolute precision. Eradicate manual errors. Shift from reactive counting to proactive financial engineering.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};
