// import home_1 from '@assets/img/menu/menu-home-1.jpg';
import home_2 from '@assets/img/menu/menu-home-2.jpg';
// import home_3 from '@assets/img/menu/menu-home-3.jpg';
// import home_4 from '@assets/img/menu/menu-home-4.jpg';

const menu_data = [
  {
    id: 1,
    homes: true,
    title: 'Home',
    link: '/',
    // home_pages: [
    //   {
    //     img: home_1,
    //     title: 'Electronics',
    //     link: '/'
    //   },
    //   {
    //     img: home_2,
    //     title: 'Fashion',
    //     link: '/home-2'
    //   },
    //   {
    //     img: home_3,
    //     title: 'Beauty',
    //     link: '/home-3'
    //   },
    //   {
    //     img: home_4,
    //     title: 'Jewelry',
    //     link: '/home-4'
    //   }
    // ]
  },
  {
    id: 2,
    products: true,
    title: 'Men',
    link: '/shop',
    product_pages: [
      {
        title: 'TSHIRTS',
        link: '/shop',
        mega_menus: [
          { title: 'Plain T-shirts', link: '/shop-category' },
          { title: 'Printed T-shirts', link: '/shop' },
          { title: 'Regular Fit T-shirt', link: '/product-details' },
          { title: 'Polo T-shirts', link: '/shop' },
          { title: 'Full Sleeve Tshirts', link: '/shop' },
          { title: 'OverSized Tshirts', link: 'shop' },
        ]
      },
      {
        title: 'SHIRTS',
        link: '/product-details',
        mega_menus: [
          { title: 'Formal Shirts', link: '/shop' },
          { title: 'Casual Shirts', link: '/shop' },
          { title: 'Polo Shirts', link: '/shop' },
          { title: 'Full Sleeve Tshirts', link: '/shop' },
          { title: 'Checked Formal Shirts', link: 'shop' },
          { title: 'Floral Shirts', link: '/shop' },
    ],
  },
  {
        title: 'BOTTOM WEAR',
        link: '/shop',
        mega_menus: [
          { title: 'Cargo Joggers', link: '/shop-category' },
          { title: 'Cargo Pants', link: '/shop' },
          { title: 'Trousers', link: '/product-details' },
          { title: 'Jeans', link: '/shop' },
          { title: 'Boxers', link: '/shop' },
          { title: 'Shorts', link: 'shop' },
        ]
      },
    ],
    // Special sections for the new layout
    special_offerings: [
      { title: 'ANYWHERE SHORTS', image: '/assets/img/navbar/men/men-1.png', link: '/shop/anywhere-shorts' },
      { title: 'TANK TOPS', image: '/assets/img/navbar/men/men-2.png', link: '/shop/tank-tops' },
      { title: 'ALL DAY PANTS', image: '/assets/img/navbar/men/men-3.png', link: '/shop/all-day-pants' }
    ],
    trending_collections: [
      { title: 'MOYE ATHLEISURE', image: '/assets/img/navbar/men/men1.png', link: '/shop/moye-athleisure' },
      { title: 'INTERNATIONAL COLLECTION', image: '/assets/img/navbar/men/men2.png', link: '/shop/international' },
      { title: 'MOVE INTERNATIONAL COLLECTION', image: '/assets/img/navbar/men/men3.png', link: '/shop/move-international' }
    ],
    banner: {
      title: 'MENS FASHION',
      subtitle: 'EVERYTHING FOR MEN',
      discount: '50% OFF',
      image: '/assets/img/navbar/men/men-banner.png',
      contact: {
        website: 'www.craftyart.com',
        social: '@craftyfashionsite',
        phone: '123-456-789'
      }
    }
  },
  {
    id: 3,
    products: true,
    title: 'Women',
    link: '/shop',
    product_pages: [
      {
        title: 'Tshirts',
        link: '/shop',
        mega_menus: [
          { title: 'Plain T-shirts', link: '/shop-category' },
          { title: 'Printed T-shirts', link: '/shop' },
          { title: 'Regular Fit T-shirt', link: '/product-details' },
          { title: 'Polo T-shirts', link: '/shop' },
          { title: 'Full Sleeve Tshirts', link: '/shop' },
          { title: 'OverSized Tshirts', link: 'shop' },
        ]
      },
      {
        title: 'Shirts',
        link: '/product-details',
        mega_menus: [
          { title: 'Formal Shirts', link: '/shop' },
          { title: 'Casual Shirts', link: '/shop' },
          { title: 'Polo Shirts', link: '/shop' },
          { title: 'Full Sleeve Tshirts', link: '/shop' },
          { title: 'Checked Formal Shirts', link: 'shop' },
          { title: 'Floral Shirts', link: '/shop' },
    ],
  },
  {
        title: 'Bottom Wear',
        link: '/shop',
        mega_menus: [
          { title: 'Cargo Joggers', link: '/shop-category' },
          { title: 'Cargo Pants', link: '/shop' },
          { title: 'Trousers', link: '/product-details' },
          { title: 'Jeans', link: '/shop' },
          { title: 'Boxers', link: '/shop' },
          { title: 'Shorts', link: 'shop' },
        ]
      },
      {
        title: 'Athleisure Mode',
        link: '/shop',
        mega_menus: [
          { title: 'Track Pants', link: '/shop-category' },
          { title: 'Track Suits', link: '/shop' },
          { title: 'Joggers', link: '/product-details' },
          { title: 'Sweatshirts', link: '/shop' },
          { title: 'Yoga Pants', link: '/shop' },
          { title: 'Zip-Up Jackets ', link: 'shop' },
        ]
      },
      // {
      //   title: 'Women',
      //   link: '/shop',
      //   mega_menus: [
      //     { title: 'Shopping Cart', link: '/cart' },
      //     { title: 'Compare', link: '/compare' },
      //     { title: 'Wishlist', link: '/wishlist' },
      //     { title: 'Checkout', link: '/checkout' },
      //     { title: 'My account', link: '/profile' },
      //   ]
      // },
      // {
      //   title: 'More Pages',
      //   link: '/shop',
      //   mega_menus: [
      //     { title: 'Login', link: '/login' },
      //     { title: 'Register', link: '/register' },
      //     { title: 'Forgot Password', link: '/forgot' },
      //     { title: '404 Error', link: '/404' },
      //   ]
      // },
    ]
  },
  {
    id: 4,
    products: true,
    title: 'Junior',
    link: '/junior',
    product_pages: [
      {
        title: 'Boys',
        link: '/shop',
        mega_menus: [
          { title: 'T-shirts', link: '/shop-category' },
          { title: 'Shirts', link: '/shop' },
          { title: 'Jeans & Trousers', link: '/product-details' },
          { title: 'Sweatshirts & Hoodies', link: '/shop' },
          { title: 'Ethnic Wear (Kurta, Sherwani)', link: '/shop' },
          { title: 'Shorts', link: 'shop' },
        ]
      },
      {
        title: 'Girls',
        link: '/product-details',
        mega_menus: [
          { title: 'Tops & T-Shirts', link: '/shop' },
          { title: 'Dresses & Frocks', link: '/shop' },
          { title: 'Skirts & Shorts', link: '/shop' },
          { title: 'Jeans & Leggings', link: '/shop' },
          { title: 'Sweatshirts & Hoodies', link: 'shop' },
          { title: 'Ethnic Wear (Lehenga, Kurti)', link: '/shop' },
    ],
  },
  ]
  },
  {
    id: 5,
    products: true,
    title: 'Accessories',
    link: '/shop',
    product_pages: [
      {
        title: 'Headwear',
        link: '/shop',
        mega_menus: [
          { title: 'Caps & Hats', link: '/shop-category' },
          { title: 'Bandanas', link: '/shop' },
          { title: 'Regular Fit T-shirt', link: '/product-details' },
          { title: 'Headbands', link: '/shop' },
        ]
      },
      {
        title: 'Fashion Accessories',
        link: '/product-details',
        mega_menus: [
          { title: 'Belts', link: '/shop' },
          { title: 'Cufflinks & Brooches', link: '/shop' },
          { title: 'Wallets & Card Holders', link: '/shop' },
          { title: 'Ties & Bow Ties', link: '/shop' },
    ],
  },
  {
        title: 'Bags & Carriers',
        link: '/shop',
        mega_menus: [
          { title: 'Backpacks', link: '/shop-category' },
          { title: 'Sling Bags', link: '/shop' },
          { title: 'Laptop Bags', link: '/product-details' },
          { title: 'Tote Bags', link: '/shop' },
        ]
      },

    ]
  },
  {
    id: 6,
    sub_menu: true,
    title: 'Cosmetic',
    link: '/blog',
    sub_menus: [
      { title: 'Skincare ', link: '/blog' },
      { title: 'Hair Care', link: '/blog-grid' },
      { title: 'Fragrances', link: '/blog-list' },
      { title: 'Body Care', link: '/blog-details' },
      { title: 'Mens Grooming', link: '/blog-details-2' },
    ]
  },
 
]

