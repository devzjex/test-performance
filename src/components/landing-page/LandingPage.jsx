'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './LandingPage.scss';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import SearchDataApiService from '@/api-services/api/SearchDataApiService';
import {
  AutoComplete,
  Button,
  Col,
  Divider,
  Empty,
  Input,
  message,
  Progress,
  Row,
  Tooltip,
  TreeSelect,
  Typography,
} from 'antd';
import Image from 'next/image';
import { ArrowRightOutlined, SearchOutlined, StarFilled } from '@ant-design/icons';
import Auth from '@/utils/store/Authentication';
import { fetchOnboardStatus } from '@/redux/slice/onboarding/Onboarding';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import FadeInSection from '../ui/fade-in-section/FadeInSection';
import { LayoutPaths, Paths } from '@/utils/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Loader from '../ui/loader/Loader';
import UnlockPage from './_components/UnlockPage/UnlockPage';
import dynamic from 'next/dynamic';
import UnlockInsightsPage from './_components/UnlockInsightsPage/UnlockInsightsPage';
import CollectionPage from './_components/CollectionPage/CollectionPage';
import DownloadPage from './_components/DownloadPage/DownloadPage';
import MyLink from '../ui/link/MyLink';

const CompareApp = dynamic(() => import('./compare-app/CompareApp'), {
  ssr: false,
});

dayjs.extend(relativeTime);

