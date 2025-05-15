'use client';

import { MENU_APP_ITEM, MENU_ITEMS, MENU_TOP_APP_ITEM } from '@/constants/MenuItem';
import Auth from '@/utils/store/Authentication';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Input } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import styles from './HeaderMobile.module.scss';
import { LayoutPaths, Paths } from '@/utils/router';
import SearchIcon from '@/components/SVG/SearchIcon';
import MyLink from '@/components/ui/link/MyLink';

const { Search } = Input;

const HeaderMobile = ({ onSearch, isShowProfile, myApps, menu }) => {
  const [active, setActive] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [activeMenu, setActiveMenu] = useState(false);
  const [activeTopApp, setActiveTopApp] = useState(false);

  const handlerClick = () => {
    setActive(!active);
  };

  const handlerClickDropdown = (item) => {
    if (item.hasSub) {
      item.key === 'apps' ? setActiveMenu(!activeMenu) : setActiveTopApp(!activeTopApp);
      return;
    }
    if (item.isCheckAuth) {
      setActiveDropdown(!activeDropdown);
    }
  };

  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    const isAuthenticated = Auth.isAuthenticated();
    const isStore = Auth.getIsStore();

    if (item.isCheckAuth) {
      if (isAuthenticated && isStore) {
        return true;
      }
      if (isAuthenticated && !isStore && item.key === 'my-apps') {
        return true;
      }
      return false;
    }

    return true;
  });

  return (
    <div className={styles.headerMobile}>
      <div className={styles.headerMobileLogo}>
        <MyLink href="/">
          <Image src="/image/logo_update.webp" alt="Logo" width={80} height={60} />
        </MyLink>
      </div>
      <div className={styles.headerMobileBottom}>
        <div className="Header-mobile-bottom-bars" onClick={handlerClick}>
          <SearchIcon />
        </div>
        <div className={styles.headerMobileSearch}>
          <Search placeholder="Search for apps and developer" onSearch={onSearch} />
        </div>
        <div className={styles.headerMobileLogin}>
          {isShowProfile ? (
            <div className="header-profile">
              <Dropdown overlay={menu} trigger={['click']}>
                <div className="profile-header">
                  <Avatar
                    className="avatar-profile-header"
                    style={{ backgroundColor: '#FFC225' }}
                    icon={<UserOutlined />}
                  />
                </div>
              </Dropdown>
              <div className="model-connect-shopify"></div>
            </div>
          ) : (
            <div className={styles.buttonLogin}>
              <MyLink href={`${LayoutPaths.Auth}${Paths.LoginApp}`} className={styles.linkLoginApp}>
                Login
              </MyLink>
            </div>
          )}
        </div>
        <ul className={`${styles.headerMobileList} ${active ? styles.active : ''}`}>
          {filteredMenuItems.map((item, index) => (
            <li
              key={item.key}
              className={`${item.isCheckAuth || item.hasSub ? styles.hasSubMenu : ''}`}
              onClick={() => handlerClickDropdown(item)}
            >
              {item.isCheckAuth && Auth.isAuthenticated() && item.isShowPopupMyApp ? (
                <MyLink href="#javascript">{item.nameShow}</MyLink>
              ) : (
                <MyLink href={item.hasSub ? '#javascript' : item.linkTo || '#'}>{item.title}</MyLink>
              )}
              {item.hasSub && item.key === 'apps' ? (
                <ul className={`${styles.dropdownMenu} ${activeMenu ? styles.active : ''}`}>
                  {MENU_APP_ITEM.map((item) => (
                    <li key={item.key}>
                      <MyLink href={item.linkTo || '#'}>{item.title}</MyLink>
                    </li>
                  ))}
                </ul>
              ) : (
                ''
              )}
              {item.hasSub && item.key !== 'apps' ? (
                <ul className={`${styles.dropdownMenu} ${activeTopApp ? styles.active : ''}`}>
                  {MENU_TOP_APP_ITEM.map((item) => (
                    <li key={item.key}>
                      <MyLink href={item.linkTo || '#'}>{item.title}</MyLink>
                    </li>
                  ))}
                </ul>
              ) : (
                ''
              )}
              {item.isCheckAuth && Auth.isAuthenticated() && item.isShowPopupMyApp ? (
                <ul className={`${styles.dropdownMenu} ${activeDropdown ? styles.active : ''}`}>
                  {myApps &&
                    myApps.map((item, index) => (
                      <li key={index}>
                        <MyLink href={'/app/' + item.app_id}>
                          {item.detail && item.detail.name ? item.detail.name : ''}
                        </MyLink>
                      </li>
                    ))}
                </ul>
              ) : (
                ''
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HeaderMobile;
