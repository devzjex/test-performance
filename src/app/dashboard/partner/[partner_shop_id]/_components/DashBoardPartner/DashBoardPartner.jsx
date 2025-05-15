'use client';

import { HomeOutlined, LoadingOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, DatePicker, message, Spin } from 'antd';
import React, { useState } from 'react';
import './DashBoardPartner.scss';
import MyPartnerApiService from '@/api-services/api/MyPartnerApiService';
import dayjs from 'dayjs';
import EventCountByDate from '../EventCountByDate/EventCountByDate';
import EventAmountByDate from '../EventAmountByDate/EventAmountByDate';
import EventCountTotals from '../EventCountTotals/EventCountTotals';
import EarningAmountByDate from '../EarningAmountByDate/EarningAmountByDate';
import MerchantByDate from '../MerchantByDate/MerchantByDate';
import ReviewCountPie from '../ReviewCount/ReviewCount';

const { RangePicker } = DatePicker;

export default function DashBoardPartner({ partnerId, partnerName, initialDataPartner }) {
  const [dataPartner, setDataPartner] = useState(initialDataPartner.dataPartner);
  const [loading, setLoading] = useState(false);
  const dateFormat = 'YYYY-MM-DD';
  const [fromDate, setFromDate] = useState(dayjs().subtract(30, 'd').format(dateFormat));
  const [toDate, setToDate] = useState(dayjs().format(dateFormat));

  const fetchDashboardPartner = async (partnerID, fromDate, toDate) => {
    setLoading(true);
    try {
      const response = await MyPartnerApiService.getAppDetailPartnerId(partnerID, fromDate, toDate);
      if (response && response.code === 0) {
        setDataPartner(response.data || []);
      }
    } catch (error) {
      message.error('Error fetching dashboard partner:', error);
    } finally {
      setLoading(false);
    }
  };

  const onChangeDateRange = (dates, dateStrings) => {
    if (dates) {
      setFromDate(dates[0].format(dateFormat));
      setToDate(dates[1].format(dateFormat));
    }
  };

  const disabledFutureDate = (current) => {
    return current && current > dayjs().startOf('day');
  };

  const searchByDate = () => {
    fetchDashboardPartner(partnerId, fromDate, toDate);
  };

  return (
    <div className="detail-partner-dashboard">
      <div className="breadcrumb-header">
        <div className="container">
          <Breadcrumb
            items={[
              {
                href: '/',
                title: <HomeOutlined />,
              },
              {
                href: '/my-partner',
                title: <span>My Partner</span>,
              },
              {
                title: <span>Dashboard Partner {partnerName}</span>,
              },
            ]}
            separator={<RightOutlined />}
          />
        </div>
      </div>
      <div className="dashboard-container container">
        <h1>Dashboard Partner {partnerName}</h1>
        <div className="dashboard-range">
          <RangePicker
            defaultValue={[dayjs(fromDate, dateFormat), dayjs(toDate, dateFormat)]}
            allowClear={false}
            onChange={onChangeDateRange}
            disabledDate={disabledFutureDate}
            format={dateFormat}
          />
          <Button type="primary" icon={<SearchOutlined />} style={{ marginLeft: '10px' }} onClick={searchByDate}>
            Search
          </Button>
        </div>
        <div className="chart-section">
          <h3>Event Counts by Date</h3>
          {loading ? (
            <div className="loading-section" style={{ textAlign: 'center', marginTop: '20px' }}>
              <Spin indicator={<LoadingOutlined spin />} />
            </div>
          ) : (
            <EventCountByDate dataPartner={dataPartner} />
          )}
        </div>

        <div className="chart-section">
          <h3>Event Amount By Date</h3>
          {loading ? (
            <div className="loading-section" style={{ textAlign: 'center', marginTop: '20px' }}>
              <Spin indicator={<LoadingOutlined spin />} />
            </div>
          ) : (
            <EventAmountByDate dataPartner={dataPartner} />
          )}
        </div>

        <div className="chart-section">
          <h3>Event Count Totals</h3>
          {loading ? (
            <div className="loading-section" style={{ textAlign: 'center', marginTop: '20px' }}>
              <Spin indicator={<LoadingOutlined spin />} />
            </div>
          ) : (
            <EventCountTotals dataPartner={dataPartner} />
          )}
        </div>

        <div className="chart-section">
          <h3>Review Count</h3>
          {loading ? (
            <div className="loading-section" style={{ textAlign: 'center', marginTop: '20px' }}>
              <Spin indicator={<LoadingOutlined spin />} />
            </div>
          ) : (
            <ReviewCountPie dataPartner={dataPartner} />
          )}
        </div>

        <div className="chart-section">
          <h3>Earning Amount By Date</h3>
          {loading ? (
            <div className="loading-section" style={{ textAlign: 'center', marginTop: '20px' }}>
              <Spin indicator={<LoadingOutlined spin />} />
            </div>
          ) : (
            <EarningAmountByDate dataPartner={dataPartner} />
          )}
        </div>

        <div className="chart-section">
          <h3>Merchant By Date</h3>
          {loading ? (
            <div className="loading-section" style={{ textAlign: 'center', marginTop: '20px' }}>
              <Spin indicator={<LoadingOutlined spin />} />
            </div>
          ) : (
            <MerchantByDate dataPartner={dataPartner} />
          )}
        </div>
      </div>
    </div>
  );
}
