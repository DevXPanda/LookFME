"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useGetBulkProductsQuery, useSubmitBulkOrderMutation, useGetMyBulkRequestsQuery, useLazyGetBulkRequestsByEmailQuery } from "@/redux/features/bulkOrderApi";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import { notifyError, notifySuccess } from "@/utils/toast";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  pinCode: "",
  preferredContact: "email",
  comments: "",
};

const PREFIX_BULK = "b-";
const PREFIX_PRODUCT = "p-";

const BulkOrderArea = () => {
  const [formData, setFormData] = useState(initialForm);
  const [items, setItems] = useState([{ selected: "", productLabel: "", quantity: 1 }]);
  const [guestEmail, setGuestEmail] = useState("");

  const { user } = useSelector((state) => state.auth);
  const userInfoCookie = Cookies.get("userInfo");
  const isLoggedIn = useMemo(() => {
    if (userInfoCookie) {
      try {
        const u = JSON.parse(userInfoCookie);
        return !!(u?.user?._id || u?.user?.email);
      } catch (_) {}
    }
    return !!(user?._id || user?.email);
  }, [user, userInfoCookie]);

  const { data: productsData, isLoading: productsLoading } = useGetBulkProductsQuery();
  const { data: catalogData } = useGetAllProductsQuery(undefined, { skip: false });
  const [submitBulkOrder, { isLoading: isSubmitting }] = useSubmitBulkOrderMutation();
  const { data: myRequestsData, refetch: refetchMyRequests } = useGetMyBulkRequestsQuery(undefined, { skip: !isLoggedIn });
  const [fetchByEmail, { data: byEmailData, isLoading: byEmailLoading }] = useLazyGetBulkRequestsByEmailQuery();

  const bulkProducts = useMemo(() => productsData?.data || [], [productsData]);
  const catalogProducts = useMemo(() => (catalogData?.data && Array.isArray(catalogData.data) ? catalogData.data : []), [catalogData]);
  const requestList = isLoggedIn ? (myRequestsData?.data || []) : (byEmailData?.data || []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const getProductLabel = (selectedVal) => {
    if (!selectedVal) return "";
    if (selectedVal.startsWith(PREFIX_BULK)) {
      const id = selectedVal.slice(PREFIX_BULK.length);
      const p = bulkProducts.find((x) => x._id === id);
      return p ? p.name : "";
    }
    if (selectedVal.startsWith(PREFIX_PRODUCT)) {
      const id = selectedVal.slice(PREFIX_PRODUCT.length);
      const p = catalogProducts.find((x) => x._id === id);
      return p ? (p.title || p.name || "") : "";
    }
    return "";
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      if (field === "selected") {
        next[index].productLabel = getProductLabel(value);
      }
      return next;
    });
  };

  const addItem = () => {
    setItems((prev) => [...prev, { selected: "", productLabel: "", quantity: 1 }]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validItems = [];
    for (const it of items) {
      const qty = Number(it.quantity);
      if (!it.selected || qty < 1) continue;
      if (it.selected.startsWith(PREFIX_BULK)) {
        validItems.push({ bulkProduct: it.selected.slice(PREFIX_BULK.length), quantity: qty });
      } else if (it.selected.startsWith(PREFIX_PRODUCT)) {
        validItems.push({ product: it.selected.slice(PREFIX_PRODUCT.length), quantity: qty });
      }
    }
    if (validItems.length === 0) {
      notifyError("Please add at least one product with quantity.");
      return;
    }
    try {
      const userId = user?._id || (userInfoCookie ? JSON.parse(userInfoCookie)?.user?._id : null);
      const payload = {
        ...formData,
        items: validItems,
        ...(userId ? { user: userId } : {}),
      };
      const res = await submitBulkOrder(payload).unwrap();
      if (res.success) {
        notifySuccess(res.message || "Bulk order request submitted successfully!");
        setFormData(initialForm);
        setItems([{ selected: "", productLabel: "", quantity: 1 }]);
        if (isLoggedIn) refetchMyRequests();
      }
    } catch (err) {
      notifyError(err?.data?.message || err?.message || "Something went wrong.");
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#F875AA] transition-all bg-white text-gray-700";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <section className="py-12">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h4 className="text-4xl font-bold mb-2">Bulk Order</h4>
          <p className="text-gray-600 mb-8">
            Submit your bulk order request. We will get back to you at your preferred contact method.
          </p>

          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className={labelClass}>Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email *</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className={labelClass}>Phone *</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className={inputClass}
                placeholder="+91 85060 69811"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="city" className={labelClass}>City *</label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                  placeholder="City"
                />
              </div>
              <div>
                <label htmlFor="state" className={labelClass}>State *</label>
                <input
                  type="text"
                  id="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                  placeholder="State"
                />
              </div>
              <div>
                <label htmlFor="pinCode" className={labelClass}>Pin Code *</label>
                <input
                  type="text"
                  id="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                  placeholder="Pin Code"
                />
              </div>
            </div>

            <div className="mb-4">
              <span className={labelClass}>Preferred Contact *</span>
              <div className="flex gap-4 mt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="email"
                    checked={formData.preferredContact === "email"}
                    onChange={handleInputChange}
                    className="text-[#F875AA] focus:ring-[#F875AA]"
                  />
                  <span className="text-gray-700">Email</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="phone"
                    checked={formData.preferredContact === "phone"}
                    onChange={handleInputChange}
                    className="text-[#F875AA] focus:ring-[#F875AA]"
                  />
                  <span className="text-gray-700">Phone</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Products Required *</label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm font-semibold text-[#F875AA] hover:text-[#e6669a]"
                >
                  + Add product
                </button>
              </div>
              {productsLoading ? (
                <p className="text-gray-500 text-sm">Loading products...</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex flex-wrap gap-2 items-end">
                      <div className="flex-1 min-w-[200px]">
                        <select
                          value={item.selected}
                          onChange={(e) => handleItemChange(index, "selected", e.target.value)}
                          className={inputClass}
                          required={index === 0}
                        >
                          <option value="">Select product</option>
                          {bulkProducts.length > 0 && (
                            <optgroup label="Bulk items">
                              {bulkProducts.map((p) => (
                                <option key={p._id} value={`${PREFIX_BULK}${p._id}`}>{p.name}</option>
                              ))}
                            </optgroup>
                          )}
                          {catalogProducts.length > 0 && (
                            <optgroup label="Shop / Homepage products">
                              {catalogProducts.slice(0, 100).map((p) => (
                                <option key={p._id} value={`${PREFIX_PRODUCT}${p._id}`}>{p.title || p.name || p._id}</option>
                              ))}
                              {catalogProducts.length > 100 && (
                                <option disabled>… and more (search in shop)</option>
                              )}
                            </optgroup>
                          )}
                        </select>
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={items.length <= 1}
                        className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="comments" className={labelClass}>Comments / Message</label>
              <textarea
                id="comments"
                value={formData.comments}
                onChange={handleInputChange}
                rows={4}
                className={inputClass}
                placeholder="Any additional details or requirements..."
              />
            </div>

            <button
              disabled={isSubmitting || productsLoading}
              type="submit"
              className={`bg-[#F875AA] text-white font-bold py-3 px-8 rounded-lg text-lg transition-all ${(isSubmitting || productsLoading) ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e6669a]"}`}
            >
              {isSubmitting ? "Submitting..." : "Submit Bulk Order Request"}
            </button>
          </form>

          {/* Your Bulk Order Requests */}
          <div className="mt-12">
            <h4 className="text-2xl font-bold mb-4">Your Bulk Order Requests</h4>
            {!isLoggedIn && (
              <div className="mb-4 flex flex-wrap gap-2 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className={labelClass}>View status by email</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={inputClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => guestEmail.trim() && fetchByEmail(guestEmail.trim())}
                  disabled={!guestEmail.trim() || byEmailLoading}
                  className="bg-gray-700 text-white font-semibold py-3 px-5 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {byEmailLoading ? "Loading..." : "View my requests"}
                </button>
              </div>
            )}
            {requestList.length === 0 && (isLoggedIn || byEmailData) && (
              <p className="text-gray-500 py-4">No bulk order requests yet.</p>
            )}
            {requestList.length > 0 && (
              <div className="space-y-4">
                {requestList.map((req) => {
                  const statusClass =
                    req.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : req.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800";
                  const lastUpdate = (req.statusHistory && req.statusHistory.length > 0)
                    ? req.statusHistory[req.statusHistory.length - 1]?.updatedAt
                    : req.updatedAt || req.createdAt;
                  return (
                    <div
                      key={req._id}
                      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-sm text-gray-500">
                          Submitted: {req.createdAt
                            ? new Date(req.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${statusClass}`}>
                          {req.status ? req.status.charAt(0).toUpperCase() + req.status.slice(1) : ""}
                        </span>
                      </div>
                      {lastUpdate && (
                        <p className="text-xs text-gray-500 mb-2">
                          Last updated: {new Date(lastUpdate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                      <div className="mb-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Products required</span>
                        <ul className="mt-1 text-sm text-gray-700 list-disc list-inside">
                          {(req.items || []).map((it, i) => (
                            <li key={i}>
                              {it.productName} × {it.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {req.status === "accepted" && (
                        <Link
                          href="/contact"
                          className="inline-block mt-2 bg-[#F875AA] text-white font-semibold py-2 px-5 rounded-lg hover:bg-[#e6669a] transition-colors"
                        >
                          Proceed to purchase
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BulkOrderArea;
