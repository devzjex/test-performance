'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Select, Pagination, Tag, message } from 'antd';
import MyPartnerApiService from '@/api-services/api/MyPartnerApiService';
import './MyPartner.scss';
import Image from 'next/image';
import {
  ArrowRightOutlined,
  LinkOutlined,
  PlusCircleOutlined,
  SketchOutlined,
  StarFilled,
  SyncOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Auth from '@/utils/store/Authentication';
import Button from '@/components/ui/button/Button';
import MyLink from '@/components/ui/link/MyLink';

const ModalAddPartner = dynamic(() => import('@/components/modal-add-partner/ModalAddPartner'), {
  ssr: false,
});

const ModalSyncPartner = dynamic(() => import('@/components/modal-sync-partner/ModalSyncPartner'), {
  ssr: false,
});

const { Option } = Select;

export default function MyPartner({ initialData }) {
  const [data, setData] = useState(initialData.data);
  const [dataAppInPartner, setDataAppInPartner] = useState([]);
  const [filteredApps, setFilteredApps] = useState(initialData.filteredApps);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [partnerDetails, setPartnerDetails] = useState(null);
  const [total, setTotal] = useState(initialData.total);
  const [currentPage, setCurrentPage] = useState(1);
  const numberPage = 10;
  const router = useRouter();
  const [isActiveBFS, setIsActiveBFS] = useState(false);
  const [isBFS, setIsBFS] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const CMS_URL = process.env.NEXT_PUBLIC_REACT_APP_CMS_URL ?? 'https://cms.letsmetrix.com';
  const accessToken = Auth.getAccessToken();
  const [modalShowSyncPartner, setModalShowSyncPartner] = useState(false);

  const showModal = () => {
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
  };

  const fetchDataMyPartner = async () => {
    try {
      const response = await MyPartnerApiService.getMyPartners();
      if (response && response.code === 0) {
        setData(response.data || []);
        setFilteredApps(response.data.flatMap((partner) => partner.apps));
        setTotal(response.data.flatMap((partner) => partner.apps).length);
      }
    } catch (error) {
      message.error('Failed to fetch data my partner:', error);
    }
  };

  const handleIsBFS = () => {
    const newBFS = !isBFS;
    setIsBFS(newBFS);
    setIsActiveBFS(!isActiveBFS);
  };

  // Lọc ứng dụng dựa trên selectedPartner và isBFS
  const filterApps = () => {
    let filtered = data;

    if (selectedPartner) {
      const selectedPartnerData = data.find((partner) => partner.partner_shop_name === selectedPartner);
      filtered = selectedPartnerData ? [selectedPartnerData] : [];
    }

    const apps = filtered.flatMap((partner) => partner.apps);

    if (isBFS) {
      return apps.filter((app) => app.built_for_shopify);
    }

    return apps;
  };

  // Cập nhật filteredApps và total khi selectedPartner hoặc isBFS thay đổi
  useEffect(() => {
    const filtered = filterApps();
    setFilteredApps(filtered);
    setTotal(filtered.length);
  }, [selectedPartner, isBFS, data]);

  const handleFilterChange = (value) => {
    setSelectedPartner(value);
    if (value) {
      const selectedPartnerData = data.find((partner) => partner.partner_shop_name === value);
      setPartnerDetails(selectedPartnerData);
    } else {
      setPartnerDetails(null);
    }
  };

  const onChangePage = (page) => {
    setCurrentPage(page);
  };

  const openAppDetail = (id) => () => {
    router.push(`/app/${id}`);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      render: (text, record, index) => (
        <div className="rank">
          <span>{numberPage * (currentPage - 1) + index + 1}</span>
        </div>
      ),
    },
    {
      title: 'App',
      dataIndex: 'app_name',
      key: 'app_name',
      sorter: (a, b) => a.app_name.localeCompare(b.app_name),
      showSorterTooltip: false,
      render: (text, record) => (
        <div className="content-app">
          <div className="image">
            <Image onClick={openAppDetail(record.app_id)} src={record.app_icon} width={75} height={75} alt="" />
          </div>
          <div className="item-detail-app">
            <div className="name-app-shopify">
              <MyLink href={'/app/' + record.app_id} className="link-name">
                {record.app_name}
              </MyLink>
              {record.built_for_shopify && (
                <Tag className="built-for-shopify" icon={<SketchOutlined />} color="#108ee9">
                  Built for shopify
                </Tag>
              )}
            </div>
            <div className="tagline">
              <ul>
                <li>{record.pricing}</li>
              </ul>
            </div>
            <div className="link-app-shopify">
              <MyLink
                target="_blank"
                href={
                  'https://apps.shopify.com/' +
                  record.app_id +
                  `?utm_source=letsmetrix.com&utm_medium=app_listing&utm_content=${record.app_name}`
                }
                className="link"
                rel="noopener nofollow noreferrer"
              >
                <LinkOutlined />
              </MyLink>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'star',
      key: 'star',
      sorter: (a, b) => a.star - b.star,
      render: (star, record) => (
        <div className="icon-star">
          <StarFilled /> {record.star > 5 ? record.star / 10 : record.star}
        </div>
      ),
      showSorterTooltip: false,
    },
    {
      title: 'Reviews',
      dataIndex: 'review_count',
      key: 'review_count',
      sorter: (a, b) => a.review_count - b.review_count,
      showSorterTooltip: false,
      render: (review_count, record) => <>{record.review_count > 0 ? record.review_count : null}</>,
    },
  ];

  const formattedData = useMemo(() => {
    return filteredApps.slice((currentPage - 1) * numberPage, currentPage * numberPage).map((app) => ({
      key: app.app_id,
      ...app,
    }));
  }, [filteredApps, currentPage, numberPage]);

  const fetchListAppInPartners = async () => {
    try {
      const response = await MyPartnerApiService.getListAppInPartnerts(partnerDetails.partner_shop_id);
      setDataAppInPartner(response.data || []);
    } catch (error) {
      message.error('Failed to fetch data my partner:', error);
    }
  };

  const mapAppInPartner = dataAppInPartner.map((app) => {
    return {
      appId: app?.app_id,
      name: app.detail.name,
      appIcon: app.detail.app_icon,
    };
  });

  const mapFilteredApps = filteredApps.map((app) => {
    return {
      appId: app?.app_id,
      name: app?.app_name,
      appIcon: app?.app_icon,
    };
  });

  const getUniqueAppsInPartner = mapAppInPartner.filter(
    (app) => !mapFilteredApps.some((filteredApp) => filteredApp.appId === app.appId),
  );

  return (
    <>
      <div className="detail-my-partner container">
        {data && data.length > 0 ? (
          <div className="detail-my-partner-body">
            <div className="header-partner">
              <div className="container-title-body">
                <div className="wrapper-title">
                  <h1 className="title">
                    {selectedPartner && partnerDetails ? (
                      <MyLink
                        prefix="false"
                        href={`/dashboard/partner/${
                          partnerDetails ? partnerDetails.partner_shop_id : ''
                        }?partner=${selectedPartner}`}
                        rel="nofollow noopener noreferrer"
                      >
                        Partner {''}
                        {selectedPartner}
                      </MyLink>
                    ) : (
                      'All Partners'
                    )}
                  </h1>
                  <div className="title-apps">{total} apps</div>
                </div>
              </div>
              <div className="container-filter-range">
                <div className="filter-apps">
                  <div className={`btn-bfs ${isActiveBFS ? 'activeBFS' : ''}`} onClick={handleIsBFS}>
                    <Image src="/image/diamond.svg" alt="diamond" width={15} height={15} />
                    <span>Built For Shopify</span>
                  </div>
                  <div className="select-partner">
                    <Select
                      placeholder="Select a Partner"
                      onChange={handleFilterChange}
                      value={selectedPartner}
                      style={{ width: '100%' }}
                      popupMatchSelectWidth={false}
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          <div className="options-btn" onClick={() => setModalShowSyncPartner(true)}>
                            <Button
                              title={'Add Partner'}
                              type="link"
                              icon={<PlusCircleOutlined />}
                              className="btn-create_new_partner"
                            />
                          </div>
                        </>
                      )}
                    >
                      <Option value="">All Partners</Option>
                      {data.map((partner) => (
                        <Option key={partner.partner_shop_name} value={partner.partner_shop_name}>
                          {partner.partner_shop_name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  {selectedPartner && (
                    <div className="btn-add-app" onClick={showModal}>
                      <PlusCircleOutlined />
                      <span className="text-btn-add">Add App to partner</span>
                    </div>
                  )}
                  <MyLink
                    href={`${CMS_URL}/login?accessToken=` + accessToken}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="backlink-cms"
                  >
                    <div className="btn-backlink-cms">
                      <span>User Management {''}</span>
                      <ArrowRightOutlined />
                    </div>
                  </MyLink>
                </div>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={formattedData}
              loading={false}
              rowKey="key"
              rowClassName="item-detail"
              bordered
              pagination={false}
              scroll={{ x: 'max-content' }}
            />

            {total && total > 10 ? (
              <div className="pagination">
                <Pagination
                  pageSize={numberPage}
                  current={currentPage}
                  onChange={onChangePage}
                  total={total}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} apps`}
                />
              </div>
            ) : (
              ''
            )}
          </div>
        ) : (
          <div className="sync-partner-container">
            <div className="content-sync">
              <Image src={'/image/image-sync-partner-data.png'} width={200} height={200} alt="logo-sync-parter" />
              <div className="description-sync">
                <span>Click this button to sync partner data with the system!</span>
              </div>
              <Button
                title={'Sync Partner Data'}
                size={'large'}
                icon={<SyncOutlined />}
                onClick={() => setModalShowSyncPartner(true)}
              />
            </div>
          </div>
        )}
      </div>
      {modalShow && (
        <ModalAddPartner
          partnerId={partnerDetails.partner_api_id}
          disableModal={handleCloseModal}
          fetchDataMyPartner={fetchDataMyPartner}
          fetchListAppInPartners={fetchListAppInPartners}
          getUniqueAppsInPartner={getUniqueAppsInPartner}
        />
      )}
      {modalShowSyncPartner && (
        <ModalSyncPartner disableModal={() => setModalShowSyncPartner(false)} fetchDataMyPartner={fetchDataMyPartner} />
      )}
    </>
  );
}
