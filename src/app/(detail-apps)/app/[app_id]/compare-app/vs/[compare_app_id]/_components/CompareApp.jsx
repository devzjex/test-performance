'use client';

import { Breadcrumb, Tooltip } from 'antd';
import { useState } from 'react';
import './CompareApp.scss';
import Compare from './compare/Compare';
import AppInfo from './app-info/AppInfo';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import AppRanking from './app-ranking/AppRanking';
import AppPricing from './app-pricing/AppPricing';
import dynamic from 'next/dynamic';

const AppReview = dynamic(() => import('./app-review/AppReview'), {
  ssr: false,
});
const PopularComparisons = dynamic(() => import('./popular-comparisons/PopularComparisons'), {
  ssr: false,
});

export default function CompareApp({ initialDataCompares }) {
  const compareAppData = initialDataCompares.dataCompareApps;
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const MAX_TEXT_LENGTH = 50;
  const renderNameCompetitor = compareAppData[1].app_compare.map((item) => item.app_name).join(' vs ');
  const truncatedRenderNameCompetitor =
    renderNameCompetitor.length > MAX_TEXT_LENGTH
      ? renderNameCompetitor.substring(0, MAX_TEXT_LENGTH) + '...'
      : renderNameCompetitor;

  const renderAppNameWithTooltip = <Tooltip title={renderNameCompetitor}>{truncatedRenderNameCompetitor}</Tooltip>;

  return (
    <>
      <div className="breadcrumb-header">
        <div className="container">
          <Breadcrumb
            items={[
              {
                href: '/',
                title: <HomeOutlined />,
              },
              {
                title: <span>{compareAppData[0].app_host.app_name}</span>,
              },
              {
                title: <span>Compare</span>,
              },
              {
                title: <span>{renderAppNameWithTooltip}</span>,
              },
            ]}
            separator={<RightOutlined />}
          />
        </div>
      </div>
      <div className="container-compare_app container">
        <Tooltip title={renderNameCompetitor} visible={isTooltipVisible}>
          <h1 onMouseEnter={() => setTooltipVisible(true)} onMouseLeave={() => setTooltipVisible(false)}>
            {compareAppData[0]?.app_host?.app_name || '..........'} Compare {truncatedRenderNameCompetitor}
          </h1>
        </Tooltip>

        <Compare compareAppData={compareAppData} />
        <AppInfo compareAppData={compareAppData} />
        <AppRanking compareAppData={compareAppData} initialDataTopKW={initialDataCompares.dataTopKeyword} />
        <AppPricing compareAppData={compareAppData} />
        <AppReview compareAppData={compareAppData} />
        <PopularComparisons compareAppData={compareAppData} />
      </div>
    </>
  );
}
