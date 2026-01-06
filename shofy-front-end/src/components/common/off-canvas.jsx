import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
// internal
import { CloseTwo } from '@/svg';
import logo from '@assets/img/logo/logo.svg';
import contact_img from '@assets/img/icon/contact.png';
import language_img from '@assets/img/icon/language-flag.png';
import MobileCategory from '@/layout/headers/header-com/mobile-category';
import MobileMenus from './mobile-menus';

// Mobile Profile Link Component
const MobileProfileLink = ({ user, setIsCanvasOpen }) => {
  // Check authentication from cookie as well
  const userInfoCookie = Cookies.get('userInfo');
  let isAuthenticated = false;
  
  if (userInfoCookie) {
    try {
      const userInfo = JSON.parse(userInfoCookie);
      isAuthenticated = userInfo?.user && (userInfo.user.name || userInfo.user.email);
    } catch (e) {
      isAuthenticated = user?.name || user?.email;
    }
  } else {
    isAuthenticated = user?.name || user?.email;
  }
  
  return (
    <Link 
      href={isAuthenticated ? "/profile" : "/login"} 
      className="tp-btn-2 tp-btn-border-2 w-100 text-center"
      onClick={() => setIsCanvasOpen(false)}
      style={{
        display: 'block',
        padding: '12px 20px',
        textDecoration: 'none',
        borderRadius: '4px',
        border: '1px solid #F875AA',
        color: '#F875AA',
        backgroundColor: 'transparent',
        transition: 'all 0.3s'
      }}
    >
      {isAuthenticated ? 'My Profile' : 'Sign In'}
    </Link>
  );
};

const OffCanvas = ({ isOffCanvasOpen, setIsCanvasOpen,categoryType = "electronics" }) => {
  const [isCategoryActive, setIsCategoryActive] = useState(false);
  const [isCurrencyActive, setIsCurrencyActive] = useState(false);
  const [isLanguageActive, setIsLanguageActive] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // handle language active
  const handleLanguageActive = () => {
    setIsLanguageActive(!isLanguageActive)
    setIsCurrencyActive(false)
  }
  // handle Currency active
  const handleCurrencyActive = () => {
    setIsCurrencyActive(!isCurrencyActive)
    setIsLanguageActive(false)
  }
  return (
    <>
      <div className={`offcanvas__area offcanvas__radius ${isOffCanvasOpen ? "offcanvas-opened" : ""}`}>
        <div className="offcanvas__wrapper">
          <div className="offcanvas__close">
            <button onClick={() => setIsCanvasOpen(false)} className="offcanvas__close-btn offcanvas-close-btn">
              <CloseTwo />
            </button>
          </div>
          <div className="offcanvas__content">
            <div className="offcanvas__top mb-70 d-flex justify-content-between align-items-center">
              <div className="offcanvas__logo logo">
                <Link href="/">
                  <Image src={logo} alt="logo" />
                </Link>
              </div>
            </div>
            <div className="offcanvas__category pb-40">
              <button onClick={() => setIsCategoryActive(!isCategoryActive)} className="tp-offcanvas-category-toggle">
                <i className="fa-solid fa-bars"></i>
                All Categories
              </button>
              <div className="tp-category-mobile-menu">
                <nav className={`tp-category-menu-content ${isCategoryActive ? "active" : ""}`}>
                  <MobileCategory categoryType={categoryType} isCategoryActive={isCategoryActive} />
                </nav>
              </div>
            </div>
            <div className="tp-main-menu-mobile fix d-lg-none mb-40">
              <MobileMenus />
            </div>

            {/* My Profile / Sign In Link for Mobile */}
            <div className="offcanvas__profile mb-30 d-lg-none">
              <MobileProfileLink user={user} setIsCanvasOpen={setIsCanvasOpen} />
            </div>

            <div className="offcanvas__contact align-items-center d-none">
              <div className="offcanvas__contact-icon mr-20">
                <span>
                  <Image src={contact_img} alt="contact_img" />
                </span>
              </div>
              <div className="offcanvas__contact-content">
                <h3 className="offcanvas__contact-title">
                  <a href="tel:098-852-987">004524865</a>
                </h3>
              </div>
            </div>
            <div className="offcanvas__btn">
              <Link href="/contact" className="tp-btn-2 tp-btn-border-2">Contact Us</Link>
            </div>
          </div>
          <div className="offcanvas__bottom">
            <div className="offcanvas__footer d-flex align-items-center justify-content-between">
              <div className="offcanvas__currency-wrapper currency">
                <span onClick={handleCurrencyActive} className="offcanvas__currency-selected-currency tp-currency-toggle" id="tp-offcanvas-currency-toggle">Currency : INR</span>
                <ul className={`offcanvas__currency-list tp-currency-list ${isCurrencyActive ? 'tp-currency-list-open' : ''}`}>
                  <li>INR</li>
                </ul>
              </div>
              <div className="offcanvas__select language">
                <div className="offcanvas__lang d-flex align-items-center justify-content-md-end">
                  <div className="offcanvas__lang-img mr-15">
                    <Image src={language_img} alt="language-flag" />
                  </div>
                  <div className="offcanvas__lang-wrapper">
                    <span onClick={handleLanguageActive} className="offcanvas__lang-selected-lang tp-lang-toggle" id="tp-offcanvas-lang-toggle">English</span>
                    <ul className={`offcanvas__lang-list tp-lang-list ${isLanguageActive ? 'tp-lang-list-open' : ''}`}>
                      <li>Hindi</li>
                      <li>Portugese</li>
                      <li>American</li>
                      <li>Canada</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* body overlay start */}
      <div onClick={() => setIsCanvasOpen(false)} className={`body-overlay ${isOffCanvasOpen ? 'opened' : ''}`}></div>
      {/* body overlay end */}
    </>
  );
};

export default OffCanvas;