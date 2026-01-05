'use client';
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// internal
import { useGetProductTypeCategoryQuery } from "@/redux/features/categoryApi";
import ErrorMsg from "@/components/common/error-msg";
import Loader from "@/components/loader/loader";

const MobileCategory = ({ isCategoryActive, categoryType }) => {
  const {data: categories,isError,isLoading} = useGetProductTypeCategoryQuery(categoryType);
  const [isActiveSubMenu,setIsActiveSubMenu] = useState("")
  const router = useRouter();

  // handleOpenSubMenu
  const handleOpenSubMenu = (title) => {
    if(title === isActiveSubMenu){
      setIsActiveSubMenu("")
    }
    else {
      setIsActiveSubMenu(title)
    }
  }

  // handle category route
  const handleCategoryRoute = (title, route, e) => {
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Small delay to ensure event is fully processed
    setTimeout(() => {
      if (route === "parent") {
        router.push(
          `/shop?category=${title
            .toLowerCase()
            .replace("&", "")
            .split(" ")
            .join("-")}`
        );
      } else {
        router.push(
          `/shop?subCategory=${title
            .toLowerCase()
            .replace("&", "")
            .split(" ")
            .join("-")}`
        );
      }
    }, 0);
  };
  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <div className="py-5">
        <Loader loading={isLoading} />
      </div>
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && categories?.result?.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  }
  if (!isLoading && !isError && categories?.result?.length > 0) {
    const category_items = categories.result;
    content = category_items.map((item) => (
      <li className="has-dropdown" key={item._id}>
        <a 
          href="#"
          className="cursor-pointer"
          onClick={(e) => handleCategoryRoute(item.parent, "parent", e)}
        >
          {item.img && (
            <span>
              <Image src={item.img} alt="cate img" width={50} height={50} />
            </span>
          )}
          {item.parent}
          {item.children && (
            <button onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleOpenSubMenu(item.parent);
            }} className="dropdown-toggle-btn">
              <i className="fa-regular fa-angle-right"></i>
            </button>
          )}
        </a>

        {item.children && (
          <ul className={`tp-submenu ${isActiveSubMenu === item.parent ? 'active':''}`}>
            {item.children.map((child, i) => (
              <li
                key={i}
                onClick={(e) => handleCategoryRoute(child, "children", e)}
              >
                <a 
                  href="#" 
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  {child}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  }
  return <ul className={isCategoryActive ? "active" : ""}>{content}</ul>;
};

export default MobileCategory;
