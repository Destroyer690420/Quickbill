import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LineChart, ScanLine, Rotate3d } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const cards = [
    {
        id: 1,
        title: 'Value Assertion',
        description: 'Cryptographically secured state transitions ensure ledger immutability.',
        icon: Rotate3d,
        color: 'from-[var(--color-slate)] to-[var(--color-indigo-midnight)]',
    },
    {
        id: 2,
        title: 'Data Telemetry',
        description: 'High-frequency invoice parsing with instantaneous format validation.',
        icon: ScanLine,
        color: 'from-blue-900 to-[var(--color-indigo-midnight)]',
    },
    {
        id: 3,
        title: 'Growth Vectors',
        description: 'Algorithmic forecasting models built directly into your equity dashboard.',
        icon: LineChart,
        color: 'from-[var(--color-green-volt)]/20 to-[var(--color-indigo-midnight)]',
    }
];

export const Protocol = () => {
    const containerRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const cards = cardsRef.current;

            cards.forEach((card, index) => {
                if (!card || index === cards.length - 1) return;

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top top',
                    pin: true,
                    pinSpacing: false,
                    endTrigger: containerRef.current,
                    end: 'bottom bottom',
                    animation: gsap.to(card, {
                        scale: 0.90,
                        opacity: 0,
                        y: 50,
                        ease: 'power2.inOut',
                    }),
                    scrub: true,
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="protocol"
            ref={containerRef}
            className="relative bg-[var(--color-indigo-midnight)]"
        >
            <div className="pt-32 pb-16 text-center sticky top-0 z-10 bg-gradient-to-b from-[var(--color-indigo-midnight)] to-transparent pointer-events-none">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-[var(--color-pearl)] tracking-tight">
                    Transaction <span className="text-[var(--color-green-volt)] font-playfair italic">Stacking Archive</span>
                </h2>
            </div>

            <div className="relative pb-32">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.id}
                            ref={(el: HTMLDivElement | null) => { cardsRef.current[index] = el; }}
                            className="min-h-screen flex items-center justify-center sticky top-0 w-full"
                        >
                            <div className="w-full max-w-5xl mx-auto px-6 lg:px-12">
                                <div className={`relative h-[60vh] rounded-[2rem] bg-[var(--color-indigo-midnight)] bg-gradient-to-br ${card.color} border border-[var(--color-slate)] p-12 overflow-hidden shadow-2xl flex flex-col justify-between`}>

                                    {/* Decorative Background Elements */}
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-pearl)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                    <div className="relative z-10 flex justify-between items-start">
                                        <span className="text-[var(--color-green-volt)] font-jetbrains text-lg bg-[var(--color-indigo-midnight)]/50 px-4 py-2 rounded-full border border-[var(--color-green-volt)]/30 backdrop-blur-md">
                                            Protocol 0{index + 1}
                                        </span>
                                        <Icon className="w-12 h-12 text-[var(--color-pearl)]/50" />
                                    </div>

                                    <div className="relative z-10 max-w-2xl">
                                        <h3 className="text-5xl font-bold text-[var(--color-pearl)] mb-6 font-playfair tracking-tight">
                                            {card.title}
                                        </h3>
                                        <p className="text-xl text-[var(--color-pearl)]/70 font-medium">
                                            {card.description}
                                        </p>
                                    </div>

                                    {/* Interactive mock artifact */}
                                    <div className="absolute right-12 bottom-12 w-48 h-48 border border-[var(--color-slate)] rounded-full flex items-center justify-center opacity-30 mix-blend-screen">
                                        {/* Simulated data rings */}
                                        <div className="absolute inset-4 border border-[var(--color-green-volt)] rounded-full border-t-transparent animate-[spin_4s_linear_infinite]" />
                                        <div className="absolute inset-8 border border-[var(--color-pearl)] rounded-full border-l-transparent animate-[spin_3s_linear_infinite_reverse]" />
                                        <div className="absolute inset-12 border border-[var(--color-slate)] rounded-full border-b-transparent animate-[spin_2s_linear_infinite]" />
                                    </div>

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
