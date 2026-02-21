import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { MoreHorizontal, Filter, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

interface InvoiceData {
    id: string;
    partyName: string;
    invoiceNumber: string;
    date: Date;
    total: number;
    // Mock status logic for UI
    status?: 'Paid' | 'Pending' | 'Overdue';
}

interface Props {
    data: InvoiceData[];
}

export const LedgerStream = ({ data }: Props) => {
    const tableRef = useRef<HTMLTableElement>(null);
    const [filter, setFilter] = useState<'All' | 'Unpaid > ₹10k'>('All');

    // Generating mock status based on amount strictly for demonstration of UI logic
    const processData = (raw: InvoiceData[]) => {
        return raw.map(inv => {
            let status: 'Paid' | 'Pending' | 'Overdue' = 'Pending';
            if (inv.total < 10000) status = 'Paid';
            else if (inv.total > 50000) status = 'Overdue';

            return { ...inv, status };
        });
    };

    const displayData = processData(data).filter(inv => {
        if (filter === 'Unpaid > ₹10k') {
            return inv.status !== 'Paid' && inv.total > 10000;
        }
        return true;
    });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.ledger-row',
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }
            );
        }, tableRef);
        return () => ctx.revert();
    }, [filter, displayData.length]);

    const StatusBadge = ({ status }: { status: 'Paid' | 'Pending' | 'Overdue' }) => {
        const config = {
            Paid: { icon: CheckCircle2, color: 'text-[var(--color-green-volt)]', bg: 'bg-[var(--color-green-volt)]/10', glow: 'shadow-[0_0_10px_rgba(204,255,0,0.2)]' },
            Pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', glow: 'shadow-[0_0_10px_rgba(251,191,36,0.2)]' },
            Overdue: { icon: AlertCircle, color: 'text-[var(--color-rose)]', bg: 'bg-[var(--color-rose)]/10', glow: 'shadow-[0_0_10px_rgba(244,63,94,0.2)]' },
        }[status];

        const Icon = config.icon;

        return (
            <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/5", config.bg, config.glow)}>
                <Icon className={cn("w-3.5 h-3.5", config.color)} />
                <span className={cn("text-xs font-medium tracking-wide", config.color)}>{status}</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Header & Controls */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-white font-outfit">Ledger Stream</h2>
                    <p className="text-xs text-gray-500 font-inter mt-1">Real-time transaction array</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setFilter(f => f === 'All' ? 'Unpaid > ₹10k' : 'All')}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 text-xs font-jetbrains rounded border btn-haptic transition-all",
                            filter !== 'All'
                                ? "bg-[var(--color-green-volt)]/10 border-[var(--color-green-volt)]/30 text-[var(--color-green-volt)]"
                                : "bg-[#1E293B] border-[#334155] text-gray-400 hover:text-white"
                        )}
                    >
                        <Filter className="w-3.5 h-3.5" />
                        {filter === 'All' ? 'Quick Filter' : 'Clear Filter'}
                    </button>
                </div>
            </div>

            {/* Data Grid */}
            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse" ref={tableRef}>
                    <thead>
                        <tr className="border-b border-[#1E293B]">
                            <th className="pb-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest font-inter whitespace-nowrap">Entity</th>
                            <th className="pb-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest font-inter whitespace-nowrap">Reference</th>
                            <th className="pb-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest font-inter whitespace-nowrap text-right">Amount</th>
                            <th className="pb-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest font-inter whitespace-nowrap text-center">Status</th>
                            <th className="pb-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest font-inter whitespace-nowrap text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E293B]/50">
                        {displayData.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-sm text-gray-500 font-inter">No transactions match current filters.</td>
                            </tr>
                        ) : (
                            displayData.map((invoice) => (
                                <tr key={invoice.id} className="ledger-row group hover:bg-[#1E293B]/30 transition-colors">
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white group-hover:text-[var(--color-green-volt)] transition-colors">{invoice.partyName || 'Unknown Entity'}</span>
                                            <span className="text-xs text-gray-500 font-inter">{new Date(invoice.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <span className="text-xs font-jetbrains px-2 py-1 rounded bg-[#1E293B] text-gray-300 border border-[#334155]">
                                            {invoice.invoiceNumber || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-right">
                                        <span className="text-sm font-jetbrains font-medium text-white tracking-tight">
                                            ₹{invoice.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-center">
                                        <StatusBadge status={invoice.status!} />
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-right">
                                        <button className="p-1.5 rounded text-gray-500 hover:text-white hover:bg-[#334155] transition-all opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
