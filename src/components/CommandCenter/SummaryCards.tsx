import { useEffect, useRef } from 'react';
import gsap from 'gsap';
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
                    duration: 2,
                    ease: "power2.out",
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
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerHTML: 1 }
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [data]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" ref={containerRef}>

            <Card title="Total Receivables">
                <div className="text-3xl font-medium text-[#2D5BFF] font-['JetBrains_Mono'] mt-2 currency-counter" data-value={data.totalReceivables}>
                    ₹0
                </div>
            </Card>

            <Card title="Monthly Sales">
                <div className="text-3xl font-medium text-gray-900 font-['JetBrains_Mono'] mt-2 currency-counter" data-value={data.monthlySales}>
                    ₹0
                </div>
            </Card>

            <Card title="Monthly Collections">
                <div className="text-3xl font-medium text-[#00D1FF] font-['JetBrains_Mono'] mt-2 currency-counter" data-value={data.monthlyCollections}>
                    ₹0
                </div>
            </Card>

            <Card title="Active Nodes">
                <div className="text-3xl font-medium text-gray-900 font-['JetBrains_Mono'] mt-2 number-counter" data-value={data.activeNodes}>
                    0
                </div>
            </Card>

        </div>
    );
};

const Card = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="dashboard-card bg-[#FFFFFF] p-6 rounded-xl border border-[#E2E8F0] shadow-[inset_0_0_20px_rgba(226,232,240,0.2)] hover:shadow-[inset_0_0_25px_rgba(45,91,255,0.05)] transition-shadow duration-300 relative overflow-hidden">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        {children}
    </div>
);
