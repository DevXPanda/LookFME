'use client';
import React, { useRef } from "react";
import menu_data from "@/data/menu-data";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Menus = () => {

  const router = useRouter()
  const menuRefs = useRef({});

  const handleMenuItemClick = (menu) => {
    if(menu?.link){
      router.push(menu.link)
    }
  }

  // Close mega menu on link click
  const handleLinkClick = (menuId, e) => {
    // Get the parent <li> element and add class to force close menu
    const menuItem = menuRefs.current[menuId];
    if (menuItem) {
      // Add class to force hide the menu immediately
      menuItem.classList.add('menu-closing');
      // Also remove hover state by temporarily disabling pointer events
      const megaMenu = menuItem.querySelector('.jockey-mega-menu, .tp-submenu');
      if (megaMenu) {
        megaMenu.style.pointerEvents = 'none';
        megaMenu.style.opacity = '0';
        megaMenu.style.visibility = 'hidden';
      }
      // Remove class after navigation completes (longer delay for reliability)
      setTimeout(() => {
        menuItem.classList.remove('menu-closing');
        if (megaMenu) {
          megaMenu.style.pointerEvents = '';
          megaMenu.style.opacity = '';
          megaMenu.style.visibility = '';
        }
      }, 300);
    }
  }

  // Helper function to convert menu links to shop grid format
  const getShopLink = (link, title) => {
    // If link starts with /shop-category/, convert to /shop?subCategory=...
    if (link && link.startsWith('/shop-category/')) {
      // Use the title as the subcategory name, normalized (same as shop-area.jsx normalization)
      const normalizedSubCategory = title
        .toLowerCase()
        .replace(/&/g, '')
        .replace(/[-\s\/]+/g, '-')  // Replace spaces, hyphens, and slashes with single hyphen
        .replace(/-+/g, '-')  // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '')  // Remove leading/trailing hyphens
        .trim();
      return `/shop?subCategory=${normalizedSubCategory}`;
    }
    // If link is just '/shop', add category/subcategory if title is provided
    if (link === '/shop' && title) {
      const normalizedCategory = title
        .toLowerCase()
        .replace(/&/g, '')
        .replace(/[-\s\/]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .trim();
      return `/shop?subCategory=${normalizedCategory}`;
    }
    return link;
  }

  return (
    <ul>
      {menu_data.map((menu) => {
        if (!menu) return null;

        // Main Mega Menu (Products)
        if (menu.products && menu.product_pages) {
          return (
            <li 
              key={menu.id} 
              className="has-dropdown has-mega-menu jockey-style-mega"
              ref={(el) => { if (el) menuRefs.current[menu.id] = el; }}
            >
              <Link href={menu.link}>{menu.title}</Link>
              <div className="tp-submenu tp-mega-menu jockey-mega-menu">
                <div className="jockey-mega-wrapper">
                  
                  {/* Left Section: Categories + Banner */}
                  <div className="jockey-left-section">
                    <div className="jockey-categories-section">
                      {menu.product_pages.map((category, i) => (
                        <div key={i} className="jockey-category-column">
                          <h4 className="jockey-category-title">{category.title}</h4>
                          <ul className="jockey-category-items">
                            {category.mega_menus &&
                              category.mega_menus.map((item, j) => (
                                <li key={j}>
                                  <Link 
                                    href={getShopLink(item.link, item.title)}
                                    onClick={(e) => handleLinkClick(menu.id, e)}
                                  >
                                    {item.title}
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Banner Image (aligned right inside left section) */}
                    {menu.banner && (
                        <div className="jockey-banner-right">
                        <div className="jockey-banner-container">
                          <div className="jockey-banner-image">
                          <button onClick={() => handleMenuItemClick(menu)}>
                              <Image
                              src={menu.banner.image}
                              alt={menu.banner.title}
                              width={400}
                              height={600}
                              className="banner-img"
                            />
                          </button>
                          </div>
                        </div>
                      </div>                      
                    )}
                  </div>

                  {/* Right Section: Offers + Trending */}
                  <div className="jockey-offers-section">
                    {menu.special_offerings && (
                      <div className="jockey-special-offerings">
                        <h4 className="jockey-section-title">OUR SPECIAL OFFERINGS</h4>
                        <div className="jockey-offerings-grid">
                          {menu.special_offerings.map((offering, i) => (
                            <Link 
                              key={i} 
                              href={offering.link} 
                              className="jockey-offering-item"
                              onClick={(e) => handleLinkClick(menu.id, e)}
                            >
                              <div className="jockey-offering-image">
                                <Image
                                  src={offering.image}
                                  alt={offering.title}
                                  width={80}
                                  height={80}
                                  className="offering-img"
                                />
                              </div>
                              <span className="jockey-offering-text">{offering.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {menu.trending_collections && (
                      <div className="jockey-trending-collections">
                        <h4 className="jockey-section-title">TRENDING COLLECTIONS</h4>
                        <div className="jockey-trending-grid">
                          {menu.trending_collections.map((trend, i) => (
                            <Link 
                              key={i} 
                              href={trend.link} 
                              className="jockey-trending-item"
                              onClick={(e) => handleLinkClick(menu.id, e)}
                            >
                              <div className="jockey-trending-image">
                                <Image
                                  src={trend.image}
                                  alt={trend.title}
                                  width={60}
                                  height={60}
                                  className="trending-img"
                                />
                              </div>
                              <span className="jockey-trending-text">{trend.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        }

        // Sub Menu (non-mega)
        else if (menu.sub_menu && menu.sub_menus) {
          return (
            <li 
              key={menu.id} 
              className="has-dropdown"
              ref={(el) => { if (el) menuRefs.current[menu.id] = el; }}
            >
              <Link href={menu.link}>{menu.title}</Link>
              <ul className="tp-submenu">
                {menu.sub_menus.map((b, i) => (
                  <li key={i}>
                    <Link 
                      href={b.link}
                      onClick={(e) => handleLinkClick(menu.id, e)}
                    >
                      {b.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        }

        // Regular Menu
        else {
          return (
            <li key={menu.id}>
              <Link href={menu.link}>{menu.title}</Link>
            </li>
          );
        }
      })}
      <style jsx>{`
        .jockey-style-mega.menu-closing .jockey-mega-menu {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          transform: translateY(10px) !important;
        }
        .has-dropdown.menu-closing .tp-submenu {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
        .jockey-style-mega.menu-closing:hover .jockey-mega-menu {
          opacity: 0 !important;
          visibility: hidden !important;
        }
        .has-dropdown.menu-closing:hover .tp-submenu {
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `}</style>
    </ul>
  );
};

export default Menus;
