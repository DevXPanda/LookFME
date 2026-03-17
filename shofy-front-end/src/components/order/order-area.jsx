'use client';
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import dayjs from "dayjs";
// Native window.print() approach; removed react-to-print due to findDOMNode errors in Next.js 15
import { useForm } from "react-hook-form";
// internal
import logo from "@assets/img/logo/logo.svg";
import ErrorMsg from "@/components/common/error-msg";
import { useGetUserOrderByIdQuery, useUpdateOrderAddressMutation } from "@/redux/features/order/orderApi";
import PrdDetailsLoader from "@/components/loader/prd-details-loader";
import { notifySuccess, notifyError } from "@/utils/toast";


const OrderArea = ({ orderId }) => {
  const printRef = useRef();
  const { data: order, isError, isLoading, refetch } = useGetUserOrderByIdQuery(orderId);
  const [updateOrderAddress, { isLoading: isUpdatingAddress }] = useUpdateOrderAddressMutation();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const handlePrint = () => {
    window.print();
  };

  // Initialize form values when order data is available - MUST be at top level
  useEffect(() => {
    if (order?.order) {
      setValue("address", order.order.address || "");
      setValue("city", order.order.city || "");
      setValue("country", order.order.country || "");
      setValue("zipCode", order.order.zipCode || "");
      setValue("contact", order.order.contact || "");
    }
  }, [order, setValue]);

  // Handle address update - MUST be at top level
  const onSubmitAddress = async (data) => {
    try {
      await updateOrderAddress({
        id: orderId,
        ...data,
      }).unwrap();
      notifySuccess("Address updated successfully!");
      setShowAddressModal(false);
      refetch();
    } catch (error) {
      notifyError(error?.data?.message || "Failed to update address");
    }
  };

  let content = null;
  if (isLoading) {
    content = <PrdDetailsLoader loading={isLoading} />
  }
  if (isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && order?.order) {
    const { name, country, city, contact, invoice, orderId: orderOrderId, createdAt, cart, shippingCost, discount, totalAmount, paymentMethod, address, zipCode, status } = order.order;

    const getDisplayStatus = (o) => {
      const base = (o?.status || '').toLowerCase();
      const returnItems = Array.isArray(o?.returnItems) ? o.returnItems : [];
      const exchangeItems = Array.isArray(o?.exchangeItems) ? o.exchangeItems : [];

      if (returnItems.length > 0) {
        const anyRefundCompleted = returnItems.some(
          (ri) => (ri?.refundStatus || '').toLowerCase() === 'completed'
        );
        const anyApproved = returnItems.some((ri) => (ri?.status || '').toLowerCase() === 'approved');
        const anyPending = returnItems.some((ri) => (ri?.status || '').toLowerCase() === 'pending');
        if (anyRefundCompleted) return { key: 'returned', label: 'Refunded' };
        if (anyApproved) return { key: 'returned', label: 'Return Approved' };
        if (anyPending) return { key: 'returned', label: 'Return Requested' };
        return { key: 'returned', label: 'Returned' };
      }

      if (exchangeItems.length > 0) {
        const anyAwaitingPayment = exchangeItems.some(
          (ei) => (ei?.status || '').toLowerCase() === 'awaiting_payment'
        );
        const anyCompleted = exchangeItems.some((ei) => (ei?.status || '').toLowerCase() === 'completed');
        const anyApproved = exchangeItems.some((ei) => (ei?.status || '').toLowerCase() === 'approved');
        const anyPending = exchangeItems.some((ei) => (ei?.status || '').toLowerCase() === 'pending');
        if (anyCompleted) return { key: 'exchanged', label: 'Exchange Completed' };
        if (anyAwaitingPayment) return { key: 'exchanged', label: 'Awaiting Payment' };
        if (anyApproved) return { key: 'exchanged', label: 'Exchange Approved' };
        if (anyPending) return { key: 'exchanged', label: 'Exchange Requested' };
        return { key: 'exchanged', label: 'Exchanged' };
      }

      if (base === 'delivered') return { key: 'delivered', label: 'Delivered' };
      if (base === 'processing') return { key: 'processing', label: 'Processing' };
      if (base === 'pending') return { key: 'pending', label: 'Pending' };
      if (base === 'cancel') return { key: 'cancel', label: 'Cancel' };
      return { key: base || 'pending', label: status };
    };

    const ds = getDisplayStatus(order.order);
    content = (
      <>
        <section className="invoice__area pt-120 pb-120">
          <div className="container">
            <div className="invoice__msg-wrapper">
              <div className="row">
                <div className="col-xl-12">
                  <div className="invoice_msg mb-40">
                    <p className="text-black alert alert-success">Thank you <strong>{name}</strong> Your order have been received ! </p>
                  </div>
                </div>
              </div>
            </div>
            <div ref={printRef} className="bg-white mb-4 p-6 lg:p-10 rounded-xl shadow-sm overflow-hidden tp-invoice-print-wrapper text-start">
              {/* Invoice Header Banner */}
              <div className="border-2 border-slate-900 text-slate-900 p-6 mb-6 text-center rounded-lg">
                <h1 className="text-2xl font-black tracking-[0.2em] uppercase m-0">LookFame Official Invoice</h1>
                <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Premium Quality Fashion</p>
              </div>

              <div className="mb-8">
                <div className="grid grid-cols-2 gap-6 border-b border-slate-100 pb-6">
                  {/* Left Side: Invoice To */}
                  <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
                    <span className="font-bold text-[10px] uppercase text-slate-400 block mb-2 tracking-widest">
                      INVOICE TO
                    </span>
                    <div className="text-slate-900">
                      <h4 className="font-black text-lg mb-1 text-uppercase">{name}</h4>
                      <p className="text-sm mb-1 font-bold text-slate-600">{contact}</p>
                      <p className="text-xs leading-relaxed opacity-80 italic mt-1">
                        {address}<br />
                        {city}, {zipCode}<br />
                        {country}
                      </p>
                      {ds.key !== 'delivered' && (
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(true)}
                          className="tp-btn tp-btn-border mt-3 no-print"
                          style={{ fontSize: '10px', padding: '4px 12px', textTransform: 'uppercase', letterSpacing: '1px' }}
                        >
                          Update Address
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Order Info */}
                  <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50 flex flex-col justify-center">
                    <span className="font-bold text-[10px] uppercase text-slate-400 block mb-2 tracking-widest">
                      ORDER DETAILS
                    </span>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center border-b border-white pb-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">DATE:</span>
                        <span className="text-sm font-black text-slate-900">
                          {dayjs(createdAt).format("MMMM D, YYYY")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white pb-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">INVOICE NO:</span>
                        <span className="text-sm font-black text-slate-900">{invoice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ORDER ID:</span>
                        <span className="text-xs text-slate-500 font-mono font-bold tracking-tighter">{(orderOrderId ? String(orderOrderId) : (order.order._id ? String(order.order._id).slice(-6) : '')).replace(/-/g, '').toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="invoice__order-table mb-8 overflow-hidden rounded-xl border border-slate-200">
                <table className="table mb-0">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="px-5 py-3 font-black uppercase text-[10px] tracking-widest border-0">SL</th>
                      <th className="px-5 py-3 font-black uppercase text-[10px] tracking-widest border-0">Product Name</th>
                      <th className="px-5 py-3 font-black uppercase text-[10px] tracking-widest border-0 text-center">Qty</th>
                      <th className="px-5 py-3 font-black uppercase text-[10px] tracking-widest border-0 text-center">Item Price</th>
                      <th className="px-5 py-3 font-black uppercase text-[10px] tracking-widest border-0 text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cart.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-5 py-3 font-bold text-slate-400 border-0">{i + 1}</td>
                        <td className="px-5 py-3 border-0">
                          <span className="font-bold text-sm text-slate-900">{item.title}</span>
                          {/* Combo selections display */}
                          {item.isCombo && item.comboItems && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.comboItems.map((combo, index) => (
                                <span key={index} className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 font-bold uppercase tracking-tighter">
                                  #{index + 1}: {combo.color}/{combo.size}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3 text-center font-black text-slate-700 border-0">{item.orderQuantity}</td>
                        <td className="px-5 py-3 text-center font-bold text-slate-400 italic border-0 text-sm">₹{item.price}</td>
                        <td className="px-5 py-3 text-end font-black text-slate-900 border-0 text-sm">₹{item.price * item.orderQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden mb-8">
                <div className="grid grid-cols-4 divide-x divide-slate-100 bg-slate-50/30 font-heading">
                  <div className="p-4 text-center border-b border-slate-100 lg:border-b-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">PAYMENT</span>
                    <span className="text-sm font-black text-slate-900 uppercase">{paymentMethod}</span>
                  </div>
                  <div className="p-4 text-center border-b border-slate-100 lg:border-b-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">SHIPPING</span>
                    <span className="text-sm font-bold text-slate-800 italic">Free Shipping</span>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">DISCOUNT</span>
                    <span className="text-sm font-bold text-slate-400">₹{discount.toFixed(2)}</span>
                  </div>
                  <div className="p-6 text-center bg-slate-900">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-1">TOTAL AMOUNT</span>
                    <span className="text-2xl font-black text-white">₹{Number(totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center border-t border-slate-100 pt-6 pb-2">
                <p className="text-slate-500 font-bold text-xs tracking-wide uppercase italic mb-4">Thank you for choosing LookFame. We appreciate your style!</p>
                <div className="flex justify-center items-center gap-8 mt-2 opacity-30 font-black tracking-widest text-[9px] uppercase">
                  <span>WWW.LOOKFAME.COM</span>
                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                  <span>SUPPORT@LOOKFAME.COM</span>
                </div>
              </div>
            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
              __html: `
              @media print {
                /* Hide everything by default */
                body * {
                  visibility: hidden;
                  background: none !important;
                }
                
                /* Show ONLY the invoice wrapper and its children */
                .tp-invoice-print-wrapper, 
                .tp-invoice-print-wrapper * {
                  visibility: visible;
                }
                
                /* Position the wrapper at the very top left */
                .tp-invoice-print-wrapper {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 2.5rem !important;
                  box-shadow: none !important;
                  border: none !important;
                  background: white !important;
                }

                /* Force backgrounds for black banner and totals */
                .bg-slate-900 {
                  background-color: #0f172a !important;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                
                .text-white {
                  color: #ffffff !important;
                }

                .border-2.border-slate-900 {
                   border: 2px solid #0f172a !important;
                }

                /* Hide Interactive elements and page chrome */
                .no-print, 
                .invoice__print, 
                .header__area, 
                .footer__area,
                .invoice__msg-wrapper,
                .tp-auth-modal-overlay {
                  display: none !important;
                }

                /* Remove header/footer injected by browser */
                @page {
                  size: auto;
                  margin: 10mm;
                }
              }
            `}} />

            <div className="invoice__print text-end mt-3 no-print">
              <div className="row">
                <div className="col-xl-12">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="tp-invoice-print tp-btn tp-btn-black"
                  >
                    <span className="mr-5">
                      <i className="fa-regular fa-print"></i>
                    </span>{" "}
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Address Change Modal */}
        {
          showAddressModal && (
            <div className="tp-auth-modal-overlay" style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <div className="tp-auth-modal-content" style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                padding: '40px'
              }}>
                <button
                  onClick={() => setShowAddressModal(false)}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  ×
                </button>
                <h3 className="mb-20">Change Delivery Address</h3>
                <form onSubmit={handleSubmit(onSubmitAddress)}>
                  <div className="row">
                    <div className="col-md-12 mb-15">
                      <label>Address</label>
                      <input
                        type="text"
                        {...register("address", { required: "Address is required" })}
                        className="tp-checkout-input"
                      />
                      <ErrorMsg msg={errors?.address?.message} />
                    </div>
                    <div className="col-md-6 mb-15">
                      <label>City</label>
                      <input
                        type="text"
                        {...register("city", { required: "City is required" })}
                        className="tp-checkout-input"
                      />
                      <ErrorMsg msg={errors?.city?.message} />
                    </div>
                    <div className="col-md-6 mb-15">
                      <label>Zip Code</label>
                      <input
                        type="text"
                        {...register("zipCode", { required: "Zip code is required" })}
                        className="tp-checkout-input"
                      />
                      <ErrorMsg msg={errors?.zipCode?.message} />
                    </div>
                    <div className="col-md-6 mb-15">
                      <label>Country</label>
                      <input
                        type="text"
                        {...register("country", { required: "Country is required" })}
                        className="tp-checkout-input"
                      />
                      <ErrorMsg msg={errors?.country?.message} />
                    </div>
                    <div className="col-md-6 mb-15">
                      <label>Contact</label>
                      <input
                        type="text"
                        {...register("contact", { required: "Contact is required" })}
                        className="tp-checkout-input"
                      />
                      <ErrorMsg msg={errors?.contact?.message} />
                    </div>
                    <div className="col-md-12">
                      <button
                        type="submit"
                        disabled={isUpdatingAddress}
                        className="tp-checkout-btn w-100"
                      >
                        {isUpdatingAddress ? "Updating..." : "Update Address"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )
        }
      </>
    );
  }

  return (
    <>
      {content}
    </>
  );
};

export default OrderArea;