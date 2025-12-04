import React from "react";

export default function MobileNavbar() {
  const categories = [
    { id: 1, image: "https://images-home.beyoung.in/imgi_12_combo_icon_july_5554f7d529.png"},
    { id: 2, image: "https://images-home.beyoung.in/Shirts_min_97b7526c79.png" },
    { id: 3, image: "https://images-home.beyoung.in/Trouser_min_7e857e7795.png" },
    { id: 4, image: "https://images-home.beyoung.in/winter_wear_01_min_a38c5f2fc1.png" },
    { id: 5, image: "https://images-home.beyoung.in/T_shirt_min_4668722559.png" },
    { id: 6, image: "https://images-home.beyoung.in/imgi_18_Pyjama_icon_july_e217def7f5.png" },
    { id: 7, image: "https://images-home.beyoung.in/polos_min_2070bd5b70.png" },
    { id: 8, image: "https://images-home.beyoung.in/imgi_17_Cargo_icon_july_618b93c72f.png" },
    { id: 9, image: "https://images-home.beyoung.in/imgi_19_jeans_icon_july_8ff772a60d.png" },
  ];

  return (
    <div className="bg-white py-6 w-full overflow-hidden">
      <div className="horizontal-scroll">
        {categories.map((cat) => (
          <div key={cat.id} className="category-item">
            <div className="category-image">
              <img src={cat.image} alt="" />
            </div>
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
          align-items: center;
          flex-shrink: 0;
          background: transparent;
          box-shadow: none;
          padding: 0;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .category-item:hover {
          transform: scale(1.05);
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
