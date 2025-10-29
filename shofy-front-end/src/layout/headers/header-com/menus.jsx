'use client';
import React from "react";
import menu_data from "@/data/menu-data";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Menus = () => {

  const router = useRouter()

  const handleMenuItemClick = (menu) => {
    if(menu?.link){
      router.push(menu.link)
    }
  }

  return (
    <ul>
      {menu_data.map((menu) => {
        if (!menu) return null;

        // Main Mega Menu (Products)
        if (menu.products && menu.product_pages) {
          return (
            <li key={menu.id} className="has-dropdown has-mega-menu jockey-style-mega">
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
                                  <Link href={item.link}>{item.title}</Link>
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
                            <Link key={i} href={offering.link} className="jockey-offering-item">
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
                            <Link key={i} href={trend.link} className="jockey-trending-item">
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
    </ul>
  );
};

export default Menus;
