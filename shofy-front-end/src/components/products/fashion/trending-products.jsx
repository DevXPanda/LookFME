"use client";
import React, { useState, useEffect } from "react";
import { useGetProductTypeQuery } from "@/redux/features/productApi";
import ProductItem from "./product-item";
import ErrorMsg from "@/components/common/error-msg";
import { HomeTwoNewPrdPrdLoader } from "@/components/loader";

const baseCategories = [
  "View All",
  "Shirts",
  "Trousers",
  "T-shirts",
  "Polo T-shirts",
];

const categoryLimits = {
  Shirts: 4,
  Trousers: 3,
  "T-shirts": 4,
  "Polo T-shirts": 3,
};

const matchesCategory = (productCategory = "", target = "") => {
  const cat = productCategory.toLowerCase();
  const tar = target.toLowerCase();

  if (tar === "shirts") {
    return cat.includes("shirt");
  }
  if (tar === "trousers") {
    return cat.includes("trouser") || cat.includes("pant");
  }
  if (tar === "t-shirts") {
    return cat.includes("t-shirt") || cat.includes("tee");
  }
  if (tar === "polo t-shirts") {
    return cat.includes("polo");
  }

  return cat.includes(tar);
};

const TrendingProducts = () => {
  const { data: products, isError, isLoading } = useGetProductTypeQuery({
    type: "fashion",
    query: `new=true`,
  });

  const [activeCat, setActiveCat] = useState("View All");
  const [categories, setCategories] = useState(baseCategories);

  useEffect(() => {
    if (!products?.data) return;
    const dynamicSet = new Set(baseCategories);
    products.data.forEach((item) => {
      if (typeof item.category === "string" && item.category.trim().length > 0) {
        dynamicSet.add(item.category.trim());
      }
    });
    setCategories(Array.from(dynamicSet));
  }, [products?.data]);

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <HomeTwoNewPrdPrdLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }

  if (!isLoading && !isError && products?.data?.length > 0) {
    // Return items for the active category; if none match, fall back to all (repetition allowed)
    const getItemsForCategory = (cat) => {
      if (cat === "View All") return products.data;

      const matches = products.data.filter((p) =>
        matchesCategory(p.category || "", cat)
      );

      if (matches.length === 0) return products.data;

      const limit = categoryLimits[cat] ?? 4;
      return matches.slice(0, limit);
    };

    const filteredItems = getItemsForCategory(activeCat);

    // Show all filtered products (no limit)
    const product_items = filteredItems;

    content = (
      <>
        <style>{`
          .tp-trending-grid {
            display: grid;
            gap: 32px;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            margin-top: 40px;
          }
        `}</style>
        <div className="tp-trending-grid">
          {product_items.map((item) => (
            <div key={item._id} className="tp-trending-item">
              <ProductItem product={item} style_2={true} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <section
      className="tp-trending-area bg-white"
      style={{
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
        width: "100vw",
        padding: "80px 0 100px",
      }}
    >
      <div className="container text-center">
        <h2 className="text-4xl font-bold tracking-wide uppercase">
          New Arrivals
        </h2>
        <p className="text-gray-500 mt-3">
          Get them before everyone else does
        </p>

        <style>{`
          .filter-pills {
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 24px;
            margin-bottom: 8px;
          }
          .filter-btn {
            padding: 12px 22px;
            border-radius: 9999px;
            border: 1px solid #d1d5db; /* gray-300 */
            background: #ffffff;
            color: #374151; /* gray-700 */
            font-weight: 600;
            font-size: 16px;
            line-height: 1;
            transition: all 200ms ease;
          }
          .filter-btn:hover {
            // background: #f3f4f6; /* gray-100 */
          }
          .filter-btn--active {
            background: #000000;
            color: #ffff00;
            border-color: #000000;
            box-shadow: 0 6px 16px rgba(0,0,0,0.15);
          }
        `}</style>

        <div className="filter-pills">
          {categories.map((cat) => {
            const isActive = activeCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`filter-btn ${isActive ? "filter-btn--active" : ""}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="tp-trending-slider">{content}</div>
      </div>
    </section>
  );
};

export default TrendingProducts;





// "use client";
// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/ui";
// import { Heart } from "lucide-react";
// import { motion } from "framer-motion";

// const products = [
//   {
//     id: 1,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Beige Recycled Checked Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 998,
//     originalPrice: 2499,
//     discount: 60,
//     fit: "Regular Fit",
//   },
//   {
//     id: 2,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Caramel Brown Recycled Checked Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 998,
//     originalPrice: 2499,
//     discount: 60,
//     fit: "Regular Fit",
//   },
//   {
//     id: 3,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Wine Button Down Oxford Shirt",
//     category: "Oxford Shirt",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 4,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Dark Grey Button Down Oxford Shirt",
//     category: "Oxford Shirt",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 5,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Navy Blue Checked Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 1049,
//     originalPrice: 2599,
//     discount: 60,
//     fit: "Regular Fit",
//   },
//   {
//     id: 6,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Olive Green Cotton Casual Shirt",
//     category: "Casual Shirts",
//     price: 949,
//     originalPrice: 1999,
//     discount: 50,
//   },
//   {
//     id: 7,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Black Button Down Oxford Shirt",
//     category: "Oxford Shirts",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 8,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Sky Blue Slim Fit Formal Shirt",
//     category: "Formal Shirts",
//     price: 999,
//     originalPrice: 2099,
//     discount: 50,
//   },
//   {
//     id: 9,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Grey Checked Heavy Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 998,
//     originalPrice: 2499,
//     discount: 60,
//   },
//   {
//     id: 10,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "White Button Down Oxford Shirt",
//     category: "Oxford Shirts",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 11,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Maroon Slim Fit Casual Shirt",
//     category: "Casual Shirts",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 12,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Green Checked Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 998,
//     originalPrice: 2499,
//     discount: 60,
//     fit: "Regular Fit",
//   },
//   {
//     id: 13,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Khaki Cotton Casual Shirt",
//     category: "Casual Shirts",
//     price: 949,
//     originalPrice: 1999,
//     discount: 50,
//   },
// ];

// export default function NewArrivals() {
//   return (
//     <div className="w-full flex flex-col items-center py-10 bg-white">
//       <style>{`
//         /* Hide scrollbar but keep scroll functionality */
//         .hide-scrollbar {
//           -ms-overflow-style: none; /* IE and Edge */
//           scrollbar-width: none; /* Firefox */
//         }
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none; /* Chrome, Safari and Opera */
//         }
//       `}</style>

//       <h2 className="text-3xl font-bold">NEW ARRIVALS</h2>
//       <p className="text-gray-500 mt-2 mb-6">
//         Get them before everyone else does
//       </p>

//       <div className="flex space-x-4 mb-6">
//         <Button className="bg-black text-white px-6 py-2 rounded-full">
//           View All
//         </Button>
//         <Button variant="outline" className="rounded-full px-6 py-2">
//           Shirts
//         </Button>
//         <Button variant="outline" className="rounded-full px-6 py-2">
//           Trousers
//         </Button>
//         <Button variant="outline" className="rounded-full px-6 py-2">
//           T-shirts
//         </Button>
//         <Button variant="outline" className="rounded-full px-6 py-2">
//           Polo T-shirts
//         </Button>
//       </div>

//       <div className="overflow-y-auto h-[700px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 hide-scrollbar">
//         {products.map((product) => (
//           <motion.div
//             key={product.id}
//             className="relative"
//             whileHover={{ scale: 1.02 }}
//           >
//             <Card className="shadow-md rounded-2xl overflow-hidden border">
//               <div className="relative">
//                 {product.tag && (
//                   <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
//                     {product.tag}
//                   </span>
//                 )}
//                 <img
//                   src={product.image}
//                   alt={product.title}
//                   className="w-full h-80 object-cover"
//                 />
//                 <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
//                   <Heart size={18} />
//                 </button>
//                 {product.fit && (
//                   <span className="absolute bottom-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
//                     {product.fit}
//                   </span>
//                 )}
//               </div>
//               <CardContent className="p-4">
//                 <h3 className="text-sm font-medium line-clamp-2">
//                   {product.title}
//                 </h3>
//                 <p className="text-gray-500 text-xs mb-1">{product.category}</p>
//                 <div className="flex items-center space-x-2">
//                   <span className="font-semibold text-lg">₹{product.price}</span>
//                   <span className="line-through text-gray-400 text-sm">
//                     ₹{product.originalPrice}
//                   </span>
//                   <span className="text-green-600 text-sm">
//                     ({product.discount}% off)
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }






// "use client";
// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/ui";
// import { Heart } from "lucide-react";
// import { motion } from "framer-motion";

// const products = [
//   {
//     id: 1,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Beige Recycled Checked Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 998,
//     originalPrice: 2499,
//     discount: 60,
//     fit: "Regular Fit",
//   },
//   {
//     id: 2,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Caramel Brown Recycled Checked Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 998,
//     originalPrice: 2499,
//     discount: 60,
//     fit: "Regular Fit",
//   },
//   {
//     id: 3,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Wine Button Down Oxford Shirt",
//     category: "Oxford Shirt",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 4,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Dark Grey Button Down Oxford Shirt",
//     category: "Oxford Shirt",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 5,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Navy Blue Checked Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 1049,
//     originalPrice: 2599,
//     discount: 60,
//     fit: "Regular Fit",
//   },
//   {
//     id: 6,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Olive Green Cotton Casual Shirt",
//     category: "Casual Shirts",
//     price: 949,
//     originalPrice: 1999,
//     discount: 50,
//   },
//   {
//     id: 7,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Black Button Down Oxford Shirt",
//     category: "Oxford Shirts",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 8,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Sky Blue Slim Fit Formal Shirt",
//     category: "Formal Shirts",
//     price: 999,
//     originalPrice: 2099,
//     discount: 50,
//   },
//   {
//     id: 9,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Grey Checked Heavy Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 998,
//     originalPrice: 2499,
//     discount: 60,
//   },
//   {
//     id: 10,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "White Button Down Oxford Shirt",
//     category: "Oxford Shirts",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 11,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Maroon Slim Fit Casual Shirt",
//     category: "Casual Shirts",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 12,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Green Checked Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 998,
//     originalPrice: 2499,
//     discount: 60,
//     fit: "Regular Fit",
//   },
//   {
//     id: 13,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Khaki Cotton Casual Shirt",
//     category: "Casual Shirts",
//     price: 949,
//     originalPrice: 1999,
//     discount: 50,
//   },
// ];

// export default function NewArrivals() {
//   return (
//     <div className="w-full flex flex-col items-center py-10 bg-white">
//       <style>{`
//         /* Hide scrollbar but keep scroll functionality */
//         .hide-scrollbar {
//           -ms-overflow-style: none; /* IE and Edge */
//           scrollbar-width: none; /* Firefox */
//         }
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none; /* Chrome, Safari and Opera */
//         }
//       `}</style>

//       <h2 className="text-3xl font-bold">NEW ARRIVALS</h2>
//       <p className="text-gray-500 mt-2 mb-6">
//         Get them before everyone else does
//       </p>

//       <div className="flex space-x-4 mb-6">
//         <Button className="bg-black text-white px-6 py-2 rounded-full">
//           View All
//         </Button>
//         <Button variant="outline" className="rounded-full px-6 py-2">
//           Shirts
//         </Button>
//         <Button variant="outline" className="rounded-full px-6 py-2">
//           Trousers
//         </Button>
//         <Button variant="outline" className="rounded-full px-6 py-2">
//           T-shirts
//         </Button>
//         <Button variant="outline" className="rounded-full px-6 py-2">
//           Polo T-shirts
//         </Button>
//       </div>

//       <div className="overflow-y-auto h-[700px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 hide-scrollbar">
//         {products.map((product) => (
//           <motion.div
//             key={product.id}
//             className="relative"
//             whileHover={{ scale: 1.02 }}
//           >
//             <Card className="shadow-md rounded-2xl overflow-hidden border">
//               <div className="relative">
//                 {product.tag && (
//                   <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
//                     {product.tag}
//                   </span>
//                 )}
//                 <img
//                   src={product.image}
//                   alt={product.title}
//                   className="w-full h-80 object-cover"
//                 />
//                 <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
//                   <Heart size={18} />
//                 </button>
//                 {product.fit && (
//                   <span className="absolute bottom-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
//                     {product.fit}
//                   </span>
//                 )}
//               </div>
//               <CardContent className="p-4">
//                 <h3 className="text-sm font-medium line-clamp-2">
//                   {product.title}
//                 </h3>
//                 <p className="text-gray-500 text-xs mb-1">{product.category}</p>
//                 <div className="flex items-center space-x-2">
//                   <span className="font-semibold text-lg">₹{product.price}</span>
//                   <span className="line-through text-gray-400 text-sm">
//                     ₹{product.originalPrice}
//                   </span>
//                   <span className="text-green-600 text-sm">
//                     ({product.discount}% off)
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }






// "use client";
// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/ui";
// import { Heart } from "lucide-react";
// import { motion } from "framer-motion";

// const products = [
//   {
//     id: 1,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Beige Recycled Checked Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 998,
//     originalPrice: 2499,
//     discount: 60,
//     fit: "Regular Fit",
//   },
//   {
//     id: 2,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Caramel Brown Recycled Checked Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 998,
//     originalPrice: 2499,
//     discount: 60,
//     fit: "Regular Fit",
//   },
//   {
//     id: 3,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Wine Button Down Oxford Shirt",
//     category: "Oxford Shirt",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 4,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Dark Grey Button Down Oxford Shirt",
//     category: "Oxford Shirt",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 5,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Navy Blue Checked Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 1049,
//     originalPrice: 2599,
//     discount: 60,
//     fit: "Regular Fit",
//   },
//   {
//     id: 6,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Olive Green Cotton Casual Shirt",
//     category: "Casual Shirts",
//     price: 949,
//     originalPrice: 1999,
//     discount: 50,
//   },
//   {
//     id: 7,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Black Button Down Oxford Shirt",
//     category: "Oxford Shirts",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 8,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Sky Blue Slim Fit Formal Shirt",
//     category: "Formal Shirts",
//     price: 999,
//     originalPrice: 2099,
//     discount: 50,
//   },
//   {
//     id: 9,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Grey Checked Heavy Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 998,
//     originalPrice: 2499,
//     discount: 60,
//   },
//   {
//     id: 10,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "White Button Down Oxford Shirt",
//     category: "Oxford Shirts",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 11,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Maroon Slim Fit Casual Shirt",
//     category: "Casual Shirts",
//     price: 899,
//     originalPrice: 1799,
//     discount: 50,
//   },
//   {
//     id: 12,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Green Checked Flannel Shirt",
//     category: "Flannel Shirts",
//     price: 998,
//     originalPrice: 2499,
//     discount: 60,
//     fit: "Regular Fit",
//   },
//   {
//     id: 13,
//     tag: "New Arrival",
//     image: "/assets/img/trending-products/beige_recycled_checked_flannel_shirt_full_view_400x533.jpg",
//     title: "Khaki Cotton Casual Shirt",
//     category: "Casual Shirts",
//     price: 949,
//     originalPrice: 1999,
//     discount: 50,
//   },
// ];

// export default function NewArrivals() {
//   return (
//     <div className="w-full flex flex-col items-center py-10 bg-white">
//       <style>{`
//         /* Hide scrollbar but keep scroll functionality */
//         .hide-scrollbar {
//           -ms-overflow-style: none; /* IE and Edge */
//           scrollbar-width: none; /* Firefox */
//         }
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none; /* Chrome, Safari and Opera */
//         }
//       `}</style>

//       <h2 className="text-3xl font-bold">NEW ARRIVALS</h2>
//       <p className="text-gray-500 mt-2 mb-6">
//         Get them before everyone else does
//       </p>

//       <div className="flex space-x-4 mb-6">
//         <Button className="bg-black text-white px-6 py-2 rounded-full">
//           View All
//         </Button>
//         <Button variant="outline" className="rounded-full px-6 py-2">
//           Shirts
//         </Button>
//         <Button variant="outline" className="rounded-full px-6 py-2">
//           Trousers
//         </Button>
//         <Button variant="outline" className="rounded-full px-6 py-2">
//           T-shirts
//         </Button>
//         <Button variant="outline" className="rounded-full px-6 py-2">
//           Polo T-shirts
//         </Button>
//       </div>

//       <div className="overflow-y-auto h-[700px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 hide-scrollbar">
//         {products.map((product) => (
//           <motion.div
//             key={product.id}
//             className="relative"
//             whileHover={{ scale: 1.02 }}
//           >
//             <Card className="shadow-md rounded-2xl overflow-hidden border">
//               <div className="relative">
//                 {product.tag && (
//                   <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
//                     {product.tag}
//                   </span>
//                 )}
//                 <img
//                   src={product.image}
//                   alt={product.title}
//                   className="w-full h-80 object-cover"
//                 />
//                 <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
//                   <Heart size={18} />
//                 </button>
//                 {product.fit && (
//                   <span className="absolute bottom-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
//                     {product.fit}
//                   </span>
//                 )}
//               </div>
//               <CardContent className="p-4">
//                 <h3 className="text-sm font-medium line-clamp-2">
//                   {product.title}
//                 </h3>
//                 <p className="text-gray-500 text-xs mb-1">{product.category}</p>
//                 <div className="flex items-center space-x-2">
//                   <span className="font-semibold text-lg">₹{product.price}</span>
//                   <span className="line-through text-gray-400 text-sm">
//                     ₹{product.originalPrice}
//                   </span>
//                   <span className="text-green-600 text-sm">
//                     ({product.discount}% off)
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }
