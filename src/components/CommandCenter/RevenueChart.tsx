import { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import gsap from 'gsap';

interface Props {
    data: { name: string; total: number }[];
}

export const RevenueChart: React.FC<Props> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    useEffect(() => {
        // Crystallizing animation
        const ctx = gsap.context(() => {
            gsap.fromTo(containerRef.current,
                { filter: 'blur(10px)', opacity: 0 },
                { filter: 'blur(0px)', opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.5 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-3 rounded-lg shadow-lg">
                    <p className="text-sm font-semibold text-gray-700">{label}</p>
                    <p className="text-[#2D5BFF] font-['JetBrains_Mono'] font-bold">
                        ₹{payload[0].value.toLocaleString('en-IN')}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E2E8F0] shadow-[inset_0_0_20px_rgba(226,232,240,0.2)] h-[400px] w-full" ref={containerRef}>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend (6 Months)</h3>
            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2D5BFF" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#2D5BFF" stopOpacity={0.3} />
                            </linearGradient>
                            <linearGradient id="colorRevenueHover" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00D1FF" stopOpacity={1} />
                                <stop offset="95%" stopColor="#2D5BFF" stopOpacity={0.6} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'JetBrains Mono' }}
                            tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F0F4F8' }} />
                        <Bar
                            dataKey="total"
                            radius={[4, 4, 0, 0]}
                            onMouseEnter={(_, index) => setActiveIdx(index)}
                            onMouseLeave={() => setActiveIdx(null)}
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={activeIdx === index ? "url(#colorRevenueHover)" : "url(#colorRevenue)"}
                                    className="transition-all duration-300"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
