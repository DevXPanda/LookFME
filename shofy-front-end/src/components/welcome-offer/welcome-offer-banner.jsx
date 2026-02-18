'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetWelcomeOfferQuery } from '@/redux/features/welcomeOffer/welcomeOfferApi';

const SESSION_KEY = 'welcome_offer_banner_dismissed';

const WelcomeOfferBanner = () => {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetWelcomeOfferQuery();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDismissed = sessionStorage.getItem(SESSION_KEY) === '1';
    setDismissed(isDismissed);
  }, []);

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, '1');
    }
    setDismissed(true);
  };

  if (isLoading) return null;

  const offer = data?.data;
  if (!offer) return null;

  const isActive = offer?.isActive === true;
  if (!isActive) return null;

  const totalOrders = user?.totalOrders ?? 0;
  const isFirstOrder = totalOrders === 0;
  
  if (!isFirstOrder) return null;
  if (dismissed) return null;

  const show = true;

  const percent = offer.discountPercent ?? 10;
  const text = offer.bannerText?.trim() || `Welcome! Get ${percent}% off on your first order`;

  return (
    <div 
      className="tp-welcome-offer-banner text-white py-2.5 px-4 d-flex align-items-center justify-content-center position-relative w-100"
      style={{ 
        minHeight: '48px',
        backgroundColor: '#F875AA',
        zIndex: 10000,
        position: 'sticky',
        top: 0,
        fontSize: '15px',
        fontWeight: '600',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div className="container">
        <div className="d-flex align-items-center justify-content-center position-relative w-100">
          <span className="me-2" style={{ fontSize: '18px' }}>🎉</span>
          <span style={{ textAlign: 'center' }}>{text}</span>
          <button
            type="button"
            onClick={handleDismiss}
            className="position-absolute end-0 btn btn-link text-white p-0"
            style={{ 
              fontSize: '1.75rem', 
              lineHeight: 1,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '0 12px',
              opacity: 0.8,
              fontWeight: '300'
            }}
            aria-label="Dismiss"
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOfferBanner;
