'use client';

import { Breadcrumb, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import './LayoutDetailApp.scss';
import { useParams, usePathname, useRouter } from 'next/navigation';
import InfoApp from './info-app/InfoApp';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';

export default function LayoutDetailApp({ children, initialDataAppInfo }) {
  const [activeTab, setActiveTab] = useState('app-info');
  const pathname = usePathname();
  const router = useRouter();
  const { app_id: id } = useParams();
  const infoApp = initialDataAppInfo?.appDetail;

  const nameApps = infoApp?.data ? infoApp.data.detail.name : '';
  const countReviews = infoApp?.data ? infoApp.data.detail.review_count : 0;

  const items = [
    {
      key: 'app-info',
      label: 'App Info',
      path: `/app/${id}`,
    },
    {
      key: 'pricing',
      label: 'Pricing',
      path: `/app/${id}/pricing`,
    },
    {
      key: 'reviews',
      label: `Reviews (${countReviews})`,
      path: `/app/${id}/reviews`,
    },
  ];

  useEffect(() => {
    const matchingItem = items.find((item) => pathname.includes(item.key));
    if (matchingItem) {
      setActiveTab(matchingItem.key);
    }
  }, [pathname]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    const selectedTab = items.find((item) => item.key === key);
    if (selectedTab) {
      router.push(selectedTab.path);
    }
  };

  return (
    <div className="container-detail-app">
      <div className="breadcrumb-header">
        <div className="container">
          <Breadcrumb
            items={[
              {
                href: '/',
                title: <HomeOutlined />,
              },
              {
                title: <span>App</span>,
              },
              {
                title: <span>{nameApps}</span>,
              },
            ]}
            separator={<RightOutlined />}
          />
        </div>
      </div>
      <div className="content-app">
        <div className="info-app container">
          <InfoApp infoApp={infoApp} id={id} />
        </div>
        <div className="tabs-app container">
          <Tabs
            activeKey={activeTab}
            defaultActiveKey="app-info"
            onChange={handleTabChange}
            items={items.map((item) => ({
              key: item.key,
              label: item.label,
            }))}
          />
          <div className="tab-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
