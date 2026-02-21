import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { MousePointer2, Settings, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

const taxes = [
    { id: 1, label: 'Auto-IGST Calculation', icon: Zap },
    { id: 2, label: 'HSN Validation', icon: ShieldCheck },
    { id: 3, label: 'E-Way Bill Ready', icon: Settings },
];

const transactions = [
    { id: 1, text: 'Invoice #INV-2026-01 Generated...' },
    { id: 2, text: 'Payment Received: ₹50,000' },
    { id: 3, text: 'Reconciling against Ledger ID-892...' },
    { id: 4, text: 'Status update: Settled instantly.' },
];

export const Features = () => {
    const containerRef = useRef<HTMLElement>(null);

    // Card 1: GST Engine Refs
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);


    const [streamIndex, setStreamIndex] = useState(0);

    // Card 3: Audit Protocol Refs
    const cursorRef = useRef<HTMLDivElement>(null);
    const matchBtnRef = useRef<HTMLButtonElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            // Card 1: GST Engine Shuffler
            const shufflerCardStack = [...cardsRef.current];

            const playShuffle = () => {
                if (!shufflerCardStack[0]) return;

                // Animate the front card up and fade out
                gsap.to(shufflerCardStack[0], {
                    y: -40,
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.6,
                    ease: 'back.in(1.2)',
                    delay: 2.4,
                    onComplete: () => {
                        // Move front card to back of our array
                        const first = shufflerCardStack.shift();
                        if (first) shufflerCardStack.push(first);

                        // Animate all cards to their new positions
                        shufflerCardStack.forEach((card, i) => {
                            if (!card) return;
                            gsap.to(card, {
                                y: i * 15,
                                scale: 1 - (i * 0.05),
                                zIndex: 3 - i,
                                opacity: i === 2 ? 0 : 1 - (i * 0.2), // Third item hides initially
                                duration: 0.8,
                                ease: 'elastic.out(1, 0.7)'
                            });
                        });

                        // Fade in the element that just moved to the back
                        gsap.to(shufflerCardStack[2], { opacity: 0.6, duration: 0.4, delay: 0.2 });

                        // Loop
                        playShuffle();
                    }
                });
            };

            // Set initial positions
            shufflerCardStack.forEach((card, i) => {
                if (!card) return;
                gsap.set(card, {
                    y: i * 15,
                    scale: 1 - (i * 0.05),
                    zIndex: 3 - i,
                    opacity: 1 - (i * 0.2)
                });
            });

            // Start loop
            playShuffle();


            // Card 3: Audit Protocol Auto-Cursor
            const cursorTl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

            cursorTl
                .to(cursorRef.current, {
                    x: 40,
                    y: 60,
                    duration: 1.2,
                    ease: 'power2.inOut'
                })
                .to(cursorRef.current, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }) // simulate click
                .to(cursorRef.current, {
                    x: 140,
                    y: 120,
                    duration: 1.5,
                    ease: 'power3.inOut',
                    delay: 0.3
                })
                .to(cursorRef.current, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }) // click match
                .to(matchBtnRef.current, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                }, '<')
                .to(glowRef.current, {
                    opacity: 1,
                    scale: 1.5,
                    duration: 0.4,
                    ease: 'power2.out'
                })
                .to(glowRef.current, {
                    opacity: 0,
                    duration: 0.8
                })
                .to(cursorRef.current, {
                    x: 0,
                    y: 0,
                    duration: 1,
                    ease: 'power2.inOut',
                    delay: 1
                });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Card 2 Typewriter effect basic implementation
    useEffect(() => {
        const interval = setInterval(() => {
            setStreamIndex((prev) => (prev + 1) % transactions.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section
            id="features"
            ref={containerRef}
            className="py-32 bg-[var(--color-indigo-midnight)] relative z-10"
        >
            <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        The Financial Micro-UI <span className="text-[var(--color-green-volt)] font-playfair italic">Dashboard</span>
                    </h2>
                    <p className="text-[var(--color-pearl)]/60 max-w-2xl mx-auto text-lg">
                        A brutalist approach to accounting. Zero fluff. Pure computational power visualizing your data in real-time.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Card 1: The GST Engine */}
                    <div className="group relative h-[400px] rounded-[var(--radius-custom)] bg-[var(--color-slate)]/20 border border-[var(--color-slate)] p-8 overflow-hidden flex flex-col items-center justify-center backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-slate)]/10 to-transparent pointer-events-none" />
                        <h3 className="absolute top-8 left-8 text-[var(--color-pearl)]/80 font-medium tracking-wide text-sm font-jetsbrains uppercase">
                            01 // The GST Engine
                        </h3>

                        <div className="relative w-full max-w-[240px] h-[120px] mt-10">
                            {taxes.map((tax, i) => {
                                const Icon = tax.icon;
                                return (
                                    <div
                                        key={tax.id}
                                        ref={(el: HTMLDivElement | null) => { cardsRef.current[i] = el; }}
                                        className="absolute inset-x-0 h-16 bg-[var(--color-indigo-midnight)] border border-[var(--color-slate)] rounded-xl flex items-center px-4 gap-3 shadow-xl"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-[var(--color-slate)]/50 flex items-center justify-center">
                                            <Icon size={16} className="text-[var(--color-green-volt)]" />
                                        </div>
                                        <span className="text-sm font-medium text-[var(--color-pearl)]">{tax.label}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="absolute bottom-8 left-8 right-8 text-xs text-[var(--color-pearl)]/40 font-jetbrains text-center">
                            Re-computing tax vectors dynamically...
                        </div>
                    </div>

                    {/* Card 2: The Ledger Stream */}
                    <div className="group relative h-[400px] rounded-[var(--radius-custom)] bg-[var(--color-slate)]/20 border border-[var(--color-slate)] p-8 overflow-hidden backdrop-blur-sm">
                        <h3 className="text-[var(--color-pearl)]/80 font-medium tracking-wide text-sm font-jetsbrains uppercase mb-8">
                            02 // The Ledger Stream
                        </h3>

                        <div className="font-jetbrains text-sm space-y-4">
                            {transactions.slice(0, streamIndex + 1).map((t) => (
                                <div
                                    key={t.id}
                                    className="flex items-start gap-3 opacity-0 animate-fade-in"
                                >
                                    <span className="text-[var(--color-slate)] shrink-0 font-mono text-xs mt-0.5">
                                        [{new Date().toISOString().split('T')[1].slice(0, 8)}]
                                    </span>
                                    <span className={`
                    ${t.text.includes('Received') ? 'text-[var(--color-green-volt)]' : 'text-[var(--color-pearl)]/80'}
                  `}>
                                        {t.text}
                                    </span>
                                </div>
                            ))}
                            <div className="flex items-center gap-2">
                                <span className="text-[var(--color-green-volt)] animate-[pulse_1s_ease-in-out_infinite]">_</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Automated Reconciliation */}
                    <div className="group relative h-[400px] rounded-[var(--radius-custom)] bg-[var(--color-slate)]/20 border border-[var(--color-slate)] p-8 overflow-hidden backdrop-blur-sm">
                        <h3 className="absolute top-8 left-8 text-[var(--color-pearl)]/80 font-medium tracking-wide text-sm font-jetsbrains uppercase">
                            03 // Auto-Reconciliation
                        </h3>

                        <div className="mt-16 relative">
                            {/* Mock Calendar / Invoice row */}
                            <div className="bg-[var(--color-indigo-midnight)] border border-[var(--color-slate)] rounded-xl p-4 mb-4 flex justify-between items-center shadow-lg">
                                <div>
                                    <div className="text-xs text-[var(--color-pearl)]/50 font-jetbrains mb-1">Invoice INV-910</div>
                                    <div className="font-medium">₹1,24,000</div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            </div>

                            {/* Mock Payment list */}
                            <div className="bg-[var(--color-indigo-midnight)] border border-[var(--color-slate)] rounded-xl p-4 flex justify-between items-center shadow-lg relative">
                                <div>
                                    <div className="text-xs text-[var(--color-pearl)]/50 font-jetbrains mb-1">Incoming RTGS</div>
                                    <div className="font-medium text-[var(--color-green-volt)]">₹1,24,000</div>
                                </div>

                                <button
                                    ref={matchBtnRef}
                                    className="relative z-10 px-3 py-1.5 rounded-md bg-[var(--color-slate)] text-xs font-medium flex items-center gap-1 border border-transparent"
                                >
                                    <CheckCircle2 size={12} />
                                    Match
                                </button>

                                {/* Success Glow effect attached to button area */}
                                <div
                                    ref={glowRef}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-8 bg-[var(--color-green-volt)]/20 blur-xl rounded-full opacity-0 pointer-events-none"
                                />
                            </div>

                            {/* Autonomous Cursor */}
                            <div
                                ref={cursorRef}
                                className="absolute top-4 left-4 z-50 pointer-events-none drop-shadow-lg"
                            >
                                <MousePointer2 className="text-[var(--color-pearl)] fill-[var(--color-indigo-midnight)] w-6 h-6 -rotate-12" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
