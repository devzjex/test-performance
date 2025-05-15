'use client';
import { Avatar, Badge, Dropdown, Empty, Input, Layout, List, Menu, message, Popover, Tooltip } from 'antd';
import {
  BellOutlined,
  CaretDownOutlined,
  CloseOutlined,
  LoadingOutlined,
  MoreOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { MENU_APPS_ITEM, MENU_RESOURCE_ITEM } from '@/constants/MenuItem';
import { debounce } from 'lodash';
import { usePathname, useRouter } from 'next/navigation';
import Auth from '@/utils/store/Authentication';
import { getNotification, getReviewChanges } from '@/utils/functions';
import SearchDataApiService from '@/api-services/api/SearchDataApiService';
import WatchAppChangeApiService from '@/api-services/api/WatchAppChangeApiService';
import styles from './HeaderComponent.module.scss';
import { LayoutPaths, Paths } from '@/utils/router';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import dynamic from 'next/dynamic';
import MyAppApiService from '@/api-services/api/MyAppApiService';
import MyLink from '@/components/ui/link/MyLink';

const TourGuide = dynamic(() => import('../main/tour-guide/TourGuide'), { ssr: false });

const { Header } = Layout;

const HeaderComponent = ({ myApps, menu, isShowProfile, selectedKeys, setSelectedKey }) => {
  const [listSearch, setListSearch] = useState();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const router = useRouter();
  const userName = Auth.getCurrentUser();
  const accessStore = Auth.getIsStore();
  const pathname = usePathname();
  const [currentKey, setCurrentKey] = useState(pathname);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownVisibleInsights, setIsDropdownVisibleInsights] = useState(false);
  const isAuthenticated = Auth.isAuthenticated();
  const [showOnboard, setShowOnboard] = useState(false);
  const [isDropdownControlledByTour, setIsDropdownControlledByTour] = useState(false);
  const [isDropdownControlledByTour1, setIsDropdownControlledByTour1] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const processNotifications = (notifications) => {
    return notifications.map((notification) => {
      let actionType = '';
      if (notification.notification.includes('revoked') || notification.notification.includes('deleted')) {
        actionType = 'delete';
      } else if (notification.notification.includes('granted') || notification.notification.includes('added')) {
        actionType = 'active';
      }

      return {
        ...notification,
        action_type: actionType,
      };
    });
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (Auth.isAuthenticated()) {
          const [data, unreadCount] = await Promise.all([
            MyAppApiService.getNotifications(),
            MyAppApiService.getCountNotifications(),
          ]);
          const processedNotifications = processNotifications(data.results);
          setNotifications(processedNotifications);
          setUnreadCount(unreadCount.results);
        }
      } catch (error) {
        console.error('Error when calling API to receive notification:', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((notification) => !notification.is_read);
      const response = await MyAppApiService.getReadNotifications(unreadNotifications);

      if (response.code === 0) {
        const updatedNotifications = notifications.map((notification) => ({
          ...notification,
          is_read: true,
        }));
        setNotifications(updatedNotifications);
        setUnreadCount(0);
      } else {
        message.error('There was an error marking the notification as read.');
      }
    } catch (error) {
      message.error('There was an error marking all notifications as read.');
    }
  };

  const renderNotificationList = (
    <div style={{ width: '450px', maxHeight: '300px', overflowY: 'auto' }}>
      <List
        dataSource={notifications}
        renderItem={(item) => {
          let itemStyle = {};
          if (item.action_type === 'delete') {
            itemStyle = { backgroundColor: '#ffcccc' };
          } else if (item.action_type === 'active') {
            itemStyle = { backgroundColor: '#e6ffed' };
          }

          return (
            <List.Item style={{ ...itemStyle }}>
              <List.Item.Meta
                style={{ padding: '0px 5px' }}
                title={item.notification}
                description={`Created At: ${item.created_at}`}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );

  useEffect(() => {
    const checkShowOnboard = async () => {
      if (Auth.getAccessToken()) {
        const response = await LandingPageApiService.handleShowOnboard();
        setShowOnboard(response.show_onboarding);
      }
    };
    checkShowOnboard();
  }, []);

  const handleSeeAllResults = (current) => {
    router.push(`/search?q=${encodeURIComponent(current)}`);
  };

  useEffect(() => {
    setCurrentKey(pathname);
  }, [pathname]);

  const onClickHomepage = () => {
    setSelectedKey(null);
  };

  const resourceSubmenu = (
    <Menu className={styles.appsDropdown}>
      {MENU_RESOURCE_ITEM.map((item) => (
        <Menu.Item key={item.key} className={`${currentKey === item.linkTo ? styles.activeItem : styles.noActive}`}>
          <MyLink href={item.linkTo} onClick={() => handleClickMenuItem(item.linkTo)}>
            {item.title}
          </MyLink>
        </Menu.Item>
      ))}
    </Menu>
  );

  const insightSubmenu = (
    <Menu className={styles.appsDropdown}>
      <Menu.Item
        key="reviews"
        id="step3"
        className={`${currentKey === '/dashboard/reviews' ? styles.activeItem : styles.noActive}`}
      >
        <MyLink href="/dashboard/reviews" onClick={() => handleClickMenuItem('/dashboard/reviews')}>
          Reviews
        </MyLink>
      </Menu.Item>
      <Menu.Item
        key="developers"
        id="step2"
        className={`${currentKey === '/developers' ? styles.activeItem : styles.noActive}`}
      >
        <MyLink href="/developers" onClick={() => handleClickMenuItem('/developers')}>
          Developers
        </MyLink>
      </Menu.Item>
    </Menu>
  );

  const popupSubmenu = (
    <Menu className={styles.appsDropdown}>
      {MENU_APPS_ITEM.map((item) => {
        if (item.key === 'top-apps') {
          const subChildren = item.submenu.map((subItem) => subItem.linkTo);

          const isActive = (currentKey, paths) => {
            const flatPaths = paths.flat();
            return flatPaths.includes(currentKey);
          };

          return (
            <Menu.SubMenu
              className={`${isActive(currentKey, [[item.linkTo], subChildren]) ? styles.activeItem : styles.noActive}`}
              key={item.key}
              title={
                <MyLink href={item.linkTo} onClick={() => handleClickMenuItem(item.linkTo)}>
                  {item.title}
                </MyLink>
              }
            >
              {item.submenu.map((subItem) => {
                return (
                  <Menu.Item
                    key={subItem.key}
                    className={`${currentKey === subItem.linkTo ? 'activeItem' : styles.noActive}`}
                  >
                    <MyLink href={subItem.linkTo} onClick={() => handleClickMenuItem(subItem.linkTo)}>
                      {subItem.title}
                    </MyLink>
                  </Menu.Item>
                );
              })}
            </Menu.SubMenu>
          );
        }
        return (
          <Menu.Item key={item.key} className={`${currentKey === item.linkTo ? styles.activeItem : styles.noActive}`}>
            <MyLink href={item.linkTo} onClick={() => handleClickMenuItem(item.linkTo)}>
              {item.title}
            </MyLink>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const handleMenuItemClick = (e) => {
    e.domEvent.stopPropagation();
  };

  const handleClickMenuItem = (key) => {
    setCurrentKey(key);
  };

  const listAppsSearch = useMemo(() => {
    return listSearch ? (
      listSearch.length > 0 ? (
        <Menu>
          {listSearch.map((item) => {
            return (
              <MyLink href={`/app/${item.value}`} key={item.value}>
                <Menu.Item>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
                    {item.icon ? (
                      <Image src={item.icon} alt="icon" width={30} height={30} className={styles.image} />
                    ) : (
                      <Image
                        src="/image/no-image.webp"
                        width={30}
                        height={30}
                        alt="No icon app"
                        className={`${styles.image} ${styles.noImage}`}
                      />
                    )}
                    {item.text}
                  </div>
                </Menu.Item>
              </MyLink>
            );
          })}
        </Menu>
      ) : (
        <Menu>
          <Menu.Item>
            <i style={{ padding: '10px' }}>No Result</i>
          </Menu.Item>
        </Menu>
      )
    ) : (
      <></>
    );
  }, [listSearch]);

  const debouncedHandleInputChange = debounce(async (value) => {
    try {
      setLoadingSearch(true);
      const result = await SearchDataApiService.searchData(value, 1, 12);
      setLoadingSearch(false);
      if (result && result.code === 0) {
        setListSearch(
          result.data.apps.map((item) => {
            return {
              value: item.app_id,
              text: item.detail.name,
              icon: item.detail.app_icon,
            };
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, 500);

  const onSearchApps = async (current) => {
    debouncedHandleInputChange(current.target.value);
  };

  const renderBgColor = (app) => {
    if (app.delete || app.unlisted) {
      return '#ffcccc';
    }
    return '';
  };

  const watchAppChange = async (id) => {
    await WatchAppChangeApiService.watchAppChange(id);
  };

  const popupMyApp = (
    <div className={styles.scrollableMenu}>
      {myApps && myApps.length > 0 ? (
        <Menu className={styles.appsDropdownMyApps}>
          {myApps.map((item) => {
            return (
              <MyLink
                href={`/app/${item.app_id}`}
                key={item.app_id}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(`/app/${item.app_id}`, '_blank');
                  watchAppChange(item.app_id);
                }}
              >
                <Menu.Item style={{ backgroundColor: renderBgColor(item.detail) }}>
                  <Image
                    style={{ margin: '2px 5px 5px 0', borderRadius: '4px' }}
                    src={item.detail.app_icon}
                    alt=""
                    width={30}
                    height={30}
                  />
                  {item.detail.name}
                  {item.detail.built_for_shopify === true && (
                    <>
                      <Tooltip title={item.detail && item.detail.rank_bfs > 0 ? item.detail.rank_bfs : ''}>
                        <Image
                          src="/image/diamond.svg"
                          alt="diamond"
                          width={20}
                          height={20}
                          className={styles.diamondIcon}
                        />
                      </Tooltip>
                    </>
                  )}
                  {Object.keys(item.changed).length > 0 && item.changed.review_count && !item.watched_changes && (
                    <span className={styles.reviewChange}>
                      {getReviewChanges(item.changed.review_count.after, item.changed.review_count.before)}
                    </span>
                  )}
                  {getNotification(item)}
                </Menu.Item>
              </MyLink>
            );
          })}
        </Menu>
      ) : (
        <Menu className={styles.appsDropdown}>
          <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            imageStyle={{
              height: 60,
            }}
            description={
              <span style={{ fontSize: '15px' }}>
                <MyLink href="/explore">Search</MyLink> for applications that interest you
              </span>
            }
          />
        </Menu>
      )}
    </div>
  );

  const handleInsightsDropdownVisibleChange = (visible) => {
    if (!isDropdownControlledByTour) {
      setIsDropdownVisibleInsights(visible);
    }
  };

  const handleUserDropdownVisibleChange = (visible) => {
    if (!isDropdownControlledByTour1) {
      setIsDropdownVisible(visible);
    }
  };

  const isActive = (currentKey, paths) => {
    return paths.includes(currentKey);
  };

  return (
    <>
      <Header className={styles.sasiLayoutBackground}>
        <div className={`${styles.headerSasi} container`}>
          <div className={styles.menuSasi}>
            <div className={styles.menuContent}>
              <div className={styles.logoSasi}>
                <Menu className={styles.menuLogo}>
                  <Menu.Item key="homepage" onClick={onClickHomepage} className={styles.logItem}>
                    <MyLink href={'/'}>
                      <Image
                        src="/image/logo_update.webp"
                        className={styles.imgResponsive}
                        alt="Logo"
                        width={75}
                        height={45}
                        fetchPriority="high"
                        priority={true}
                        loading="eager"
                      />
                    </MyLink>
                  </Menu.Item>
                </Menu>
              </div>
              <div className={styles.menuRight}>
                <div className={styles.listMenu}>
                  <Menu
                    mode="horizontal"
                    defaultSelectedKeys={['4']}
                    selectedKeys={[selectedKeys]}
                    className={styles.horizontalMenu}
                  >
                    <Menu.Item key="apps" className={styles.menuItemDetail}>
                      <Dropdown placement="bottom" overlay={popupSubmenu} arrow>
                        <MyLink
                          href="/dashboard"
                          className={`${styles.menuLink} ${
                            isActive(currentKey, [
                              '/dashboard',
                              '/categories',
                              '/collections',
                              '/top-new-apps',
                              '/delisted-deleted',
                              '/integrations',
                              '/dashboard/top-apps',
                              '/top-reviewed',
                              '/growth-apps',
                              '/growth_review',
                              '/growth_rate',
                              '/installation_growth_rate',
                            ])
                              ? styles.active
                              : ''
                          }`}
                          onClick={() => handleClickMenuItem('/dashboard')}
                          id="step1"
                        >
                          <span style={{ textAlign: 'center' }}>
                            Apps <CaretDownOutlined style={{ marginLeft: '5px' }} />
                          </span>
                        </MyLink>
                      </Dropdown>
                    </Menu.Item>
                    <Menu.Item key="compare-apps" className={styles.menuItemDetail}>
                      <MyLink
                        href="/#compare"
                        className={`${styles.menuLink} ${currentKey === '/#compare' ? styles.active : ''}`}
                        onClick={() => handleClickMenuItem('/#compare')}
                      >
                        Compare Apps
                      </MyLink>
                    </Menu.Item>
                    <Menu.Item key="insights" className={styles.menuItemDetail}>
                      <Dropdown
                        placement="bottom"
                        overlay={insightSubmenu}
                        arrow
                        visible={isDropdownVisibleInsights}
                        onVisibleChange={handleInsightsDropdownVisibleChange}
                      >
                        <span
                          className={`${styles.menuLink} ${
                            isActive(currentKey, ['/developers', '/dashboard/reviews']) ? styles.active : ''
                          }`}
                        >
                          Insights
                          <CaretDownOutlined style={{ marginLeft: '5px' }} />
                        </span>
                      </Dropdown>
                    </Menu.Item>
                    <Menu.Item key="resources" className={styles.menuItemDetail}>
                      <Dropdown placement="bottom" overlay={resourceSubmenu} arrow>
                        <span className={`${styles.menuLink} ${currentKey === '/blogs' ? styles.active : ''}`}>
                          Resources
                          <CaretDownOutlined style={{ marginLeft: '5px' }} />
                        </span>
                      </Dropdown>
                    </Menu.Item>
                    <Menu.Item key="watching-apps" className={styles.menuItemDetail}>
                      <MyLink
                        href="/watching-apps"
                        className={`${styles.menuLink} ${currentKey === '/watching-apps' ? styles.active : ''}`}
                        onClick={() => handleClickMenuItem('/watching-apps')}
                      >
                        Watching
                      </MyLink>
                    </Menu.Item>
                    {isAuthenticated && accessStore === true && (
                      <Menu.Item key="explore-store" className={styles.menuItemDetail}>
                        <MyLink
                          href="/explore-store"
                          className={`${styles.menuLink} ${currentKey === '/explore-store' ? styles.active : ''}`}
                          onClick={() => handleClickMenuItem('/explore-store')}
                        >
                          Explore Store
                        </MyLink>
                      </Menu.Item>
                    )}
                    {isAuthenticated && (
                      <Menu.Item key="my-apps" className={styles.menuItemDetail}>
                        <Dropdown placement="bottom" overlay={popupMyApp} arrow>
                          <span className={styles.menuLink} id="step6">
                            My Apps
                          </span>
                        </Dropdown>
                      </Menu.Item>
                    )}

                    <Menu.Item key="search" onClick={handleMenuItemClick} className={styles.menuItemSearch}>
                      {isShowSearch ? (
                        <Dropdown overlay={listAppsSearch} trigger={['click']} placement="bottom" au>
                          <Input
                            placeholder="Application name"
                            className={styles.searchData}
                            onChange={onSearchApps}
                            onClick={(e) => e.stopPropagation()}
                            suffix={loadingSearch ? <LoadingOutlined /> : <></>}
                            onPressEnter={(e) => handleSeeAllResults(e.target.value)}
                          />
                        </Dropdown>
                      ) : (
                        <>
                          <SearchOutlined
                            className={styles.searchIcon}
                            onClick={(e) => {
                              setIsShowSearch(true);
                              e.stopPropagation();
                            }}
                          />
                          <div
                            className={styles.searchText}
                            onClick={(e) => {
                              setIsShowSearch(true);
                              e.stopPropagation();
                            }}
                          >
                            Search
                          </div>
                        </>
                      )}
                      {isShowSearch && (
                        <CloseOutlined className={styles.closeIcon} onClick={() => setIsShowSearch(false)} />
                      )}
                    </Menu.Item>
                  </Menu>
                </div>
              </div>
            </div>
            {isShowProfile ? (
              <div className={`${styles.headerProfile} flex items-center`}>
                <Popover
                  className={styles.notificationAccount}
                  content={renderNotificationList}
                  title="Notification"
                  trigger="click"
                  placement="bottomRight"
                  onClick={markAllAsRead}
                >
                  <Badge count={unreadCount > 0 ? unreadCount : ''} showZero>
                    <BellOutlined className={styles.bellIcon} />
                  </Badge>
                </Popover>

                <Dropdown overlay={menu} visible={isDropdownVisible} onVisibleChange={handleUserDropdownVisibleChange}>
                  <Tooltip title={userName ? userName : ''} className="flex items-center" placement="right">
                    <Avatar className={styles.avatarProfileHeader} style={{ backgroundColor: '#FFC225' }}>
                      {userName ? userName.substring(0, 1).toLocaleUpperCase() : 'K'}
                    </Avatar>
                    <MoreOutlined />
                  </Tooltip>
                </Dropdown>
              </div>
            ) : (
              <div className={styles.registerLogin}>
                <div className={styles.buttonRegister}>
                  <MyLink className={styles.buttonRegisterStyled} href={`${LayoutPaths.Auth}${Paths.Register}`}>
                    Get Started
                  </MyLink>
                </div>
                <div className={styles.buttonLogin}>
                  <MyLink className={styles.buttonLoginStyled} href={`${LayoutPaths.Auth}${Paths.LoginApp}`}>
                    Login
                  </MyLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </Header>

      {showOnboard && (
        <TourGuide
          setIsDropdownVisible={setIsDropdownVisible}
          setIsDropdownVisibleInsights={setIsDropdownVisibleInsights}
          setIsDropdownControlledByTour={setIsDropdownControlledByTour}
          setIsDropdownControlledByTour1={setIsDropdownControlledByTour1}
          handleSuccess={() => setShowOnboard(false)}
        />
      )}
    </>
  );
};

export default HeaderComponent;
