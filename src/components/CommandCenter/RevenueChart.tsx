import { useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import gsap from 'gsap';

interface Props {
    data: { name: string; total: number }[];
}

export const RevenueChart: React.FC<Props> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Soft fade animation
        const ctx = gsap.context(() => {
            gsap.fromTo(containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.3 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 backdrop-blur-md border border-gray-100 p-3 rounded-xl shadow-lg">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</p>
                    <p className="text-[var(--color-slate)] font-outfit text-lg font-semibold mt-1">
                        ₹{payload[0].value.toLocaleString('en-IN')}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full flex flex-col h-full" ref={containerRef}>
            <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-lg font-semibold text-[var(--color-slate)] font-outfit tracking-tight">Revenue Trend</h3>
                <span className="text-xs font-medium bg-gray-50 text-gray-500 px-2 py-1 rounded-full border border-gray-100">6 Months</span>
            </div>
            <div className="flex-1 w-full min-h-[250px] -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-soft-sky)" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="var(--color-soft-sky)" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            axisLine={{ stroke: '#f1f5f9', strokeWidth: 1 }}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
                            tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="var(--color-soft-sky)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            activeDot={{ r: 6, fill: "var(--color-chalk)", stroke: "var(--color-soft-sky)", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