export default function LandingPage({ initialData }) {
  const router = useRouter();
  const [valueFilter, setValueFilter] = useState('finding-products');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const dispatch = useDispatch();
  const isShowOnboarding = useSelector((state) => state.onboarding.isShowOnboarding);
  const data = {
    categories: initialData.categories,
    topApp: initialData.topApp,
    count: initialData.count,
  };
  const [top5Apps, setTop5Apps] = useState(initialData.top5App);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('#compare')) {
        const element = document.getElementById('compare');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            window.scrollBy(0, 700);
          }, 500);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSeeAllResults = (searchValue) => {
    router.push(`/search?q=${encodeURIComponent(searchValue)}`);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value) => {
        if (!value) return;
        setSearchLoading(true);
        try {
          const response = await SearchDataApiService.searchData(value, 1, 15);
          const apps = response.data.apps;

          if (apps.length === 0) {
            setSearchResults([
              {
                value: 'no-results',
                label: <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description="No results found" />,
              },
            ]);
          } else {
            const results = apps.map((app) => ({
              value: app.detail.app_id,
              label: (
                <div
                  key={app.detail.app_id}
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
                >
                  {app.detail && app.detail.app_icon ? (
                    <Image
                      src={app.detail.app_icon}
                      alt={app.detail.name}
                      width={35}
                      height={35}
                      style={{ borderRadius: '6px' }}
                    />
                  ) : (
                    <Image
                      src={'/image/no-image.webp'}
                      alt={'no image'}
                      width={35}
                      height={35}
                      style={{ border: '1px solid #ccc' }}
                    />
                  )}
                  &nbsp;
                  <span style={{ marginLeft: '5px' }}>{app.detail.name}</span>
                </div>
              ),
            }));
            results.push({
              value: 'see-all',
              label: (
                <div key="see-all" style={{ textAlign: 'center' }}>
                  <Button
                    type="link"
                    icon={<ArrowRightOutlined />}
                    onClick={() => handleSeeAllResults(value)}
                    style={{ color: '#ffc225' }}
                  >
                    See All Results
                  </Button>
                </div>
              ),
            });
            setSearchResults(results);
          }
        } catch (error) {
          console.error('Failed to fetch search results:', error);
        } finally {
          setSearchLoading(false);
        }
      }, 300),
    [],
  );

  const onSearchApp = useCallback(
    (value) => {
      setSearchLoading(true);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleSelect = (value) => {
    if (value === 'see-all') {
      const searchInput = document.querySelector('.input-style input');
      if (searchInput) {
        const searchValue = searchInput.value;
        router.push(`/search?q=${encodeURIComponent(searchValue)}`);
      }
    } else if (value !== 'see-all') {
      router.push(`/app/${value}`);
    } else if (value === 'no-results') {
      return;
    }
  };

  const dataCategory = (allCategory) => {
    if (allCategory) {
      return allCategory.map((item) => {
        return {
          value: item.category_id,
          title: item.category_name,
          children: dataCategory(item.child),
        };
      });
    }
  };

  useEffect(() => {
    if (Auth.getAccessToken()) {
      dispatch(fetchOnboardStatus());
    }
  }, [dispatch]);

  const filterByCat = async (id) => {
    setIsLoading(true);
    try {
      const top5AppsData = await LandingPageApiService.getTop5Apps(id);
      setTop5Apps(top5AppsData.data.apps.sort((a, b) => a.star - b.star));
    } catch (error) {
      console.error(error);
      message.error(`Error loading data: ${error.message || 'Unknown'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeFilter = (value) => {
    setValueFilter(value);
    filterByCat(value);
  };

  return (
    <div className="layoutLandingPage">
      <div className="layoutLandingPageIntro">
        <div className="background-image-container">
          <Image
            src={'/image/background.webp'}
            layout="fill"
            objectFit="cover"
            alt="banner-lmt"
            fetchPriority="high"
            priority={true}
            loading="eager"
            className="banner"
          />
          <div className="background-overlay"></div>
        </div>
        <div className="container">
          <Row type="flex" style={{ alignItems: 'center' }}>
            <Col lg={12} span={24}>
              <h1 className="title">All you need to win Shopify Apps market</h1>
              <h2 className="description">Insights and data across thousands Shopify Apps</h2>
              <div className="input" id="step5">
                <AutoComplete
                  options={searchResults}
                  onSearch={onSearchApp}
                  onSelect={handleSelect}
                  notFoundContent={searchLoading ? <Loader size="small" /> : null}
                  popupMatchSelectWidth={false}
                  className="auto-complete"
                >
                  <Input
                    className="inputStyle"
                    size="large"
                    placeholder="Find an app by name, categories and more"
                    prefix={<SearchOutlined />}
                    onPressEnter={(e) => handleSeeAllResults(e.target.value)}
                  />
                </AutoComplete>
              </div>
              <div className="divider">
                <Divider />
              </div>
              <h2 className="description">Want a deeper insights?</h2>
              <div className="ctaBtn">
                <MyLink
                  href={`${Auth.getAccessToken() ? '/pricing' : `${LayoutPaths.Auth}${Paths.Register}`}`}
                  className="wrapperLink"
                >
                  Start your free trial
                </MyLink>
              </div>
            </Col>
            <Col lg={12} span={24} className="flex flex-col items-center">
              <div className={`progress flex ${top5Apps ? 'flex-col justify-between' : 'justify-center items-center'}`}>
                {isLoading ? (
                  <Loader />
                ) : (
                  top5Apps &&
                  top5Apps.map((item, index) => {
                    return (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                        <Progress
                          className={`progress-${index} progressApp`}
                          percent={60}
                          showInfo={false}
                          strokeColor={{
                            '0%': 'rgba(182, 131, 0, 1)',
                            '100%': 'rgba(255, 194, 37, 1)',
                          }}
                        />

                        <Tooltip title={item.name}>
                          <Typography.Text ellipsis={1} className="progressName">
                            {item.name} <br /> {item.star} <StarFilled style={{ color: 'yellow' }} />
                          </Typography.Text>
                        </Tooltip>
                        <MyLink href={`/app/${item.id}`}>
                          <Image
                            className="progressImage"
                            src={item.app_icon}
                            alt="logo"
                            width={48}
                            height={48}
                            priority
                          />
                        </MyLink>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="tree-cate">
                <TreeSelect
                  showSearch
                  value={valueFilter}
                  placeholder="Please select"
                  onChange={onChangeFilter}
                  treeData={data?.categories}
                  virtual={false}
                  loading={isLoading}
                  filterTreeNode={(inputValue, treeNode) => {
                    const searchValue = inputValue.toLowerCase();
                    const nodeTitle = treeNode.title.toLowerCase();
                    return nodeTitle.includes(searchValue);
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="layoutLandingPageParam">
        <Row className="detail" justify={'center'}>
          <Col lg={16} sm={18} xs={22}>
            <FadeInSection>
              <Row>
                <MyLink
                  href={'/dashboard'}
                  className="primary-color"
                  style={{ fontWeight: 500, textDecoration: 'underline' }}
                >
                  Explore what you can get <ArrowRightOutlined className="primary-color" />
                </MyLink>
              </Row>
              {data?.count && (
                <Row justify={'space-between'}>
                  {[
                    {
                      title: 'Apps',
                      value: data?.count.app_count,
                      href: '/dashboard',
                    },
                    {
                      title: 'Reviews',
                      value: data?.count.review_count,
                      href: '/dashboard/reviews',
                    },
                    {
                      title: 'Categories',
                      value: data?.count.category_count,
                      href: '/categories',
                    },
                    {
                      title: 'Developers',
                      value: data?.count.partner_count,
                      href: '/developers',
                    },
                  ].map((item, index) => (
                    <MyLink key={index} href={item.href}>
                      <Col className="detailBox">
                        <Row>
                          <Typography.Text className="totalTitle" level={1}>
                            {item?.value?.toLocaleString('en-US') ?? ''}
                          </Typography.Text>
                        </Row>
                        <Row>
                          <Typography.Text className="totalDesc">{item.title}</Typography.Text>
                        </Row>
                      </Col>
                    </MyLink>
                  ))}
                </Row>
              )}
            </FadeInSection>
          </Col>
        </Row>
        <Row className="dashboardExplore" justify={'center'}>
          <Col lg={12} sm={18} xs={22}>
            <FadeInSection>
              <Row className="textMarket">
                <Typography.Text className={`dashboardExploreTextUnderstand primary-color`}>
                  Understand what rules the market
                </Typography.Text>
              </Row>
              <Row className="text-merket_content">
                <Typography.Text className="dashboardExploreText">
                  Let’s Metrix helps marketers, developers and product managers to understand insights and data across
                  thousands Shopify Apps
                </Typography.Text>
              </Row>
              {data?.count && (
                <Row justify={'space-between'}>
                  {[
                    {
                      image: '/image/optimize.png',
                      title: 'Optimize ASO & User Insights',
                      value:
                        'Access unlimited keyword analytics powered by AI and user insights to boost app visibility and optimize user experience',
                    },
                    {
                      image: '/image/revenue.png',
                      title: 'Revenue & Growth Tracking',
                      value:
                        'Monitor revenue, retention rate, churn rate and subscriptions to optimize financial performance and business strategies.',
                    },
                    {
                      image: '/image/changelog.png',
                      title: 'Competitor Changelog Analysis',
                      value:
                        'Track competitor changes, rankings, and reviews to gain insights and stay ahead in the market.',
                    },
                    {
                      image: '/image/comparison.png',
                      title: 'App Comparison',
                      value:
                        'Compare unlimited apps, diverse filters, category rankings, reviews, and ranking changes over time. ',
                    },
                  ].map((item, index) => (
                    <Col key={index} className="dashboardExploreBox">
                      <Row>
                        <Image src={item.image} width={48} height={48} alt="icon" />
                      </Row>
                      <Row className="totalTitle">
                        <Typography.Text level={3} className="typographyText">
                          {item.title}
                        </Typography.Text>
                      </Row>
                      <Row>
                        <Typography.Text className="totalDesc">{item.value}</Typography.Text>
                      </Row>
                    </Col>
                  ))}
                </Row>
              )}
            </FadeInSection>
          </Col>
        </Row>
      </div>

      <UnlockPage data={data} />

      <UnlockInsightsPage data={data} />

      <CollectionPage data={data} isLoading={isLoading} />

      {isShowOnboarding === false ? (
        <FadeInSection>
          <CompareApp
            initialDataCompare={initialData.dataCompareApps}
            initialDataTopKeyWord={initialData.topKeywords}
          />
        </FadeInSection>
      ) : (
        <CompareApp initialDataCompare={initialData.dataCompareApps} initialDataTopKeyWord={initialData.topKeywords} />
      )}

      <DownloadPage />
    </div>
  );
}
