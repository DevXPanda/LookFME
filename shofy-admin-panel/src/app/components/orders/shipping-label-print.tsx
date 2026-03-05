import React from "react";
import { Order } from "@/types/order-amount-type";
import dayjs from "dayjs";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import BarcodeRaw from "react-barcode";
const Barcode = BarcodeRaw as any;
import { QRCodeSVG } from "qrcode.react";

// prop type
type IPropType = {
    orderData: Order;
};

const ShippingLabelPrint = ({ orderData }: IPropType) => {
    const totalItems = orderData.cart.reduce((acc, curr) => acc + curr.orderQuantity, 0);

    // Base URL for tracking (adjust as needed, using a placeholder for now)
    const trackingUrl = `https://lookfame.com/track-order/${orderData._id}`;

    return (
        <div className="shipping-label-container p-4 bg-white text-black" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Header Banner */}
            <div className="header-banner border-2 border-black p-3 mb-6 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold tracking-widest text-center">LOOKFAME SHIPPING LABEL</h1>
            </div>

            {/* Top Info Row */}
            <div className="flex justify-between items-start mb-6 border-b-2 border-dashed border-gray-300 pb-4">
                <div className="flex-1">
                    <p className="text-sm font-semibold uppercase text-gray-600">Order ID:</p>
                    <p className="text-lg font-bold">#{orderData.invoice}</p>
                </div>
                <div className="flex-1 text-center">
                    <p className="text-sm font-semibold uppercase text-gray-600">Date:</p>
                    <p className="text-lg font-bold">{dayjs(orderData.createdAt).format('DD/MM/YYYY')}</p>
                </div>
                <div className="flex-1 text-right">
                    <p className="text-sm font-semibold uppercase text-gray-600">Payment Status:</p>
                    <p className="text-lg font-bold uppercase">{orderData.paymentMethod === 'cod' ? 'COD - ₹' + orderData.totalAmount.toFixed(2) : 'PREPAID'}</p>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Delivery Information Box */}
                <div className="border-2 border-black p-4 rounded-none h-full">
                    <h3 className="text-sm font-bold uppercase bg-black text-white px-2 py-1 mb-3 inline-block">Delivery Information</h3>
                    <div className="space-y-1">
                        <p className="text-lg font-bold">{orderData.name}</p>
                        <p className="text-sm leading-tight text-gray-800">{orderData.address}</p>
                        <p className="text-sm font-bold">{orderData.city}, {orderData.zipCode}</p>
                        <p className="text-sm">{orderData.country}</p>
                        <div className="pt-2">
                            <p className="text-sm"><span className="font-semibold text-gray-600">Phone:</span> {orderData.contact}</p>
                            <p className="text-sm italic text-gray-500 overflow-hidden text-ellipsis">{orderData.email}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Order Details & QR Box */}
                    <div className="border-2 border-black p-4 rounded-none flex justify-between items-center">
                        <div className="flex-1 pr-2">
                            <h3 className="text-sm font-bold uppercase bg-black text-white px-2 py-1 mb-2 inline-block">Tracking</h3>
                            <p className="text-[10px] text-gray-500 mb-2">Scan QR code to track your order status in real-time.</p>
                            <p className="text-xs font-mono break-all">{orderData._id}</p>
                        </div>
                        <div className="qr-container bg-white p-1 border border-gray-200">
                            <QRCodeSVG value={trackingUrl} size={80} level="H" />
                        </div>
                    </div>

                    {/* Item Summary Box */}
                    <div className="border-2 border-black p-4 rounded-none flex-grow">
                        <h3 className="text-sm font-bold uppercase bg-black text-white px-2 py-1 mb-3 inline-block">Item Summary</h3>
                        <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-1">
                            <span className="text-xs font-semibold">Total Items</span>
                            <span className="text-sm font-bold">{totalItems}</span>
                        </div>
                        <div className="max-h-[120px] overflow-hidden">
                            <ul className="text-xs space-y-1">
                                {orderData.cart.map((item, idx) => (
                                    <li key={idx} className="flex justify-between border-b border-gray-100 last:border-0 pb-1">
                                        <span className="truncate pr-2">{item.title}</span>
                                        <span className="font-medium whitespace-nowrap">x{item.orderQuantity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barcode Footer */}
            <div className="footer-section border-t-2 border-black pt-6 flex flex-col items-center justify-center">
                <div className="barcode-container mb-2">
                    <Barcode
                        value={orderData.invoice.toString()}
                        width={2}
                        height={60}
                        fontSize={14}
                        background="#ffffff"
                        lineColor="#000000"
                        margin={0}
                    />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mt-1">LookFame Shipping Services</p>
            </div>

            {/* Print styles */}
            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .shipping-label-container, .shipping-label-container * {
            visibility: visible;
          }
          .shipping-label-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          @page {
            size: auto;
            margin: 0mm;
          }
        }
      `}</style>
        </div>
    );
};

export default ShippingLabelPrint;
