'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { TextShapeLine } from "@/svg";

const BeyoungCategories = () => {
  const router = useRouter();

  // BEYOUNG categories data - ready for admin panel updates
  const categories = [
    {
      id: 1,
      name: "SHIRTS",
      description: "SHIRTS"
    },
    {
      id: 2,
      name: "TROUSERS",
      description: "TROUSERS"
    },
    {
      id: 3,
      name: "OVERSIZED T-SHIRTS",
      description: "OVERSIZED T-SHIRTS"
    },
    {
      id: 4,
      name: "CARGOS",
      description: "CARGOS"
    },
    {
      id: 5,
      name: "POLOS",
      description: "POLOS"
    },
    {
      id: 6,
      name: "JEANS",
      description: "JEANS"
    },
    {
      id: 7,
      name: "PRINTED T-SHIRTS",
      description: "PRINTED T-SHIRTS"
    },
    {
      id: 8,
      name: "JOGGERS",
      description: "JOGGERS"
    },
    {
      id: 9,
      name: "PLAIN T-SHIRTS",
      description: "PLAIN T-SHIRTS"
    },
    {
      id: 10,
      name: "BOXERS",
      description: "BOXERS"
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
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-2 text-center mb-50">
                <span className="tp-section-title-pre-2">
                  Shop by Category
                  <TextShapeLine />
                </span>
                <h3 className="tp-section-title-2">
                  Lookfame Editions.
                </h3>
              </div>
            </div>
          </div>
          
          {/* Scrollable Categories Container */}
          <div className="categories-scroll-container" style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            whiteSpace: 'nowrap',
            padding: '20px 0',
            scrollbarWidth: 'thin',
            scrollbarColor: '#BE5985 #f0f0f0'
          }}>
            <div className="categories-scroll-wrapper" style={{
              display: 'inline-flex',
              gap: '20px',
              padding: '0 20px',
              minWidth: '100%'
            }}>
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className="category-scroll-item"
                  onClick={() => handleCategoryRoute(category.name)}
                  style={{ 
                    cursor: 'pointer',
                    flexShrink: 0,
                    minWidth: '200px',
                    maxWidth: '250px'
                  }}
                >
                  <div className="position-relative" style={{ 
                    aspectRatio: '1/1',
                    border: '1px solid black',
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    ':hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}>
                    {/* Category Label - Centered */}
                    <div className="text-center p-3">
                      <h3 className="h6 fw-semibold mb-0 text-dark" style={{ 
                        fontFamily: 'var(--tp-ff-poppins)',
                        fontSize: '14px',
                        lineHeight: '1.2',
                        whiteSpace: 'normal'
                      }}>
                        {category.description}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Scrollbar Styling for Webkit browsers */}
          <style jsx>{`
            .categories-scroll-container::-webkit-scrollbar {
              height: 8px;
            }
            .categories-scroll-container::-webkit-scrollbar-track {
              background: #f0f0f0;
              border-radius: 4px;
            }
            .categories-scroll-container::-webkit-scrollbar-thumb {
              background: #BE5985;
              border-radius: 4px;
            }
            .categories-scroll-container::-webkit-scrollbar-thumb:hover {
              background: #a04a6f;
            }
            .category-scroll-item:hover {
              transform: scale(1.05);
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
          `}</style>
        </div>
      </section>
    </>
  );
};

export default BeyoungCategories;
