'use client';

import React, { useState } from 'react';
import { Table, Pagination, Spin, Tag } from 'antd';
import { encodeQueryParams, getParameterQuery, renderSelect } from '@/utils/functions';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';
import { StarFilled, LinkOutlined, UpOutlined, DownOutlined, SketchOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import './MostReviews.scss';
import { optionsSort } from '@/utils/data/filter-option';
import MyLink from '@/components/ui/link/MyLink';

function MostReviews({ initialData }) {
  const [data, setData] = useState(initialData.data);
  const params = getParameterQuery();
  const page = params.page ? parseInt(params.page, 10) : 1;
  const perPage = params.per_page ? parseInt(params.per_page, 10) : 20;
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState(initialData.total);
  const router = useRouter();
  const [sort, setSort] = useState(params.sort ? params.sort : '');
  const pathname = usePathname();

  const onChangePage = (page, pageSize) => {
    let newParams = {
      ...params,
      page,
      per_page: pageSize,
    };
    router.push(`${pathname}?${encodeQueryParams(newParams)}`);
    fetchData(page, pageSize);
    setCurrentPage(page);
    setNumberPage(pageSize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function fetchData(page, perPage, sort) {
    setIsLoading(true);
    let result = await DashboardTopAppService.getTopReview(page, perPage, sort);
    if (result) {
      setData(
        result.result.map((item, index) => ({
          ...item.detail,
          pricing_max: item.pricing_max,
          pricing_min: item.pricing_min,
          rank: perPage * (page - 1) + index + 1,
          key: index,
        })),
      );
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
    }
    setIsLoading(false);
  }

  const openAppDetail = (id) => () => {
    router.push(`/app/${id}`);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      render: (text, record) => (
        <div className="rank">
          <span>{record.index || record.rank}</span>
        </div>
      ),
      width: 20,
    },
    {
      title: 'App',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="content-app">
          <div className="image">
            <Image onClick={openAppDetail(record.app_id)} src={record.app_icon} width={75} height={75} alt="" />
          </div>
          <div className="item-detail-app">
            <div className="name-app-shopify">
              {record.before_rank && record.rank && !isLoading && record.before_rank - record.rank > 0 ? (
                <span className="calular-incre">
                  <UpOutlined /> {record.before_rank - record.rank}
                </span>
              ) : (
                ''
              )}
              {record.before_rank && record.rank && !isLoading && record.before_rank - record.rank < 0 ? (
                <span className="calular-decre">
                  <DownOutlined /> {record.rank - record.before_rank}
                </span>
              ) : (
                ''
              )}
              <MyLink href={'/app/' + record.app_id} className="link-name">
                {record.name}
              </MyLink>
              {record.built_for_shopify && (
                <Tag className="built-for-shopify" icon={<SketchOutlined />} color="#108ee9">
                  Built for shopify
                </Tag>
              )}
            </div>
            <div className="tagline">{record.tagline ? record.tagline : record.metatitle}</div>
            <div className="link-app-shopify">
              <MyLink
                target="_blank"
                href={
                  'https://apps.shopify.com/' +
                  record.app_id +
                  `?utm_source=letsmetrix.com&utm_medium=app_listing&utm_content=${record.name}`
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
      width: 350,
    },
    {
      title: 'Highlights',
      dataIndex: 'highlights',
      key: 'highlights',
      render: (highlights) =>
        highlights && highlights.length > 0 ? (
          <ul>
            {highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        ) : null,
      width: 200,
    },
    {
      title: 'Pricing',
      dataIndex: 'pricing_max',
      key: 'pricing_max',
      render: (pricing_max, record) => {
        if (record.pricing_min === 0 && record.pricing_max === 0) {
          return 'Free';
        }
        if (record.pricing_min !== undefined && record.pricing_max !== undefined) {
          return record.pricing_min === record.pricing_max
            ? `$${record.pricing_min || record.pricing_max} / month`
            : `$${record.pricing_min} - $${record.pricing_max} / month`;
        }
        return 'N/A';
      },
      width: 120,
    },
    {
      title: 'Rating',
      dataIndex: 'star',
      key: 'star',
      render: (star, record) => (
        <div className="icon-star">
          <StarFilled /> {record.star > 5 ? record.star / 10 : record.star}
          {record.before_star && record.star && record.before_star - record.star > 0 ? (
            <span className="calular-incre">
              <UpOutlined className="icon" /> {(record.before_star - record.star).toFixed(1)}
            </span>
          ) : (
            ''
          )}
          {record.before_star && record.star && record.before_star - record.star < 0 ? (
            <span className="calular-decre">
              <DownOutlined /> {(record.star - record.before_star).toFixed(1)}
            </span>
          ) : (
            ''
          )}
        </div>
      ),
      width: 120,
    },
    {
      title: 'Reviews',
      dataIndex: 'review_count',
      key: 'review_count',
      render: (review_count, record) => (
        <>
          {record.review_count > 0 ? record.review_count : record.review || null}
          {record.before_review && record.review - record.before_review > 0 ? (
            <span> (+{record.review - record.before_review})</span>
          ) : (
            ''
          )}
        </>
      ),
      width: 120,
    },
  ];

  return (
    <Spin spinning={isLoading}>
      <div className="detail-top-reviewed">
        <div className="detail-top-reviewed-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">Top applications by Review</h1>
              <div className="title-apps">{total} apps</div>
            </div>
            <div className="sort">
              {renderSelect(optionsSort, 'Sort By', sort, (value) => {
                setSort(value);
                fetchData(page, perPage, value);
              })}
            </div>
          </div>
          <div className="line-top"></div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowClassName="item-detail"
            bordered
            scroll={{ x: 'max-content' }}
          />
          <div className="pagination">
            <Pagination
              pageSize={numberPage}
              current={currentPage}
              onChange={onChangePage}
              total={total}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} apps`}
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}

export default MostReviews;
