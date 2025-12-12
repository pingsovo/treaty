
import React from 'react';

// This component is rendered hidden from view but used for PDF generation
const PartyReceipt = React.forwardRef(({ people, calculatedResults, totalAmount, date }, ref) => {
    return (
        <div ref={ref} className="w-[800px] bg-gray-900 p-8 text-white font-inter relative overflow-hidden" style={{ minHeight: '1000px' }}>
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg width="100%" height="100%">
                    <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                        <circle cx="25" cy="25" r="5" fill="white" />
                    </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                </svg>
            </div>

            {/* Header */}
            <div className="text-center mb-10 border-b-4 border-dashed border-pink-500 pb-6">
                <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    PARTY RECEIPT 🎉
                </h1>
                <p className="text-gray-400 text-xl font-mono">{date}</p>
                <div className="flex justify-center mt-4 space-x-2 text-3xl">
                    <span>🍕</span><span>🍹</span><span>🍰</span><span>🍗</span>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {Object.values(calculatedResults).map((result, index) => (
                    <div
                        key={result.name}
                        className={`relative p-6 rounded-3xl border-2 ${result.treatReceived > 0 ? 'border-yellow-400 bg-gray-800' : 'border-gray-700 bg-gray-800/50'}`}
                    >
                        {/* Fireworks Effect for Treated People */}
                        {result.treatReceived > 0 && (
                            <>
                                <div className="absolute -top-4 -right-4 text-6xl animate-bounce" style={{ animationDuration: '2s' }}>🎆</div>
                                <div className="absolute -bottom-4 -left-4 text-6xl animate-bounce" style={{ animationDuration: '2.5s' }}>🎇</div>
                                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
                                    <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,215,0,0.15)_0%,transparent_70%)]"></div>
                                </div>
                            </>
                        )}

                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <h2 className="text-3xl font-bold flex items-center">
                                {index + 1}. {result.name}
                                {result.treatReceived > 0 && <span className="ml-3 text-sm bg-yellow-500 text-black px-2 py-1 rounded-full font-bold uppercase tracking-wider">VIP (Treated)</span>}
                            </h2>
                            <div className="text-right">
                                <span className={`text-4xl font-black ${result.treatReceived > 0 ? 'text-gray-500 line-through mr-3 opacity-50' : 'text-green-400'}`}>
                                    {result.treatReceived > 0 ? `฿${result.subtotalBeforeProportion.toFixed(0)}` : `฿${result.totalPay.toFixed(2)}`}
                                </span>
                                {result.treatReceived > 0 && (
                                    <span className="text-4xl font-black text-yellow-400">FREE!</span>
                                )}
                            </div>
                        </div>

                        {/* Details List */}
                        <div className="grid grid-cols-2 gap-4 text-gray-400 text-lg relative z-10">
                            <div className="space-y-1">
                                <p>Order Subtotal: <span className="text-white">฿{result.individualSubtotal.toFixed(2)}</span></p>
                                <p>Shared Items: <span className="text-white">฿{result.sharedItemContribution.toFixed(2)}</span></p>
                            </div>
                            <div className="space-y-1 text-right">
                                {result.proportionalShipping > 0 && <p>Shipping: <span className="text-white">+฿{result.proportionalShipping.toFixed(2)}</span></p>}
                                {result.proportionalDiscount > 0 && <p className="text-green-400">Discount: -฿{result.proportionalDiscount.toFixed(2)}</p>}
                                {result.treatContribution > 0 && (
                                    <p className="text-yellow-400 font-bold">Treat Contribution: +฿{result.treatContribution.toFixed(2)}</p>
                                )}
                            </div>
                        </div>

                        {(result.proportionalServiceCharge > 0 || result.proportionalVat > 0) && (
                            <div className="mt-2 pt-2 border-t border-gray-700 text-sm text-gray-500 flex justify-end gap-4 relative z-10">
                                {result.proportionalServiceCharge > 0 && <span>SVC: {result.proportionalServiceCharge.toFixed(2)}</span>}
                                {result.proportionalVat > 0 && <span>VAT: {result.proportionalVat.toFixed(2)}</span>}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Grand Total Footer */}
            <div className="mt-10 border-t-4 border-dashed border-pink-500 pt-6 flex justify-between items-end">
                <div className="text-gray-400 italic">
                    Thank you for dining together! <br /> Generated by Lunch Share App
                </div>
                <div className="text-right">
                    <p className="text-2xl text-pink-400 font-bold mb-1">GRAND TOTAL</p>
                    <p className="text-7xl font-black text-white bg-clip-text bg-gradient-to-l from-indigo-500 to-pink-500 text-transparent">
                        ฿{totalAmount.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
});

export default PartyReceipt;
