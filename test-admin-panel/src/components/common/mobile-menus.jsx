"use client"
import React, { useState } from "react";
import Link from "next/link";
import { mobile_menu } from "@/data/menu-data";

const MobileMenus = () => {
  const [isActiveMenu, setIsActiveMenu] = useState("");

  // toggle sub menu open/close
  const handleOpenSubMenu = (title) => {
    if (title === isActiveMenu) {
      setIsActiveMenu("");
    } else {
      setIsActiveMenu(title);
    }
  };

  return (
    <nav className="tp-main-menu-content">
      {mobile_menu.map((menu) => (
        <ul key={menu.id}>
          {menu.sub_menu ? (
            <li
              className={`has-dropdown ${
                isActiveMenu === menu.title ? "dropdown-opened" : ""
              }`}
            >
              <a
                className={`${
                  isActiveMenu === menu.title ? "expanded" : ""
                }`}
              >
                {menu.title}
                <button
                  onClick={() => handleOpenSubMenu(menu.title)}
                  className={`dropdown-toggle-btn ${
                    isActiveMenu === menu.title ? "dropdown-opened" : ""
                  }`}
                >
                  <i className="fa-regular fa-angle-right"></i>
                </button>
              </a>
              <ul
                className={`tp-submenu ${
                  isActiveMenu === menu.title ? "active" : ""
                }`}
              >
                {menu.sub_menus.map((sub, i) => (
                  <li key={i}>
                    <Link href={sub.link}>{sub.title}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ) : (
            <li>
              <Link href={menu.link}>{menu.title}</Link>
            </li>
          )}
        </ul>
      ))}
    </nav>
  );
};

export default MobileMenus;
