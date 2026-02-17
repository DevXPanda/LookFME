import { ISidebarMenus } from "./../types/menu-types";
import {
  Dashboard,
  Categories,
  Coupons,
  Orders,
  Pages,
  Products,
  Profile,
  Reviews,
  Setting,
  Leaf,
  StuffUser,
} from "@/svg";

const sidebar_menu: Array<ISidebarMenus> = [
  {
    id: 100,
    icon: Setting, // Use appropriate icon
    link: "/inventory",
    title: "Inventory",
    subMenus: [
      { title: "Category Stock Details", link: "/inventory/category-stock" },
      { title: "Low Stock Alerts", link: "/inventory/low-stock" },
      { title: "Stock Valuation Report", link: "/inventory/stock-valuation" },
      { title: "Sales vs Stock Report", link: "/inventory/sales-vs-stock" },
    ],
  },
  {
    id: 1,
    icon: Dashboard,
    link: "/dashboard",
    title: "Dashboard",
  },
  {
    id: 2,
    icon: Products,
    link: "/product-list",
    title: "Products",
    subMenus: [
      { title: "Product List", link: "/product-list" },
      { title: "Product Grid", link: "/product-grid" },
      { title: "Add Product", link: "/add-product" }
    ],
  },
  {
    id: 3,
    icon: Categories,
    link: "/category",
    title: "Category",
  },
  {
    id: 4,
    icon: Orders,
    link: "/orders",
    title: "Orders",
    subMenus: [
      { title: "All", link: "/orders?status=all" },
      { title: "Pending", link: "/orders?status=pending" },
      { title: "Confirmed", link: "/orders?status=confirmed" },
      { title: "Packaging", link: "/orders?status=packaging" },
      { title: "Out for delivery", link: "/orders?status=out-for-delivery" },
      { title: "Delivered", link: "/orders?status=delivered" },
      { title: "Returned", link: "/orders?status=returned" },
      { title: "Failed to Deliver", link: "/orders?status=failed-to-deliver" },
      { title: "Canceled", link: "/orders?status=canceled" },
    ],
  },
  {
    id: 5,
    icon: Leaf,
    link: "/brands",
    title: "Brand",
  },
  {
    id: 6,
    icon: Reviews,
    link: "/reviews",
    title: "Reviews",
  },
  {
    id: 7,
    icon: Coupons,
    link: "/coupon",
    title: "Coupons",
  },
  {
    id: 14,
    icon: Setting,
    link: "/cms",
    title: "CMS Management",
    subMenus: [
      { title: "Homepage Banners", link: "/cms/homepage-banners" },
    ],
  },
  {
    id: 12,
    icon: Dashboard,
    link: "/reports-analytics",
    title: "Reports & Analytics",
  },
  {
    id: 13,
    icon: StuffUser,
    link: "/user-management",
    title: "User Management",
    subMenus: [
      { title: "Customers", link: "/user-management/customers" },
      { title: "Subscribers", link: "/user-management/subscribers" },
    ],
  },
  {
    id: 8,
    icon: Profile,
    link: "/profile",
    title: "Profile",
  },
  {
    id: 9,
    icon: Setting,
    link: "#",
    title: "Online store",
  },
  {
    id: 10,
    icon: StuffUser,
    link: "/our-staff",
    title: "Our Staff",
  },
  {
    id: 11,
    icon: Pages,
    link: "/dashboard",
    title: "Pages",
    subMenus: [
      { title: "Register", link: "/register" },
      { title: "Login", link: "/login" },
      { title: "Forgot Password", link: "/forgot-password" }
    ],
  },
];

export default sidebar_menu;
