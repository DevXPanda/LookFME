'use client';
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import ReactToPrint from "react-to-print";
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
    const { name, country, city, contact, invoice, createdAt, cart, shippingCost, discount, totalAmount, paymentMethod, address, zipCode, status } = order.order;

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
            <div ref={printRef} className="invoice__wrapper grey-bg-2 pt-40 pb-40 pl-40 pr-40 tp-invoice-print-wrapper">
              <div className="invoice__header-wrapper border-2 border-bottom border-white mb-40">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="invoice__header pb-20">
                      <div className="row align-items-end">
                        <div className="col-md-4 col-sm-6">
                          <div className="invoice__left">
                            <Image src={logo} alt="logo" />
                            <p>D140, Sector 7 <br /> Noida 201301 </p>
                          </div>
                        </div>
                        <div className="col-md-8 col-sm-6">
                          <div className="invoice__right mt-15 mt-sm-0 text-sm-end">
                            <h3 className="text-uppercase font-70 mb-20">Invoice</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="invoice__customer mb-30">
                <div className="row">
                  <div className="col-md-6 col-sm-8">
                    <div className="invoice__customer-details">
                      <h4 className="mb-10 text-uppercase">{name}</h4>
                      <p className="mb-0 text-uppercase">{address}</p>
                      <p className="mb-0 text-uppercase">{city}, {zipCode}</p>
                      <p className="mb-0 text-uppercase">{country}</p>
                      <p className="mb-0">{contact}</p>
                      {ds.key !== 'delivered' && (
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(true)}
                          className="tp-btn tp-btn-border mt-3"
                          style={{ fontSize: '12px', padding: '5px 15px' }}
                        >
                          Change Address
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-4">
                    <div className="invoice__details mt-md-0 mt-20 text-md-end">
                      <p className="mb-0">
                        <strong>Invoice ID:</strong> #{invoice}
                      </p>
                      <p className="mb-0">
                        <strong>Date:</strong> {dayjs(createdAt).format("MMMM D, YYYY")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="invoice__order-table pt-30 pb-30 pl-40 pr-40 bg-white mb-30">
                <table className="table">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">SL</th>
                      <th scope="col">Product Name</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Item Price</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {cart.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.orderQuantity}</td>
                        <td>₹{item.price}</td>
                        <td>₹{item.price * item.orderQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="invoice__total pt-40 pb-10 alert-success pl-40 pr-40 mb-30">
                <div className="row">
                  <div className="col-lg-3 col-md-4">
                    <div className="invoice__payment-method mb-30">
                      <h5 className="mb-0">Payment Method</h5>
                      <p className="tp-font-medium text-uppercase">{paymentMethod}</p>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-4">
                    <div className="invoice__shippint-cost mb-30">
                      <h5 className="mb-0">Shipping</h5>
                      <p className="tp-font-medium">Free</p>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-4">
                    <div className="invoice__discount-cost mb-30">
                      <h5 className="mb-0">Discount</h5>
                      <p className="tp-font-medium">₹{discount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-4">
                    <div className="invoice__total-ammount mb-30">
                      <h5 className="mb-0">Total Ammount</h5>
                      <p className="tp-font-medium text-danger">
                        <strong>₹{parseInt(totalAmount).toFixed(2)}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className="invoice__print text-end mt-3">
              <div className="row">
                <div className="col-xl-12">
                  <ReactToPrint
                    trigger={() => (
                      <button
                        type="button"
                        className="tp-invoice-print tp-btn tp-btn-black"
                      >
                        <span className="mr-5">
                          <i className="fa-regular fa-print"></i>
                        </span>{" "}
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                    documentTitle="Invoice"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Address Change Modal */}
        {showAddressModal && (
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
        )}
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