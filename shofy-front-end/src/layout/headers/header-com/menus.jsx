'use client';
import React from "react";
import menu_data from "@/data/menu-data";
import Link from "next/link";
import Image from "next/image";

const Menus = () => {
  return (
    <ul>
      {menu_data.map((menu) => {
        // Safety check to ensure menu exists
        if (!menu) return null;
        
        if (menu.products && menu.product_pages) {
          return (
            <li key={menu.id} className="has-dropdown has-mega-menu jockey-style-mega">
              <Link href={menu.link}>{menu.title}</Link>
              <div className="tp-submenu tp-mega-menu jockey-mega-menu">
                <div className="jockey-mega-wrapper">
                  {/* Left Section - Categories */}
                  <div className="jockey-categories-section">
                    {menu.product_pages.map((category, i) => (
                      <div key={i} className="jockey-category-column">
                        <h4 className="jockey-category-title">{category.title}</h4>
                        <ul className="jockey-category-items">
                          {category.mega_menus && category.mega_menus.map((item, j) => (
                            <li key={j}>
                              <Link href={item.link}>{item.title}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Right Section - Images */}
                  <div className="jockey-images-section">
                    {/* Column 1 - Main Banner */}
                    <div className="jockey-banner-column">
                      <div className="jockey-main-banner">
                        <Link href="/shop/men">
                          <div className="jockey-banner-image">
                            <Image 
                              src="/assets/img/navbar/men/men-banner.png" 
                              alt="Everything for Men"
                              width={150}
                              height={320}
                              className="banner-img"
                            />
                          </div>
                          <div className="jockey-banner-text">
                            <h3>EVERYTHING FOR MEN</h3>
                            <button className="jockey-explore-btn">EXPLORE &gt;</button>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Column 2 - Other Images */}
                    <div className="jockey-other-images-column">
                      {/* Special Offerings */}
                      <div className="jockey-special-offerings">
                        <h4 className="jockey-section-title">Our Special Offerings</h4>
                        <div className="jockey-offerings-grid">
                          <Link href="/shop/men/shorts" className="jockey-offering-item">
                            <div className="jockey-offering-image">
                              <Image 
                                src="/assets/img/navbar/men/men-1.png" 
                                alt="Anywhere Shorts"
                                width={80}
                                height={120}
                                className="offering-img"
                              />
                            </div>
                            <span className="jockey-offering-text">ANYWHERE SHORTS</span>
                          </Link>
                          <Link href="/shop/men/tank-tops" className="jockey-offering-item">
                            <div className="jockey-offering-image">
                              <Image 
                                src="/assets/img/navbar/men/men-2.png" 
                                alt="Tank Tops"
                                width={80}
                                height={120}
                                className="offering-img"
                              />
                            </div>
                            <span className="jockey-offering-text">TANK TOPS</span>
                          </Link>
                          <Link href="/shop/men/pants" className="jockey-offering-item">
                            <div className="jockey-offering-image">
                              <Image 
                                src="/assets/img/navbar/men/men-3.png" 
                                alt="All Day Pants"
                                width={80}
                                height={120}
                                className="offering-img"
                              />
                            </div>
                            <span className="jockey-offering-text">ALL DAY PANTS</span>
                          </Link>
                        </div>
                      </div>

                      {/* Trending Collections */}
                      <div className="jockey-trending-collections">
                        <h4 className="jockey-section-title">Trending Collections</h4>
                        <div className="jockey-trending-grid">
                          <Link href="/shop/men/move" className="jockey-trending-item">
                            <div className="jockey-trending-image">
                              <Image 
                                src="/assets/img/navbar/men/men1.png" 
                                alt="Move"
                                width={80}
                                height={80}
                                className="trending-img"
                              />
                            </div>
                            <span className="jockey-trending-text">MOVE</span>
                          </Link>
                          <Link href="/shop/men/athleisure" className="jockey-trending-item">
                            <div className="jockey-trending-image">
                              <Image 
                                src="/assets/img/navbar/men/men2.png" 
                                alt="Athleisure"
                                width={80}
                                height={80}
                                className="trending-img"
                              />
                            </div>
                            <span className="jockey-trending-text">ATHLEISURE</span>
                          </Link>
                          <Link href="/shop/men/international" className="jockey-trending-item">
                            <div className="jockey-trending-image">
                              <Image 
                                src="/assets/img/navbar/men/men3.png" 
                                alt="International Collection"
                                width={80}
                                height={80}
                                className="trending-img"
                              />
                            </div>
                            <span className="jockey-trending-text">INTERNATIONAL COLLECTION</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        } else if (menu.sub_menu && menu.sub_menus) {
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
        } else {
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