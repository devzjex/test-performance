'use client';

import DashboardApiService from '@/api-services/api/DashboardApiService';
import { encodeQueryParams, getParameterQuery } from '@/utils/functions';
import { Breadcrumb, Pagination, Select, Spin, Table, Tag, message } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import styles from './ListAppByDay.module.scss';
import {
  DownOutlined,
  HomeOutlined,
  LinkOutlined,
  LoadingOutlined,
  RightOutlined,
  SketchOutlined,
  StarFilled,
  UpOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import MyLink from '../ui/link/MyLink';

const { Option } = Select;

export default function ListAppByDay({ initialData }) {
  const params = getParameterQuery();
  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const view_type = searchParams.get('type');
  const sortBy = searchParams.get('sort_by');
  const [sort_by, setSort_by] = useState(sortBy);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [listApp, setListApp] = useState(initialData.listApp);
  const pathname = usePathname();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const [total, setTotal] = useState(initialData.total);
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);

  const handleChangeSortBy = (value) => {
    setSort_by(value);
    const newQueryParams = {
      ...params,
      page: 1,
    };
    router.push(`${pathname}?${encodeQueryParams(newQueryParams)}`);
    asyncFetch(value, date, page, perPage);
  };

  const asyncFetch = async (type, date, page, per_page) => {
    setLoading(true);
    const result =
      view_type == 'bfs'
        ? await DashboardApiService.getBFSByDate(date, type, page, per_page)
        : await DashboardApiService.getAppsByDate(type, date, page, per_page);
    setLoading(false);
    if (result && result.code == 0) {
      setListApp(result.result);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
      return;
    }
    message.error(result.message);
  };

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page,
      per_page,
    };
    router.push(`${pathname}?${encodeQueryParams(newParams)}`);
    asyncFetch(sort_by, date, page, perPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const arrFilter = useMemo(() => {
    if (view_type == 'bfs') {
      return [
        { value: 'active', label: 'Built For Shopify' },
        { value: 'inactive', label: 'Removed' },
      ];
    }
    return [
      { value: 'newest', label: 'Newest' },
      { value: 'delete', label: 'Deleted' },
      { value: 'unlisted', label: 'Delisted' },
    ];
  }, [view_type]);

  const isAppInfo = (record, param) => {
    return record?.detail?.[param] ? record.detail[param] : record?.app_info?.detail?.[param];
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank, record, index) => (
        <div className="rank">
          <span>{perPage * (currentPage - 1) + index + 1}</span>
        </div>
      ),
      width: 20,
    },
    {
      title: 'App',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => {
        const nameA = isAppInfo(a, 'name')?.toLowerCase() || '';
        const nameB = isAppInfo(b, 'name')?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      },
      showSorterTooltip: false,
      render: (name, record) => {
        return (
          <div className="content-app">
            <div className="image">
              <Image
                src={isAppInfo(record, 'app_icon')}
                width={75}
                height={75}
                alt={name}
                onClick={() => router.push(`/app/${isAppInfo(record, 'app_id')}`)}
              />
            </div>
            <div className="item-detail-app">
              <div className="name-app-shopify">
                {isAppInfo(record, 'before_rank') &&
                  isAppInfo(record, 'rank') &&
                  isAppInfo(record, 'before_rank') - isAppInfo(record, 'rank') > 0 && (
                    <span className="calular-incre">
                      <UpOutlined /> {isAppInfo(record, 'before_rank') - isAppInfo(record, 'rank')}{' '}
                    </span>
                  )}
                {isAppInfo(record, 'before_rank') &&
                  isAppInfo(record, 'rank') &&
                  isAppInfo(record, 'before_rank') - isAppInfo(record, 'rank') < 0 && (
                    <span className="calular-decre">
                      <DownOutlined /> {isAppInfo(record, 'rank') - isAppInfo(record, 'before_rank')}{' '}
                    </span>
                  )}
                <MyLink href={`/app/${isAppInfo(record, 'app_id')}`} className="link-name">
                  {isAppInfo(record, 'name')}
                </MyLink>
                {isAppInfo(record, 'built_for_shopify') && (
                  <Tag className="built-for-shopify" icon={<SketchOutlined />} color="#108ee9">
                    Built for Shopify
                  </Tag>
                )}
                <div className="tagline">
                  {isAppInfo(record, 'tagline') ? isAppInfo(record, 'tagline') : isAppInfo(record, 'metatitle')}
                </div>
                <div className="link-app-shopify">
                  <MyLink
                    target="_blank"
                    href={
                      'https://apps.shopify.com/' +
                      isAppInfo(record, 'app_id') +
                      `?utm_source=letsmetrix.com&utm_medium=app_listing&utm_content=${isAppInfo(record, 'name')}`
                    }
                    className="link"
                    rel="noopener nofollow noreferrer"
                  >
                    <LinkOutlined />
                  </MyLink>
                </div>
              </div>
            </div>
          </div>
        );
      },
      width: 350,
    },
    {
      title: 'Highlights',
      dataIndex: 'highlights',
      key: 'highlights',
      render: (text, record) => {
        const highlightDetail = record.detail || record.app_info?.detail;
        return (
          <ul>
            {highlightDetail?.highlights?.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
      },
      width: 200,
    },
    {
      title: 'Rating',
      dataIndex: 'star',
      key: 'star',
      sorter: (a, b) => {
        const starA = isAppInfo(a, 'star') || 0;
        const starB = isAppInfo(b, 'star') || 0;
        const normalizedStarA = starA > 5 ? starA / 10 : starA;
        const normalizedStarB = starB > 5 ? starB / 10 : starB;
        return normalizedStarA - normalizedStarB;
      },
      showSorterTooltip: false,
      render: (star, record) => {
        const starValue = isAppInfo(record, 'star') || 0;
        return (
          <div className="icon-star">
            <StarFilled /> {starValue > 5 ? starValue / 10 : starValue}
          </div>
        );
      },
      width: 20,
    },
    {
      title: 'Reviews',
      dataIndex: 'review_count',
      key: 'review_count',
      sorter: (a, b) => {
        const reviewCountA = isAppInfo(a, 'review_count') || 0;
        const reviewCountB = isAppInfo(b, 'review_count') || 0;
        return reviewCountA - reviewCountB;
      },
      showSorterTooltip: false,
      render: (review_count, record) =>
        isAppInfo(record, 'review_count') > 0 ? isAppInfo(record, 'review_count') : isAppInfo(record, 'review') || null,
      width: 100,
    },
  ];

  return (
    <div className={styles.detailCategories}>
      <div className="breadcrumb-header">
        <div className="container">
          <Breadcrumb
            items={[
              {
                href: '/',
                title: <HomeOutlined />,
              },
              {
                href: '/dashboard',
                title: <span>Apps Dashboard</span>,
              },
              {
                title: <span>{view_type === 'bfs' ? 'Built For Shopify' : 'List Apps'}</span>,
              },
            ]}
            separator={<RightOutlined />}
          />
        </div>
      </div>
      <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
        <div className={`${styles.detailCategoriesBody} container`}>
          <div className={styles.containerTitleBody}>
            <div className="wrapper-title">
              <h1 className={styles.title}>{date}</h1>
              <div className={styles.titleApps}>{total} apps</div>
            </div>
            <div className={styles.sort}>
              Type:
              <Select value={sort_by} onChange={handleChangeSortBy} className="type-select">
                {arrFilter.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="detail-category">
            <Table
              rowKey={(record) => record.app_id}
              columns={columns}
              dataSource={listApp}
              pagination={false}
              bordered
              scroll={{ x: 'max-content' }}
            />
          </div>

          {listApp && listApp.length > 0 && (
            <div className={styles.pagination}>
              <Pagination
                pageSize={numberPage}
                current={currentPage}
                onChange={(page, pageSize) => {
                  setCurrentPage(page);
                  setNumberPage(pageSize);
                  onChangePage(page, pageSize);
                }}
                total={total}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} apps`}
              />
            </div>
          )}
        </div>
      </Spin>
    </div>
  );
}
