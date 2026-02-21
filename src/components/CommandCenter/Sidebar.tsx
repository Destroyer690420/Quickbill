import { FileText, LayoutDashboard, Settings, Receipt, Users } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
    currentPath: string;
    onNavigate: (path: string) => void;
}

export const Sidebar = ({ currentPath, onNavigate }: SidebarProps) => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Pulse', path: 'dashboard' },
        { icon: FileText, label: 'Invoices', path: 'invoices' },
        { icon: Receipt, label: 'Quotations', path: 'quotations' },
        { icon: Users, label: 'Parties', path: 'parties' },
    ];

    return (
        <aside className="fixed bottom-0 left-0 w-full md:w-20 lg:w-64 md:h-screen bg-[#0A0F1E] border-t md:border-t-0 md:border-r border-[#1E293B] z-50 flex md:flex-col transition-all duration-300">
            {/* Logo Area (Hidden on Mobile) */}
            <div className="hidden md:flex items-center justify-center lg:justify-start lg:px-6 h-16 border-b border-[#1E293B] w-full">
                <div className="w-8 h-8 rounded bg-[var(--color-green-volt)] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#0A0F1E] font-bold text-lg font-space">Q</span>
                </div>
                <span className="hidden lg:block ml-3 font-bold text-white tracking-tight">Quickbill</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex md:flex-col items-center md:items-stretch justify-around md:justify-start p-2 md:p-4 gap-1 md:gap-2 w-full overflow-x-auto md:overflow-visible">
                {navItems.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => onNavigate(item.path)}
                            className={cn(
                                "flex flex-col md:flex-row items-center lg:justify-start justify-center gap-1 md:gap-3 p-2 md:p-3 rounded-lg transition-all duration-200 group btn-haptic relative overflow-hidden",
                                isActive
                                    ? "text-[var(--color-green-volt)] bg-[#1E293B]/50"
                                    : "text-gray-400 hover:text-white hover:bg-[#1E293B]/30"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--color-green-volt)] rounded-r hidden md:block" />
                            )}
                            <item.icon className={cn("w-5 h-5 md:w-5 md:h-5 transition-transform group-hover:scale-110", isActive && "drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]")} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] md:text-sm font-medium hidden lg:block tracking-wide">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Settings / Bottom Area */}
            <div className="hidden md:flex p-4 border-t border-[#1E293B]">
                <button
                    onClick={() => onNavigate('settings')}
                    className={cn(
                        "flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg transition-all duration-200 group btn-haptic w-full",
                        currentPath === 'settings'
                            ? "text-[var(--color-green-volt)] bg-[#1E293B]/50"
                            : "text-gray-400 hover:text-white hover:bg-[#1E293B]/30"
                    )}
                >
                    <Settings className="w-5 h-5 transition-transform group-hover:rotate-90" />
                    <span className="hidden lg:block text-sm font-medium tracking-wide">Settings</span>
                </button>
            </div>
        </aside>
    );
};
