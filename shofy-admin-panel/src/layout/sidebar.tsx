"use client";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import sidebar_menu from "@/data/sidebar-menus";
import { DownArrow } from "@/svg";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "@/redux/auth/authSlice";
import { useRouter, usePathname } from "next/navigation";
import OrdersDropdown from "@/app/components/sidebar/orders-dropdown";

// prop type
type IProps = {
  sideMenu: boolean;
  setSideMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar = React.memo(function Sidebar({ sideMenu, setSideMenu }: IProps) {
  const [isDropdown, setIsDropDown] = useState<string>("");
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRefs = useRef<{ [key: string]: HTMLUListElement | null }>({});

  // Check if a menu item or its submenu is active based on pathname
  const isMenuActive = useCallback((menu: typeof sidebar_menu[0]): boolean => {
    if (!pathname) return false;
    
    // Check if current pathname matches the menu link
    if (menu.link && pathname === menu.link) return true;
    
    // Check if current pathname matches any submenu link
    if (menu.subMenus) {
      return menu.subMenus.some(sub => {
        // For orders, check if pathname starts with /orders
        if (menu.title === "Orders" && pathname.startsWith("/orders")) {
          return true;
        }
        // For other menus, check exact match or starts with
        return pathname === sub.link || pathname.startsWith(sub.link + "/");
      });
    }
    
    return false;
  }, [pathname]);

  // Check if a submenu item is active
  const isSubMenuActive = useCallback((subLink: string, parentTitle: string): boolean => {
    if (!pathname) return false;
    
    // For orders, check query params
    if (parentTitle === "Orders" && pathname.startsWith("/orders")) {
      return true;
    }
    
    // For other menus, check exact match or starts with
    return pathname === subLink || pathname.startsWith(subLink + "/");
  }, [pathname]);

  // Determine which dropdown should be open based on pathname
  const activeDropdown = useMemo(() => {
    if (!pathname) return "";
    
    for (const menu of sidebar_menu) {
      if (menu.subMenus && isMenuActive(menu)) {
        return menu.title;
      }
    }
    return "";
  }, [pathname, isMenuActive]);

  // Auto-expand dropdowns based on current pathname (only on pathname change)
  useEffect(() => {
    if (activeDropdown && isDropdown !== activeDropdown) {
      setIsDropDown(activeDropdown);
    }
  }, [activeDropdown]); // Only depend on activeDropdown, not isDropdown

  // Update dropdown heights when they open to ensure smooth transitions
  useEffect(() => {
    if (isDropdown) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        const dropdown = dropdownRefs.current[isDropdown];
        if (dropdown) {
          // Force reflow to ensure height is calculated
          dropdown.offsetHeight;
        }
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isDropdown]);

  // handle active menu
  const handleMenuActive = useCallback((title: string) => {
    setIsDropDown(prev => prev === title ? "" : title);
  }, []);

  // handle logout
  const handleLogOut = useCallback(() => {
    dispatch(userLoggedOut());
    router.push(`/login`);
  }, [dispatch, router]);
  // Memoize menu items to prevent re-renders
  const menuItems = useMemo(() => {
    return sidebar_menu.map((menu) => {
      const isActive = isMenuActive(menu);
      const isOpen = isDropdown === menu.title;
      
      return (
        <li key={menu.id}>
          {!menu.subMenus && menu.title !== 'Online store' && (
            <Link
              href={menu.link}
              className={`group rounded-md relative text-black text-lg font-medium inline-flex items-center w-full transition-colors ease-in-out duration-300 px-5 py-[9px] mb-2 hover:bg-gray sidebar-link-active ${
                pathname === menu.link ? "bg-themeLight hover:bg-themeLight text-theme" : ""
              }`}
            >
              <span className="inline-block mr-[10px] text-xl">
                <menu.icon />
              </span>
              {menu.title}
            </Link>
          )}
          {menu.subMenus && (
            <>
              <Link
                href={menu.link}
                onClick={() => {
                  // Toggle dropdown on click
                  if (isDropdown !== menu.title) {
                    handleMenuActive(menu.title);
                  }
                }}
                className={`group cursor-pointer rounded-md relative text-black text-lg font-medium inline-flex items-center w-full transition-colors ease-in-out duration-300 px-5 py-[9px] mb-2 hover:bg-gray sidebar-link-active ${
                  isActive || isOpen ? "bg-themeLight hover:bg-themeLight text-theme" : ""
                }`}
              >
                <span className="inline-block mr-[10px] text-xl">
                  <menu.icon />
                </span>
                {menu.title}
                <span 
                  className={`absolute right-4 top-[52%] transition-transform duration-300 origin-center w-4 h-4 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <DownArrow />
                </span>
              </Link>
              <div
                className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                style={{
                  maxHeight: isOpen ? `${dropdownRefs.current[menu.title]?.scrollHeight || 500}px` : "0px"
                }}
              >
                <ul
                  ref={(el) => {
                    if (el) dropdownRefs.current[menu.title] = el;
                  }}
                  className="pl-[42px] pr-[20px] pb-3"
                >
                  {menu.title === "Orders" ? (
                    <React.Suspense fallback={<li className="text-tiny text-text3 px-4 py-2">Loading...</li>}>
                      <OrdersDropdown />
                    </React.Suspense>
                  ) : (
                    menu.subMenus.map((sub, i) => {
                      const subIsActive = isSubMenuActive(sub.link, menu.title);
                      return (
                        <li key={i}>
                          <Link
                            href={sub.link}
                            className={`block font-normal w-full transition-colors duration-200 nav-dot ${
                              subIsActive 
                                ? "text-theme font-medium" 
                                : "text-[#6D6F71] hover:text-theme"
                            }`}
                          >
                            {sub.title}
                          </Link>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            </>
          )}
          {menu.title === 'Online store' && (
            <a
              href=""
              target="_blank"
              className="group cursor-pointer rounded-md relative text-black text-lg font-medium inline-flex items-center w-full transition-colors ease-in-out duration-300 px-5 py-[9px] mb-2 hover:bg-gray sidebar-link-active"
            >
              <span className="inline-block mr-[10px] text-xl">
                <menu.icon />
              </span>
              {menu.title}
            </a>
          )}
        </li>
      );
    });
  }, [isDropdown, pathname, isMenuActive, isSubMenuActive, handleMenuActive]);

  return (
    <>
      <aside
        className={`w-[300px] lg:w-[250px] xl:w-[300px] border-r border-gray overflow-y-auto sidebar-scrollbar fixed left-0 top-0 h-full bg-white z-50 transition-transform duration-300 ${
          sideMenu ? "translate-x-[0px]" : " -translate-x-[300px] lg:translate-x-[0]"
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="py-4 pb-8 px-8 border-b border-gray h-[78px]">
              <Link href="/dashboard">
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/img/logo/logo.svg"
                    alt="LookFame Logo"
                    width={36}
                    height={36}
                    priority
                    style={{ minWidth: 36 }}
                  />
                  <span style={{ fontWeight: 700, fontSize: 22, color: '#222', letterSpacing: 0.5 }}>
                    LookFame
                  </span>
                </div>
              </Link>
            </div>
            <div className="px-4 py-5">
              <ul>
                {menuItems}
              </ul>
            </div>
          </div>
          <div className="text-center mb-6">
            <button onClick={handleLogOut} className="tp-btn px-7 py-2">Logout</button>
          </div>
        </div>
      </aside>

      <div
        onClick={() => setSideMenu(!sideMenu)}
        className={`fixed top-0 left-0 w-full h-full z-40 bg-black/70 transition-opacity duration-300 ${
          sideMenu ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {" "}
      </div>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
