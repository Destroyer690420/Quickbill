import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
    data: { name: string; value: number }[];
}

const COLORS = ['#2D5BFF', '#00D1FF', '#1E3A8A', '#3B82F6', '#93C5FD'];

export const ProductPieChart: React.FC<Props> = ({ data }) => {
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-3 rounded-lg shadow-lg">
                    <p className="text-sm font-semibold text-gray-700">{payload[0].name}</p>
                    <p className="text-[#2D5BFF] font-['JetBrains_Mono'] font-bold">
                        Qty: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E2E8F0] shadow-[inset_0_0_20px_rgba(226,232,240,0.2)] h-[400px] w-full flex flex-col items-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2 self-start">Product Trajectory</h3>
            <p className="text-xs text-gray-500 mb-4 self-start">Top 5 by Quantity</p>

            {data.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-sm text-gray-400">No data available</div>
            ) : (
                <div className="w-full h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip content={<CustomTooltip />} />
                            <Pie
                                data={data}
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                onMouseEnter={(_, index) => setActiveIdx(index)}
                                onMouseLeave={() => setActiveIdx(null)}
                                stroke="none"
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        className="transition-all duration-300 outline-none"
                                        style={{
                                            transform: activeIdx === index ? 'scale(1.05)' : 'scale(1)',
                                            transformOrigin: 'center',
                                            filter: activeIdx === index ? 'drop-shadow(0px 0px 8px rgba(45,91,255,0.6))' : 'none'
                                        }}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="w-full mt-auto space-y-2">
                {data.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                            <span className="text-gray-700 truncate max-w-[120px]">{item.name}</span>
                        </div>
                        <span className="font-['JetBrains_Mono'] font-medium">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
