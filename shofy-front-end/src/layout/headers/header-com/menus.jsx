'use client';
import React from "react";
import menu_data from "@/data/menu-data";
import Link from "next/link";

const Menus = () => {
  return (
    <ul>
      {menu_data.map((menu) =>
        menu.products ? (
          <li key={menu.id} className="has-dropdown has-mega-menu ">
            <Link href={menu.link}>{menu.title}</Link>
            <ul className="tp-submenu tp-mega-menu mega-menu-style-2">
              {menu.product_pages.map((p, i) => (
                <li key={i} className="has-dropdown">
                  <Link href={p.link} className="mega-menu-title">
                    {p.title}
                  </Link>
                  <ul className="tp-submenu">
                    {p.mega_menus.map((m, i) => (
                      <li key={i}>
                        <Link href={m.link}>{m.title}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ) : menu.sub_menu ? (
          <li key={menu.id} className="has-dropdown">
            <Link href={menu.link}>{menu.title}</Link>
            <ul className="tp-submenu">
              {menu.sub_menus.map((b, i) => (
                <li key={i}>
                  <Link href={b.link}>{b.title}</Link>
                </li>
              ))}
            </ul>
          </li>
        ) : (
          // ✅ Home and all other simple links will fall here
          <li key={menu.id}>
            <Link href={menu.link}>{menu.title}</Link>
          </li>
        )
      )}
    </ul>
  );
};

export default Menus;
