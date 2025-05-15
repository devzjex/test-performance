'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, List, Empty, Spin, message, Divider, Select, Tooltip, TreeSelect, Avatar } from 'antd';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import './ExploreStore.scss';
import StoreApiService from '@/api-services/api/StoreApiService';
import InfiniteScroll from 'react-infinite-scroll-component';
import Image from 'next/image';
import { debounce } from 'lodash';
import storeLessData from '@/utils/data/storeLessData.json';
import MyLink from '@/components/ui/link/MyLink';

const { Option } = Select;

const convertToTree = (data) => {
  const map = {};
  const tree = [];

  const processNode = (item, parentPath = '') => {
    const pathParts = item._id.split('/').filter(Boolean);
    const node = {
      title: pathParts[pathParts.length - 1],
      value: item._id,
      children: [],
    };
    map[item._id] = node;

    if (!parentPath) {
      tree.push(node);
    } else {
      if (map[parentPath]) {
        map[parentPath].children.push(node);
      }
    }

    if (item.children) {
      item.children.forEach((child) => processNode(child, item._id));
    }
  };

  data.forEach((item) => processNode(item));
  return tree;
};

export default function ExploreStore({ initialAllAppStore }) {
  const [storeSearch, setStoreSearch] = useState('');
  const [listStore, setListStore] = useState(initialAllAppStore.listStore);
  const [loadingStore, setLoadingStore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const storeAllApp = initialAllAppStore.storeAllApp;
  const [selectedApp, setSelectedApp] = useState('all');
  const keywordSearch = storeSearch.trim() || '';
  const [treeData, setTreeData] = useState([{ title: 'All Category', value: '', children: [] }]);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValueSource, setSelectedValueSource] = useState('letsmetrix');
  const isLetsmetrix = selectedValueSource === 'letsmetrix';

  useEffect(() => {
    if (storeLessData && convertToTree(storeLessData).length > 0) {
      setTreeData([{ title: 'All Category', value: '', children: [] }, ...convertToTree(storeLessData)]);
      setSelectedValue('');
    }
  }, []);

  const searchStoreList = useCallback(
    async (keyword = '', currentPage = 1, appId = 'all', category = '', source = '') => {
      try {
        setLoadingStore(true);
        const appIdToUse = appId === 'all' ? '' : appId;

        const result = await StoreApiService.searchStores(keyword, currentPage, 20, appIdToUse, category, source);

        if (result && result.code === 0) {
          setListStore((prevStores) =>
            currentPage === 1
              ? result.list_store.map((item) => ({
                  ...item,
                  id: item._id,
                  domain: isLetsmetrix ? item.shop_domain : item.platform_domain || item.domain,
                  name: isLetsmetrix ? item.shop_name : item.merchant_name || item.name,
                  apps: item.apps,
                }))
              : [
                  ...prevStores,
                  ...result.list_store.map((item) => ({
                    ...item,
                    id: item._id,
                    domain: isLetsmetrix ? item.shop_domain : item.platform_domain || item.domain,
                    name: isLetsmetrix ? item.shop_name : item.merchant_name || item.name,
                    apps: item.apps,
                  })),
                ],
          );
          setHasMore(currentPage < result.total_page);
        } else {
          setListStore([]);
        }
      } catch (error) {
        message.error('Error fetching stores:', error);
      } finally {
        setLoadingStore(false);
      }
    },
    [],
  );

  const debouncedSearch = useMemo(() => {
    return debounce((keyword) => {
      searchStoreList(keyword, 1, selectedApp, selectedValue, selectedValueSource);
    }, 500);
  }, [searchStoreList, selectedApp, selectedValue, selectedValueSource]);

  const fetchMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    searchStoreList(keywordSearch, nextPage, selectedApp, selectedValue, selectedValueSource);
  };

  return (
    <div className="stores-page">
      <div className="search-filter-store">
        <h1>Search Stores</h1>
        <div className="filter-source">
          <span>Source: </span>
          <Select
            placeholder="Select source"
            onChange={(value) => {
              setSelectedValueSource(value);
              searchStoreList(storeSearch, 1, selectedApp, selectedValue, value);
            }}
            value={selectedValueSource}
            popupMatchSelectWidth={false}
            className="custom-select"
          >
            <Select.Option value="letsmetrix">Letsmetrix</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </div>
      </div>
      <div className="search-select-store">
        <div className="search-store">
          <Input
            placeholder="Enter store name or domain..."
            value={storeSearch}
            onChange={(e) => {
              const value = e.target.value;
              setStoreSearch(value);
              if (value.trim() === '') {
                searchStoreList('', 1, selectedApp, selectedValue, selectedValueSource);
              } else {
                debouncedSearch(value.trim());
              }
            }}
            suffix={<SearchOutlined />}
          />
        </div>
        <div className="select-app">
          <Select
            showSearch
            placeholder="Select an app"
            onChange={(value) => {
              setSelectedApp(value);
              searchStoreList(storeSearch, 1, value, selectedValue, selectedValueSource);
            }}
            value={selectedApp || 'all'}
            popupMatchSelectWidth={false}
          >
            <Option key="all" value="all">
              <div className="option-app">All App</div>
            </Option>
            {storeAllApp.map((app) => (
              <Option key={app.app_id} value={app.app_id}>
                <div className="option-app">
                  <Image
                    src={app.app_icon}
                    alt={app.app_name}
                    width={20}
                    height={20}
                    style={{
                      marginRight: 8,
                      borderRadius: '50%',
                    }}
                    className="app-icon"
                  />
                  <Tooltip title={app.app_name}>
                    <span>{app.app_name}</span>
                  </Tooltip>
                  <Tooltip title={'Built for shopify'}>
                    {app.built_for_shopify ? (
                      <Image src="/image/diamond.svg" alt="diamond" width={15} height={15} className="diamond-icon" />
                    ) : (
                      ''
                    )}
                  </Tooltip>
                </div>
              </Option>
            ))}
          </Select>

          <TreeSelect
            showSearch
            value={selectedValue}
            placeholder="Select a category"
            onChange={(value) => {
              setSelectedValue(value);
              searchStoreList(storeSearch, 1, selectedApp, value, selectedValueSource);
            }}
            treeData={treeData}
            virtual={false}
          />
        </div>
      </div>

      <Spin spinning={loadingStore} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
        <div className="store-results">
          {listStore.length > 0 ? (
            <div className="list-container" id="list-container">
              <InfiniteScroll
                dataLength={listStore.length}
                next={fetchMoreData}
                hasMore={hasMore}
                scrollableTarget="list-container"
              >
                <List
                  dataSource={listStore}
                  renderItem={(store) => (
                    <>
                      <MyLink
                        href={`/explore-store/detail-store/${
                          isLetsmetrix ? store.domain : store.platform_domain
                        }?name-store=${encodeURIComponent(
                          isLetsmetrix ? store.name : store.id,
                        )}&source=${selectedValueSource}`}
                        rel="noopener noreferrer"
                      >
                        <List.Item>
                          <div className="store-item">
                            <div className="information-store">
                              <strong>Name: </strong>
                              <span>{isLetsmetrix ? store.name : store.merchant_name}</span>
                              <strong> - Domain: </strong>
                              <span className="domain">
                                {isLetsmetrix ? store.domain : store.platform_domain || store.id}
                              </span>
                            </div>

                            <div className="app-icons">
                              {store.apps && store.apps.length > 0 ? (
                                <>
                                  {store.apps.slice(0, 4).map((app) => (
                                    <Tooltip
                                      key={isLetsmetrix ? app.app_id : app.id}
                                      title={isLetsmetrix ? app.app_name : app.name}
                                    >
                                      <Avatar
                                        src={isLetsmetrix ? app.app_icon : app.icon_url}
                                        alt={isLetsmetrix ? app.app_name : app.name}
                                        size={30}
                                        className="app-avatar"
                                      />
                                    </Tooltip>
                                  ))}

                                  {store.apps.length > 4 && (
                                    <Tooltip title={`${store.apps.length - 4} more apps`}>
                                      <Avatar size={30} className="more-apps-avatar">
                                        +{store.apps.length - 4}
                                      </Avatar>
                                    </Tooltip>
                                  )}
                                </>
                              ) : (
                                ''
                              )}

                              {store.apps &&
                                store.apps_other &&
                                store.apps.length > 0 &&
                                store.apps_other &&
                                store.apps_other.length > 0 && <div className="separator"></div>}

                              {store.apps_other && store.apps_other.length > 0 ? (
                                <>
                                  {store.apps_other.slice(0, 4).map((app) => (
                                    <Tooltip key={app.id} title={app.name}>
                                      <Avatar src={app.icon_url} alt={app.name} size={30} className="app-avatar" />
                                    </Tooltip>
                                  ))}

                                  {store.apps_other.length > 4 && (
                                    <Tooltip title={`${store.apps_other.length - 4} more apps`}>
                                      <Avatar size={30} className="more-apps-avatar">
                                        +{store.apps_other.length - 4}
                                      </Avatar>
                                    </Tooltip>
                                  )}
                                </>
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                        </List.Item>
                      </MyLink>
                      <Divider style={{ margin: 0 }} />
                    </>
                  )}
                />
              </InfiniteScroll>
            </div>
          ) : (
            <Empty description="No store name or domain found." />
          )}
        </div>
      </Spin>
    </div>
  );
}
