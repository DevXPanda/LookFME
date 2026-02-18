"use client";

import React from "react";
import { useGetWelcomeOfferAdminQuery } from "@/redux/welcomeOffer/welcomeOfferApi";
import Link from "next/link";

const WelcomeOfferCard = () => {
  const { data, isLoading } = useGetWelcomeOfferAdminQuery();

  if (isLoading || !data?.data) return null;

  const offer = data.data;
  const isActive = offer.isActive ?? false;
  const percent = offer.discountPercent ?? 0;

  return (
    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
      <span className="text-sm font-medium text-gray-600">Welcome Offer: </span>
      {isActive ? (
        <span className="text-sm text-gray-900">
          {percent}% OFF (Enabled)
        </span>
      ) : (
        <span className="text-sm text-gray-500">No Active Welcome Offer</span>
      )}
      <Link
        href="/marketing/welcome-offer"
        className="ml-2 text-sm text-theme hover:underline"
      >
        Configure
      </Link>
    </div>
  );
};

export default WelcomeOfferCard;
