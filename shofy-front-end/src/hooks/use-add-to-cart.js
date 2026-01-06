'use client';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { add_cart_product } from '@/redux/features/cartSlice';

const useAddToCart = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleAddToCart = (product) => {
    // Check if user is authenticated
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
        // Dispatch custom event to show auth modal
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('showAuthModal', { 
            detail: { source: 'addToCart', product } 
          }));
        }
        return false; // Return false to indicate action was blocked
      }

      // User is authenticated, proceed with adding to cart
      dispatch(add_cart_product(product));
      return true; // Return true to indicate action succeeded
    } catch (error) {
      console.error('Error in handleAddToCart:', error);
      // On error, show auth modal to be safe
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('showAuthModal', { 
          detail: { source: 'addToCart', product } 
        }));
      }
      return false;
    }
  };

  return {
    handleAddToCart,
  };
};

export default useAddToCart;

