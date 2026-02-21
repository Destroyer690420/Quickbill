import { useState, useRef, useLayoutEffect } from 'react';
import type { FormEvent } from 'react';
import gsap from 'gsap';
import { STATE_OPTIONS } from '../lib/stateCodes';
import { Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '../utils/cn';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

interface OnboardingProps {
    onComplete: () => void;
    onBack?: () => void;
}

export const Onboarding = ({ onComplete, onBack }: OnboardingProps) => {
    const [phase, setPhase] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        companyName: '',
        gstin: '',
        address: '',
        state: '',
        bankName: '',
        accountNumber: '',
        ifsc: ''
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const formBoxRef = useRef<HTMLDivElement>(null);
    const phasesRef = useRef<(HTMLDivElement | null)[]>([]);
    const inputRefs = useRef<Record<string, HTMLInputElement | HTMLSelectElement | null>>({});

    // Boot-up Animation
    useLayoutEffect(() => {
        const initialPhase = auth.currentUser ? 2 : 1;
        setPhase(initialPhase);

        const ctx = gsap.context(() => {
            gsap.fromTo(containerRef.current,
                { scale: 0.95, filter: 'blur(10px)', opacity: 0 },
                { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 1.2, ease: 'power4.out' }
            );

            if (phasesRef.current[initialPhase]) {
                gsap.fromTo(phasesRef.current[initialPhase],
                    { x: 50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, ease: 'power4.out', delay: 0.4 }
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const triggerErrorShake = (fieldName?: string) => {
        const el = fieldName ? inputRefs.current[fieldName] : formBoxRef.current;
        if (!el) return;

        gsap.timeline()
            .to(el, { x: -8, duration: 0.05, borderColor: 'var(--color-green-volt)' })
            .to(el, { x: 8, duration: 0.05 })
            .to(el, { x: -8, duration: 0.05 })
            .to(el, { x: 8, duration: 0.05 })
            .to(el, { x: 0, duration: 0.05, borderColor: 'var(--color-slate)' });
    };

    const nextPhase = (currentPhase: number) => {
        let isValid = true;

        if (currentPhase === 1) {
            // Phase 1 is handled by handleEmailSignup/handleGoogleSignup
            // This nextPhase call is for moving from Phase 1 (auth) to Phase 2 (company details)
            // No validation here, as auth is already done.
        } else if (currentPhase === 2) {
            if (!formData.companyName) { triggerErrorShake('companyName'); isValid = false; }
            if (!formData.gstin) { triggerErrorShake('gstin'); isValid = false; }
        } else if (currentPhase === 3) {
            if (!formData.address) { triggerErrorShake('address'); isValid = false; }
            if (!formData.state) { triggerErrorShake('state'); isValid = false; }
        }

        if (!isValid) return;

        const currentEl = phasesRef.current[currentPhase];
        const nextEl = phasesRef.current[currentPhase + 1];

        if (currentEl && nextEl) {
            const tl = gsap.timeline();
            tl.to(currentEl, {
                x: -50,
                opacity: 0,
                duration: 0.4,
                ease: 'power4.in',
                onComplete: () => setPhase(currentPhase + 1)
            })
                .fromTo(nextEl,
                    { x: 50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.6, ease: 'power4.out' }
                );
        }
    };

    const handleEmailSignup = async () => {
        if (!formData.email) { triggerErrorShake('email'); return; }
        if (!formData.password) { triggerErrorShake('password'); return; }
        setIsLoading(true);
        setError(null);
        try {
            await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            setIsLoading(false);
            nextPhase(1); // Move to the next phase after successful signup
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
            setIsLoading(false);
            triggerErrorShake();
        }
    };

    const handleGoogleSignup = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            setIsLoading(false);
            nextPhase(1); // Move to the next phase after successful signup
        } catch (err: any) {
            setError(err.message || 'Google Auth failed');
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No authenticated user found.");

            // Save Company Profile Metadata
            const dbRef = getFirestore();
            await setDoc(doc(dbRef, "users", user.uid, "profile", "companyDetails"), {
                companyName: formData.companyName,
                gstin: formData.gstin,
                address: formData.address,
                state: formData.state,
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                ifsc: formData.ifsc,
                createdAt: new Date().toISOString()
            });

            // "System Initialized" phase triggers callback
            setIsLoading(false);
            onComplete();

        } catch (err: any) {
            console.error("Initialization Error:", err);
            setError(err.message || "Failed to initialize identity vector.");
            setIsLoading(false);
            triggerErrorShake();
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-[100dvh] bg-[var(--color-indigo-midnight)] flex flex-col items-center justify-center relative p-6 font-sans overflow-hidden"
        >
            <div className="absolute top-8 left-8 flex items-center gap-6 z-20">
                {onBack && (
                    <button onClick={onBack} className="text-[var(--color-pearl)]/50 hover:text-[var(--color-green-volt)] transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-[var(--color-green-volt)] flex items-center justify-center">
                        <span className="text-[var(--color-indigo-midnight)] font-bold text-lg font-space">Q</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[var(--color-pearl)]">Quickbill</span>
                </div>
            </div>

            <div
                ref={formBoxRef}
                className="w-full max-w-[600px] bg-[var(--color-indigo-midnight)] border border-[var(--color-slate)] rounded-[var(--radius-custom)] p-12 relative shadow-2xl z-10"
            >
                {/* Progressive Initialization Bar */}
                <div className="absolute top-0 left-0 h-1 bg-[var(--color-slate)] w-full rounded-t-[var(--radius-custom)] overflow-hidden">
                    <div
                        className="h-full bg-[var(--color-green-volt)] transition-all duration-700 ease-in-out glow-bar"
                        style={{ width: `${(phase / 4) * 100}%` }}
                    />
                </div>

                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-[var(--color-pearl)] mb-2 font-playfair tracking-tight">System Initialization</h2>
                    <p className="text-[var(--color-pearl)]/50 font-jetbrains text-sm">MODULE {phase} OF 4</p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[300px] animate-fade-in">
                        <Loader2 className="w-12 h-12 text-[var(--color-green-volt)] animate-spin mb-6" />
                        <p className="font-jetbrains text-[var(--color-pearl)] text-sm tracking-widest uppercase">Initializing System...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="relative min-h-[300px]">

                        {/* PHASE 1: AUTHENTICATION */}
                        <div
                            ref={(el) => { phasesRef.current[1] = el; }}
                            className={cn("absolute inset-0 w-full", phase === 1 ? 'pointer-events-auto' : 'pointer-events-none opacity-0')}
                        >
                            <h3 className="text-[var(--color-green-volt)] font-jetbrains text-xs uppercase tracking-widest mb-6 border-b border-[var(--color-slate)] pb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-green-volt)] animate-pulse" /> Phase 1: Authentication
                            </h3>

                            <div className="space-y-6">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-center mb-4">
                                        <p className="text-red-400 font-jetbrains text-xs uppercase">{error}</p>
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[var(--color-pearl)]/70 font-jetbrains text-xs uppercase tracking-wider block">Admin Email *</label>
                                        <input
                                            ref={(el) => { inputRefs.current['email'] = el; }}
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
                                            ref={(el) => { inputRefs.current['password'] = el; }}
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border border-[var(--color-slate)] rounded-lg px-4 py-3 text-[var(--color-pearl)] font-jetbrains focus:outline-none focus:border-[var(--color-green-volt)] transition-colors placeholder:text-[var(--color-slate)] tracking-[0.2em]"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleEmailSignup}
                                        className="px-6 py-3 bg-transparent border border-[var(--color-green-volt)] text-[var(--color-green-volt)] font-bold rounded-lg w-full transition-all font-sans relative group overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-[var(--color-indigo-midnight)] transition-colors">
                                            Sign Up with Email
                                        </span>
                                        <div className="absolute inset-0 bg-[var(--color-green-volt)] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
                                    </button>
                                </div>
                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-[var(--color-slate)]"></div>
                                    <span className="flex-shrink-0 mx-4 text-[var(--color-pearl)]/50 font-jetbrains text-xs">OR</span>
                                    <div className="flex-grow border-t border-[var(--color-slate)]"></div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGoogleSignup}
                                    className="px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-lg w-full transition-all font-sans flex items-center justify-center gap-3 shadow-md"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign Up with Google
                                </button>
                            </div>
                        </div>

                        {/* PHASE 2: IDENTITY */}
                        <div
                            ref={(el) => { phasesRef.current[2] = el; }}
                            className={cn("absolute inset-0 w-full", phase === 2 ? 'pointer-events-auto' : 'pointer-events-none opacity-0 invisible')}
                        >
                            <h3 className="text-[var(--color-green-volt)] font-jetbrains text-xs uppercase tracking-widest mb-6 border-b border-[var(--color-slate)] pb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-green-volt)] animate-pulse" /> Phase 2: Enterprise Identity
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[var(--color-pearl)]/70 font-jetbrains text-xs uppercase tracking-wider block">Company Name *</label>
                                    <input
                                        ref={(el) => { inputRefs.current['companyName'] = el; }}
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border border-[var(--color-slate)] rounded-lg px-4 py-3 text-[var(--color-pearl)] font-sans focus:outline-none focus:border-[var(--color-green-volt)] transition-colors placeholder:text-[var(--color-slate)]"
                                        placeholder="Acme Corporation"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[var(--color-pearl)]/70 font-jetbrains text-xs uppercase tracking-wider block">GSTIN *</label>
                                    <input
                                        ref={(el) => { inputRefs.current['gstin'] = el; }}
                                        type="text"
                                        name="gstin"
                                        value={formData.gstin}
                                        onChange={handleChange}
                                        maxLength={15}
                                        className="w-full bg-transparent border border-[var(--color-slate)] rounded-lg px-4 py-3 text-[var(--color-pearl)] font-jetbrains focus:outline-none focus:border-[var(--color-green-volt)] transition-colors placeholder:text-[var(--color-slate)] uppercase"
                                        placeholder="22AAAAA0000A1Z5"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => nextPhase(2)}
                                className="mt-10 px-6 py-3 bg-[var(--color-green-volt)] text-[var(--color-indigo-midnight)] font-bold rounded-lg w-full hover:bg-[var(--color-green-volt)]/90 transition-all font-sans"
                            >
                                Setup Geography &rarr;
                            </button>
                        </div>

                        {/* PHASE 3: GEOGRAPHY */}
                        <div
                            ref={(el) => { phasesRef.current[3] = el; }}
                            className={cn("absolute inset-0 w-full", phase === 3 ? 'pointer-events-auto' : 'pointer-events-none opacity-0 invisible')}
                        >
                            <h3 className="text-[var(--color-green-volt)] font-jetbrains text-xs uppercase tracking-widest mb-6 border-b border-[var(--color-slate)] pb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-green-volt)] animate-pulse" /> Phase 3: Geography
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[var(--color-pearl)]/70 font-jetbrains text-xs uppercase tracking-wider block">Registered Address *</label>
                                    <input
                                        ref={(el) => { inputRefs.current['address'] = el; }}
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border border-[var(--color-slate)] rounded-lg px-4 py-3 text-[var(--color-pearl)] font-sans focus:outline-none focus:border-[var(--color-green-volt)] transition-colors"
                                        placeholder="123 Financial District..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[var(--color-pearl)]/70 font-jetbrains text-xs uppercase tracking-wider block">State Code *</label>
                                    <select
                                        ref={(el) => { inputRefs.current['state'] = el; }}
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full bg-[var(--color-indigo-midnight)] border border-[var(--color-slate)] rounded-lg px-4 py-3 text-[var(--color-pearl)] font-sans focus:outline-none focus:border-[var(--color-green-volt)] transition-colors appearance-none"
                                    >
                                        <option value="" className="text-[var(--color-slate)]" disabled>Select State Vector</option>
                                        {STATE_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => nextPhase(3)}
                                className="mt-10 px-6 py-3 bg-[var(--color-green-volt)] text-[var(--color-indigo-midnight)] font-bold rounded-lg w-full hover:bg-[var(--color-green-volt)]/90 transition-all font-sans"
                            >
                                Setup Ledger Zones &rarr;
                            </button>
                        </div>

                        {/* PHASE 4: FINANCIALS */}
                        <div
                            ref={(el) => { phasesRef.current[4] = el; }}
                            className={cn("absolute inset-0 w-full", phase === 4 ? 'pointer-events-auto' : 'pointer-events-none opacity-0 invisible')}
                        >
                            <h3 className="text-[var(--color-green-volt)] font-jetbrains text-xs uppercase tracking-widest mb-6 border-b border-[var(--color-slate)] pb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-green-volt)] animate-pulse" /> Phase 4: Secondary Modules [Optional]
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[var(--color-pearl)]/70 font-jetbrains text-xs uppercase tracking-wider block">Bank Name</label>
                                    <input
                                        type="text"
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border border-[var(--color-slate)] rounded-lg px-4 py-2.5 text-[var(--color-pearl)] font-sans focus:outline-none focus:border-[var(--color-green-volt)] transition-colors"
                                        placeholder="NeoBank Corp"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[var(--color-pearl)]/70 font-jetbrains text-xs uppercase tracking-wider block">A/C Number</label>
                                        <input
                                            type="text"
                                            name="accountNumber"
                                            value={formData.accountNumber}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border border-[var(--color-slate)] rounded-lg px-4 py-2.5 text-[var(--color-pearl)] font-jetbrains focus:outline-none focus:border-[var(--color-green-volt)] transition-colors"
                                            placeholder="XXXXXXXX019"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[var(--color-pearl)]/70 font-jetbrains text-xs uppercase tracking-wider block">IFSC</label>
                                        <input
                                            type="text"
                                            name="ifsc"
                                            value={formData.ifsc}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border border-[var(--color-slate)] rounded-lg px-4 py-2.5 text-[var(--color-pearl)] font-jetbrains focus:outline-none focus:border-[var(--color-green-volt)] transition-colors uppercase"
                                            placeholder="NBCO000123"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-8 px-6 py-3 bg-transparent border border-[var(--color-green-volt)] text-[var(--color-green-volt)] font-bold rounded-lg w-full transition-all font-sans relative group overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-[var(--color-indigo-midnight)] transition-colors">
                                    Initialize System
                                </span>
                                <div className="absolute inset-0 bg-[var(--color-green-volt)] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />

                                {/* Volt-Pulse glow */}
                                <div className="absolute inset-[-4px] rounded-lg border border-[var(--color-green-volt)] opacity-0 shadow-[0_0_15px_rgba(204,255,0,0.5)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <style>{`
                .glow-bar {
                    box-shadow: 0 0 10px rgba(204, 255, 0, 0.5);
                }
            `}</style>
        </div>
    );
};
