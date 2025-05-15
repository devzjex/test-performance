'use client';

import React, { useState } from 'react';
import { Pagination, Spin, Tag, Typography, Table } from 'antd';
import { encodeQueryParams, getParameterQuery, renderSelect } from '@/utils/functions';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';
import { FallOutlined, LinkOutlined, RiseOutlined, SketchOutlined, StarFilled } from '@ant-design/icons';
import Image from 'next/image';
import './InstallationGrowthRate.scss';
import { usePathname, useRouter } from 'next/navigation';
import './InstallationGrowthRate.scss';
import { optionsSort } from '@/utils/data/filter-option';
import MyLink from '@/components/ui/link/MyLink';

function InstallationGrowthRate({ initialDataInstallationGrowRate }) {
  const [data, setData] = useState(initialDataInstallationGrowRate.data);
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState(initialDataInstallationGrowRate.total);
  const router = useRouter();
  const [sort, setSort] = useState(params.sort ? params.sort : '');
  const pathname = usePathname();

  const openAppDetail = (id) => () => {
    router.push(`/app/${id}`);
  };

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page,
      per_page,
    };

    router.push(`${pathname}?${encodeQueryParams(newParams)}`);
    fetchData(page, per_page, sort);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function fetchData(page, per_page, sort) {
    setIsLoading(true);
    let result = await DashboardTopAppService.getInstallationGrowthRate(page, per_page, sort);
    if (result) {
      setData(result.data);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
    }
    setIsLoading(false);
  }

  const renderTagType = (sum) => {
    if (sum !== 0) {
      return (
        <Tag
          style={{
            borderRadius: '16px',
            color: sum > 0 ? '#336B1F' : '#ff3333',
            fontSize: '14px',
            padding: '5px 10px',
            fontWeight: 500,
          }}
          color={sum > 0 ? 'rgba(101, 216, 60, 0.36)' : '#ffb3b3'}
        >
          <Typography.Text>{sum}</Typography.Text>
          {sum > 0 ? <RiseOutlined /> : <FallOutlined />}
        </Tag>
      );
    }
    return null;
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      render: (text, record, index) => (
        <div className="rank">
          <span>{perPage * (page - 1) + index + 1}</span>
        </div>
      ),
      width: 50,
    },
    {
      title: 'App',
      dataIndex: 'detail',
      key: 'name',
      render: (text, record) => {
        return (
          <div className="content-app">
            <div className="image">
              <Image onClick={() => openAppDetail(record.app_id)} src={record.app_icon} alt="" width={75} height={75} />
            </div>
            <div className="item-detail-app">
              <div className="name-app-shopify">
                <MyLink href={'/app/' + record.app_id} className="link-name">
                  {record.name}
                </MyLink>
                {record.built_for_shopify && (
                  <Tag className="built-for-shopify" icon={<SketchOutlined />} color="#108ee9">
                    Built for Shopify
                  </Tag>
                )}
              </div>
              <div className="tagline">{record.tagline || record.metatitle}</div>
              <div className="link-app-shopify">
                <MyLink
                  href={`https://apps.shopify.com/${record.app_id}?utm_source=letsmetrix.com&utm_medium=app_listing&utm_content=${record.name}`}
                  className="link"
                  target="__blank"
                  rel="noopener nofollow noreferrer"
                >
                  <LinkOutlined />
                </MyLink>
              </div>
            </div>
          </div>
        );
      },
      width: 350,
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (total, record) => (
        <MyLink href={`category/${record.cate_id}`} target="__blank">
          {record.categoryName}
        </MyLink>
      ),
      width: 100,
    },
    {
      title: 'Growth Rate',
      dataIndex: 'growthRate',
      key: 'growthRate',
      render: (total, record) => {
        return renderTagType(record.growthRate);
      },
      width: 50,
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
      width: 100,
    },
    {
      title: 'Rating',
      dataIndex: 'detail',
      key: 'rating',
      render: (rating, record) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="icon-star">
            {record.star > 5 ? record.star / 10 : record.star} <StarFilled />
          </div>
        </div>
      ),
      width: 50,
    },
    {
      title: 'Reviews',
      dataIndex: 'review_count',
      key: 'review_count',
      render: (reviews, record) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>{record.review_count > 0 ? record.review_count : null}</div>
        </div>
      ),
      width: 50,
    },
  ];

  const dataSource = data.map((item, index) => {
    const { app_id, name, app_icon, tagline, metatitle, review_count, star, built_for_shopify } = item.app_info.detail;
    let growthRate = item.count;
    let categoryName = item.category_name;
    let pricing_max = item.pricing_max;
    let pricing_min = item.pricing_min;
    let cate_id = item._id;
    return {
      key: index,
      app_id,
      name,
      app_icon,
      tagline,
      metatitle,
      growthRate: growthRate,
      categoryName: categoryName,
      star,
      review_count: review_count,
      built_for_shopify: built_for_shopify,
      pricing_max,
      pricing_min,
      cate_id,
    };
  });

  return (
    <Spin spinning={isLoading}>
      <div className="detail-top-growth-install-gr">
        <div className="detail-top-growth-install-gr-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">Top applications by Installation Growth Rate</h1>
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
          <div className="detail-category">
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              rowClassName="item-detail"
              bordered
              scroll={{ x: 'max-content' }}
            />
          </div>
          {total > 0 ? (
            <div className="pagination">
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
          ) : (
            ''
          )}
        </div>
      </div>
    </Spin>
  );
}
export default InstallationGrowthRate;
