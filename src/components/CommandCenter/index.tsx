import { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SummaryCards } from './SummaryCards';
import { RevenueChart } from './RevenueChart';
import { ProductPieChart } from './ProductPieChart';
import { RecentActivity } from './RecentActivity';
import gsap from 'gsap';
import type { DashboardData } from './types';

export const CommandCenter = () => {
    const { user, loading: authLoading } = useAuth();
    const [dataLoading, setDataLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                // Fetch parties (Active Nodes)
                const partiesRef = collection(db, `users/${user.uid}/parties`);
                const partiesSnapshot = await getDocs(partiesRef);
                const activeNodes = partiesSnapshot.size;

                // Fetch invoices
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
                    if (invoice.type !== 'Tax Invoice') return; // Explicitly ignore Quotations and Proforma Invoices

                    const date = invoice.date ? new Date(invoice.date) : new Date();

                    let subtotal = 0;
                    invoice.items?.forEach((item: any) => {
                        const itemTotal = item.quantity * item.rate;
                        const itemGst = itemTotal * ((item.gst || 0) / 100);
                        subtotal += itemTotal + itemGst;

                        // Product Performance tracking
                        const itemName = item.name || 'Unknown Item';
                        productCounts[itemName] = (productCounts[itemName] || 0) + (Number(item.quantity) || 0);
                    });

                    let freightGst = 0;
                    if (invoice.freightCharges) {
                        // 18% tax on freight
                        freightGst = Number(invoice.freightCharges) * 0.18;
                    }

                    const invoiceTotal = subtotal + Number(invoice.freightCharges || 0) + freightGst;
                    totalSales += invoiceTotal;

                    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                        monthlySales += invoiceTotal;
                    }

                    // Revenue Trend (last 6 months)
                    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
                    revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + invoiceTotal;

                    recentInvoices.push({ id: doc.id, ...invoice, total: invoiceTotal, date });
                });

                recentInvoices.sort((a, b) => b.date.getTime() - a.date.getTime());

                // Fetch payments
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

                // Process revenue data for chart
                const revenueData = [];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
                    revenueData.push({
                        name: d.toLocaleString('default', { month: 'short' }),
                        total: revenueByMonth[monthKey] || 0
                    });
                }

                // Process top products
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
                gsap.fromTo('.dashboard-card',
                    { opacity: 0, scale: 0.95, y: 20 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
                );
            }, containerRef);
            return () => ctx.revert();
        }
    }, [dataLoading, data]);

    if (authLoading || dataLoading) {
        return (
            <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center p-6">
                <div className="w-64 relative mx-auto h-1 bg-[#E2E8F0] overflow-hidden rounded">
                    <div className="absolute top-0 left-0 h-full bg-[#2D5BFF] animate-[scanning_2s_ease-in-out_infinite]" style={{ width: '30%' }}></div>
                </div>
                <p className="text-[#2D5BFF] font-['Inter'] mt-4 font-medium tracking-wide">Synchronizing Financial Core...</p>
                <style>{`
          @keyframes scanning {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(350%); }
          }
        `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F4F8] p-4 md:p-8 font-['Inter']" ref={containerRef}>
            <div className="max-w-7xl mx-auto space-y-6">

                <header className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Command Center</h1>
                        <p className="text-gray-500 mt-1">Real-time Financial Telemetry</p>
                    </div>
                    <button
                        onClick={() => auth.signOut()}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2D5BFF] bg-white border border-[#E2E8F0] rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </header>

                {data && (
                    <>
                        <SummaryCards data={data} />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 dashboard-card">
                                <RevenueChart data={data.revenueData} />
                            </div>
                            <div className="dashboard-card">
                                <ProductPieChart data={data.topProducts} />
                            </div>
                        </div>
                        <div className="dashboard-card pt-2">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 ml-1">Recent Activity</h2>
                            <RecentActivity data={data.recentActivity} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
