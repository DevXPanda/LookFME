import React from "react";
import { Order } from "@/types/order-amount-type";
import dayjs from "dayjs";
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";

// prop type
type IPropType = {
    orderData: Order;
};

const ShippingLabelPrint = ({ orderData }: IPropType) => {
    const totalItems = orderData.cart.reduce((acc, curr) => acc + curr.orderQuantity, 0);
    const displayOrderId = orderData.orderId ? String(orderData.orderId).replace(/-/g, '') : String(orderData.invoice);
    const trackingUrl = `https://lookfame.com/track-order/${orderData._id}`;

    return (
        <div className="shipping-label-container bg-white text-black" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', padding: '8px', fontSize: '12px' }}>
            {/* Header Banner - compact */}
            <div className="header-banner border border-black py-1.5 mb-2 flex flex-col items-center justify-center">
                <h1 className="text-sm font-bold tracking-wider text-center uppercase">LookFame Shipping Label</h1>
            </div>

            {/* Top Info Row - compact */}
            <div className="flex justify-between items-center mb-2 border-b border-dashed border-gray-400 pb-2 text-[10px]">
                <div>
                    <p className="text-[9px] font-semibold uppercase text-gray-500">Order ID</p>
                    <p className="font-bold text-xs">{displayOrderId}</p>
                </div>
                <div className="text-center">
                    <p className="text-[9px] font-semibold uppercase text-gray-500">Date</p>
                    <p className="font-bold text-xs">{dayjs(orderData.createdAt).format('DD/MM/YYYY')}</p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-semibold uppercase text-gray-500">Payment</p>
                    <p className="font-bold text-xs uppercase">{orderData.paymentMethod === 'cod' ? 'COD ₹' + orderData.totalAmount.toFixed(0) : 'PREPAID'}</p>
                </div>
            </div>

            {/* Main Content - compact */}
            <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="border border-black p-2">
                    <h3 className="text-[9px] font-bold uppercase bg-black text-white px-1.5 py-0.5 mb-1.5 inline-block">Delivery</h3>
                    <p className="font-bold text-[10px]">{orderData.name}</p>
                    <p className="text-[9px] leading-tight">{orderData.address}</p>
                    <p className="text-[9px]">{orderData.city}, {orderData.zipCode} {orderData.country}</p>
                    <p className="text-[9px]">Ph: {orderData.contact}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                    <div className="border border-black p-1.5 flex justify-between items-center">
                        <div className="min-w-0 flex-1 pr-1">
                            <h3 className="text-[9px] font-bold uppercase bg-black text-white px-1 py-0.5 mb-0.5 inline-block">Tracking</h3>
                            <p className="text-[8px] text-gray-500">Scan QR to track</p>
                            <p className="text-[8px] font-mono truncate">{displayOrderId}</p>
                        </div>
                        <QRCodeSVG value={trackingUrl} size={44} level="M" />
                    </div>
                    <div className="border border-black p-1.5 flex-grow">
                        <h3 className="text-[9px] font-bold uppercase bg-black text-white px-1 py-0.5 mb-1 inline-block">Items</h3>
                        <p className="text-[9px] font-semibold">Total: {totalItems}</p>
                        <ul className="text-[8px] space-y-0.5 max-h-14 overflow-hidden">
                            {orderData.cart.slice(0, 2).map((item, idx) => (
                                <li key={idx} className="flex justify-between">
                                    <span className="truncate pr-1">{item.title}</span>
                                    <span className="whitespace-nowrap">x{item.orderQuantity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Barcode - same Order ID as header */}
            <div className="border-t border-black pt-2 flex flex-col items-center">
                <Barcode
                    value={displayOrderId}
                    width={1.2}
                    height={36}
                    fontSize={10}
                    background="#ffffff"
                    lineColor="#000000"
                    margin={0}
                />
                <p className="text-[8px] font-bold uppercase mt-0.5">LookFame Shipping</p>
            </div>

            <style jsx global>{`
                @media print {
                    body * { visibility: hidden; }
                    .shipping-label-container, .shipping-label-container * { visibility: visible; }
                    .shipping-label-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 400px !important;
                        max-width: 400px !important;
                        padding: 4px !important;
                        margin: 0 !important;
                        font-size: 11px;
                    }
                    @page { size: 105mm 148mm; margin: 4mm; }
                }
            `}</style>
        </div>
    );
};

export default ShippingLabelPrint;
