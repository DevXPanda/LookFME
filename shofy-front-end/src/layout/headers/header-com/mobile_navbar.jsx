'use client';
import React from "react";
import { useRouter } from "next/navigation";

export default function MobileNavbar() {
  const router = useRouter();

  const categories = [
    { id: 1, image: "https://images-home.beyoung.in/imgi_12_combo_icon_july_5554f7d529.png", name: "Combos", category: "Super Saving Combos" },
    { id: 2, image: "https://images-home.beyoung.in/Shirts_min_97b7526c79.png", name: "Shirts", category: "Shirts" },
    { id: 3, image: "https://images-home.beyoung.in/Trouser_min_7e857e7795.png", name: "Trousers", category: "Trousers" },
    { id: 4, image: "https://images-home.beyoung.in/winter_wear_01_min_a38c5f2fc1.png", name: "Winter Wear", category: "Winter Wear" },
    { id: 5, image: "https://images-home.beyoung.in/T_shirt_min_4668722559.png", name: "T-Shirts", category: "T-shirts" },
    { id: 6, image: "https://images-home.beyoung.in/imgi_18_Pyjama_icon_july_e217def7f5.png", name: "Pyjamas", category: "Pyjamas" },
    { id: 7, image: "https://images-home.beyoung.in/polos_min_2070bd5b70.png", name: "Polos", category: "Polo T-shirts" },
    { id: 8, image: "https://images-home.beyoung.in/imgi_17_Cargo_icon_july_618b93c72f.png", name: "Cargos", category: "Cargo Pants" },
    { id: 9, image: "https://images-home.beyoung.in/imgi_19_jeans_icon_july_8ff772a60d.png", name: "Jeans", category: "Jeans" },
  ];

  // Handle category click - navigate to shop grid with filter
  const handleCategoryClick = (categoryName, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Normalize category name for URL
    const normalizedCategory = categoryName
      .toLowerCase()
      .replace(/&/g, '')
      .replace(/[-\s\/]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
    
    // Navigate to shop grid with category filter
    setTimeout(() => {
      router.push(`/shop?category=${normalizedCategory}`);
    }, 0);
  };

  return (
    <div className="bg-white py-6 w-full overflow-hidden">
      <div className="horizontal-scroll">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="category-item"
            onClick={(e) => handleCategoryClick(cat.category, e)}
          >
            <div className="category-image">
              <img src={cat.image} alt={cat.name} />
            </div>
            {cat.name && (
              <span className="category-label">{cat.name}</span>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .horizontal-scroll {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
          gap: 0.25rem;
          // padding: 0 0.75rem;
          white-space: nowrap;
          scrollbar-width: none; 
          -ms-overflow-style: none; 
        }

        .horizontal-scroll::-webkit-scrollbar {
          display: none; 
        }

        .category-item {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          background: transparent;
          box-shadow: none;
          padding: 0.5rem;
          transition: all 0.3s ease;
          cursor: pointer;
          gap: 0.5rem;
        }

        .category-item:hover {
          transform: scale(1.05);
        }

        .category-item:active {
          transform: scale(0.95);
        }

        .category-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--tp-common-black, #000);
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .category-image {
          width: 4.5rem;
          height: 4.5rem;
          border-radius: 9999px;
          overflow: hidden;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-image img {
          width: 4rem;
          height: 4rem;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}
