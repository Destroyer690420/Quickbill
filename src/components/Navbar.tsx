import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface NavbarProps {
    onLogin?: () => void;
    onSignup?: () => void;
}

export const Navbar = ({ onLogin, onSignup }: NavbarProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            ref={navRef}
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-6 py-4 lg:px-12',
                isScrolled
                    ? 'bg-[var(--color-indigo-midnight)]/80 backdrop-blur-xl border-b border-[var(--color-slate)] py-3'
                    : 'bg-transparent py-6'
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer group">
                    <img src="/logo.svg" alt="Quickbill Logo" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-xl font-bold tracking-tight text-[var(--color-pearl)]">
                        Quickbill
                    </span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {['Features', 'Philosophy', 'Protocol'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-sm font-medium text-[var(--color-pearl)]/70 hover:text-[var(--color-green-volt)] transition-colors duration-300 relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-green-volt)] transition-all duration-300 group-hover:w-full" />
                        </a>
                    ))}
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={onLogin}
                        className="text-sm font-medium text-[var(--color-pearl)] hover:text-white transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={onSignup}
                        className="px-5 py-2.5 rounded-[var(--radius-custom)] bg-[var(--color-green-volt)] text-[var(--color-indigo-midnight)] font-medium text-sm hover:bg-[var(--color-green-volt)]/90 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                    >
                        Sign up
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-[var(--color-pearl)]"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--color-indigo-midnight)] border-b border-[var(--color-slate)] p-6 flex flex-col gap-4 shadow-2xl">
                    {['Features', 'Philosophy', 'Protocol'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-lg font-medium text-[var(--color-pearl)] hover:text-[var(--color-green-volt)] transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item}
                        </a>
                    ))}
                    <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-[var(--color-slate)]/50">
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                onLogin?.();
                            }}
                            className="text-left text-lg font-medium text-[var(--color-pearl)]"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                onSignup?.();
                            }}
                            className="px-5 py-3 rounded-[var(--radius-custom)] bg-[var(--color-green-volt)] text-[var(--color-indigo-midnight)] font-medium text-lg text-center w-full"
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};
