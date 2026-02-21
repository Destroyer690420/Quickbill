import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [currentPath, setCurrentPath] = useState('dashboard');

    return (
        <div className="flex h-screen w-full bg-[#0A0F1E] text-white overflow-hidden">
            {/* Sidebar matches 'Midnight Indigo' (#0A0F1E) */}
            <Sidebar currentPath={currentPath} onNavigate={setCurrentPath} />

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col md:ml-20 lg:ml-64 relative w-full transition-all duration-300">
                <TopBar />

                {/* Content Area - Momentum Scroll */}
                <main className="flex-1 overflow-y-auto tactical-scroll p-4 md:p-8 pb-24 md:pb-8">
                    <div className="max-w-[1600px] mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
