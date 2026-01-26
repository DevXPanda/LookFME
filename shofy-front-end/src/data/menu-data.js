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
          { title: 'Plain T-shirts', link: '/shop' },
          { title: 'Printed T-shirts', link: '/shop' },
          { title: 'Regular Fit T-shirt', link: '/shop' },
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
          { title: 'Cargo Joggers', link: '/shop' },
          { title: 'Cargo Pants', link: '/shop' },
          { title: 'Trousers', link: '/shop' },
          { title: 'Jeans', link: '/shop' },
          { title: 'Boxers', link: '/shop' },
          { title: 'Shorts', link: 'shop' },
        ]
      },
    ],
    // Special sections for the new layout
    special_offerings: [
      { title: '', image: '/assets/img/navbar/men/Our Special offering 1.jpg', link: '/shop?category=men' },
      { title: '', image: '/assets/img/navbar/men/Our Special offering 2.jpg', link: '/shop?category=men' },
      { title: '', image: '/assets/img/navbar/men/Our Special offering 3.jpg', link: '/shop?category=men' }
    ],
    trending_collections: [
      { title: '', image: '/assets/img/navbar/men/Trending 1.jpg', link: '/shop?category=men' },
      { title: '', image: '/assets/img/navbar/men/Trending 2.jpg', link: '/shop?category=men' },
      { title: '', image: '/assets/img/navbar/men/Trending 3.jpg', link: '/shop?category=men' }
    ],
    banner: {
      title: 'MENS FASHION',
      subtitle: 'EVERYTHING FOR MEN',
      discount: '50% OFF',
      image: '/assets/img/navbar/men/Men Banner.jpg',
      link: '/shop?category=men',
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
          { title: 'Plain T-shirts', link: '/shop' },
          { title: 'Printed T-shirts', link: '/shop' },
          { title: 'Regular Fit T-shirt', link: '/shop' },
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
          { title: 'Cargo Joggers', link: '/shop' },
          { title: 'Cargo Pants', link: '/shop' },
          { title: 'Trousers', link: '/shop' },
          { title: 'Jeans', link: '/shop' },
          { title: 'Boxers', link: '/shop' },
          { title: 'Shorts', link: 'shop' },
        ]
      },
      {
        title: 'Athleisure Mode',
        link: '/shop',
        mega_menus: [
          { title: 'Track Pants', link: '/shop' },
          { title: 'Track Suits', link: '/shop' },
          { title: 'Joggers', link: '/shop' },
          { title: 'Sweatshirts', link: '/shop' },
          { title: 'Yoga Pants', link: '/shop' },
          { title: 'Zip-Up Jackets ', link: 'shop' },
        ]
      },
    ],
    // Special sections for Women layout
    special_offerings: [
      { title: '', image: '/assets/img/navbar/women/Special offering 1.jpg', link: '/shop?category=women' },
      { title: '', image: '/assets/img/navbar/women/Special offering 2.jpg', link: '/shop?category=women' },
      { title: '', image: '/assets/img/navbar/women/Special offering 3.jpg', link: '/shop?category=women' }
    ],

    trending_collections: [
      { title: '', image: '/assets/img/navbar/women/Trending 1.jpg', link: '/shop?category=women' },
      { title: '', image: '/assets/img/navbar/women/Trending 2.jpg', link: '/shop?category=women' },
      { title: '', image: '/assets/img/navbar/women/Trending 3.jpg', link: '/shop?category=women' }
    ],

    banner: {
      title: 'WOMEN’S FASHION',
      subtitle: 'STYLE FOR EVERY OCCASION',
      discount: '40% OFF',
      image: '/assets/img/navbar/women/Women Banner.jpg',
      link: '/shop?category=women',
      contact: {
        website: 'www.craftyart.com',
        social: '@craftywomensite',
        phone: '987-654-321'
      }
    }
  },
  {
    id: 4,
    products: true,
    title: 'Junior',
    link: '/shop',
    product_pages: [
      {
        title: 'Boys',
        link: '/shop',
        mega_menus: [
          { title: 'T-shirts', link: '/shop' },
          { title: 'Shirts', link: '/shop' },
          { title: 'Jeans & Trousers', link: '/shop' },
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
    ],

    special_offerings: [
      { title: '', image: '/assets/img/navbar/kids/Special Offering 1.jpg', link: '/shop?category=junior' },
      { title: '', image: '/assets/img/navbar/kids/Special Offering 2.jpg', link: '/shop?category=junior' },
      { title: '', image: '/assets/img/navbar/kids/Special Offering 3.jpg', link: '/shop?category=junior' }
    ],

    // Trending Collections
    trending_collections: [
      { title: '', image: '/assets/img/navbar/kids/Trending 1.jpg', link: '/shop?category=junior' },
      { title: '', image: '/assets/img/navbar/kids/Trending 2.jpg', link: '/shop?category=junior' },
      { title: '', image: '/assets/img/navbar/kids/Trending 3.jpg', link: '/shop?category=junior' }
    ],

    // Banner
    banner: {
      title: 'KIDS FASHION',
      subtitle: 'TRENDY & COMFY FOR LITTLE ONES',
      image: '/assets/img/navbar/kids/Kid banner.jpg',
      link: '/shop?category=junior',

    }
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
          { title: 'Caps & Hats', link: '/shop' },
          { title: 'Bandanas', link: '/shop' },
          { title: 'Regular Fit T-shirt', link: '/shop' },
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
          { title: 'Socks', link: '/shop' },
        ],
      },
      {
        title: 'Bags & Carriers',
        link: '/shop',
        mega_menus: [
          { title: 'Backpacks', link: '/shop' },
          { title: 'Sling Bags', link: '/shop' },
          { title: 'Laptop Bags', link: '/shop' },
          { title: 'Tote Bags', link: '/shop' },
        ]
      },

    ],
    // Special Offerings
    special_offerings: [
      { title: '', image: '/assets/img/navbar/accessories/Special Offering 1.jpg', link: '/shop?category=accessories' },
      { title: '', image: '/assets/img/navbar/accessories/Special Offering 2.jpg', link: '/shop?category=accessories' },
      { title: '', image: '/assets/img/navbar/accessories/Special Offering 3.jpg', link: '/shop?category=accessories' }
    ],

    // Trending Collections
    trending_collections: [
      { title: '', image: '/assets/img/navbar/accessories/Trending 1.jpg', link: '/shop?category=accessories' },
      { title: '', image: '/assets/img/navbar/accessories/Trending 2.jpg', link: '/shop?category=accessories' },
      { title: '', image: '/assets/img/navbar/accessories/Trending 3.jpg', link: '/shop?category=accessories' }
    ],

    // Banner
    banner: {
      title: 'ACCESSORIES',
      subtitle: 'STYLE THAT COMPLETES YOU',
      discount: '25% OFF',
      image: '/assets/img/navbar/accessories/Accessories Banner.jpg',
      link: '/shop?category=accessories',
    }

  },
  {
    id: 6,
    products: true,
    // sub_menu: true,
    title: 'Cosmetic',
    link: '/shop',
    product_pages: [
      {
        title: 'Skincare',
        link: '/shop',
        mega_menus: [
          { title: 'Primer', link: '/shop' },
          { title: 'Sunscreen', link: '/shop' },
          { title: 'Moisturizers', link: '/shop' },
          { title: 'Day Cream', link: '/shop' },
          { title: 'Night Cream', link: '/shop' },
          { title: 'Face Wash/Cleanser', link: '/shop' },
          { title: 'Face Mask', link: '/shop' },
          { title: 'Sheet Mask', link: '/shop' },
          { title: 'Face Pack', link: '/shoP' },
          { title: 'Lip Balm', link: '/shop' },
          { title: 'Wet Tissue', link: '/shop' },
          { title: 'Makeup Remover', link: '/shop' },
        ]
      },
      {
        title: 'Color Cosmetic',
        link: '/shop',
        mega_menus: [
          { title: 'Concealer/Foundation', link: '/shop-category/foundations' },
          { title: 'Compact', link: '/shop-category/concealers' },
          { title: 'Face Powder', link: '/shop-category/blush-bronzer' },
          { title: 'Blush', link: '/shop-category/highlighters' },
          { title: 'Highlighter', link: '/shop-category/eyeshadows' },
          { title: 'Contour', link: '/shop-category/lipsticks' },
          { title: 'Bronzer', link: '/shop-category/mascaras' },
          { title: 'Eye Shadow', link: '/shop-category/mascaras' },
          { title: 'Eyeliner', link: '/shop-category/mascaras' },
          { title: 'Kajal', link: '/shop-category/mascaras' },
          { title: 'Mascara', link: '/shop-category/mascaras' },
          { title: 'Eyebrow Pencil', link: '/shop-category/mascaras' },
          { title: 'Lipstick/Lip Color', link: '/shop-category/mascaras' },
          { title: 'Lip Liner', link: '/shop-category/mascaras' },
          { title: 'Nail Polish', link: '/shop-category/mascaras' },
          { title: 'Nail Paint Remover', link: '/shop-category/mascaras' },
          { title: 'Bindi', link: '/shop-category/mascaras' },
          { title: 'Sindur', link: '/shop-category/mascaras' },
          { title: 'Perfume', link: '/shop-category/mascaras' },
        ]
      }
    ],

    // special offering
    special_offerings: [
      { title: '', image: '/assets/img/navbar/Cosmetics/Special offer 1.jpg', link: '/shop?category=cosmetic' },
      { title: '', image: '/assets/img/navbar/Cosmetics/Special offer 2.jpg', link: '/shop?category=cosmetic' },
      { title: '', image: '/assets/img/navbar/Cosmetics/Special offer 3.jpg', link: '/shop?category=cosmetic' }
    ],


    // Trending Collections
    trending_collections: [
      { title: '', image: '/assets/img/navbar/Cosmetics/Trending 1.jpg', link: '/shop?category=cosmetic' },
      { title: '', image: '/assets/img/navbar/Cosmetics/Trending 2.jpg', link: '/shop?category=cosmetic' },
      { title: '', image: '/assets/img/navbar/Cosmetics/Trending 3.jpg', link: '/shop?category=cosmetic' }
    ],

    // Banner
    banner: {
      title: 'ACCESSORIES',
      subtitle: 'STYLE THAT COMPLETES YOU',
      link: '/shop?category=cosmetic',
      image: '/assets/img/navbar/Cosmetics/Cosmetics Banner.jpg',
    }
  }

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
    id: 6,
    sub_menu: true,
    title: 'Cosmetic',
    link: '/cosmetic',
    sub_menus: [
      { title: 'Skincare', link: '/shop' },
      { title: 'Color cosmetic', link: '/blog-grid' },
    ]
  },
  {
    id: 7,
    single_link: true,
    title: 'Contact',
    link: '/contact',
  },
]