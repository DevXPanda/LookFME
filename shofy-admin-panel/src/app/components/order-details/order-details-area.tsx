"use client";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import ErrorMsg from "../common/error-msg";
import { Card, Typography } from "@material-tailwind/react";
import { useGetSingleOrderQuery, useProcessRefundMutation, useProcessExchangeMutation } from "@/redux/order/orderApi";
import { Invoice } from "@/svg";
import { useReactToPrint } from "react-to-print";
import { notifyError, notifySuccess } from "@/utils/toast";
import Image from "next/image";

const formatImageUrl = (url: any) => {
  if (!url || typeof url !== "string") return "https://placehold.co/200x200?text=No+Image";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) {
    return `http://localhost:3001${url}`;
  }
  return url;
};

const OrderDetailsArea = ({ id }: { id: string }) => {
  const { data: orderData, isLoading, isError, refetch } = useGetSingleOrderQuery(id);
  const [processRefund, { isLoading: isProcessingRefund }] = useProcessRefundMutation();
  const [processExchange, { isLoading: isProcessingExchange }] = useProcessExchangeMutation();
  const printRef = useRef<HTMLDivElement | null>(null);

  const handleProcessRefund = async (returnItemIndex: number, approve: boolean) => {
    try {
      await processRefund({ id, returnItemIndex, approve }).unwrap();
      notifySuccess(approve ? "Refund approved and processed!" : "Return request rejected!");
      refetch();
    } catch (error: any) {
      notifyError(error?.data?.message || "Failed to process refund");
    }
  };

  const handleProcessExchange = async (exchangeItemIndex: number, approve: boolean) => {
    try {
      await processExchange({ id, exchangeItemIndex, approve }).unwrap();
      notifySuccess(approve ? "Exchange approved and processed!" : "Exchange request rejected!");
      refetch();
    } catch (error: any) {
      notifyError(error?.data?.message || "Failed to process exchange");
    }
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError && orderData) {
    const TABLE_HEAD = [
      "SL",
      "Product Name",
      "	Quantity",
      "Item Price",
      "Amount",
    ];
    const total = orderData.cart.reduce((acc, curr) => acc + curr.price, 0);
    const grand_total = (total +
      orderData.shippingCost +
      (orderData.discount ?? 0)) as number;
    content = (
      <>
        <div className="container grid px-6 mx-auto">
          <h1 className="my-6 text-lg font-bold text-gray-700 dark:text-gray-300">
            Invoice
          </h1>
          <div ref={printRef} className="bg-white mb-4 p-6 rounded-xl shadow-sm overflow-hidden tp-invoice-print-wrapper">
            {/* Invoice Header Banner */}
            <div className="border-2 border-slate-900 text-slate-900 p-5 mb-6 text-center rounded-lg">
              <h1 className="text-xl font-bold tracking-widest uppercase m-0">LookFame Official Invoice</h1>
              <p className="text-xs font-medium mt-1 uppercase tracking-widest">Premium Quality Fashion</p>
            </div>

            <div className="mb-8">
              <div className="grid grid-cols-2 gap-6 border-b border-slate-100 pb-6">
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
                      <span className="text-xs font-semibold text-slate-600">ORDER ID:</span>
                      <span className="text-xs text-slate-500 font-mono">#{id.slice(-8).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <div className="relative rounded-b-md bg-white">
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-base text-left text-gray-500 whitespace-no-wrap">
                    <thead className="bg-white">
                      <tr className="border-b border-gray6 text-center">
                        <td className="pl-3 py-2 text-[10px] text-textBody uppercase font-bold text-start tracking-wider">SR.</td>
                        <td className="pr-8 py-2 text-[10px] text-textBody uppercase font-bold text-start tracking-wider">Product Title</td>
                        <td className="pr-8 py-2 text-[10px] text-textBody uppercase font-bold tracking-wider">QUANTITY</td>
                        <td className="pr-3 py-2 text-[10px] text-textBody uppercase font-bold tracking-wider">ITEM PRICE</td>
                        <td className="pr-3 py-2 text-[10px] text-textBody uppercase font-bold text-right tracking-wider">AMOUNT</td>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y text-base ">
                      {orderData?.cart?.map((item, i) => {
                        // Check if this item is being returned or exchanged
                        const returnItem = orderData.returnItems?.find((ri: any) => ri.productId === item._id);
                        const exchangeItem = orderData.exchangeItems?.find((ei: any) => ei.originalProductId === item._id);

                        return (
                          <tr key={item._id} className={`${returnItem || exchangeItem ? "bg-yellow-50" : ""} border-b border-slate-100`}>
                            <td className="px-3 py-2 text-start text-sm">
                              {i + 1}
                              {(returnItem || exchangeItem) && (
                                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                                  {returnItem ? "RETURN" : "EXCHANGE"}
                                </span>
                              )}
                            </td>
                            <td className="px-3 pl-0 py-2 text-start">
                              <div className="flex items-center gap-3">
                                {(item.img || item?.imageURLs?.[0]?.img) && (
                                  <Image
                                    src={formatImageUrl(item?.imageURLs?.[0]?.img || item.img)}
                                    alt={item.title}
                                    width={40}
                                    height={40}
                                    className="rounded"
                                    style={{ objectFit: 'cover' }}
                                  />
                                )}
                                <div>
                                  <div className="font-bold text-sm text-heading">{item.title}</div>
                                  {/* Combo Items Display */}
                                  {item.isCombo && item.comboItems && (
                                    <div className="mt-1 flex flex-wrap gap-1">
                                      {item.comboItems.map((combo, idx) => (
                                        <div key={idx} className="text-[9px] bg-slate-50 px-1.5 py-0.5 rounded text-slate-600 border border-slate-200 flex items-center gap-1">
                                          <span className="opacity-70 font-bold uppercase">#{idx + 1}:</span>
                                          <span className="font-bold text-slate-900">{combo.color}/{combo.size}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {/* Individual Product Selection Display */}
                                  {!item.isCombo && (item.selectedColor || item.selectedSize) && (
                                    <div className="text-[9px] text-slate-500 mt-0.5 flex items-center gap-2 font-bold uppercase">
                                      {item.selectedColor && (
                                        <span>Color: {typeof item.selectedColor === 'object' ? item.selectedColor.name : item.selectedColor}</span>
                                      )}
                                      {item.selectedSize && (
                                        <span> | Size: {item.selectedSize}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-2 font-bold text-center text-sm">
                              {item.orderQuantity}
                            </td>
                            <td className="px-3 py-2 font-bold text-center text-sm">
                              ₹{item.price.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 text-right font-bold text-sm">
                              ₹{(item.price * item.orderQuantity).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden mt-6">
              <div className="grid grid-cols-4 divide-x divide-slate-100 bg-slate-50/30">
                <div className="p-4 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">PAYMENT</span>
                  <span className="text-sm font-bold text-slate-900 uppercase">{orderData.paymentMethod}</span>
                </div>
                <div className="p-4 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">SHIPPING</span>
                  <span className="text-sm font-bold text-slate-900 italic uppercase">Free Shipping</span>
                </div>
                <div className="p-4 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">DISCOUNT</span>
                  <span className="text-sm font-bold text-slate-400">₹{orderData?.discount || 0}</span>
                </div>
                <div className="p-4 text-center bg-slate-900 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">GRAND TOTAL</span>
                  <span className="text-xl font-black text-white">₹{grand_total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center border-t border-slate-100 pt-6 pb-2">
              <p className="text-slate-400 text-xs italic mb-4">Thank you for choosing LookFame. We hope to see you again soon!</p>
              <div className="flex justify-center items-center gap-6 mt-2 opacity-30 font-bold uppercase tracking-widest">
                <span className="text-[9px] text-slate-400">www.lookfame.com</span>
                <span className="text-slate-200">|</span>
                <span className="text-[9px] text-slate-400">support@lookfame.com</span>
              </div>
            </div>

            {/* Return Items Section */}
            {orderData.returnItems && orderData.returnItems.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-lg font-bold mb-4">Return Requests</h3>
                <div className="space-y-4">
                  {orderData.returnItems.map((returnItem: any, index: number) => {
                    const originalItem = orderData.cart.find((item: any) => item._id === returnItem.productId);
                    return (
                      <div key={index} className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <div className="flex items-start gap-4 mb-3">
                          {(originalItem?.img || originalItem?.imageURLs?.[0]?.img) && (
                            <Image
                              src={formatImageUrl(originalItem?.imageURLs?.[0]?.img || originalItem.img)}
                              alt={originalItem.title}
                              width={80}
                              height={80}
                              className="rounded"
                              style={{ objectFit: 'cover' }}
                            />
                          )}
                          <div className="flex-grow">
                            <h6 className="font-semibold text-blue-700 mb-1">{returnItem.productTitle}</h6>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Product ID:</strong> {returnItem.productId}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Quantity:</strong> {returnItem.quantity} |
                              <strong> Price:</strong> ₹{returnItem.price} |
                              <strong> Refund Amount:</strong> ₹{returnItem.refundAmount?.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Reason:</strong> {returnItem.reason}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Status:</strong>
                              <span className={`ml-2 px-2 py-1 rounded text-xs ${returnItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                returnItem.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  returnItem.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                {returnItem.status}
                              </span>
                              {returnItem.refundStatus && (
                                <>
                                  <strong className="ml-3">Refund Status:</strong>
                                  <span className={`ml-2 px-2 py-1 rounded text-xs ${returnItem.refundStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                    returnItem.refundStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                      returnItem.refundStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {returnItem.refundStatus}
                                  </span>
                                </>
                              )}
                            </p>
                            {returnItem.refundTransactionId && (
                              <p className="text-xs text-gray-500">
                                Transaction ID: {returnItem.refundTransactionId}
                              </p>
                            )}
                            {returnItem.status === 'pending' && (
                              <div className="mt-3 flex gap-2">
                                <button
                                  onClick={() => handleProcessRefund(index, true)}
                                  disabled={isProcessingRefund}
                                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                >
                                  {isProcessingRefund ? "Processing..." : "Approve & Process Refund"}
                                </button>
                                <button
                                  onClick={() => handleProcessRefund(index, false)}
                                  disabled={isProcessingRefund}
                                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Requested on: {dayjs(returnItem.requestedAt).format('MMM D, YYYY h:mm A')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Exchange Items Section */}
            {orderData.exchangeItems && orderData.exchangeItems.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-lg font-bold mb-4">Exchange Requests</h3>
                <div className="space-y-4">
                  {orderData.exchangeItems.map((exchangeItem: any, index: number) => {
                    const originalItem = orderData.cart.find((item: any) => item._id === exchangeItem.originalProductId);
                    return (
                      <div key={index} className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <h6 className="font-semibold text-green-700 mb-2">Original Product</h6>
                            <div className="flex items-start gap-3">
                              {(originalItem?.img || originalItem?.imageURLs?.[0]?.img) && (
                                <Image
                                  src={formatImageUrl(originalItem?.imageURLs?.[0]?.img || originalItem.img)}
                                  alt={originalItem.title}
                                  width={80}
                                  height={80}
                                  className="rounded"
                                  style={{ objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <p className="font-medium">{exchangeItem.originalProductTitle}</p>
                                <p className="text-sm text-gray-600">
                                  ID: {exchangeItem.originalProductId}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Qty: {exchangeItem.originalQuantity} × ₹{exchangeItem.originalPrice} = ₹{(exchangeItem.originalQuantity * exchangeItem.originalPrice).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-semibold text-green-700 mb-2">Exchange Product</h6>
                            <div className="flex items-start gap-3">
                              <div className="flex items-start gap-3">
                                {exchangeItem.exchangeProductImg && (
                                  <Image
                                    src={formatImageUrl(exchangeItem.exchangeProductImg)}
                                    alt={exchangeItem.exchangeProductTitle}
                                    width={80}
                                    height={80}
                                    className="rounded"
                                    style={{ objectFit: 'cover' }}
                                  />
                                )}
                                <div>
                                  <p className="font-medium">{exchangeItem.exchangeProductTitle}</p>
                                  <p className="text-sm text-gray-600">
                                    ID: {exchangeItem.exchangeProductId}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Qty: {exchangeItem.exchangeQuantity} × ₹{exchangeItem.exchangePrice} = ₹{(exchangeItem.exchangeQuantity * exchangeItem.exchangePrice).toFixed(2)}
                                  </p>
                                  <p className={`text-sm font-semibold mt-2 ${exchangeItem.priceDifference > 0 ? 'text-red-600' :
                                    exchangeItem.priceDifference < 0 ? 'text-green-600' :
                                      'text-gray-600'
                                    }`}>
                                    Price Difference: ₹{Math.abs(exchangeItem.priceDifference).toFixed(2)}
                                    {exchangeItem.priceDifference > 0 ? ' (Customer pays more)' :
                                      exchangeItem.priceDifference < 0 ? ' (Customer receives refund)' :
                                        ' (No difference)'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Reason:</strong> {exchangeItem.reason}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Status:</strong>
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${exchangeItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            exchangeItem.status === 'approved' ? 'bg-green-100 text-green-800' :
                              exchangeItem.status === 'awaiting_payment' ? 'bg-orange-100 text-orange-800' :
                                exchangeItem.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                            }`}>
                            {exchangeItem.status === 'awaiting_payment'
                              ? 'awaiting payment'
                              : exchangeItem.status}
                          </span>
                        </p>
                        {exchangeItem.status === 'pending' && (
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => handleProcessExchange(index, true)}
                              disabled={isProcessingExchange}
                              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                            >
                              {isProcessingExchange ? "Processing..." : "Approve Exchange"}
                            </button>
                            <button
                              onClick={() => handleProcessExchange(index, false)}
                              disabled={isProcessingExchange}
                              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Requested on: {dayjs(exchangeItem.requestedAt).format('MMM D, YYYY h:mm A')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Status & History Section */}
            {(orderData.cancelReason || orderData.returnReason || orderData.exchangeReason || (orderData.addressChangeHistory && orderData.addressChangeHistory.length > 0)) && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-lg font-bold mb-4">Order Status & History</h3>

                {/* Cancel Reason */}
                {orderData.cancelReason && (
                  <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <h6 className="font-semibold text-red-700 mb-2">Order Cancelled</h6>
                    <p className="text-sm text-gray-700"><strong>Reason:</strong> {orderData.cancelReason}</p>
                  </div>
                )}

                {/* Return Reason (if order-level return) */}
                {orderData.returnReason && !orderData.returnItems?.length && (
                  <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <h6 className="font-semibold text-blue-700 mb-2">Order Returned</h6>
                    <p className="text-sm text-gray-700"><strong>Reason:</strong> {orderData.returnReason}</p>
                  </div>
                )}

                {/* Exchange Reason (if order-level exchange) */}
                {orderData.exchangeReason && !orderData.exchangeItems?.length && (
                  <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                    <h6 className="font-semibold text-green-700 mb-2">Order Exchanged</h6>
                    <p className="text-sm text-gray-700"><strong>Reason:</strong> {orderData.exchangeReason}</p>
                  </div>
                )}

                {/* Address Change History */}
                {orderData.addressChangeHistory && orderData.addressChangeHistory.length > 0 && (
                  <div className="mt-4">
                    <h6 className="font-semibold mb-3">Address Change History</h6>
                    <div className="space-y-3">
                      {orderData.addressChangeHistory.map((change: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded">
                          <p className="text-xs text-gray-500 mb-2">
                            Changed on: {dayjs(change.changedAt).format('MMM D, YYYY h:mm A')}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-1">Old Address:</p>
                              <p className="text-sm text-gray-700">
                                {change.oldAddress.address}, {change.oldAddress.city}, {change.oldAddress.zipCode}
                                <br />
                                {change.oldAddress.country}
                                <br />
                                Contact: {change.oldAddress.contact}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-1">New Address:</p>
                              <p className="text-sm text-gray-700">
                                {change.newAddress.address}, {change.newAddress.city}, {change.newAddress.zipCode}
                                <br />
                                {change.newAddress.country}
                                <br />
                                Contact: {change.newAddress.contact}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Refund History */}
                {orderData.refundHistory && orderData.refundHistory.length > 0 && (
                  <div className="mt-4">
                    <h6 className="font-semibold mb-3">Refund History</h6>
                    <div className="space-y-3">
                      {orderData.refundHistory.map((refund: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-semibold">₹{refund.amount.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">
                                Type: {refund.type} | Method: {refund.paymentMethod}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${refund.status === 'completed' ? 'bg-green-100 text-green-800' :
                              refund.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                refund.status === 'failed' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                              {refund.status}
                            </span>
                          </div>
                          {refund.transactionId && (
                            <p className="text-xs text-gray-500">Transaction ID: {refund.transactionId}</p>
                          )}
                          {refund.reason && (
                            <p className="text-xs text-gray-600 mt-1">Reason: {refund.reason}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {refund.processedAt ? `Processed: ${dayjs(refund.processedAt).format('MMM D, YYYY h:mm A')}` :
                              `Created: ${dayjs(refund.createdAt).format('MMM D, YYYY h:mm A')}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  const handlePrint = useReactToPrint({
    content: () => printRef?.current,
    documentTitle: "Receipt",
  });

  const handlePrintReceipt = async () => {
    try {
      handlePrint();
    } catch (err) {
      console.log("order by user id error", err);
      notifyError("Failed to print");
    }
    // console.log('id', id);
  };

  return (
    <>
      <div className="">{content}</div>
      <div className="container grid px-6 mx-auto">
        <div className="mb-4 mt-3 flex justify-between">
          <button onClick={handlePrintReceipt} className="tp-btn px-5 py-2">
            Print Invoice
            <span className="ml-2">
              <Invoice />
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsArea;
