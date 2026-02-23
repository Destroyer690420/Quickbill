import { useInvoice } from '../../../hooks/useInvoice';
import { Plus, X, Tag, User, Receipt, Calculator, PlayCircle } from 'lucide-react';

export const OmniEditor = () => {
    const { invoice, updateField, addItem, updateItem, removeItem } = useInvoice();

    return (
        <div className="flex h-[calc(100vh-8rem)] w-full gap-6">
            {/* Left Pane: Configuration Engine */}
            <div className="w-[500px] flex-shrink-0 bg-[#0A0F1E] border border-[#1E293B] rounded-xl flex flex-col overflow-hidden shadow-2xl relative">
                {/* Editor Header */}
                <div className="p-4 border-b border-[#1E293B] bg-[#0F1626] flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[var(--color-green-volt)]/10 border border-[var(--color-green-volt)]/30 flex items-center justify-center">
                            <Receipt className="w-4 h-4 text-[var(--color-green-volt)]" />
                        </div>
                        <div>
                            <h2 className="text-white font-semibold font-outfit">Omni-Editor</h2>
                            <p className="text-[10px] text-gray-500 font-jetbrains uppercase tracking-widest mt-0.5">Draft Sequence Active</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-[var(--color-green-volt)] text-[#0A0F1E] text-sm font-bold font-jetbrains rounded hover:bg-white transition-colors btn-haptic flex items-center gap-2">
                        <PlayCircle className="w-4 h-4" /> Deploy
                    </button>
                </div>

                {/* Editor Form Core */}
                <div className="flex-1 overflow-y-auto tactical-scroll p-6 space-y-8">
                    {/* Identity Block */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[var(--color-green-volt)] mb-2">
                            <User className="w-4 h-4" />
                            <h3 className="text-sm font-jetbrains uppercase tracking-widest">Entity Target</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5 col-span-2">
                                <label className="text-xs text-gray-400 font-inter">Party Name</label>
                                <input
                                    type="text"
                                    value={invoice.partyName}
                                    onChange={(e) => updateField('partyName', e.target.value)}
                                    className="w-full bg-[#1E293B]/50 border border-[#334155] rounded px-3 py-2 text-white font-inter text-sm focus:border-[var(--color-green-volt)] focus:outline-none transition-colors"
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-gray-400 font-inter">Place of Supply</label>
                                <input
                                    type="text"
                                    value={invoice.placeOfSupply}
                                    onChange={(e) => updateField('placeOfSupply', e.target.value)}
                                    className="w-full bg-[#1E293B]/50 border border-[#334155] rounded px-3 py-2 text-white font-inter text-sm focus:border-[var(--color-green-volt)] focus:outline-none transition-colors"
                                    placeholder="State Name"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-gray-400 font-inter">Due Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-[#1E293B]/50 border border-[#334155] rounded px-3 py-2 text-white font-inter text-sm focus:border-[var(--color-green-volt)] focus:outline-none transition-colors [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Line Items Block */}
                    <div className="space-y-4 pt-4 border-t border-[#1E293B]">
                        <div className="flex items-center justify-between text-[var(--color-green-volt)] mb-2">
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                <h3 className="text-sm font-jetbrains uppercase tracking-widest">Line Items</h3>
                            </div>
                            <button
                                onClick={() => addItem({})}
                                className="text-[10px] font-jetbrains border border-[var(--color-green-volt)]/50 text-[var(--color-green-volt)] px-2 py-1 rounded hover:bg-[var(--color-green-volt)] hover:text-[#0A0F1E] transition-colors btn-haptic flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> ADD ITEM
                            </button>
                        </div>

                        {invoice.items.length === 0 ? (
                            <div className="text-center py-8 border border-dashed border-[#334155] rounded-lg">
                                <span className="text-xs text-gray-500 font-jetbrains">No active line items</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {invoice.items.map((item, _idx) => (
                                    <div key={item.id} className="p-3 bg-[#1E293B]/30 border border-[#334155] rounded-lg space-y-3 relative group">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-[#0A0F1E] border border-[#334155] rounded-full flex items-center justify-center text-gray-500 hover:text-[var(--color-rose)] hover:border-[var(--color-rose)] transition-colors btn-haptic opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-12">
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={e => updateItem(item.id, { description: e.target.value })}
                                                    placeholder="Item Description"
                                                    className="w-full bg-transparent border-b border-[#334155] px-1 py-1.5 text-white font-inter text-sm focus:border-[var(--color-green-volt)] focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <label className="text-[10px] text-gray-500 font-jetbrains uppercase">QTY</label>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={e => updateItem(item.id, { quantity: Number(e.target.value) })}
                                                    className="w-full bg-[#0A0F1E] border border-[#334155] rounded px-2 py-1.5 text-white font-jetbrains text-sm focus:border-[var(--color-green-volt)] focus:outline-none mt-1"
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <label className="text-[10px] text-gray-500 font-jetbrains uppercase">RATE</label>
                                                <input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={e => updateItem(item.id, { rate: Number(e.target.value) })}
                                                    className="w-full bg-[#0A0F1E] border border-[#334155] rounded px-2 py-1.5 text-white font-jetbrains text-sm focus:border-[var(--color-green-volt)] focus:outline-none mt-1"
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <label className="text-[10px] text-gray-500 font-jetbrains uppercase">HSN</label>
                                                <input
                                                    type="text"
                                                    value={item.hsn}
                                                    onChange={e => updateItem(item.id, { hsn: e.target.value })}
                                                    className="w-full bg-[#0A0F1E] border border-[#334155] rounded px-2 py-1.5 text-white font-jetbrains text-sm focus:border-[var(--color-green-volt)] focus:outline-none mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Math Engine Sticky Footer */}
                <div className="p-4 bg-[#0F1626] border-t border-[#1E293B] flex-shrink-0">
                    <div className="flex items-center gap-2 text-[var(--color-green-volt)] mb-3">
                        <Calculator className="w-4 h-4" />
                        <span className="text-xs font-jetbrains uppercase tracking-widest">Telemetry Engine</span>
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-inter">Subtotal</span>
                            <span className="text-white font-jetbrains">₹{invoice.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-inter">Calculated Tax ({invoice.isIGST ? 'IGST' : 'CGST/SGST'})</span>
                            <span className="text-white font-jetbrains">₹{invoice.totalGst.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-[#334155] flex justify-between items-end">
                        <span className="text-sm font-semibold text-white font-outfit uppercase tracking-wider">Grand Total</span>
                        <span className="text-3xl font-bold text-[var(--color-green-volt)] font-jetbrains tracking-tight">₹{invoice.grandTotal.toLocaleString()}</span>
                    </div>
                </div>

            </div>

            {/* Right Pane: 1:1 Live Preview Engine */}
            <div className="flex-1 bg-white rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col items-center justify-start p-8 overflow-y-auto aspect-[1/1.414] max-w-4xl mx-auto">
                {/* Standard Minimalist Invoice Preview Component (Mock PDF Look) */}
                <div className="w-full space-y-8 text-black font-inter">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-gray-200 pb-8">
                        <div>
                            <h1 className="text-4xl font-light tracking-tight text-gray-900">INVOICE</h1>
                            <p className="text-sm text-gray-500 mt-2 font-jetbrains">{invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-semibold text-lg text-gray-900">Quickbill Corp</h3>
                            <p className="text-sm text-gray-500">123 Financial District</p>
                            <p className="text-sm text-gray-500">New Delhi, India</p>
                        </div>
                    </div>

                    {/* Identities */}
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Billed To</p>
                            <h3 className="font-semibold text-lg text-gray-900">{invoice.partyName || '--------------------'}</h3>
                            <p className="text-sm text-gray-600">Place of Supply: {invoice.placeOfSupply || '--------------------'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Date Details</p>
                            <p className="text-sm text-gray-900"><span className="text-gray-500 w-20 inline-block">Issued:</span> {invoice.date.toLocaleDateString()}</p>
                            <p className="text-sm text-gray-900 mt-1"><span className="text-gray-500 w-20 inline-block">Due:</span> {invoice.dueDate.toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="pt-8 w-full">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-gray-900">
                                    <th className="py-3 text-xs font-semibold text-gray-900 uppercase">Description</th>
                                    <th className="py-3 text-xs font-semibold text-gray-900 uppercase text-center w-24">HSN</th>
                                    <th className="py-3 text-xs font-semibold text-gray-900 uppercase text-right w-24">Qty</th>
                                    <th className="py-3 text-xs font-semibold text-gray-900 uppercase text-right w-32">Rate</th>
                                    <th className="py-3 text-xs font-semibold text-gray-900 uppercase text-right w-40">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {invoice.items.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-sm text-gray-400">Add items from the engine room to preview...</td>
                                    </tr>
                                ) : (
                                    invoice.items.map((item, i) => (
                                        <tr key={i}>
                                            <td className="py-4 text-sm text-gray-900">{item.description || '-'}</td>
                                            <td className="py-4 text-sm text-gray-600 text-center font-jetbrains">{item.hsn || '-'}</td>
                                            <td className="py-4 text-sm text-gray-900 text-right">{item.quantity}</td>
                                            <td className="py-4 text-sm text-gray-900 text-right font-jetbrains">₹{item.rate.toLocaleString()}</td>
                                            <td className="py-4 text-sm text-gray-900 text-right font-jetbrains">₹{item.amount.toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Math Summary */}
                    <div className="pt-8 flex justify-end">
                        <div className="w-80 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-jetbrains">₹{invoice.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tax Type</span>
                                <span className="font-semibold text-xs tracking-wider uppercase">{invoice.isIGST ? 'IGST' : 'CGST & SGST'}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-gray-200 pb-3">
                                <span className="text-gray-500">Total Tax ({invoice.isIGST ? 'IGST 18%' : 'CGST 9% | SGST 9%'})</span>
                                <span className="font-jetbrains">₹{invoice.totalGst.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end pt-2">
                                <span className="font-semibold text-gray-900 text-lg">Grand Total</span>
                                <span className="text-2xl font-bold text-gray-900 font-jetbrains">₹{invoice.grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Stamp */}
                    <div className="pt-24 text-center">
                        <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Generated Internally</p>
                        <p className="text-[10px] text-gray-300 font-jetbrains">QUICKBILL OMNI-EDITOR FRAMEWORK V2.0</p>
                    </div>

                </div>
            </div>
        </div>
    );
};
