import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Props {
    data: { name: string; value: number }[];
}

export const TopProductsList: React.FC<Props> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.product-bar-fill',
                { width: '0%' },
                { width: (_, el) => el.getAttribute('data-width'), duration: 1.5, ease: 'expo.out', stagger: 0.1, delay: 0.4 }
            );
            gsap.fromTo('.product-item',
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1, delay: 0.2 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [data]);

    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

    return (
        <div className="flex flex-col h-full" ref={containerRef}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-slate)] font-outfit tracking-tight">Top Products</h3>
                <span className="text-xs font-medium bg-gray-50 text-gray-500 px-2 py-1 rounded-full border border-gray-100">By Volume</span>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6">
                {data.length === 0 ? (
                    <div className="text-sm text-gray-400 font-inter text-center py-8">No product data available</div>
                ) : (
                    data.map((item, index) => {
                        const widthPct = `${(item.value / maxValue) * 100}%`;
                        return (
                            <div key={index} className="product-item group">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-medium text-[var(--color-slate)] font-inter truncate pr-4 group-hover:text-[var(--color-soft-sky)] transition-colors">{item.name}</span>
                                    <span className="text-sm font-semibold text-[var(--color-slate)] font-outfit">{item.value.toLocaleString()} <span className="text-gray-400 text-xs font-normal">units</span></span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="product-bar-fill h-full rounded-full bg-gradient-to-r from-[var(--color-soft-sky)] to-blue-400 relative"
                                        data-width={widthPct}
                                    >
                                        <div className="absolute inset-0 bg-white/20 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
