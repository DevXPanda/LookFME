'use client';
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// internal
import { ArrowRightLong } from "@/svg";

const BeyoungCategories = () => {
  const router = useRouter();

  // BEYOUNG categories data with better images
  const categories = [
    {
      id: 1,
      name: "SHIRTS",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&crop=face",
      description: "I SHIRTS"
    },
    {
      id: 2,
      name: "TROUSERS",
      image: "https://images.unsplash.com/photo-1624378439575-d8705d7b71d3?w=400&h=400&fit=crop",
      description: "I TROUSERS"
    },
    {
      id: 3,
      name: "OVERSIZED T-SHIRTS",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      description: "I OVERSIZED T-SHIRTS"
    },
    {
      id: 4,
      name: "CARGOS",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
      description: "I CARGOS"
    },
    {
      id: 5,
      name: "POLOS",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&crop=face",
      description: "I POLOS"
    },
    {
      id: 6,
      name: "JEANS",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
      description: "I JEANS"
    },
    {
      id: 7,
      name: "PRINTED T-SHIRTS",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      description: "I PRINTED T-SHIRTS"
    },
    {
      id: 8,
      name: "JOGGERS",
      image: "https://images.unsplash.com/photo-1624378439575-d8705d7b71d3?w=400&h=400&fit=crop",
      description: "I JOGGERS"
    },
    {
      id: 9,
      name: "PLAIN T-SHIRTS",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      description: "I PLAIN T-SHIRTS"
    },
    {
      id: 10,
      name: "BOXERS",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
      description: "I BOXERS"
    }
  ];

  // handle category route
  const handleCategoryRoute = (categoryName) => {
    router.push(
      `/shop?category=${categoryName
        .toLowerCase()
        .replace("&", "")
        .split(" ")
        .join("-")}`
    );
  };

  return (
    <>
      <section className="tp-beyoung-categories-area py-5 mb-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center mb-5">
                <h2 className="display-4 fw-bold text-dark">
                  MOST WANTED CATEGORIES
                </h2>
              </div>
            </div>
          </div>
          
          <div className="row g-4">
            {categories.map((category) => (
              <div key={category.id} className="col-6 col-md-4 col-lg-2-4">
                <div 
                  className="position-relative category-item"
                  onClick={() => handleCategoryRoute(category.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="position-relative overflow-hidden rounded shadow-sm">
                    <div className="position-relative" style={{ aspectRatio: '1/1' }}>
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x400?text=' + category.name;
                        }}
                      />
                      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-40"></div>
                    </div>
                    
                    {/* Category Label Overlay */}
                    <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-80 text-white p-3">
                      <h3 className="h6 fw-semibold text-center mb-0 text-white">
                        {category.description}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BeyoungCategories;
