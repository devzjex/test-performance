'use client';

import CategoriesApiService from '@/api-services/api/CategoriesApiService';
import { getParameterQuery } from '@/utils/functions';
import { Breadcrumb, Empty, message, Pagination, Select, Spin, Table, Tag } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import './CategoryCollectionDetail.scss';
import { optionsLanguage, optionsPricingType, optionsSortBy, optionsSortType } from '@/utils/data/filter-option';
import {
  DownOutlined,
  ExportOutlined,
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

export default function CategoryCollectionDetail({ dataInitial }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const isCategory = pathname.includes('category');
  const [data, setData] = useState(dataInitial.initialData);
  const [pricingRange, setPricingRange] = useState(dataInitial.initialPricingRange);
  const [avgPrice, setAvgPrice] = useState(dataInitial.initialAvgPrice);
  const [dataCategory, setDataCategory] = useState(dataInitial.initialDataCategory);
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 24;
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState(dataInitial.initialTotal);
  const [sort_by, setSort_by] = useState(params.sort_by ? params.sort_by : 'best_match');
  const [language, setLanguage] = useState(params.language ? params.language : 'uk');
  const [priceType, setPriceType] = useState(params.price_type ? params.price_type : 'all');
  const [sortType, setSortType] = useState(params.sort_type ? params.sort_type : 'rank');
  const [priceRange, setPriceRange] = useState(0);
  const parts = pathname.split('/');
  const lastPart = parts[parts.length - 1];
  const id = lastPart;
  const router = useRouter();

  const fetchData = async (id, page, per_page, sort_by, language, sortType, priceType, priceRange) => {
    setLoading(true);
    const range = pricingRange ? pricingRange.find((item, index) => index + 1 == priceRange) : {};
    const rangeMax = range ? range.max : 0;
    const rangeMin = range ? range.min : 0;

    let result = isCategory
      ? await CategoriesApiService.getConversationCategory(
          id,
          sort_by,
          page,
          per_page,
          language,
          sortType,
          priceType,
          rangeMin,
          rangeMax,
        )
      : await CategoriesApiService.getConversationCollection(
          id,
          sort_by === 'popular' ? 'most_popular' : 'best_match',
          page,
          per_page,
          language,
          sortType,
          priceType,
          rangeMin,
          rangeMax,
        );
    setLoading(false);
    if (result && result.code == 0) {
      setData(result.data);
      setPricingRange(result.filter_range_price);
      setAvgPrice(result.price_avg);
      setDataCategory(result.data.apps);
      setCurrentPage(result.current_page);
      setTotal(result.total);
    } else {
      message.error('Internal Server Error');
    }
  };

  const checkLocale = () => {
    if (language === 'us') {
      return '';
    }
    if (language === 'cn') {
      return 'zh-CN';
    }
    if (language === 'tw') {
      return 'zh-TW';
    }
    return `${language}`;
  };

  const getLinkNameCategory = () => {
    if (id === 'built-for-shopify') {
      return `apps.shopify.com/app-groups/highlights/${id}?sort_by=${sort_by}${
        language === 'uk' ? '' : `&locale=${checkLocale(language)}`
      }`;
    }
    if (id === 'made-by-shopify') {
      return `apps.shopify.com/partners/shopify`;
    }
    return `apps.shopify.com/${isCategory ? 'categories' : 'collections'}/${id}?${
      language === 'uk' ? '' : `locale=${checkLocale(language)}&`
    }sort_by=${!isCategory && sort_by === 'popular' ? 'most_popular' : sort_by}`;
  };

  const renderSelect = (options, label, value, onChange) => {
    return (
      <div className="sort-container">
        <label className="select-label">{label}</label>
        <Select value={value} onChange={onChange} style={{ width: 180 }}>
          <Select.OptGroup label={label}>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select.OptGroup>
        </Select>
      </div>
    );
  };

  const handleChangeSort = (type, value) => {
    switch (type) {
      case 'sortBy':
        setSort_by(value);
        fetchData(id, page, perPage, value, language, sortType, priceType, priceRange);
        return;
      case 'sortType':
        setSortType(value);
        fetchData(id, page, perPage, sort_by, language, value, priceType, priceRange);
        return;
      case 'language':
        setLanguage(value);
        fetchData(id, page, perPage, sort_by, value, sortType, priceType, priceRange);
        return;
      case 'priceType':
        setPriceType(value);
        fetchData(id, page, perPage, sort_by, language, sortType, value, priceRange);
        return;
      default:
        setPriceRange(value);
        fetchData(id, page, perPage, sort_by, language, sortType, priceType, value);
        return;
    }
  };

  const optionPricingRange = useMemo(() => {
    return pricingRange
      ? [
          { label: 'All', value: 0 },
          ...pricingRange.map((item, index) => {
            return { label: `$${item.min} - $${item.max}`, value: index + 1 };
          }),
        ]
      : [];
  }, [pricingRange]);

  const onChangePage = (page, per_page) => {
    fetchData(id, page, per_page, sort_by, language, sortType, priceType, priceRange);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank, record) => (
        <div className="rank">
          <span>{record.index || rank}</span>
        </div>
      ),
      width: 20,
    },
    {
      title: 'App',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="content-app">
          <div className="image">
            <Image
              src={record.app_icon}
              width={75}
              height={75}
              alt={name}
              onClick={() => router.push(`/app/${record.app_id}`)}
            />
          </div>
          <div className="item-detail-app">
            <div className="name-app-shopify">
              {record.before_rank && record.rank && record.before_rank - record.rank > 0 && (
                <span className="calular-incre">
                  <UpOutlined /> {record.before_rank - record.rank}{' '}
                </span>
              )}
              {record.before_rank && record.rank && record.before_rank - record.rank < 0 && (
                <span className="calular-decre">
                  <DownOutlined /> {record.rank - record.before_rank}{' '}
                </span>
              )}
              <MyLink href={`/app/${record.app_id}`} className="link-name">
                {name}
              </MyLink>
              {record.built_for_shopify && (
                <Tag className="built-for-shopify" icon={<SketchOutlined />} color="#108ee9">
                  Built for Shopify
                </Tag>
              )}
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
        </div>
      ),
      width: 450,
    },
    {
      title: 'Highlights',
      dataIndex: 'highlights',
      key: 'highlights',
      render: (highlights) => <ul>{highlights && highlights.map((item, index) => <li key={index}>{item}</li>)}</ul>,
      width: 170,
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
      title: 'Launched',
      dataIndex: 'launched',
      key: 'launched',
      render: (launched) => <span>{launched ? launched.slice(0, 10) : null}</span>,
      width: 100,
    },
    {
      title: 'Rating',
      dataIndex: 'star',
      key: 'star',
      render: (star, record) => (
        <div className="icon-star">
          <StarFilled /> {star > 5 ? star / 10 : star}
          {record.before_star && record.star && record.before_star - record.star > 0 ? (
            <span className="calular-incre">
              <UpOutlined className="icon" /> {(record.before_star - record.star).toFixed(1)}
            </span>
          ) : record.before_star && record.star && record.before_star - record.star < 0 ? (
            <span className="calular-decre">
              <DownOutlined /> {(record.star - record.before_star).toFixed(1)}
            </span>
          ) : null}
        </div>
      ),
      width: 100,
    },
    {
      title: 'Reviews',
      dataIndex: 'review_count',
      key: 'review_count',
      render: (review_count, record) => (
        <div>
          {review_count > 0 ? review_count : record.review || null}
          {record.before_review && record.review - record.before_review > 0 && (
            <span> (+{record.review - record.before_review})</span>
          )}
        </div>
      ),
      width: 100,
    },
  ];

  const dataTable = dataCategory?.map((item) => ({
    app_icon: item.app_icon,
    app_id: item.app_id,
    before_rank: item.before_rank,
    before_review: item.before_review,
    before_star: item.before_star,
    built_for_shopify: item.built_for_shopify,
    launched: item.launched,
    pricing_max: item.pricing_max,
    pricing_min: item.pricing_min,
    growth: item.growth,
    highlights: item.highlights,
    id: item.id,
    index: item.index,
    metatitle: item.metatitle,
    name: item.name,
    rank: item.rank,
    review: item.review,
    star: item.star,
    tagline: item.tagline,
  }));

  return (
    <Spin indicator={<LoadingOutlined spin />} spinning={loading} size="large">
      <div className="detail-categories">
        {!isCategory && (
          <div className="breadcrumb-header">
            <div className="container">
              <Breadcrumb
                items={[
                  {
                    href: '/',
                    title: <HomeOutlined />,
                  },
                  {
                    href: '/collections',
                    title: <span>Collections</span>,
                  },
                  {
                    title: <span>{data && data.text ? data.text : ''}</span>,
                  },
                ]}
                separator={<RightOutlined />}
              />
            </div>
          </div>
        )}

        {data ? (
          <div className="detail-categories-body container">
            <div className="container-title-body">
              <div className="wrapper-title">
                {!isCategory && <h1 className="title">{data && data.text ? data.text : ''}</h1>}
                <div className="information-cate">
                  <div className="title-apps">
                    <span>{total}</span>&nbsp;apps - Average price:&nbsp;<span>${avgPrice}</span>/month
                  </div>
                  <MyLink
                    href={`https://${getLinkNameCategory()}&utm_source=letsmetrix.com&utm_medium=${
                      isCategory ? 'category' : 'collection'
                    }&utm_content=${data && data.text ? data.text : ''}`}
                    target="_blank"
                    rel="noopener nofollow noreferrer"
                  >
                    <div className="link">
                      View Shopify
                      <ExportOutlined className="icon-share" />
                    </div>
                  </MyLink>
                </div>
              </div>
              <div className="sort">
                {renderSelect(optionsSortBy, 'Sort By', sort_by, (value) => handleChangeSort('sortBy', value))}
                {renderSelect(optionsSortType, 'Sort Type', sortType, (value) => handleChangeSort('sortType', value))}
                {renderSelect(optionsPricingType, 'Price Type', priceType, (value) =>
                  handleChangeSort('priceType', value),
                )}
                {renderSelect(optionPricingRange, 'Price Range', priceRange, (value) =>
                  handleChangeSort('priceRange', value),
                )}
                {renderSelect(optionsLanguage, 'Location', language, (value) => handleChangeSort('language', value))}
              </div>
            </div>

            <div className="detail-category">
              <Table
                columns={columns}
                dataSource={dataTable}
                pagination={false}
                bordered
                rowKey={(record) => record.app_id}
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
                  pageSizeOptions={[24, 48, 96, 192].map(String)}
                  showSizeChanger
                />
              </div>
            ) : (
              ''
            )}
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
        )}
      </div>
    </Spin>
  );
}
