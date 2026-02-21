import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import type { DashboardData } from './types';

interface Props {
    data: DashboardData;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);
};

export const SummaryCards: React.FC<Props> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const counters = gsap.utils.toArray('.currency-counter');
            counters.forEach((counter: any) => {
                const targetValue = parseFloat(counter.getAttribute('data-value') || '0');
                gsap.to(counter, {
                    innerHTML: targetValue,
                    duration: 1.5, // Faster counter
                    ease: "expo.out",
                    snap: { innerHTML: 1 },
                    onUpdate() {
                        counter.innerHTML = formatCurrency(Math.floor(Number(counter.innerHTML)));
                    }
                });
            });

            const numCounters = gsap.utils.toArray('.number-counter');
            numCounters.forEach((counter: any) => {
                const targetValue = parseFloat(counter.getAttribute('data-value') || '0');
                gsap.to(counter, {
                    innerHTML: targetValue,
                    duration: 1.5,
                    ease: "expo.out",
                    snap: { innerHTML: 1 }
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [data]);

    const collectionProgress = data.monthlySales > 0 ? Math.min((data.monthlyCollections / data.monthlySales) * 100, 100) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" ref={containerRef}>

            {/* Total Receivables (Primary Focus) */}
            <div className="dashboard-card bg-white p-6 md:p-8 rounded-[var(--radius-soft)] border border-gray-100 shadow-soft hover:shadow-lg transition-all duration-500 relative overflow-hidden group flex flex-col justify-between h-full cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-gray-500 font-inter">Total Receivables</h3>
                    <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-[var(--color-soft-sky)] transition-all group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <div className="text-4xl md:text-5xl font-outfit font-semibold text-[var(--color-slate)] currency-counter tracking-tight" data-value={data.totalReceivables}>
                    ₹0
                </div>
            </div>

            {/* Monthly Sales */}
            <div className="dashboard-card bg-white p-6 rounded-[var(--radius-soft)] border border-gray-100 shadow-soft hover:shadow-lg transition-shadow duration-500 relative overflow-hidden">
                <h3 className="text-sm font-medium text-gray-500 font-inter mb-2">Monthly Sales</h3>
                <div className="text-3xl font-outfit font-medium text-[var(--color-slate)] currency-counter" data-value={data.monthlySales}>
                    ₹0
                </div>
            </div>

            {/* Monthly Collections / Performance */}
            <div className="dashboard-card bg-white p-6 rounded-[var(--radius-soft)] border border-gray-100 shadow-soft hover:shadow-lg transition-shadow duration-500 relative overflow-hidden flex flex-col justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 font-inter mb-2">Monthly Collections</h3>
                    <div className="text-3xl font-outfit font-medium text-[var(--color-emerald)] currency-counter" data-value={data.monthlyCollections}>
                        ₹0
                    </div>
                </div>
                {/* Performance Progress Bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 font-inter mb-1.5">
                        <span>Collection Target</span>
                        <span>{Math.round(collectionProgress)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                            style={{ width: `${collectionProgress}%`, background: 'linear-gradient(90deg, var(--color-soft-sky), #60A5FA)' }}
                        />
                    </div>
                </div>
            </div>

            {/* Active Nodes */}
            <div className="dashboard-card bg-white p-6 rounded-[var(--radius-soft)] border border-gray-100 shadow-soft hover:shadow-lg transition-shadow duration-500 relative overflow-hidden flex flex-col justify-center items-center text-center">
                <h3 className="text-sm font-medium text-gray-500 font-inter mb-2">Active Entities</h3>
                <div className="text-4xl font-outfit font-semibold text-[var(--color-slate)] number-counter" data-value={data.activeNodes}>
                    0
                </div>
            </div>

        </div>
    );
};
