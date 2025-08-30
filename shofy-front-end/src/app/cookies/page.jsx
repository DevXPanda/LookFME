"use client";
import React, { useState, useEffect } from "react";

const Cookies = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("lookfame_cookies");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("lookfame_cookies", "accepted");
    setVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("lookfame_cookies", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 max-w-lg bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50">
      <p className="text-sm text-gray-700">
        We use cookies to improve your experience on Lookfame. By continuing,
        you agree to our <a href="/privacy-policy" className="underline">Privacy Policy</a>.
      </p>
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={declineCookies}
          className="px-4 py-2 text-sm border border-gray-400 rounded hover:bg-gray-100"
        >
          Decline
        </button>
        <button
          onClick={acceptCookies}
          className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default Cookies;
