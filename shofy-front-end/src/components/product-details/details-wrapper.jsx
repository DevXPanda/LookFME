'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Rating } from 'react-simple-star-rating';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
// internal
import { notifyError } from '@/utils/toast';
import { AskQuestion, CompareTwo, WishlistTwo } from '@/svg';
import DetailsBottomInfo from './details-bottom-info';
import ProductDetailsCountdown from './product-details-countdown';
import ProductQuantity from './product-quantity';
import useAddToCart from '@/hooks/use-add-to-cart';
import { add_cart_product } from '@/redux/features/cartSlice';
import { add_to_wishlist } from '@/redux/features/wishlist-slice';
import { add_to_compare } from '@/redux/features/compareSlice';
import { handleModalClose } from '@/redux/features/productModalSlice';
import { getProductPrice } from '@/utils/price-utils';

const formatImageUrl = (url) => {
  if (!url || typeof url !== "string") return "https://placehold.co/200x200?text=No+Image";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) {
    return `http://localhost:7000${url}`;
  }
  return url;
};

const DetailsWrapper = ({ productItem, handleImageActive, activeImg, detailsBottom = false }) => {
  const { sku, img, title, imageURLs, category, description, discount, price, status, reviews, tags, offerDate } = productItem || {};
  const [ratingVal, setRatingVal] = useState(0);
  const [textMore, setTextMore] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { handleAddToCart } = useAddToCart();
  const { user } = useSelector((state) => state.auth);

  const { currentPrice, originalPrice, isDiscountActive } = getProductPrice(productItem);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const rating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;
      setRatingVal(rating);
    } else {
      setRatingVal(0);
    }
  }, [reviews]);

  // Consolidate colors from all sources
  const allAvailableColors = useMemo(() => {
    const topLevelColor = productItem?.color ? [{
      name: typeof productItem.color === 'object' ? productItem.color.name : productItem.color,
      clrCode: productItem.color?.clrCode || "#000000",
      img: productItem.img
    }] : [];

    const colorsInImageURLs = (imageURLs || [])
      .filter(item => item.color?.name || item.color?.clrCode)
      .map(item => ({
        name: item.color?.name,
        clrCode: item.color?.clrCode || "#000000",
        img: item.img
      }));

    const colorsInVariations = (productItem?.variations || [])
      .map(v => ({
        name: v.colorName,
        clrCode: v.colorCode || "#000000",
        img: v.image
      }));

    // Unique colors based on name
    return [...new Map([
      ...topLevelColor,
      ...colorsInImageURLs,
      ...colorsInVariations
    ].filter(c => c.name).map(c => [c.name, c])).values()];
  }, [productItem, imageURLs]);

  // Consolidate attributes (Size, Pack, etc.) from all sources
  const attributes = useMemo(() => {
    const attr = (productItem?.variations || []).reduce((acc, v) => {
      const type = v.attributeType || "Size";
      const val = v.attributeValue;
      if (val && typeof val === 'string' && val.trim().length > 0) {
        if (!acc[type]) acc[type] = [];
        acc[type].push(val.trim());
      }
      return acc;
    }, {});

    // Add top-level sizes and imageURLs sizes to "Size" attribute
    const topLevelSizes = [
      ...(productItem?.sizes || []),
      ...(productItem?.size ? [productItem.size] : [])
    ].filter(s => s && typeof s === 'string' && s.trim().length > 0)
      .map(s => s.trim());

    const sizesInImageURLs = (imageURLs || [])
      .flatMap(item => item.sizes || [])
      .filter(s => s && typeof s === 'string' && s.trim().length > 0)
      .map(s => s.trim());

    if (!attr["Size"]) attr["Size"] = [];
    attr["Size"] = [...new Set([...attr["Size"], ...topLevelSizes, ...sizesInImageURLs])];

    // Remove empty attribute lists
    Object.keys(attr).forEach(key => {
      if (attr[key].length === 0) delete attr[key];
    });

    return attr;
  }, [productItem, imageURLs]);

  // Default size selection
  useEffect(() => {
    if (attributes["Size"]?.length > 0) {
      if (!selectedSize || !attributes["Size"].includes(selectedSize)) {
        setSelectedSize(attributes["Size"][0]);
      }
    }
  }, [attributes, selectedSize]);

  // Get active variation info
  const activeVariationByImageURL = imageURLs?.find(item => formatImageUrl(item.img) === activeImg);
  const activeVariationByVariation = productItem?.variations?.find(v => formatImageUrl(v.image) === activeImg);

  const activeSizes = activeVariationByImageURL?.sizes ||
    (activeVariationByVariation?.attributeType === "Size" ? [activeVariationByVariation.attributeValue] : []);

  // Default selected color
  useEffect(() => {
    if (allAvailableColors.length > 0 && !selectedColor) {
      const initialColor = allAvailableColors.find(c => formatImageUrl(c.img) === activeImg) || allAvailableColors[0];
      setSelectedColor(initialColor.name);
    }
  }, [allAvailableColors, activeImg, selectedColor]);

  // handle add product
  const handleAddProduct = (prd) => {
    // Check if any mandatory attributes are missing
    if (attributes["Size"]?.length > 0 && !selectedSize) {
      notifyError(`Please select a size`);
      return;
    }
    // Prepare product with selection info
    const productWithSelection = {
      ...prd,
      selectedSize,
      selectedColor: allAvailableColors.find(c => c.name === selectedColor) || null
    };
    handleAddToCart(productWithSelection);
  };

  // handle buy now - add to cart and redirect to checkout
  const [isBuyNowProcessing, setIsBuyNowProcessing] = useState(false);

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent multiple clicks/touches
    if (isBuyNowProcessing || status === 'out-of-stock') return;

    if (attributes["Size"]?.length > 0 && !selectedSize) {
      notifyError("Please select a size");
      return;
    }

    // Check authentication first
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

      if (!isAuthenticated) {
        // Show auth modal
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('showAuthModal', {
            detail: { source: 'buyNow', product: productItem }
          }));
        }
        return;
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('showAuthModal', {
          detail: { source: 'buyNow', product: productItem }
        }));
      }
      return;
    }

    setIsBuyNowProcessing(true);

    try {
      // Prepare product with selection info
      const productWithSelection = {
        ...productItem,
        selectedSize,
        selectedColor: allAvailableColors.find(c => c.name === selectedColor) || null
      };

      // Add product to cart
      dispatch(add_cart_product(productWithSelection));
      dispatch(handleModalClose());

      // Small delay to ensure cart state is updated before navigation
      // This is especially important on mobile devices
      await new Promise(resolve => setTimeout(resolve, 150));

      // Navigate to checkout
      router.push('/checkout');
    } catch (error) {
      console.error('Error in Buy Now:', error);
      setIsBuyNowProcessing(false);
    }
  };

  // handle wishlist product
  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  // handle compare product
  const handleCompareProduct = (prd) => {
    dispatch(add_to_compare(prd));
  };


  return (
    <div className="tp-product-details-wrapper">
      <div className="tp-product-details-category">
        <span>{category.name}</span>
      </div>
      <h3 className="tp-product-details-title">{title}</h3>

      {/* inventory details */}
      <div className="tp-product-details-inventory d-flex align-items-center mb-10">
        <div className="tp-product-details-stock mb-10">
          <span>{status}</span>
        </div>
        {isDiscountActive && (
          <div className="tp-product-details-stock mb-10 ml-10">
            <span className="product-offer" style={{ backgroundColor: '#f50963', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
              -{discount}%
            </span>
          </div>
        )}
        <div className="tp-product-details-rating-wrapper d-flex align-items-center mb-10">
          <div className="tp-product-details-rating">
            <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
          </div>
          <div className="tp-product-details-reviews">
            <span>({reviews && reviews.length > 0 ? reviews.length : 0} Review)</span>
          </div>
        </div>
      </div>

      {/* price */}
      <div className="tp-product-details-price-wrapper mb-20">
        {isDiscountActive ? (
          <>
            <span className="tp-product-details-price new-price">₹{(currentPrice || 0).toFixed(2)}</span>
            <span className="tp-product-details-price old-price ml-10" style={{ textDecoration: 'line-through', color: '#a0a0a0', fontSize: '16px' }}>
              ₹{(originalPrice || 0).toFixed(2)}
            </span>
          </>
        ) : (
          <span className="tp-product-details-price new-price">₹{(price || 0).toFixed(2)}</span>
        )}
      </div>

      {/* variations */}
      <div className="tp-product-details-variation">
        {allAvailableColors.length > 0 &&
          <div className="tp-product-details-variation-item">
            <h4 className="tp-product-details-variation-title">Color :</h4>
            <div className="tp-product-details-variation-list">
              {allAvailableColors.map((item, i) => {
                const isColorActive = item.name === selectedColor;
                return (
                  <button onClick={() => { handleImageActive(item); setSelectedColor(item.name); }} key={i} type="button"
                    className={`color tp-color-variation-btn ${isColorActive ? "active" : ""}`} >
                    <span
                      data-bg-color={`${item.clrCode || "#000000"}`}
                      style={{ backgroundColor: `${item.clrCode || "#000000"}` }}
                    ></span>
                    {item.name && (
                      <span className="tp-color-variation-tootltip">
                        {item.name}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>}

        {Object.keys(attributes).map((type, index) => (
          <div key={index} className="tp-product-details-variation-item">
            <h4 className="tp-product-details-variation-title">{type} :</h4>
            <div className="tp-product-details-variation-list">
              {attributes[type].map((val, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => type === "Size" ? setSelectedSize(val) : null}
                  className={`tp-size-variation-btn ${type === "Size" && selectedSize === val ? "selected" : ""}`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* if ProductDetailsCountdown true start */}
      {offerDate?.endDate && <ProductDetailsCountdown offerExpiryTime={offerDate?.endDate} />}
      {/* if ProductDetailsCountdown true end */}

      {/* actions */}
      <div className="tp-product-details-action-wrapper">
        <h3 className="tp-product-details-action-title">Quantity</h3>
        <div className="tp-product-details-action-item-wrapper d-sm-flex align-items-center">
          {/* product quantity */}
          <ProductQuantity />
          {/* product quantity */}
          <div className="tp-product-details-add-to-cart mb-15 w-100">
            <button onClick={() => handleAddProduct(productItem)} disabled={status === 'out-of-stock'} className="tp-product-details-add-to-cart-btn w-100">Add To Cart</button>
          </div>
        </div>
        <button
          onClick={handleBuyNow}
          disabled={status === 'out-of-stock' || isBuyNowProcessing}
          className="tp-product-details-buy-now-btn w-100"
          type="button"
          style={{
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            cursor: isBuyNowProcessing ? 'wait' : 'pointer'
          }}
        >
          {isBuyNowProcessing ? 'Processing...' : 'Buy Now'}
        </button>
      </div>
      {/* product-details-action-sm start */}
      <div className="tp-product-details-action-sm">
        <button disabled={status === 'out-of-stock'} onClick={() => handleCompareProduct(productItem)} type="button" className="tp-product-details-action-sm-btn">
          <CompareTwo />
          Compare
        </button>
        <button disabled={status === 'out-of-stock'} onClick={() => handleWishlistProduct(productItem)} type="button" className="tp-product-details-action-sm-btn">
          <WishlistTwo />
          Add Wishlist
        </button>
      </div>
      {/* product-details-action-sm end */}

      {detailsBottom && <DetailsBottomInfo category={category?.name} sku={sku} tag={tags[0]} />}
    </div >
  );
};

export default DetailsWrapper;