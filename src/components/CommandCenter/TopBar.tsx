import { Search, LogOut } from 'lucide-react';
import { auth } from '../../lib/firebase';

export const TopBar = () => {
    return (
        <header className="h-16 px-4 md:px-8 border-b border-[#1E293B] bg-[#0A0F1E]/95 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
            {/* Command Palette Mock */}
            <div className="flex-1 max-w-xl hidden sm:flex items-center">
                <div className="relative w-full group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-500 group-focus-within:text-[var(--color-green-volt)] transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-[#1E293B] rounded-lg leading-5 bg-[#0A0F1E] text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-green-volt)] focus:ring-1 focus:ring-[var(--color-green-volt)] sm:text-sm transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] font-inter"
                        placeholder="Search or jump to... (Cmd + K)"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-xs font-jetbrains px-1.5 py-0.5 rounded border border-[#1E293B] bg-[#0A0F1E]">⌘K</span>
                    </div>
                </div>
            </div>

            {/* Mobile Title (When search is hidden) */}
            <div className="sm:hidden flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[var(--color-green-volt)] flex items-center justify-center">
                    <span className="text-[#0A0F1E] font-bold text-xs font-space">Q</span>
                </div>
                <span className="font-bold text-white tracking-tight">Quickbill</span>
            </div>

            {/* User Area & Status */}
            <div className="flex items-center gap-4 md:gap-6 ml-auto">
                {/* System Status Indicator */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-green-volt)]/20 bg-[var(--color-green-volt)]/5 shadow-[0_0_10px_rgba(204,255,0,0.05)]">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-green-volt)] animate-pulse shadow-[0_0_8px_rgba(204,255,0,0.8)]" />
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-green-volt)] font-jetbrains font-bold">System Live</span>
                </div>

                <div className="h-6 w-px bg-[#1E293B] hidden md:block" />

                <button
                    onClick={() => auth.signOut()}
                    className="flex items-center gap-2 text-gray-400 hover:text-[var(--color-rose)] transition-colors btn-haptic group"
                    title="Sign Out"
                >
                    <LogOut className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                    <span className="text-xs font-medium uppercase tracking-wider hidden lg:block">Disconnect</span>
                </button>
            </div>
        </header>
    );
};
