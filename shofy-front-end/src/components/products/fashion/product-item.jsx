import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";
import '@/styles/rating-fix.css';
import '@/styles/product-card-fix.css';
import { getProductPrice } from "@/utils/price-utils";

// internal
import { Cart, CompareThree, QuickView, Wishlist } from "@/svg";
import { handleProductModal } from "@/redux/features/productModalSlice";
import useAddToCart from "@/hooks/use-add-to-cart";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { add_to_compare } from "@/redux/features/compareSlice";

const ProductItem = ({ product }) => {
  const { _id, img, title, reviews, price = 0, tags = [], status } = product || {};
  const [ratingVal, setRatingVal] = useState(0);
  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const isAddedToCart = cart_products.some((prd) => prd._id === _id);
  const isAddedToWishlist = wishlist.some((prd) => prd._id === _id);
  const dispatch = useDispatch();
  const { handleAddToCart: addToCartHook } = useAddToCart();

  const { currentPrice, originalPrice, isDiscountActive } = getProductPrice(product);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const rating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
      setRatingVal(rating);
    } else {
      setRatingVal(0);
    }
  }, [reviews]);

  const handleAddProduct = (prd) => {
    if (prd.status === 'out-of-stock') return;
    addToCartHook(prd);
  };
  const handleWishlistProduct = (prd) => dispatch(add_to_wishlist(prd));
  const handleCompareProduct = (prd) => dispatch(add_to_compare(prd));

  return (
    <>
      <style>{`
        .custom-product-card {
           display: flex;
           flex-direction: column;
           height: 100%;
           border: 1px solid #f0f0f0;
           border-radius: 8px;
           overflow: hidden;
           background: #fff;
           transition: box-shadow 0.3s ease;
           position: relative;
        }
        .custom-product-card:hover {
           box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }
        .custom-image-wrapper {
           position: relative;
           height: 300px;
           width: 100%;
           background: #f8f8f8;
           overflow: hidden;
        }
        .custom-image-wrapper img {
           width: 100%;
           height: 100%;
           object-fit: cover;
           transition: transform 0.3s ease;
        }
        .custom-product-card:hover .custom-image-wrapper img {
           transform: scale(1.05);
        }
        .custom-stock-badge {
           position: absolute;
           top: 15px;
           left: 15px;
           background: #000;
           color: #fff;
           padding: 4px 10px;
           border-radius: 4px;
           font-size: 13px;
           font-weight: 600;
           z-index: 10;
        }
        .custom-product-content {
           padding: 16px;
           display: flex;
           flex-direction: column;
           flex-grow: 1;
        }
        .custom-product-title {
           font-size: 16px;
           font-weight: 500;
           color: #333;
           line-height: 1.4;
           display: -webkit-box;
           -webkit-line-clamp: 2;
           -webkit-box-orient: vertical;
           overflow: hidden;
           text-overflow: ellipsis;
           height: 45px;
           margin: 10px 0;
           text-decoration: none;
           transition: color 0.2s;
        }
        .custom-product-title:hover {
           color: #e53e3e;
        }
        .custom-price-wrapper {
           display: flex;
           align-items: center;
           flex-wrap: wrap;
           gap: 8px;
           margin-top: auto;
        }
        .custom-current-price {
           font-size: 18px;
           font-weight: 600;
           color: #111;
        }
        .custom-old-price {
           font-size: 14px;
           color: #888;
           text-decoration: line-through;
        }
        .custom-discount-text {
           font-size: 14px;
           font-weight: 600;
           color: #38a169;
        }
        .custom-overlay-actions {
           position: absolute;
           right: -45px;
           top: 15px;
           display: flex;
           flex-direction: column;
           gap: 8px;
           transition: right 0.3s ease;
           z-index: 10;
        }
        .custom-product-card:hover .custom-overlay-actions {
           right: 15px;
        }
        .custom-action-btn {
           width: 40px;
           height: 40px;
           border-radius: 50%;
           background: #fff;
           display: flex;
           align-items: center;
           justify-content: center;
           box-shadow: 0 2px 6px rgba(0,0,0,0.1);
           border: 1px solid #eee;
           cursor: pointer;
           transition: all 0.2s;
           color: #333;
        }
        .custom-action-btn:hover {
           background: #e53e3e;
           color: #fff;
           border-color: #e53e3e;
        }
        .custom-action-btn.active {
           background: #e53e3e;
           color: #fff;
        }
        .custom-action-btn svg {
           width: 18px;
           height: 18px;
        }
      `}</style>
      <div className="custom-product-card">
        <div className="custom-image-wrapper">
          <Link href={`/product-details/${_id}`}>
            <Image
              src={product?.imageURLs?.[0]?.img || img || "https://placehold.co/300x300?text=No+Image"}
              alt={title || "product img"}
              width={300}
              height={300}
              priority
            />
          </Link>

          {status === 'out-of-stock' && (
            <span className="custom-stock-badge">Out of Stock</span>
          )}

          <div className="custom-overlay-actions">
            {isAddedToCart ? (
              <Link href="/cart" className="custom-action-btn active">
                <Cart />
              </Link>
            ) : (
              <button type="button" onClick={() => handleAddProduct(product)} className="custom-action-btn" disabled={status === 'out-of-stock'}>
                <Cart />
              </button>
            )}
            <button onClick={() => dispatch(handleProductModal(product))} className="custom-action-btn">
              <QuickView />
            </button>
            <button disabled={status === 'out-of-stock'} onClick={() => handleWishlistProduct(product)} className={`custom-action-btn ${isAddedToWishlist ? 'active' : ''}`}>
              <Wishlist />
            </button>
            <button disabled={status === 'out-of-stock'} onClick={() => handleCompareProduct(product)} className="custom-action-btn">
              <CompareThree />
            </button>
          </div>
        </div>

        <div className="custom-product-content">
          <div className="mb-2">
            <Rating allowFraction size={14} initialValue={ratingVal} readonly={true} />
          </div>
          <Link href={`/product-details/${_id}`} className="custom-product-title">
            {title}
          </Link>

          <div className="custom-price-wrapper">
            <span className="custom-current-price">₹{(currentPrice || 0).toFixed(2)}</span>
            {isDiscountActive && (
              <>
                <span className="custom-old-price">₹{(originalPrice || 0).toFixed(2)}</span>
                <span className="custom-discount-text">({product.discount}% off)</span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;
