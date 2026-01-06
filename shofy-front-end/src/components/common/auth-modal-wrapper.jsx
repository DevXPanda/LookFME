'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import AuthModal from './auth-modal';

// Check if running on client side
const isClient = typeof window !== 'undefined';

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/cart',
  '/checkout',
  '/profile',
  '/order',
  '/track-orders',
  '/wishlist',
];

const AuthModalWrapper = () => {
  const [showModal, setShowModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  // Listen for add to cart events
  useEffect(() => {
    const handleShowAuthModal = (event) => {
      try {
        const userInfoCookie = Cookies.get('userInfo');
        let isAuthenticated = false;
        
        if (userInfoCookie) {
          try {
            const userInfo = JSON.parse(userInfoCookie);
            isAuthenticated = userInfo?.user && (userInfo.user.name || userInfo.user.email);
          } catch (e) {
            // If parsing fails, check Redux state
            isAuthenticated = user?.name || user?.email;
          }
        } else {
          // Fallback to Redux state
          isAuthenticated = user?.name || user?.email;
        }
        
        if (!isAuthenticated) {
          setShowModal(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // On error, show modal to be safe
        setShowModal(true);
      }
    };

    if (isClient) {
      window.addEventListener('showAuthModal', handleShowAuthModal);
      return () => {
        window.removeEventListener('showAuthModal', handleShowAuthModal);
      };
    }
  }, [user]);

  useEffect(() => {
    // Check if user is authenticated
    try {
      const userInfoCookie = Cookies.get('userInfo');
      let isAuthenticated = false;
      
      if (userInfoCookie) {
        try {
          const userInfo = JSON.parse(userInfoCookie);
          isAuthenticated = userInfo?.user && (userInfo.user.name || userInfo.user.email);
        } catch (e) {
          isAuthenticated = user?.name || user?.email;
        }
      } else {
        isAuthenticated = user?.name || user?.email;
      }

      // Check if current route is protected
      const isProtectedRoute = PROTECTED_ROUTES.some(route => 
        pathname.startsWith(route)
      );

      // Check if trying to access product purchase pages (product details)
      const isProductPurchasePage = pathname.startsWith('/product-details') || 
                                    pathname.startsWith('/combo-details');

      // Show modal if:
      // 1. User is not authenticated AND
      // 2. (It's a protected route OR it's a product purchase page) AND
      // 3. Modal hasn't been shown yet in this session
      if (!isAuthenticated && (isProtectedRoute || isProductPurchasePage)) {
        // Check if modal was already shown in this session
        if (isClient) {
          const modalShown = sessionStorage.getItem('authModalShown');
          if (!modalShown) {
            setShowModal(true);
            sessionStorage.setItem('authModalShown', 'true');
            setHasShownModal(true);
          } else if (!hasShownModal) {
            setHasShownModal(true);
          }
        }
      } else if (isAuthenticated && showModal) {
        // Close modal if user becomes authenticated
        setShowModal(false);
        if (isClient) {
          sessionStorage.removeItem('authModalShown');
        }
      }

      // Redirect protected routes if not authenticated and modal was shown
      if (!isAuthenticated && isProtectedRoute && hasShownModal) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error in auth check useEffect:', error);
    }
  }, [pathname, user, showModal, hasShownModal, router]);

  const handleClose = () => {
    // Don't allow closing if on protected route
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname.startsWith(route)
    );
    if (isProtectedRoute) {
      // Redirect to home if trying to close on protected route
      router.push('/');
    }
    setShowModal(false);
  };

  return (
    <AuthModal 
      isOpen={showModal} 
      onClose={handleClose}
      redirectTo={pathname}
    />
  );
};

export default AuthModalWrapper;

