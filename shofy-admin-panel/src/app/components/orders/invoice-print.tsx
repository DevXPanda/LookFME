import React from "react";
import { Order } from "@/types/order-amount-type";
import dayjs from "dayjs";

// prop type
type IPropType = {
  orderData: Order;
};

const InvoicePrint = ({ orderData }: IPropType) => {
  const total = orderData.cart.reduce((acc, curr) => acc + curr.price, 0);
  const grand_total = total + orderData.shippingCost;
  return (
    <>
      <div className="tp-invoice-print-wrapper p-6 bg-white">
        {/* Invoice Header Banner */}
        <div className="border-2 border-slate-900 text-slate-900 p-5 mb-6 text-center rounded-lg">
          <h1 className="text-xl font-bold tracking-widest uppercase m-0">LookFame Official Invoice</h1>
          <p className="text-xs font-medium mt-1 uppercase tracking-widest">Premium Quality Fashion</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 border-b border-slate-100 pb-6">
          {/* Left Side: Invoice To */}
          <div className="border border-slate-200 p-4 rounded-lg bg-slate-50/50">
            <span className="font-bold text-[10px] uppercase text-slate-500 block mb-2 tracking-wider">
              INVOICE TO
            </span>
            <div className="text-slate-900">
              <h4 className="font-bold text-base mb-1">{orderData?.user?.name || "Customer"}</h4>
              <p className="text-sm mb-1 font-bold text-slate-600">{orderData?.contact}</p>
              <p className="text-xs leading-relaxed opacity-80 italic">
                {orderData?.address}<br />
                {orderData?.city}, {orderData?.zipCode}
              </p>
            </div>
          </div>

          {/* Right Side: Order Info */}
          <div className="border border-slate-200 p-4 rounded-lg bg-slate-50/50 flex flex-col justify-center">
            <span className="font-bold text-[10px] uppercase text-slate-500 block mb-2 tracking-wider">
              ORDER DETAILS
            </span>
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-white pb-1">
                <span className="text-xs font-semibold text-slate-600">DATE:</span>
                <span className="text-sm font-bold text-slate-900">
                  {dayjs(orderData.createdAt).format("MMMM D, YYYY")}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white pb-1">
                <span className="text-xs font-semibold text-slate-600">INVOICE NO:</span>
                <span className="text-sm font-bold text-slate-900">#{orderData?.invoice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-600">PAYMENT:</span>
                <span className="text-sm font-bold text-slate-900 uppercase">{orderData.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>

        {/* details table */}
        <div className="mb-6 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-base text-left text-gray-500">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th scope="col" className="px-5 py-3 font-bold uppercase text-[10px] tracking-wider">Product</th>
                <th scope="col" className="px-5 py-3 font-bold uppercase text-[10px] tracking-wider text-center">Qty</th>
                <th scope="col" className="px-5 py-3 font-bold uppercase text-[10px] tracking-wider text-center">Price</th>
                <th scope="col" className="px-5 py-3 font-bold uppercase text-[10px] tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orderData.cart.map((p) => (
                <tr key={p._id} className="bg-white hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-slate-900 mb-1">{p.title}</span>
                      {/* Combo selections display */}
                      {p.isCombo && p.comboItems && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.comboItems.map((combo, index) => (
                            <span key={index} className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 font-bold uppercase">
                              #{index + 1}: {combo.color}/{combo.size}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Standard selection display */}
                      {!p.isCombo && (p.selectedColor || p.selectedSize) && (
                        <div className="text-[9px] text-slate-400 font-medium font-bold uppercase">
                          {p.selectedColor && (
                            <span>Color: {typeof p.selectedColor === 'object' ? p.selectedColor.name : p.selectedColor} </span>
                          )}
                          {p.selectedSize && (
                            <span> | Size: {p.selectedSize}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center text-sm font-bold text-slate-700">{p.orderQuantity}</td>
                  <td className="px-5 py-3 text-center text-sm font-bold text-slate-400 italic">₹{p.price.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right text-sm font-black text-slate-900">₹{(p.orderQuantity * p.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden mt-6">
          <div className="grid grid-cols-4 divide-x divide-slate-100 bg-slate-50/30">
            <div className="p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">SHIPPING</span>
              <span className="text-sm font-bold text-slate-900">Free Shipping</span>
            </div>
            <div className="p-4 text-center col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 px-4 text-left">NOTES</span>
              <p className="text-[10px] text-slate-400 text-left px-4 italic leading-tight">
                * This is a computer generated invoice and does not require a physical signature.
              </p>
            </div>
            <div className="p-4 text-center bg-slate-900 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">GRAND TOTAL</span>
              <span className="text-xl font-black text-white">₹{grand_total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center border-t border-slate-100 pt-6 pb-4">
          <p className="text-slate-400 text-xs italic mb-4">Thank you for your order. We appreciate your business!</p>
          <div className="flex justify-center items-center gap-6 mt-2 opacity-30 font-bold">
            <span className="text-[9px] text-slate-400 tracking-widest">WWW.LOOKFAME.COM</span>
            <span className="text-slate-200">|</span>
            <span className="text-[9px] text-slate-400 tracking-widest">SUPPORT@LOOKFAME.COM</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePrint;
