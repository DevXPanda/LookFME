import Link from "next/link";
import Image from "next/image";

const menuData = [
  {
    title: "MEN",
    banner: "/assets/img/navbar/men/men-banner.png", // Use your vertical banner image
    bannerText: "NEW FITS FOR HIM",
    bannerLink: "/shop/men",
    mainImages: [
      { src: "/assets/img/navbar/men-1.png", text: "MOVE", link: "/shop/men/move" },
      { src: "/assets/img/navbar/men-2.png", text: "INTERNATIONAL COLLECTION", link: "/shop/men/international" },
      { src: "/assets/img/navbar/men-3.png", text: "ATHLEISURE", link: "/shop/men/athleisure" },
    ],
    smallImages: [
      { src: "/assets/img/navbar/men1.png", text: "SOFT WONDER", link: "/shop/men/softwonder" },
      { src: "/assets/img/navbar/men2.png", text: "PERIOD PANTY", link: "/shop/men/periodpanty" },
      { src: "/assets/img/navbar/men3.png", text: "ALL DAY PANTS", link: "/shop/men/alldaypants" },
    ],
  },
  // Repeat for WOMEN, KIDS, ACCESSORIES, BEAUTY...
];

export default function MegaMenu() {
  return (
    <nav className="mega-navbar">
      <ul className="main-menu">
        {menuData.map((section) => (
          <li key={section.title} className="menu-item">
            <span>{section.title}</span>
            <div className="mega-menu-content">
              <div className="vertical-banner">
                <Link href={section.bannerLink}>
                  <a>
                    <Image src={section.banner} alt={section.bannerText} width={180} height={600} />
                    <div className="banner-text">{section.bannerText}</div>
                  </a>
                </Link>
              </div>
              <div className="main-images">
                {section.mainImages.map((img) => (
                  <Link href={img.link} key={img.text}>
                    <a className="main-img-link">
                      <Image src={img.src} alt={img.text} width={140} height={600} />
                      <div className="img-text">{img.text}</div>
                    </a>
                  </Link>
                ))}
              </div>
              <div className="small-images">
                {section.smallImages.map((img) => (
                  <Link href={img.link} key={img.text}>
                    <a className="small-img-link">
                      <Image src={img.src} alt={img.text} width={80} height={80} />
                      <div className="img-text">{img.text}</div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .mega-navbar { background: #fff; }
        .main-menu { display: flex; gap: 2rem; list-style: none; }
        .menu-item { position: relative; }
        .mega-menu-content {
          display: none;
          position: absolute;
          left: 0; top: 100%;
          background: #fff;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          padding: 2rem;
          z-index: 10;
          min-width: 800px;
          display: flex;
          gap: 2rem;
        }
        .menu-item:hover .mega-menu-content { display: flex; }
        .vertical-banner { flex: 0 0 180px; text-align: center; }
        .banner-text { margin-top: 1rem; font-weight: bold; }
        .main-images, .small-images { display: flex; flex-direction: column; gap: 1rem; }
        .main-img-link, .small-img-link { display: flex; flex-direction: column; align-items: center; text-decoration: none; color: #222; }
        .img-text { margin-top: 0.5rem; font-size: 1rem; text-align: center; }
        .main-images { flex: 0 0 160px; }
        .small-images { flex: 0 0 100px; }
      `}</style>
    </nav>
  );
}