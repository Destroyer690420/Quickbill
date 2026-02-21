import { useState, useEffect } from 'react';

export interface InvoiceItem {
    id: string;
    name: string;
    description: string;
    hsn: string;
    quantity: number;
    rate: number;
    amount: number;
    gst: number;
    gstAmount: number;
    total: number;
}

export interface InvoiceState {
    invoiceNumber: string;
    date: Date;
    dueDate: Date;
    placeOfSupply: string;
    partyId: string;
    partyName: string;
    items: InvoiceItem[];
    freightCharges: number;
    discountDetails: { type: 'percentage' | 'fixed', value: number };
    totalAmount: number;
    totalGst: number;
    grandTotal: number;
    isIGST: boolean;
}

const DEFAULT_STATE: InvoiceState = {
    invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`, // Auto mock
    date: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 15)), // +15 days default
    placeOfSupply: 'Delhi', // Default state for demo POS check
    partyId: '',
    partyName: '',
    items: [],
    freightCharges: 0,
    discountDetails: { type: 'fixed', value: 0 },
    totalAmount: 0,
    totalGst: 0,
    grandTotal: 0,
    isIGST: false,
};

export const useInvoice = (initialConfig?: Partial<InvoiceState>) => {
    const [invoice, setInvoice] = useState<InvoiceState>({ ...DEFAULT_STATE, ...initialConfig });

    // Core Calculation Engine - Returns Zero-Latency State
    useEffect(() => {
        const isIGST = invoice.placeOfSupply.toLowerCase() !== 'delhi'; // Mock home state check

        let subToT = 0;
        let totalGst = 0;

        const calculatedItems = invoice.items.map(item => {
            const amount = item.quantity * item.rate;
            const itemGst = amount * (item.gst / 100);
            subToT += amount;
            totalGst += itemGst;

            return {
                ...item,
                amount,
                gstAmount: itemGst,
                total: amount + itemGst
            };
        });

        const freightGstAmount = (invoice.freightCharges || 0) * 0.18; // Default 18% on Freight
        totalGst += freightGstAmount;
        subToT += (invoice.freightCharges || 0);

        // Apply Global Discounts
        let discountVal = invoice.discountDetails.value || 0;
        if (invoice.discountDetails.type === 'percentage') {
            discountVal = subToT * (discountVal / 100);
        }

        const effectiveSubToT = Math.max(0, subToT - discountVal);
        const grandTotal = effectiveSubToT + totalGst;

        // Prevent infinite loop by deep comparing essentials if we were to auto-set
        // Since this is a demo, direct manipulation of specific setter functions is cleaner.
        // We defer updates to explicitly triggered actions rather than effect loops for form interactions.

    }, [invoice.items, invoice.freightCharges, invoice.discountDetails, invoice.placeOfSupply]);

    // Explicit Calculation Re-Trigger for Forms via useActionState mappings
    const calculateTotals = (currentState: InvoiceState): InvoiceState => {
        const isIGST = currentState.placeOfSupply.toLowerCase() !== 'delhi';

        let subToT = 0;
        let totalGst = 0;

        const calculatedItems = currentState.items.map(item => {
            const amount = item.quantity * item.rate;
            const itemGst = amount * (item.gst / 100);
            subToT += amount;
            totalGst += itemGst;

            return {
                ...item,
                amount,
                gstAmount: itemGst,
                total: amount + itemGst
            };
        });

        const freightGstAmount = (currentState.freightCharges || 0) * 0.18;
        totalGst += freightGstAmount;
        const subPlusFreight = subToT + (currentState.freightCharges || 0);

        let discountVal = currentState.discountDetails.value || 0;
        if (currentState.discountDetails.type === 'percentage') {
            discountVal = subToT * (discountVal / 100);
        }

        const effectiveSubToT = Math.max(0, subPlusFreight - discountVal);
        const grandTotal = effectiveSubToT + totalGst;

        return {
            ...currentState,
            isIGST,
            items: calculatedItems,
            totalAmount: effectiveSubToT,
            totalGst,
            grandTotal
        };
    };

    const updateField = (field: keyof InvoiceState, value: any) => {
        setInvoice(prev => {
            const next = { ...prev, [field]: value };
            return calculateTotals(next);
        });
    };

    const addItem = (item: Partial<InvoiceItem>) => {
        setInvoice(prev => {
            const newItem = {
                id: crypto.randomUUID(),
                name: item.name || '',
                description: item.description || '',
                hsn: item.hsn || '',
                quantity: item.quantity || 1,
                rate: item.rate || 0,
                gst: item.gst || 18,
                amount: 0,
                gstAmount: 0,
                total: 0
            };
            const next = { ...prev, items: [...prev.items, newItem] };
            return calculateTotals(next);
        });
    };

    const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
        setInvoice(prev => {
            const items = prev.items.map(i => i.id === id ? { ...i, ...updates } : i);
            const next = { ...prev, items };
            return calculateTotals(next);
        });
    };

    const removeItem = (id: string) => {
        setInvoice(prev => {
            const items = prev.items.filter(i => i.id !== id);
            const next = { ...prev, items };
            return calculateTotals(next);
        });
    }

    return {
        invoice,
        updateField,
        addItem,
        updateItem,
        removeItem
    };
};
