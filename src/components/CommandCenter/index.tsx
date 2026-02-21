import { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from './Layout';
import { GlobalPulse } from './GlobalPulse';
import { RevenueChart } from './RevenueChart';
import { TopProductsList } from './TopProductsList';
import { LedgerStream } from './LedgerStream';
import { OmniEditor } from './OmniEditor';
import gsap from 'gsap';
import type { DashboardData } from './types';

export const CommandCenter = () => {
    const { user, loading: authLoading } = useAuth();
    const [dataLoading, setDataLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);
    const [activeTab, setActiveTab] = useState<'analytics' | 'editor'>('analytics');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            // ... data fetching logic unchanged (copying exact logic from previous block to avoid modifying math context)
            try {
                const partiesRef = collection(db, `users/${user.uid}/parties`);
                const partiesSnapshot = await getDocs(partiesRef);
                const activeNodes = partiesSnapshot.size;

                const invoicesRef = collection(db, `users/${user.uid}/invoices`);
                const invoicesSnapshot = await getDocs(invoicesRef);
                let totalSales = 0;
                let monthlySales = 0;
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                const recentInvoices: any[] = [];
                const productCounts: Record<string, number> = {};
                const revenueByMonth: Record<string, number> = {};

                invoicesSnapshot.docs.forEach(doc => {
                    const invoice = doc.data();
                    if (invoice.type !== 'Tax Invoice') return;

                    const date = invoice.date ? new Date(invoice.date) : new Date();

                    let subtotal = 0;
                    invoice.items?.forEach((item: any) => {
                        const itemTotal = item.quantity * item.rate;
                        const itemGst = itemTotal * ((item.gst || 0) / 100);
                        subtotal += itemTotal + itemGst;

                        const itemName = item.name || 'Unknown Item';
                        productCounts[itemName] = (productCounts[itemName] || 0) + (Number(item.quantity) || 0);
                    });

                    let freightGst = 0;
                    if (invoice.freightCharges) {
                        freightGst = Number(invoice.freightCharges) * 0.18;
                    }

                    const invoiceTotal = subtotal + Number(invoice.freightCharges || 0) + freightGst;
                    totalSales += invoiceTotal;

                    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                        monthlySales += invoiceTotal;
                    }

                    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
                    revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + invoiceTotal;

                    recentInvoices.push({ id: doc.id, ...invoice, total: invoiceTotal, date });
                });

                recentInvoices.sort((a, b) => b.date.getTime() - a.date.getTime());

                const paymentsRef = collection(db, `users/${user.uid}/payments`);
                const paymentsSnapshot = await getDocs(paymentsRef);
                let totalPayments = 0;
                let monthlyCollections = 0;

                paymentsSnapshot.docs.forEach(doc => {
                    const payment = doc.data();
                    const amount = Number(payment.amount || 0);
                    totalPayments += amount;

                    const date = payment.date ? new Date(payment.date) : new Date();
                    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                        monthlyCollections += amount;
                    }
                });

                const totalReceivables = totalSales - totalPayments;

                const revenueData = [];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
                    revenueData.push({
                        name: d.toLocaleString('default', { month: 'short' }),
                        total: revenueByMonth[monthKey] || 0
                    });
                }

                const topProducts = Object.entries(productCounts)
                    .map(([name, value]) => ({ name, value }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 5);

                setData({
                    totalReceivables,
                    monthlySales,
                    monthlyCollections,
                    activeNodes,
                    revenueData,
                    topProducts,
                    recentActivity: recentInvoices.slice(0, 5)
                });

                setDataLoading(false);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setDataLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Handle GSAP animation after data loads
    useEffect(() => {
        if (!dataLoading && data) {
            const ctx = gsap.context(() => {
                const cards = gsap.utils.toArray('.dashboard-card');
                gsap.fromTo(cards,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
                );
            }, containerRef);
            return () => ctx.revert();
        }
    }, [dataLoading, data]);

    if (authLoading || dataLoading) {
        return (
            <DashboardLayout>
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <div className="relative">
                        <Loader2 className="w-10 h-10 text-[var(--color-green-volt)] animate-spin" />
                        <div className="absolute inset-0 border-t-2 border-[var(--color-green-volt)] rounded-full animate-spin direction-reverse" style={{ animationDuration: '3s' }} />
                    </div>
                    <p className="mt-8 text-sm font-jetbrains text-gray-400 tracking-widest uppercase animate-pulse">Initializing Telemetry...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="relative" ref={containerRef}>
                {data && (
                    <div className="flex flex-col gap-6 w-full">
                        {/* Tab Switcher */}
                        <div className="flex items-center gap-2 mb-2">
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`px-4 py-1.5 text-xs font-jetbrains rounded uppercase tracking-widest transition-colors ${activeTab === 'analytics' ? 'bg-[#1E293B] text-white border border-[#334155]' : 'text-gray-500 hover:text-white'}`}
                            >
                                Analytics Pulse
                            </button>
                            <button
                                onClick={() => setActiveTab('editor')}
                                className={`px-4 py-1.5 text-xs font-jetbrains rounded uppercase tracking-widest transition-colors ${activeTab === 'editor' ? 'bg-[var(--color-green-volt)]/10 text-[var(--color-green-volt)] border border-[var(--color-green-volt)]/30' : 'text-gray-500 hover:text-white'}`}
                            >
                                Omni-Editor Framework
                            </button>
                        </div>

                        {activeTab === 'analytics' ? (
                            <>
                                <div className="w-full">
                                    <GlobalPulse data={data} />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-[#0A0F1E] border border-[#1E293B] p-6 rounded-lg dashboard-card relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-green-volt)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                            <RevenueChart data={data.revenueData} />
                                        </div>
                                        <div className="bg-[#0A0F1E] border border-[#1E293B] p-6 rounded-lg dashboard-card relative overflow-hidden group">
                                            <TopProductsList data={data.topProducts} />
                                        </div>
                                    </div>

                                    <div className="bg-[#0A0F1E] border border-[#1E293B] p-6 rounded-lg dashboard-card flex flex-col h-full min-h-[400px] relative group shadow-none">
                                        <LedgerStream data={data.recentActivity} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="dashboard-card w-full">
                                {/* Mount OmniEditor inline taking up the full real-estate */}
                                <OmniEditor />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
