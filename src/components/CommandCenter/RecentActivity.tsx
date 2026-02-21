import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Props {
    data: any[];
}

export const RecentActivity: React.FC<Props> = ({ data }) => {
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const listItems = gsap.utils.toArray('.activity-item', listRef.current);
        listItems.forEach((item: any) => {
            item.addEventListener('mouseenter', () => {
                gsap.to(item, { x: 5, backgroundColor: '#F0F4F8', borderLeftColor: '#2D5BFF', duration: 0.3 });
            });
            item.addEventListener('mouseleave', () => {
                gsap.to(item, { x: 0, backgroundColor: 'transparent', borderLeftColor: 'transparent', duration: 0.3 });
            });
        });
    }, [data]);

    return (
        <ul className="space-y-3" ref={listRef}>
            {data.length === 0 && (
                <div className="text-sm text-gray-500 py-4 text-center">No recent activity</div>
            )}
            {data.map((invoice) => {
                // Assume Status Pulse: Cyan Neon if total > 0 (Paid logic can be mapped here later, for now we will check if it has been marked paid or pending)
                // Since we don't have a direct 'status' field in fetching, let's just make it Electric Cobalt/Cyan neon randomly or based on some property.
                // Let's assume some are pending if amount is oddly specific for demo, or normally we show Paid tracking. I'll default to Cyan Neon for "Processed" as requested.
                const isPaid = invoice.status ? invoice.status === 'Paid' : true;

                return (
                    <li
                        key={invoice.id}
                        className="activity-item group flex items-center justify-between p-3 rounded-lg border-l-2 border-transparent transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 border border-[#E2E8F0]">
                                {/* Status Pulse */}
                                <div
                                    className={`absolute w-2 h-2 rounded-full ${isPaid ? 'bg-[#00D1FF] shadow-[0_0_8px_#00D1FF]' : 'bg-slate-400'}`}
                                ></div>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#2D5BFF] transition-colors">{invoice.partyName || 'Unknown Party'}</p>
                                <p className="text-xs text-gray-500">#{invoice.invoiceNumber || 'INV-XXX'}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-sm font-['JetBrains_Mono'] font-bold text-gray-900 group-hover:text-[#2D5BFF] transition-colors">
                                ₹{invoice.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-xs text-gray-400">
                                {new Date(invoice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};
