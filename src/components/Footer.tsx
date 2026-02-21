import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Check, ArrowRight, Server } from 'lucide-react';
import { cn } from '../utils/cn';

const pricingTiers = [
    {
        name: 'Standard',
        price: '₹2,499',
        period: '/mo',
        description: 'Essential ledger tools for growing teams.',
        features: ['Unlimited Invoicing', 'Basic CRM', 'Email Support'],
        isPopular: false,
    },
    {
        name: 'Enterprise',
        price: '₹7,999',
        period: '/mo',
        description: 'Full programmatic access to the GST engine.',
        features: ['Custom API Access', 'Auto-IGST Engine', 'Dedicated Manager', 'Audit Protocols'],
        isPopular: true,
    },
    {
        name: 'Network',
        price: 'Custom',
        period: '',
        description: 'High-availability nodes for massive scale.',
        features: ['SLA 99.99%', 'On-Premises Opt', 'White-labeling'],
        isPopular: false,
    },
];

export const Footer = () => {
    const containerRef = useRef<HTMLElement>(null);
    const [latency, setLatency] = useState(12);

    useEffect(() => {
        // Mock latency fluctuation
        const interval = setInterval(() => {
            setLatency(12 + Math.floor(Math.random() * 5 - 2));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.price-card', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.pricing-grid',
                    start: 'top 80%',
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <footer ref={containerRef} className="bg-[var(--color-pearl)] relative z-20">

            {/* Subscription Section */}
            <div className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-indigo-midnight)] mb-6">
                        Access the <span className="font-playfair italic underline decoration-[var(--color-green-volt)] decoration-4 underline-offset-8">Engine.</span>
                    </h2>
                    <p className="text-[var(--color-slate)]/70 text-lg max-w-2xl mx-auto font-medium">
                        Deploy enterprise-grade financial infrastructure in minutes.
                    </p>
                </div>

                <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingTiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={cn(
                                'price-card relative p-8 rounded-[2rem] flex flex-col',
                                tier.isPopular
                                    ? 'bg-[var(--color-indigo-midnight)] text-[var(--color-pearl)] border-2 border-[var(--color-green-volt)] shadow-[0_20px_50px_-12px_rgba(204,255,0,0.15)] transform md:-translate-y-4'
                                    : 'bg-white text-[var(--color-indigo-midnight)] border border-[var(--color-slate)]/20 shadow-xl'
                            )}
                        >
                            {tier.isPopular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-green-volt)] text-[var(--color-indigo-midnight)] text-xs font-bold px-4 py-1.5 rounded-full font-jetbrains">
                                    RECOMMENDED
                                </div>
                            )}

                            <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                            <p className={cn('text-sm mb-8 font-medium', tier.isPopular ? 'text-[var(--color-pearl)]/70' : 'text-[var(--color-slate)]/70')}>
                                {tier.description}
                            </p>

                            <div className="mb-8">
                                <span className="text-4xl font-bold">{tier.price}</span>
                                <span className={cn('text-sm font-medium', tier.isPopular ? 'text-[var(--color-pearl)]/50' : 'text-[var(--color-slate)]/50')}>
                                    {tier.period}
                                </span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {tier.features.map(feat => (
                                    <li key={feat} className="flex items-center gap-3 text-sm font-medium">
                                        <Check className={cn('w-5 h-5', tier.isPopular ? 'text-[var(--color-green-volt)]' : 'text-[var(--color-indigo-midnight)]')} />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={cn(
                                    'w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 group',
                                    tier.isPopular
                                        ? 'bg-[var(--color-green-volt)] text-[var(--color-indigo-midnight)] hover:scale-[1.02]'
                                        : 'bg-[var(--color-indigo-midnight)] text-white hover:bg-[var(--color-slate)] hover:scale-[1.02]'
                                )}
                            >
                                Deploy Now
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Footer Base */}
            <div className="bg-[var(--color-indigo-midnight)] rounded-t-[3rem] pt-20 pb-10 px-6 lg:px-12 text-[var(--color-pearl)]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 mb-16 border-b border-[var(--color-slate)]/30 pb-16">
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-green-volt)] flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
                            <span className="text-[var(--color-indigo-midnight)] font-bold text-xl font-space">Q</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight font-serif italic">
                            Quickbill.
                        </span>
                    </div>

                    {/* Network Status indicator */}
                    <div className="flex items-center gap-4 bg-[var(--color-slate)]/30 backdrop-blur-md px-6 py-3 rounded-full border border-[var(--color-slate)]/50">
                        <Server className="w-4 h-4 text-[var(--color-green-volt)]" />
                        <div className="flex flex-col">
                            <span className="text-xs text-[var(--color-pearl)]/50 font-medium uppercase tracking-wider">Network Status</span>
                            <div className="flex items-center gap-2 font-jetbrains text-sm">
                                <div className="w-2 h-2 rounded-full bg-[var(--color-green-volt)] animate-pulse" />
                                <span className="text-[var(--color-green-volt)]">All Systems Operational</span>
                                <span className="text-[var(--color-pearl)]/30 ml-2">[{latency}ms]</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[var(--color-pearl)]/40 font-medium">
                    <p>© 2026 Quickbill Technologies. All logic immutable.</p>
                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-[var(--color-pearl)] transition-colors">Privacy Protocol</a>
                        <a href="#" className="hover:text-[var(--color-pearl)] transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-[var(--color-pearl)] transition-colors">System Architecture</a>
                    </div>
                </div>
            </div>

        </footer>
    );
};
