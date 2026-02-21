import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

interface Props {
    data: any[];
}

export const RecentActivity: React.FC<Props> = ({ data }) => {
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.pulse-pill',
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.5 }
            );
        }, listRef);
        return () => ctx.revert();
    }, [data]);

    return (
        <ul className="space-y-3" ref={listRef}>
            {data.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <ArrowUpRight className="w-5 h-5 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-[var(--color-slate)] font-inter">No recent pulses detected</p>
                    <p className="text-xs text-gray-400 font-inter mt-1">Awaiting financial telemetry</p>
                </div>
            )}

            {data.map((invoice, index) => {
                // Determine Status based on amount/type logic (Simple representation for 'Paid' / 'Pending')
                // Real implementation would rely on an actual 'status' field from Firebase docs
                const isPaid = index % 3 !== 0; // Mock logic: 2/3 are "Paid", 1/3 is "Pending" for UI visualization

                return (
                    <li
                        key={invoice.id}
                        className="pulse-pill group flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/50 transition-all duration-300 cursor-pointer shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] hover:shadow-soft"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[var(--color-slate)] font-outfit font-semibold relative overflow-hidden group-hover:border-blue-100 transition-colors">
                                {/* Letter Avatar */}
                                <span className="relative z-10">{invoice.partyName ? invoice.partyName.charAt(0).toUpperCase() : 'U'}</span>
                                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="flex flex-col">
                                <p className="text-sm font-semibold text-[var(--color-slate)] font-inter group-hover:text-[var(--color-soft-sky)] transition-colors truncate max-w-[150px] sm:max-w-[200px]">
                                    {invoice.partyName || 'Unknown Entity'}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs font-medium text-gray-400 font-outfit">#{invoice.invoiceNumber || 'INV-XXX'}</span>
                                    {/* Soft Status Tag */}
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                                        {isPaid ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right flex flex-col items-end">
                            <p className="text-sm font-semibold text-[var(--color-slate)] font-outfit tracking-tight group-hover:text-[var(--color-soft-sky)] transition-colors">
                                ₹{invoice.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-xs text-gray-400 font-inter mt-0.5">
                                {new Date(invoice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};
