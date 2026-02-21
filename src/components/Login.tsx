import { useState, useRef, useLayoutEffect } from 'react';
import type { FormEvent } from 'react';
import gsap from 'gsap';
import { Loader2, ArrowLeft } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface LoginProps {
    onBack: () => void;
    onComplete: () => void;
}

export const Login = ({ onBack, onComplete }: LoginProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const formBoxRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Boot-up Animation
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(containerRef.current,
                { filter: 'blur(10px)', opacity: 0 },
                { filter: 'blur(0px)', opacity: 1, duration: 1.2, ease: 'power4.out' }
            );

            gsap.fromTo(formBoxRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', delay: 0.2 }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const triggerErrorShake = () => {
        if (!formRef.current) return;

        gsap.timeline()
            .to(formRef.current, { x: -8, duration: 0.05 })
            .to(formRef.current, { x: 8, duration: 0.05 })
            .to(formRef.current, { x: -8, duration: 0.05 })
            .to(formRef.current, { x: 8, duration: 0.05 })
            .to(formRef.current, { x: 0, duration: 0.05 });
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            setTimeout(() => {
                onComplete();
            }, 500);
        } catch (err: any) {
            console.error("Google login error:", err);
            setError("Google authentication failed. Try again.");
            triggerErrorShake();
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("Authentication credentials required");
            triggerErrorShake();
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            // On success, notify parent to switch to dashboard
            setTimeout(() => {
                onComplete();
            }, 500);
        } catch (err: any) {
            console.error("Login mapping error:", err);
            setError("Invalid identity credentials or node unresponsive.");
            triggerErrorShake();
            setIsLoading(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-[100dvh] bg-[var(--color-indigo-midnight)] flex flex-col items-center justify-center relative p-6 font-sans overflow-hidden"
        >
            <div className="absolute top-8 left-8 flex items-center gap-6 z-20">
                <button onClick={onBack} className="text-[var(--color-pearl)]/50 hover:text-[var(--color-green-volt)] transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-[var(--color-green-volt)] flex items-center justify-center">
                        <span className="text-[var(--color-indigo-midnight)] font-bold text-lg font-space">Q</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[var(--color-pearl)]">Quickbill</span>
                </div>
            </div>

            <div
                ref={formBoxRef}
                className="w-full max-w-[450px] bg-[var(--color-indigo-midnight)] border border-[var(--color-slate)] rounded-[var(--radius-custom)] p-12 relative shadow-2xl z-10"
            >

                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-[var(--color-pearl)] mb-2 font-playfair tracking-tight">Identity Uplink</h2>
                    <p className="text-[var(--color-pearl)]/50 font-jetbrains text-sm">ACCESS DASHBOARD NODE</p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[200px] animate-fade-in">
                        <Loader2 className="w-12 h-12 text-[var(--color-green-volt)] animate-spin mb-6" />
                        <p className="font-jetbrains text-[var(--color-pearl)] text-sm tracking-widest uppercase">Verifying Identity Hash...</p>
                    </div>
                ) : (
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-center">
                                <p className="text-red-400 font-jetbrains text-xs uppercase">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[var(--color-pearl)]/70 font-jetbrains text-xs uppercase tracking-wider block">Admin Node ID (Email) *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-transparent border border-[var(--color-slate)] rounded-lg px-4 py-3 text-[var(--color-pearl)] font-sans focus:outline-none focus:border-[var(--color-green-volt)] transition-colors placeholder:text-[var(--color-slate)]"
                                placeholder="operator@network.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[var(--color-pearl)]/70 font-jetbrains text-xs uppercase tracking-wider block">Security Key *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-transparent border border-[var(--color-slate)] rounded-lg px-4 py-3 text-[var(--color-pearl)] font-jetbrains focus:outline-none focus:border-[var(--color-green-volt)] transition-colors placeholder:text-[var(--color-slate)] tracking-[0.2em]"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-8 px-6 py-3 bg-transparent border border-[var(--color-green-volt)] text-[var(--color-green-volt)] font-bold rounded-lg w-full transition-all font-sans relative group overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-[var(--color-indigo-midnight)] transition-colors">
                                Authenticate
                            </span>
                            <div className="absolute inset-0 bg-[var(--color-green-volt)] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
                        </button>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-[var(--color-slate)]"></div>
                            <span className="flex-shrink-0 mx-4 text-[var(--color-pearl)]/50 font-jetbrains text-xs">OR</span>
                            <div className="flex-grow border-t border-[var(--color-slate)]"></div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-lg w-full transition-all font-sans flex items-center justify-center gap-3 shadow-md"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                    </form>
                )}
            </div>

            <div className="absolute bottom-8 text-[var(--color-pearl)]/30 font-jetbrains text-xs uppercase tracking-widest">
                Quickbill • Secure Node Terminal
            </div>
        </div>
    );
};
