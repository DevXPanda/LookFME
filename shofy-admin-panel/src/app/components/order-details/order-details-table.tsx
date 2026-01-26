import { Order } from '@/types/order-amount-type';
import dayjs from 'dayjs';
import Image from 'next/image';
import React from 'react';

// prop type 
type IPropType = {
    orderData:Order;
}
const OrderDetailsTable = ({orderData}:IPropType) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-t-md rounded-b-md shadow-xs px-8 py-8">
              <h5>Customer Details</h5>
              <div className="relative overflow-x-auto ">
                  <table className="w-[400px] sm:w-full text-base text-left text-gray-500">
                      <tbody>
                          <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                              <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                  Name
                              </td>
                              <td  className="py-3 whitespace-nowrap ">
                                  <a href="#" className="flex items-center justify-end space-x-5 text-end text-heading text-hover-primary">
                                      {orderData?.user?.imageURL && <Image className="w-10 h-10 rounded-full" src={orderData?.user?.imageURL} alt="user-img"/>}
                                      <span className="font-medium">{orderData?.user?.name}</span>
                                  </a>
                              </td>                                            
                          </tr>                                                           
                          <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                              <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                  Email
                              </td>
                              <td  className="py-3 text-end">
                                  <a href="mailto:support@mail.com">{orderData?.user?.email}</a>
                              </td>                                            
                          </tr>                                                           
                          <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                              <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                  Phone
                              </td>
                              <td  className="py-3 text-end">
                                  <a href="tel:9458785014">{orderData?.contact}</a>
                              </td>                                            
                          </tr>                                                           
                      </tbody>
                  </table>
              </div>
          </div>
          <div className="bg-white rounded-t-md rounded-b-md shadow-xs px-8 py-8">
              <h5>Order Summary</h5>

              <div className="relative overflow-x-auto ">
                  <table className="w-[400px] sm:w-full text-base text-left text-gray-500">
                      <tbody>
                          <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                              <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                  Order Date
                              </td>
                              <td  className="py-3 whitespace-nowrap text-end">
                                  {dayjs(orderData.createdAt).format('MM/DD/YYYY')}
                              </td>                                            
                          </tr>                                                           
                          <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                              <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                  Shipping cost 
                              </td>
                              <td  className="py-3 text-end">
                                  {orderData?.shippingCost}
                              </td>                                            
                          </tr>                                                           
                          <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                              <td className="py-3 font-normal text-[#55585B] w-[50%]">
                                  Shipping Method
                              </td>
                              <td  className="py-3 text-end">
                                  {orderData?.paymentMethod === 'COD' ? 'Cash On Delivery' : orderData.paymentMethod === 'Card' ? 'Card' : ''}
                              </td>                                            
                          </tr>                                                           
                      </tbody>
                  </table>
              </div>
          </div>
          <div className="bg-white rounded-t-md rounded-b-md shadow-xs px-8 py-8">
              <h5>Deliver To</h5>

              <div className="relative overflow-x-auto ">
                  <table className="w-[400px] sm:w-full text-base text-left text-gray-500">
                      <tbody>
                          <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                              <td className="py-3 font-normal text-[#55585B] w-[40%]">
                                  Country
                              </td>
                              <td  className="py-3 text-end">
                                  {orderData.country}
                              </td>                                            
                          </tr>
                          <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                              <td className="py-3 font-normal text-[#55585B] w-[40%]">
                                  Address
                              </td>
                              <td  className="py-3 whitespace-nowrap text-end">
                                 {orderData.address}
                              </td>                                            
                          </tr>                                                           
                          <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                              <td className="py-3 font-normal text-[#55585B] w-[40%]">
                                  City
                              </td>
                              <td  className="py-3 text-end">
                                  {orderData.city}
                              </td>                                            
                          </tr>
                          <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                              <td className="py-3 font-normal text-[#55585B] w-[40%]">
                                  Zip Code
                              </td>
                              <td  className="py-3 text-end">
                                  {orderData.zipCode}
                              </td>                                            
                          </tr>                                                           
                                                                                      
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
      
      {/* Return Items Summary */}
      {orderData.returnItems && orderData.returnItems.length > 0 && (
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white rounded-t-md rounded-b-md shadow-xs px-8 py-8">
            <h5 className="mb-4">Return Requests ({orderData.returnItems.length})</h5>
            <div className="space-y-3">
              {orderData.returnItems.map((item: any, index: number) => (
                <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded flex items-center gap-3">
                  <div className="flex-grow">
                    <p className="font-medium text-sm">{item.productTitle}</p>
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity} | Refund: ₹{item.refundAmount?.toFixed(2)} | Status: {item.status}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exchange Items Summary */}
      {orderData.exchangeItems && orderData.exchangeItems.length > 0 && (
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white rounded-t-md rounded-b-md shadow-xs px-8 py-8">
            <h5 className="mb-4">Exchange Requests ({orderData.exchangeItems.length})</h5>
            <div className="space-y-3">
              {orderData.exchangeItems.map((item: any, index: number) => (
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded">
                  <p className="font-medium text-sm mb-1">
                    {item.originalProductTitle} → {item.exchangeProductTitle}
                  </p>
                  <p className="text-xs text-gray-600">
                    Price Diff: ₹{Math.abs(item.priceDifference).toFixed(2)} | Status: {item.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Order Status & Reasons Section */}
      {(orderData.cancelReason || (orderData.returnReason && !orderData.returnItems?.length) || (orderData.exchangeReason && !orderData.exchangeItems?.length) || (orderData.addressChangeHistory && orderData.addressChangeHistory.length > 0)) && (
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white rounded-t-md rounded-b-md shadow-xs px-8 py-8">
            <h5 className="mb-4">Order Status & History</h5>
            
            {/* Cancel Reason */}
            {orderData.cancelReason && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <h6 className="font-semibold text-red-700 mb-2">Order Cancelled</h6>
                <p className="text-sm text-gray-700"><strong>Reason:</strong> {orderData.cancelReason}</p>
              </div>
            )}
            
            {/* Return Reason (order-level only) */}
            {orderData.returnReason && !orderData.returnItems?.length && (
              <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <h6 className="font-semibold text-blue-700 mb-2">Order Returned</h6>
                <p className="text-sm text-gray-700"><strong>Reason:</strong> {orderData.returnReason}</p>
              </div>
            )}
            
            {/* Exchange Reason (order-level only) */}
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
                  {orderData.addressChangeHistory.map((change, index) => (
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
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetailsTable;