"use client";
import dayjs from "dayjs";
import React,{useRef, useState} from "react";
import ErrorMsg from "../common/error-msg";
import { Card, Typography } from "@material-tailwind/react";
import { useGetSingleOrderQuery, useProcessRefundMutation, useProcessExchangeMutation } from "@/redux/order/orderApi";
import { Invoice } from "@/svg";
import { useReactToPrint } from "react-to-print";
import { notifyError, notifySuccess } from "@/utils/toast";
import Image from "next/image";

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
          <div ref={printRef} className="bg-white mb-4 p-6 lg:p-8 rounded-xl shadow-sm overflow-hidden">
            <div className=" mb-7">
              <div className="flex lg:flex-row md:flex-row flex-col lg:items-center justify-between pb-4 border-b border-slate-200">
                <h1 className="font-bold font-heading text-xl uppercase">
                  Invoice
                  <p className="text-base mt-1 text-gray-500">
                    Status
                    <span className="pl-2 font-medium text-base capitalize">
                      {" "}
                      <span className="font-heading">
                        <span className="inline-flex px-2 text-base font-medium leading-5 rounded-full">
                          {orderData.status}
                        </span>
                      </span>
                    </span>
                  </p>
                </h1>
                <div className="lg:text-right text-left">
                  <h2 className="lg:flex lg:justify-end text-lg font-semibold mt-4 lg:mt-0 lg:ml-0 md:mt-0">
                    {/* <img
                      src="/static/media/logo-dark.acf69e90.svg"
                      alt="dashtar"
                      width="110"
                    /> */}
                  </h2>
                  <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>
              <div className="flex lg:flex-row md:flex-row flex-col justify-between pt-4">
                <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                  <span className="font-bold text-base uppercase block">
                    DATE
                  </span>
                  <span className="text-base block">
                    <span>
                      {dayjs(orderData.createdAt).format("MMMM D, YYYY")}
                    </span>
                  </span>
                </div>
                <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                  <span className="font-bold text-base uppercase block">
                    INVOICE NO
                  </span>
                  <span className="text-base block">#{orderData.invoice}</span>
                </div>
                <div className="flex flex-col lg:text-right text-left">
                  <span className="font-bold text-base uppercase block">
                    INVOICE TO
                  </span>
                  <span className="text-base text-gray-500 block">
                    {orderData?.user?.name} <br />
                    <span className="ml-2">{orderData.contact}</span>
                    <br />
                    {orderData.address}
                    <br />
                    {orderData.city}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-12">
              <div className="relative rounded-b-md bg-white">
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-base text-left text-gray-500 whitespace-no-wrap">
                    <thead className="bg-white">
                      <tr className="border-b border-gray6 text-tiny">
                        <td className="pl-3 py-3 text-tiny text-textBody uppercase font-semibold">SR.</td>
                        <td className="pr-8 py-3 text-tiny text-textBody uppercase font-semibold">Product Title</td>
                        <td className="pr-8 py-3 text-tiny text-textBody uppercase font-semibold text-center">QUANTITY</td>
                        <td className="pr-3 py-3 text-tiny text-textBody uppercase font-semibold text-center">ITEM PRICE</td>
                        <td className="pr-3 py-3 text-tiny text-textBody uppercase font-semibold text-right">AMOUNT</td>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y text-base ">
                      {orderData.cart.map((item, i) => {
                        // Check if this item is being returned or exchanged
                        const returnItem = orderData.returnItems?.find((ri: any) => ri.productId === item._id);
                        const exchangeItem = orderData.exchangeItems?.find((ei: any) => ei.originalProductId === item._id);
                        
                        return (
                        <tr key={item._id} className={returnItem || exchangeItem ? "bg-yellow-50" : ""}>
                          <td className="bg-white border-b border-gray6 px-3 py-3 text-start">
                            {i + 1}
                            {(returnItem || exchangeItem) && (
                              <span className="ml-2 text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                                {returnItem ? "RETURN" : "EXCHANGE"}
                              </span>
                            )}
                          </td>
                          <td className="bg-white border-b border-gray6 px-3 pl-0 py-3 text-start">
                            <div className="flex items-center gap-3">
                              {item.img && (
                                <Image 
                                  src={item.img} 
                                  alt={item.title} 
                                  width={50} 
                                  height={50}
                                  className="rounded"
                                  style={{ objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <div className="font-medium">{item.title}</div>
                                {returnItem && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    Return Qty: {returnItem.quantity} | Status: {returnItem.status} | Refund: ₹{returnItem.refundAmount?.toFixed(2)}
                                  </div>
                                )}
                                {exchangeItem && (
                                  <div className="text-xs text-green-600 mt-1">
                                    Exchange Qty: {exchangeItem.originalQuantity} | Status: {exchangeItem.status}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="bg-white border-b border-gray6 px-3 py-3 font-bold text-center">
                            {item.orderQuantity}
                          </td>
                          <td className="bg-white border-b border-gray6 px-3 py-3 font-bold text-center">
                            ₹{item.price.toFixed(2)}
                          </td>
                          <td className="bg-white border-b border-gray6 px-3 py-3 text-right font-bold">
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
            <div className="border border-slate-200 rounded-xl p-8 py-6">
              <div className="flex lg:flex-row md:flex-row flex-col justify-between">
                <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold text-base uppercase block">
                    PAYMENT METHOD
                  </span>
                  <span className="text-base font-semibold block">
                    {orderData.paymentMethod}
                  </span>
                </div>
                <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold text-base uppercase block">
                    SHIPPING
                  </span>
                  <span className="text-base font-semibold font-heading block">
                    Free
                  </span>
                </div>
                <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold font-heading text-base uppercase block">
                    DISCOUNT
                  </span>
                  <span className="text-base text-gray-500 font-semibold font-heading block">
                    ₹{orderData?.discount}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold text-base uppercase block">
                    TOTAL AMOUNT
                  </span>
                  <span className="text-xl font-bold block">
                    ₹{grand_total.toFixed(2)}
                  </span>
                </div>
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
                          {originalItem?.img && (
                            <Image 
                              src={originalItem.img} 
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
                              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                returnItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                returnItem.status === 'approved' ? 'bg-green-100 text-green-800' :
                                returnItem.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {returnItem.status}
                              </span>
                              {returnItem.refundStatus && (
                                <>
                                  <strong className="ml-3">Refund Status:</strong>
                                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                    returnItem.refundStatus === 'completed' ? 'bg-green-100 text-green-800' :
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
                              {originalItem?.img && (
                                <Image 
                                  src={originalItem.img} 
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
      src={exchangeItem.exchangeProductImg}
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
    <p className={`text-sm font-semibold mt-2 ${
      exchangeItem.priceDifference > 0 ? 'text-red-600' :
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
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            exchangeItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
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
                            <span className={`px-2 py-1 rounded text-xs ${
                              refund.status === 'completed' ? 'bg-green-100 text-green-800' :
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
