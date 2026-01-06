'use client';
import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

// language
function Language({ active, handleActive }) {
  return (
    <div className="tp-header-top-menu-item tp-header-lang">
      <span
        onClick={() => handleActive('lang')}
        className="tp-header-lang-toggle"
        id="tp-header-lang-toggle"
      >
        English
      </span>
      <ul className={active === 'lang' ? "tp-lang-list-open" : ""}>
        <li>
          <a href="#">Hindi</a>
        </li>
        <li>
          <a href="#">Spanish</a>
        </li>
        <li>
          <a href="#">Russian</a>
        </li>
        <li>
          <a href="#">Portuguese</a>
        </li>
      </ul>
    </div>
  );
}

// currency
function Currency({ active, handleActive }) {
  return (
    <div className="tp-header-top-menu-item tp-header-currency">
      <span
        onClick={() => handleActive('currency')}
        className="tp-header-currency-toggle"
        id="tp-header-currency-toggle"
      >
        INR
      </span>
      <ul className={active === 'currency' ? "tp-currency-list-open" : ""}>
        <li>
          <a href="#">INR</a>
        </li>
      </ul>
    </div>
  );
}

// setting
function ProfileSetting() {
  const { user } = useSelector((state) => state.auth);
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
    <div className="tp-header-top-menu-item tp-header-setting">
      {isAuthenticated ? (
        <Link href="/profile" className="tp-header-setting-toggle">
          My Profile
        </Link>
      ) : (
        <Link href="/login" className="tp-header-setting-toggle">
          Sign In
        </Link>
      )}
    </div>
  );
}

const HeaderTopRight = () => {
  const [active, setIsActive] = useState('');
  // handle active
  const handleActive = (type) => {
    if (type === active) {
      setIsActive('')
    }
    else {
      setIsActive(type)
    }
  }
  return (
    <div className="tp-header-top-menu d-flex align-items-center justify-content-end flex-wrap" style={{ gap: '8px' }}>
      <Language active={active} handleActive={handleActive} />
      <Currency active={active} handleActive={handleActive} />
      <ProfileSetting />
      <span className="d-none d-sm-inline">Bulk Order</span>
    </div>
  );
};

export default HeaderTopRight;
