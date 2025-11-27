import { useState } from "react";

const ColorDropdown = ({ colors, selectedColor, setSelectedColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  const colorMap = {
    "Charcoal Grey": "#36454F",
    White: "#FFFFFF",
    Black: "#000000",
    "Sky Blue": "#87CEEB",
    "Sage Green": "#9CAF88",
    "Bottle Green": "#006A4E",
    "Emerald Green": "#50C878",
    Brown: "#A52A2A",
    Maroon: "#800000",
    "Baby Pink": "#F4C2C2",
    Red: "#FF0000",
    "Navy Blue": "#000080",
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (color) => {
    setSelectedColor(color);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full px-4 py-3 border border-gray-300 rounded-md text-left flex items-center justify-between bg-white"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
        }}
      >
        <div className="flex items-center gap-2">
          {selectedColor ? (
            <>
              <span
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: colorMap[selectedColor] }}
              ></span>
              <span
                className={
                  selectedColor === "White" ? "text-black" : "text-gray-900"
                }
              >
                {selectedColor}
              </span>
            </>
          ) : (
            <span className="text-gray-600">Select Color</span>
          )}
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute w-full mt-1 max-h-40  overflow-y-auto border rounded shadow-lg z-10 bg-white">
          {colors.map((color) => (
            <li
              key={color}
              onClick={() => handleSelect(color)}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[#F875AA] transition-colors"
            >
              <span
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: colorMap[color] }}
              ></span>
              <span
                className={color === "White" ? "text-black" : "text-gray-900"}
              >
                {color}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ColorDropdown;
