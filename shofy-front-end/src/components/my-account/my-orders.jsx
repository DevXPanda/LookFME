import dayjs from "dayjs";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCancelOrderMutation, useReturnOrExchangeOrderMutation, useGetUserOrderByIdQuery } from "@/redux/features/order/orderApi";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import { notifySuccess, notifyError } from "@/utils/toast";
import ErrorMsg from "@/components/common/error-msg";
import Image from "next/image";
import { QuickView } from "@/svg";

const MyOrders = ({ orderData }) => {
  const order_items = orderData?.orders;
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [returnOrExchangeOrder, { isLoading: isReturning }] = useReturnOrExchangeOrderMutation();
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(null);
  const [showViewModal, setShowViewModal] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();

  // Fetch order details when return/exchange modal is open
  const orderDetails = useGetUserOrderByIdQuery(showReturnModal?.id, {
    skip: !showReturnModal?.id,
  });

  // Fetch order details for view modal
  const viewOrderDetails = useGetUserOrderByIdQuery(showViewModal, {
    skip: !showViewModal,
  });

  // Fetch all products for exchange selection
  const { data: allProducts } = useGetAllProductsQuery();

  const handleItemSelection = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleCancelOrder = async (orderId, data) => {
    try {
      await cancelOrder({ id: orderId, reason: data.reason }).unwrap();
      notifySuccess("Order cancelled successfully!");
      setShowCancelModal(null);
      reset();
    } catch (error) {
      notifyError(error?.data?.message || "Failed to cancel order");
    }
  };

  const handleReturnExchange = async (orderId, type, data) => {
    try {
      // Get selected items from form data
      const selectedItems = data.selectedItems || [];

      if (selectedItems.length === 0) {
        notifyError("Please select at least one item");
        return;
      }

      let items = [];

      if (type === 'returned') {
        items = selectedItems.map(itemId => {
          const orderItem = orderDetails?.order?.cart?.find(c => (c._id === itemId) || (c._id === itemId.replace('item_', '')) || (`item_${orderDetails?.order?.cart?.indexOf(c)}` === itemId));
          return {
            productId: orderItem?._id || itemId,
            productTitle: orderItem?.title,
            quantity: data[`quantity_${itemId}`] || orderItem?.orderQuantity || 1,
            price: orderItem?.price || 0,
          };
        });
      } else {
        // Exchange - need exchange product selection
        items = selectedItems.map(itemId => {
          const orderItem = orderDetails?.order?.cart?.find(c => (c._id === itemId) || (c._id === itemId.replace('item_', '')) || (`item_${orderDetails?.order?.cart?.indexOf(c)}` === itemId));
          const exchangeProductId = data[`exchangeProduct_${itemId}`];
          const exchangeProduct = allProducts?.data?.find(p => p._id === exchangeProductId);

          if (!exchangeProduct) {
            throw new Error(`Please select an exchange product for ${orderItem?.title}`);
          }

          return {
            originalProductId: orderItem?._id || itemId,
            originalProductTitle: orderItem?.title,
            originalQuantity: data[`quantity_${itemId}`] || orderItem?.orderQuantity || 1,
            originalPrice: orderItem?.price || 0,
            exchangeProductId: exchangeProduct._id,
            exchangeProductTitle: exchangeProduct.title,
            exchangeQuantity: data[`exchangeQuantity_${itemId}`] || 1,
            exchangePrice: exchangeProduct.price || 0,
          };
        });
      }

      await returnOrExchangeOrder({
        id: orderId,
        type,
        items,
        reason: data.reason
      }).unwrap();

      notifySuccess(`${type === 'returned' ? 'Return' : 'Exchange'} request submitted successfully!`);
      setShowReturnModal(null);
      reset();
    } catch (error) {
      notifyError(error?.data?.message || error?.message || `Failed to ${type} order`);
    }
  };

  const getDisplayStatus = (order) => {
    const base = (order?.status || '').toLowerCase();
    if (!order) {
      return { key: base || 'pending', label: order?.status || '' };
    }

    const returnItems = Array.isArray(order.returnItems) ? order.returnItems : [];
    const exchangeItems = Array.isArray(order.exchangeItems) ? order.exchangeItems : [];

    if (returnItems.length > 0) {
      const anyPending = returnItems.some((ri) => (ri?.status || '').toLowerCase() === 'pending');
      const anyApproved = returnItems.some((ri) => (ri?.status || '').toLowerCase() === 'approved');
      const anyRejected = returnItems.some((ri) => (ri?.status || '').toLowerCase() === 'rejected');
      const anyRefundCompleted = returnItems.some(
        (ri) => (ri?.refundStatus || '').toLowerCase() === 'completed'
      );

      if (anyRefundCompleted) return { key: 'returned', label: 'Refunded' };
      if (anyApproved) return { key: 'returned', label: 'Return Approved' };
      if (anyPending) return { key: 'returned', label: 'Return Requested' };
      if (anyRejected) return { key: 'returned', label: 'Return Rejected' };
    }

    if (exchangeItems.length > 0) {
      const anyAwaitingPayment = exchangeItems.some(
        (ei) => (ei?.status || '').toLowerCase() === 'awaiting_payment'
      );
      const anyPending = exchangeItems.some((ei) => (ei?.status || '').toLowerCase() === 'pending');
      const anyApproved = exchangeItems.some((ei) => (ei?.status || '').toLowerCase() === 'approved');
      const anyCompleted = exchangeItems.some((ei) => (ei?.status || '').toLowerCase() === 'completed');
      const anyRejected = exchangeItems.some((ei) => (ei?.status || '').toLowerCase() === 'rejected');

      if (anyCompleted) return { key: 'exchanged', label: 'Exchange Completed' };
      if (anyAwaitingPayment) return { key: 'exchanged', label: 'Awaiting Payment' };
      if (anyApproved) return { key: 'exchanged', label: 'Exchange Approved' };
      if (anyPending) return { key: 'exchanged', label: 'Exchange Requested' };
      if (anyRejected) return { key: 'exchanged', label: 'Exchange Rejected' };
    }

    if (base === 'delivered') return { key: 'delivered', label: 'Delivered' };
    if (base === 'processing') return { key: 'processing', label: 'Processing' };
    if (base === 'pending') return { key: 'pending', label: 'Pending' };
    if (base === 'cancel') return { key: 'cancel', label: 'Cancel' };
    if (base === 'returned') return { key: 'returned', label: 'Returned' };
    if (base === 'exchanged') return { key: 'exchanged', label: 'Exchanged' };

    return { key: base || 'pending', label: order?.status || '' };
  };
  return (
    <div className="profile__ticket table-responsive">
      {!order_items ||
        (order_items?.length === 0 && (
          <div
            style={{ height: "210px" }}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="text-center">
              <i
                style={{ fontSize: "30px" }}
                className="fa-solid fa-cart-circle-xmark"
              ></i>
              <p>You Have no order Yet!</p>
            </div>
          </div>
        ))}
      {order_items && order_items?.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Order Id</th>
              <th scope="col">Order Time</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {order_items.map((item, i) => (
              <tr key={i}>
                <th scope="row">{(item.orderId || (item._id ? String(item._id).slice(-6) : '')).replace(/-/g, '')}</th>
                <td data-info="title">
                  {dayjs(item.createdAt).format("MMMM D, YYYY")}
                </td>
                {(() => {
                  const ds = getDisplayStatus(item);
                  return (
                    <td
                      data-info={`status ${ds.key === "pending" ? "pending" : ""} ${ds.key === "processing" ? "hold" : ""} ${ds.key === "delivered" ? "done" : ""} ${ds.key === "returned" ? "warning" : ""} ${ds.key === "exchanged" ? "info" : ""}`}
                      className={`status ${ds.key === "pending" ? "pending" : ""} ${ds.key === "processing" ? "hold" : ""} ${ds.key === "delivered" ? "done" : ""} ${ds.key === "returned" ? "warning" : ""} ${ds.key === "exchanged" ? "info" : ""}`}
                    >
                      {ds.label}
                    </td>
                  );
                })()}
                <td>
                  <div className="d-flex gap-2 flex-wrap align-items-center">
                    <button
                      type="button"
                      onClick={() => setShowViewModal(item._id)}
                      title="View Order Details"
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '34px', height: '34px', borderRadius: '6px',
                        border: '1px solid #F875AA', background: '#fff0f6', color: '#F875AA',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#F875AA'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff0f6'; e.currentTarget.style.color = '#F875AA'; }}
                    >
                      <QuickView />
                    </button>
                    <Link href={`/order/${item._id}`} className="tp-logout-btn" style={{ fontSize: '12px', padding: '5px 10px' }}>
                      Invoice
                    </Link>
                    {(() => {
                      const ds = getDisplayStatus(item);
                      return ds.key !== 'delivered' && ds.key !== 'cancel' && ds.key !== 'returned' && ds.key !== 'exchanged';
                    })() && (
                        <button
                          type="button"
                          onClick={() => setShowCancelModal(item._id)}
                          className="tp-btn tp-btn-border"
                          style={{ fontSize: '12px', padding: '5px 10px', background: '#fff', color: '#dc3545', borderColor: '#dc3545' }}
                        >
                          Cancel
                        </button>
                      )}
                    {(() => {
                      const ds = getDisplayStatus(item);
                      return ds.key === 'delivered';
                    })() && (
                        <button
                          type="button"
                          onClick={() => setShowReturnModal({ id: item._id, type: 'returned' })}
                          className="tp-btn tp-btn-border"
                          style={{ fontSize: '12px', padding: '5px 10px', background: '#fff', color: '#0d6efd', borderColor: '#0d6efd' }}
                        >
                          Return
                        </button>
                      )}
                    {(() => {
                      const ds = getDisplayStatus(item);
                      return ds.key === 'delivered';
                    })() && (
                        <button
                          type="button"
                          onClick={() => setShowReturnModal({ id: item._id, type: 'exchanged' })}
                          className="tp-btn tp-btn-border"
                          style={{ fontSize: '12px', padding: '5px 10px', background: '#fff', color: '#198754', borderColor: '#198754' }}
                        >
                          Exchange
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
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
              onClick={() => {
                setShowCancelModal(null);
                reset();
              }}
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
            <h3 className="mb-20">Cancel Order</h3>
            <form onSubmit={handleSubmit((data) => handleCancelOrder(showCancelModal, data))}>
              <div className="mb-15">
                <label>Reason for Cancellation *</label>
                <textarea
                  {...register("reason", { required: "Reason is required" })}
                  className="tp-checkout-input"
                  rows="4"
                  placeholder="Please provide a reason for cancelling this order"
                />
                <ErrorMsg msg={errors?.reason?.message} />
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelModal(null);
                    reset();
                  }}
                  className="tp-btn tp-btn-border"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCancelling}
                  className="tp-checkout-btn"
                  style={{ flex: 1, background: '#dc3545' }}
                >
                  {isCancelling ? "Cancelling..." : "Confirm Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return/Exchange Modal */}
      {showReturnModal && orderDetails?.data?.order && (
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
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            padding: '40px'
          }}>
            <button
              onClick={() => {
                setShowReturnModal(null);
                setSelectedItems([]);
                reset();
              }}
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
            <h3 className="mb-20">
              {showReturnModal.type === 'returned' ? 'Return Items' : 'Exchange Items'}
            </h3>
            <form onSubmit={handleSubmit((data) => {
              data.selectedItems = selectedItems;
              handleReturnExchange(showReturnModal.id, showReturnModal.type, data);
            })}>
              {/* Order Items Selection */}
              <div className="mb-20">
                <label className="mb-10 d-block"><strong>Select Items to {showReturnModal.type === 'returned' ? 'Return' : 'Exchange'}:</strong></label>
                <div className="border rounded p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {orderDetails.data.order.cart?.map((item, index) => {
                    const itemId = item._id || `item_${index}`;
                    return (
                      <div key={itemId} className="mb-3 p-3 border rounded" style={{ backgroundColor: selectedItems.includes(itemId) ? '#f0f8ff' : '#fff' }}>
                        <div className="d-flex align-items-start">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(itemId)}
                            onChange={(e) => {
                              handleItemSelection(itemId, e.target.checked);
                              if (!e.target.checked) {
                                // Reset quantities when unchecking
                                setValue(`quantity_${itemId}`, '');
                                if (showReturnModal.type === 'exchanged') {
                                  setValue(`exchangeProduct_${itemId}`, '');
                                  setValue(`exchangeQuantity_${itemId}`, '');
                                }
                              } else {
                                // Set default quantity
                                setValue(`quantity_${itemId}`, item.orderQuantity || 1);
                              }
                            }}
                            className="me-3 mt-2"
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              {item.img && (
                                <Image
                                  src={item.img}
                                  alt={item.title}
                                  width={60}
                                  height={60}
                                  className="me-3 rounded"
                                  style={{ objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <strong>{item.title}</strong>
                                <p className="mb-0 text-muted">₹{item.price} × {item.orderQuantity} = ₹{(item.price * (item.orderQuantity || 1)).toFixed(2)}</p>
                              </div>
                            </div>

                            {selectedItems.includes(itemId) && (
                              <div className="mt-2">
                                <label className="small">Quantity to {showReturnModal.type === 'returned' ? 'Return' : 'Exchange'}:</label>
                                <input
                                  type="number"
                                  {...register(`quantity_${itemId}`, {
                                    required: true,
                                    min: 1,
                                    max: item.orderQuantity || 1
                                  })}
                                  className="form-control form-control-sm"
                                  style={{ maxWidth: '100px' }}
                                  defaultValue={item.orderQuantity || 1}
                                />

                                {showReturnModal.type === 'exchanged' && (
                                  <div className="mt-2">
                                    <label className="small">Exchange Product:</label>
                                    <select
                                      {...register(`exchangeProduct_${itemId}`, { required: true })}
                                      className="form-control form-control-sm"
                                    >
                                      <option value="">Select Product</option>
                                      {allProducts?.data?.filter(p => p._id !== item._id).map(product => (
                                        <option key={product._id} value={product._id}>
                                          {product.title} - ₹{product.price}
                                        </option>
                                      ))}
                                    </select>

                                    {watch(`exchangeProduct_${itemId}`) && (
                                      <div className="mt-2">
                                        <label className="small">Exchange Quantity:</label>
                                        <input
                                          type="number"
                                          {...register(`exchangeQuantity_${itemId}`, {
                                            required: true,
                                            min: 1
                                          })}
                                          className="form-control form-control-sm"
                                          style={{ maxWidth: '100px' }}
                                          defaultValue={1}
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedItems.length === 0 && (
                  <p className="text-danger small mt-2">Please select at least one item</p>
                )}
              </div>

              <div className="mb-15">
                <label>Reason for {showReturnModal.type === 'returned' ? 'Return' : 'Exchange'} *</label>
                <textarea
                  {...register("reason", { required: "Reason is required" })}
                  className="tp-checkout-input"
                  rows="4"
                  placeholder={`Please provide a reason for ${showReturnModal.type === 'returned' ? 'returning' : 'exchanging'} these items`}
                />
                <ErrorMsg msg={errors?.reason?.message} />
              </div>

              {/* Refund/Exchange Summary */}
              {selectedItems.length > 0 && (
                <div className="mb-15 p-3 bg-light rounded">
                  <strong>Summary:</strong>
                  {showReturnModal.type === 'returned' ? (
                    <div>
                      <p className="mb-0 mt-2">
                        Estimated Refund: ₹{selectedItems.reduce((total, itemId) => {
                          const item = orderDetails.data.order.cart.find(c => (c._id === itemId) || (`item_${orderDetails.data.order.cart.indexOf(c)}` === itemId));
                          const qty = watch(`quantity_${itemId}`) || item?.orderQuantity || 1;
                          return total + ((item?.price || 0) * qty);
                        }, 0).toFixed(2)}
                      </p>
                      <small className="text-muted">Refund will be processed to your original payment method</small>
                    </div>
                  ) : (
                    <div>
                      {selectedItems.map(itemId => {
                        const item = orderDetails.data.order.cart.find(c => (c._id === itemId) || (`item_${orderDetails.data.order.cart.indexOf(c)}` === itemId));
                        const exchangeProductId = watch(`exchangeProduct_${itemId}`);
                        const exchangeProduct = allProducts?.data?.find(p => p._id === exchangeProductId);
                        const originalQty = watch(`quantity_${itemId}`) || item?.orderQuantity || 1;
                        const exchangeQty = watch(`exchangeQuantity_${itemId}`) || 1;
                        const originalTotal = (item?.price || 0) * originalQty;
                        const exchangeTotal = exchangeProduct ? (exchangeProduct.price * exchangeQty) : 0;
                        const difference = exchangeTotal - originalTotal;

                        return (
                          <div key={itemId} className="mt-2">
                            <p className="mb-1">
                              {item?.title}: ₹{originalTotal.toFixed(2)} →
                              {exchangeProduct ? `${exchangeProduct.title}: ₹${exchangeTotal.toFixed(2)}` : 'Select product'}
                            </p>
                            {exchangeProduct && (
                              <p className={`mb-0 small ${difference > 0 ? 'text-danger' : difference < 0 ? 'text-success' : ''}`}>
                                {difference > 0 ? `You need to pay: ₹${difference.toFixed(2)}` :
                                  difference < 0 ? `You will receive: ₹${Math.abs(difference).toFixed(2)}` :
                                    'No price difference'}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReturnModal(null);
                    setSelectedItems([]);
                    reset();
                  }}
                  className="tp-btn tp-btn-border"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReturning || selectedItems.length === 0}
                  className="tp-checkout-btn"
                  style={{
                    flex: 1,
                    background: showReturnModal.type === 'returned' ? '#0d6efd' : '#198754',
                    opacity: selectedItems.length === 0 ? 0.5 : 1
                  }}
                >
                  {isReturning ? "Processing..." : `Submit ${showReturnModal.type === 'returned' ? 'Return' : 'Exchange'} Request`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Order Details Modal */}
      {showViewModal && (() => {
        const vd = viewOrderDetails?.data?.order;
        const isVdLoading = viewOrderDetails?.isLoading;
        return (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px'
          }} onClick={() => setShowViewModal(null)}>
            <div style={{
              backgroundColor: '#fff', borderRadius: '12px',
              maxWidth: '720px', width: '100%', maxHeight: '90vh',
              overflowY: 'auto', position: 'relative', padding: '0',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
            }} onClick={e => e.stopPropagation()}>
              {/* Header — global UI color #F875AA */}
              <div style={{
                padding: '20px 28px', borderBottom: '1px solid #eee',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #F875AA 0%, #ff9ec5 100%)',
                borderRadius: '12px 12px 0 0', color: '#fff'
              }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Order Details</h4>
                  {vd && <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.9 }}>{(vd.orderId || (vd._id ? String(vd._id).slice(-6) : '')).replace(/-/g, '')}</p>}
                </div>
                <button onClick={() => setShowViewModal(null)} style={{
                  background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
                  width: '32px', height: '32px', borderRadius: '8px', fontSize: '18px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>×</button>
              </div>

              {isVdLoading ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <p style={{ color: '#888' }}>Loading order details...</p>
                </div>
              ) : vd ? (
                <div style={{ padding: '24px 28px' }}>
                  {/* Order Info Grid */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px', marginBottom: '24px'
                  }}>
                    <div style={{ padding: '14px 16px', background: '#f8f9fa', borderRadius: '8px' }}>
                      <p style={{ margin: 0, fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order ID</p>
                      <p style={{ margin: '4px 0 0', fontWeight: 600, fontSize: '14px' }}>{(vd.orderId || (vd._id ? String(vd._id).slice(-6) : '')).replace(/-/g, '')}</p>
                    </div>
                    <div style={{ padding: '14px 16px', background: '#f8f9fa', borderRadius: '8px' }}>
                      <p style={{ margin: 0, fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Date</p>
                      <p style={{ margin: '4px 0 0', fontWeight: 600, fontSize: '14px' }}>{dayjs(vd.createdAt).format('MMMM D, YYYY')}</p>
                    </div>
                    <div style={{ padding: '14px 16px', background: '#f8f9fa', borderRadius: '8px' }}>
                      <p style={{ margin: 0, fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</p>
                      <p style={{
                        margin: '4px 0 0', fontWeight: 600, fontSize: '14px',
                        color: getDisplayStatus(vd).key === 'delivered' ? '#198754'
                          : getDisplayStatus(vd).key === 'cancel' ? '#dc3545'
                            : getDisplayStatus(vd).key === 'processing' ? '#fd7e14' : '#F875AA'
                      }}>{getDisplayStatus(vd).label}</p>
                    </div>
                    <div style={{ padding: '14px 16px', background: '#f8f9fa', borderRadius: '8px' }}>
                      <p style={{ margin: 0, fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment</p>
                      <p style={{ margin: '4px 0 0', fontWeight: 600, fontSize: '14px', textTransform: 'capitalize' }}>{vd.paymentMethod || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {(vd.shippingAddress || vd.user) && (
                    <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
                      <h6 style={{ margin: '0 0 10px', fontSize: '13px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shipping Address</h6>
                      <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#333' }}>
                        {vd.shippingAddress?.name || vd.user?.name || ''}<br />
                        {vd.shippingAddress?.address || vd.address || ''}
                        {(vd.shippingAddress?.city || vd.city) && <><br />{vd.shippingAddress?.city || vd.city}{(vd.shippingAddress?.state || vd.state) ? `, ${vd.shippingAddress?.state || vd.state}` : ''} {vd.shippingAddress?.zipCode || vd.zipCode || ''}</>}
                        {(vd.shippingAddress?.country || vd.country) && <><br />{vd.shippingAddress?.country || vd.country}</>}
                      </p>
                    </div>
                  )}

                  {/* Products */}
                  <h6 style={{ margin: '0 0 12px', fontSize: '13px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Products</h6>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    {vd.cart?.map((cartItem, idx) => (
                      <div key={idx} style={{
                        display: 'flex', gap: '14px', padding: '14px',
                        border: '1px solid #f0f0f0', borderRadius: '8px',
                        alignItems: 'flex-start'
                      }}>
                        {cartItem.img && (
                          <Image src={cartItem.img} alt={cartItem.title || ''}
                            width={70} height={70}
                            style={{ borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#222' }}>{cartItem.title}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                            {cartItem.sku && (
                              <span style={{ fontSize: '12px', color: '#666', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }}>SKU: {cartItem.sku}</span>
                            )}
                            {cartItem.color && cartItem.color.name && (
                              <span style={{ fontSize: '12px', color: '#666', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cartItem.color.clrCode || cartItem.color.name, display: 'inline-block', border: '1px solid #ddd' }}></span>
                                {cartItem.color.name}
                              </span>
                            )}
                            {cartItem.size && (
                              <span style={{ fontSize: '12px', color: '#666', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }}>Size: {cartItem.size}</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                            <span style={{ fontSize: '13px', color: '#888' }}>Qty: {cartItem.orderQuantity || 1}</span>
                            <span style={{ fontWeight: 700, fontSize: '14px', color: '#F875AA' }}>₹{((cartItem.price || 0) * (cartItem.orderQuantity || 1)).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div style={{
                    padding: '16px', background: 'linear-gradient(135deg, #fff0f6 0%, #ffe4ef 100%)',
                    borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#555' }}>Order Total</span>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: '#F875AA' }}>₹{(vd.totalAmount || vd.subTotal || 0).toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <p style={{ color: '#888' }}>Order not found.</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default MyOrders;
