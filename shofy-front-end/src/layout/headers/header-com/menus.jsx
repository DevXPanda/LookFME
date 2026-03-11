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
    if (menu?.link) {
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

  // Normalize title/slug for URL query (spaces and special chars to single hyphen, lowercase)
  const toQuerySlug = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/&/g, '')
      .replace(/[-\s\/]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
  };

  // Build shop link for mega menu items (Men, Women, Junior, Accessories, Cosmetic)
  const getShopLink = (item, menu) => {
    const link = item.link;
    const title = item.title;
    const sectionSlug = menu.categorySlug || (menu.title && menu.title.toLowerCase().replace(/\s+/g, '-'));
    // Category + type (e.g. Men > Plain T-Shirts -> ?category=men&type=plain-tshirt)
    if (sectionSlug && item.type) {
      return `/shop?category=${sectionSlug}&type=${item.type}`;
    }
    // Legacy: link starts with /shop-category/ -> use subCategory only
    if (link && link.startsWith('/shop-category/')) {
      const normalizedSubCategory = toQuerySlug(title);
      return `/shop?subCategory=${normalizedSubCategory}`;
    }
    // Category + subCategory when menu has categorySlug but item has no type (e.g. Cosmetic > Primer)
    if (sectionSlug && (link === '/shop' || !link) && title) {
      const normalizedSubCategory = toQuerySlug(title);
      return `/shop?category=${sectionSlug}&subCategory=${normalizedSubCategory}`;
    }
    // Fallback: subCategory only from title
    if (link === '/shop' && title) {
      const normalizedSubCategory = toQuerySlug(title);
      return `/shop?subCategory=${normalizedSubCategory}`;
    }
    return link || '/shop';
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
                <div className={`jockey-mega-wrapper ${menu.product_pages?.length === 2 ? 'jockey-mega-cols-4' : 'jockey-mega-cols-5'}`}>

                  {/* Column 1 & 2: Category columns (Top Wear, Bottom Wear, etc.) */}
                  {menu.product_pages.map((category, i) => (
                    <div key={i} className="jockey-category-column">
                      <h4 className="jockey-category-title">{category.title}</h4>
                      <ul className="jockey-category-items">
                        {category.mega_menus &&
                          category.mega_menus.map((item, j) => (
                            <li key={j}>
                              <Link
                                href={getShopLink(item, menu)}
                                onClick={(e) => handleLinkClick(menu.id, e)}
                              >
                                {item.title}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}

                  {/* Column 3: Promotional banner */}
                  {menu.banner && (
                    <div className="jockey-banner-column">
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

                  {/* Column 4: Featured collections (offers + trending) */}
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
                                  width={300}
                                  height={300}
                                  quality={100}
                                  unoptimized={false}
                                  className="offering-img"
                                  priority={false}
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
                                  width={300}
                                  height={300}
                                  quality={100}
                                  unoptimized={false}
                                  className="trending-img"
                                  priority={false}
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
