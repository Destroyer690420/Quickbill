import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import type { DashboardData } from './types';

interface Props {
    data: DashboardData;
}

const mockTrend = [
    { value: 40 }, { value: 30 }, { value: 60 }, { value: 45 }, { value: 80 }, { value: 65 }, { value: 100 }
];

export const GlobalPulse = ({ data }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const counters = gsap.utils.toArray('.pulse-counter');

            counters.forEach((counter: any) => {
                const target = parseFloat(counter.getAttribute('data-value') || '0');
                const isCurrency = counter.hasAttribute('data-currency');

                gsap.to(counter, {
                    innerHTML: target,
                    duration: 1.5,
                    ease: "power2.out",
                    snap: { innerHTML: 1 },
                    onUpdate() {
                        if (isCurrency) {
                            counter.innerHTML = new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0,
                            }).format(Math.floor(Number(counter.innerHTML)));
                        }
                    }
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, [data]);

    const MetricCard = ({ title, value, isCurrency = true, trend }: { title: string, value: number, isCurrency?: boolean, trend?: any[] }) => (
        <div className="bg-[#0A0F1E] border border-[#1E293B] p-5 rounded-lg relative overflow-hidden group">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 font-inter">{title}</h3>

            <div className="flex justify-between items-end relative z-10">
                <div
                    className="text-3xl font-medium text-white font-jetbrains pulse-counter"
                    data-value={value}
                    data-currency={isCurrency ? "true" : undefined}
                >
                    {isCurrency ? '₹0' : '0'}
                </div>
            </div>

            {/* Sparkline */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-500">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend || mockTrend}>
                        <defs>
                            <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-green-volt)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-green-volt)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="var(--color-green-volt)" fillOpacity={1} fill="url(#colorPulse)" strokeWidth={1.5} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full" ref={containerRef}>
            <MetricCard title="Total Revenue" value={data.monthlySales} trend={mockTrend.map(v => ({ value: v.value * 1.5 }))} />
            <MetricCard title="Outstanding Debt" value={data.totalReceivables} trend={mockTrend.map(v => ({ value: v.value * 0.8 }))} />
            {/* Mocking GST and Burn Rate for tactical aesthetic completeness against current data set */}
            <MetricCard title="GST Liability" value={data.monthlySales * 0.18} trend={mockTrend.map(v => ({ value: v.value * 1.2 }))} />
            <MetricCard title="Active Network" value={data.activeNodes} isCurrency={false} trend={mockTrend} />
        </div>
    );
};
