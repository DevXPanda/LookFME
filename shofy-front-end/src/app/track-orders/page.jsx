"use client";
import React, { useState } from "react";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");

  const handleTrack = () => {
    if (!orderId) {
      setStatus("❌ Please enter a valid Order ID.");
      return;
    }
    // For now, just mock data
    setStatus("✅ Your order is currently: Out for Delivery.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Track Your Order</h2>
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          onClick={handleTrack}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Track Order
        </button>

        {status && (
          <p className="mt-4 text-center text-gray-700 font-medium">{status}</p>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