export default menu_data;

// mobile_menu
export const mobile_menu = [
  {
    id: 1,
    homes: true,
    title: 'Home',
    link: '/',
  },
  {
    id: 2,
    sub_menu: true,
    title: 'Products',
    link: '/shop',
    sub_menus: [
      { title: 'Mens', link: '/shop' },
      { title: 'Womens', link: '/shop-right-sidebar' },
      { title: 'Lookfame Juniors', link: '/shop-hidden-sidebar' },
      { title: 'Accessories', link: '/shop-category' },
      // { title: 'Product Simple', link: '/product-details' },
      // { title: 'With Video', link: '/product-details-video' },
      // { title: 'With Countdown Timer', link: '/product-details-countdown' },
      // { title: 'Variations Swatches', link: '/product-details-swatches' },
    ],
  },
  // {
  //   id: 3,
  //   sub_menu: true,
  //   title: 'eCommerce',
  //   link: '/cart',
  //   sub_menus: [
  //     { title: 'Shopping Cart', link: '/cart' },
  //     { title: 'Compare', link: '/compare' },
  //     { title: 'Wishlist', link: '/wishlist' },
  //     { title: 'Checkout', link: '/checkout' },
  //     { title: 'My account', link: '/profile' },
  //   ],
  // },
  // {
  //   id: 4,
  //   sub_menu: true,
  //   title: 'More Pages',
  //   link: '/login',
  //   sub_menus: [
  //     { title: 'Login', link: '/login' },
  //     { title: 'Register', link: '/register' },
  //     { title: 'Forgot Password', link: '/forgot' },
  //     { title: '404 Error', link: '/404' },
  //   ],
  // },
  // {
  //   id: 7,
  //   single_link: true,
  //   title: 'Coupons',
  //   link: '/coupon',
  // },
  {
    id: 5,
    sub_menu: true,
    title: 'Cosmetic',
    link: '/blog',
    sub_menus: [
      { title: 'Skincare', link: '/blog' },
      { title: 'Hair Care', link: '/blog-grid' },
      { title: 'Fragrances', link: '/blog-list' },
      { title: 'Body Care', link: '/blog-details' },
      { title: 'Mens Grooming', link: '/blog-details-2' },
      // { title: 'Blog Details', link: '/blog-details' },
      // { title: 'Blog Details Full Width', link: '/blog-details-2' },
    ]
  },
  {
    id: 6,
    single_link: true,
    title: 'Contact',
    link: '/contact',
  },
]