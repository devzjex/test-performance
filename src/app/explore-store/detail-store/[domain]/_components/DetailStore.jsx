'use client';

import StoreApiService from '@/api-services/api/StoreApiService';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import {
  Card,
  List,
  Spin,
  Typography,
  Row,
  Col,
  Empty,
  Breadcrumb,
  Button,
  Modal,
  Tag,
  Timeline,
  Divider,
  Tooltip,
} from 'antd';
import { HomeOutlined, LoadingOutlined, RightOutlined, StarFilled } from '@ant-design/icons';
import './DetailStore.scss';
import Image from 'next/image';
import MyLink from '@/components/ui/link/MyLink';

const { Title, Paragraph } = Typography;

export default function DetailStore({ initialDataStoreDetail }) {
  const pathname = usePathname();
  const storeDomain = pathname.split('/').pop();
  const storeData = initialDataStoreDetail.storeData;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleOther, setIsModalVisibleOther] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const [isEventLoading, setIsEventLoading] = useState(false);
  const [modalAppName, setModalAppName] = useState('');
  const [modalStoreName, setModalStoreName] = useState('');
  const searchParams = useSearchParams();
  const nameStoreURL = searchParams.get('name-store');
  const sourceStore = searchParams.get('source');
  const [selectedApp, setSelectedApp] = useState(null);
  const MAX_ITEMS = 5;
  const MAX_ITEMS_OTHER = 6;
  const MAX_ITEMS_CATE_COL = 10;
  const [expandedSections, setExpandedSections] = useState({
    apps: false,
    apps_other: false,
    categories: false,
    collections: false,
    features: false,
    technologies: false,
    categories_modal: false,
  });
  const isLetsmetrix = sourceStore === 'letsmetrix';
  const urlDomain = isLetsmetrix ? storeDomain : nameStoreURL;

  const toggleExpand = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const groupEventsByDate = (events) => {
    return events.reduce((acc, event) => {
      const date = new Date(event.occurredAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});
  };

  const getEventIcon = (type) => {
    if (type.includes('RELATIONSHIP_INSTALLED')) {
      return <Tag color="blue">Installed</Tag>;
    } else if (type.includes('RELATIONSHIP_UNINSTALLED')) {
      return <Tag color="gray">Uninstalled</Tag>;
    } else if (type.includes('RELATIONSHIP_DEACTIVATED')) {
      return <Tag color="orange">Deactivated</Tag>;
    } else if (type.includes('RELATIONSHIP_REACTIVATED')) {
      return <Tag color="purple">Reactivated</Tag>;
    } else if (type.includes('SUBSCRIPTION_CHARGE_ACTIVATED')) {
      return <Tag color="green">Charge Activated</Tag>;
    } else if (type.includes('SUBSCRIPTION_CHARGE_CANCELED')) {
      return <Tag color="red">Charge Canceled</Tag>;
    } else if (type.includes('SUBSCRIPTION_CHARGE_EXPIRED')) {
      return <Tag color="magenta">Charge Expired</Tag>;
    } else if (type.includes('SUBSCRIPTION_CHARGE_FROZEN')) {
      return <Tag color="volcano">Charge Frozen</Tag>;
    } else if (type.includes('SUBSCRIPTION_CHARGE_ACCEPTED')) {
      return <Tag color="cyan">Charge Accepted</Tag>;
    } else if (type.includes('SUBSCRIPTION_CHARGE_DECLINED')) {
      return <Tag color="gold">Charge Declined</Tag>;
    } else if (type.includes('SUBSCRIPTION_CHARGE_UNFROZEN')) {
      return <Tag color="lime">Charge Unfrozen</Tag>;
    } else if (type.includes('ONE_TIME_CHARGE_EXPIRED')) {
      return <Tag color="red">One-Time Charge Expired</Tag>;
    } else if (type.includes('ONE_TIME_CHARGE_ACTIVATED')) {
      return <Tag color="green">One-Time Charge Activated</Tag>;
    } else if (type.includes('ONE_TIME_CHARGE_ACCEPTED')) {
      return <Tag color="blue">One-Time Charge Accepted</Tag>;
    } else if (type.includes('CREDIT_PENDING')) {
      return <Tag color="orange">Credit Pending</Tag>;
    } else if (type.includes('CREDIT_APPLIED')) {
      return <Tag color="green">Credit Applied</Tag>;
    } else if (type.includes('ONE_TIME_CHARGE_DECLINED')) {
      return <Tag color="red">One-Time Charge Declined</Tag>;
    } else if (type.includes('USAGE_CHARGE_APPLIED')) {
      return <Tag color="purple">Usage Charge Applied</Tag>;
    }

    return <Tag color="default">Unknown</Tag>;
  };

  const handleShowMore = async (appId, appName) => {
    if (!storeDomain || !appId) return;

    setIsEventLoading(true);
    setIsModalVisible(true);

    setModalAppName(appName);
    setModalStoreName(storeData.shop_name || storeData.title || storeDomain);

    try {
      const response = await StoreApiService.getDetailAppInStore(urlDomain, appId);
      if (response && response.code === 0) {
        const groupedEvents = groupEventsByDate(response.list_event_store);
        setEventDetails(groupedEvents);
      }
    } catch (error) {
      console.error('Error fetching app details:', error);
    } finally {
      setIsEventLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEventDetails(null);
  };

  const handleAppClick = (app) => {
    setSelectedApp(app);
    setIsModalVisibleOther(true);
  };

  const handleModalCloseStore = () => {
    setIsModalVisibleOther(false);
    setSelectedApp(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const formatDuration = (durationString) => {
    const regex = /(\d+)h(\d+)m(\d+)s/;
    const match = durationString.match(regex);

    if (match) {
      const hours = match[1];
      const minutes = match[2];
      const seconds = match[3];

      if (minutes === '0' && seconds === '0') {
        return `${hours} hours`;
      }

      return `${hours} hours ${minutes} minutes ${seconds} seconds`;
    } else {
      return null;
    }
  };

  const domainStore = isLetsmetrix ? storeData?.shop_domain : storeData?.platform_domain || storeData?._id;
  const nameStore = isLetsmetrix ? storeData?.shop_name : storeData?.shop_name || storeData?.merchant_name;

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
                href: '/explore-store',
                title: <span>Explore Store</span>,
              },
              {
                title: <span>{nameStore}</span>,
              },
            ]}
            separator={<RightOutlined />}
          />
        </div>
      </div>
      {storeData ? (
        <div className="store-detail">
          <Card title={<Title level={3}>{nameStore}</Title>} bordered className="info-store-container">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={24} md={24}>
                <div className="info-store">
                  {domainStore && (
                    <>
                      <Typography.Text className={'title-store'}>
                        <strong>Domain</strong>
                      </Typography.Text>
                      <MyLink href={`https://${domainStore}`} target="__blank" rel="nofollow noopener noreferrer">
                        <Typography.Text className="content link-store">{domainStore}</Typography.Text>
                      </MyLink>
                      <Divider style={{ margin: '8px 0' }} />
                    </>
                  )}

                  {storeData.city && (
                    <>
                      <Typography.Text className={'title-store'}>
                        <strong>City</strong>
                      </Typography.Text>
                      <Typography.Text className="content">{storeData.city}</Typography.Text>
                      <Divider style={{ margin: '8px 0' }} />
                    </>
                  )}

                  {storeData.country_code && (
                    <>
                      <Typography.Text className={'title-store'}>
                        <strong>Country</strong>
                      </Typography.Text>
                      <Typography.Text className="content">{storeData.country_code}</Typography.Text>
                      <Divider style={{ margin: '8px 0' }} />
                    </>
                  )}

                  {storeData.location && (
                    <>
                      <Typography.Text className={'title-store'}>
                        <strong>Location</strong>
                      </Typography.Text>
                      <Typography.Text className="content">{storeData.location}</Typography.Text>
                      <Divider style={{ margin: '8px 0' }} />
                    </>
                  )}

                  {storeData.description && (
                    <>
                      <Typography.Text className={'title-store'}>
                        <strong>Description</strong>
                      </Typography.Text>
                      <Typography.Text className="content">{storeData.description}</Typography.Text>
                      <Divider style={{ margin: '8px 0' }} />
                    </>
                  )}

                  {storeData.updated_at && (
                    <>
                      <Typography.Text className={'title-store'}>
                        <strong>Last Updated</strong>
                      </Typography.Text>
                      <Typography.Text className="content">{storeData.updated_at}</Typography.Text>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </Card>

          {isLetsmetrix ? (
            <Card title={<Title level={4}>Apps</Title>} bordered className="info-store-card">
              <List
                itemLayout="horizontal"
                dataSource={storeData?.apps.slice(0, expandedSections.apps ? storeData?.apps.length : MAX_ITEMS)}
                renderItem={(app) => {
                  const hrefApp = isLetsmetrix ? app.app_id : app.token;
                  const nameApp = isLetsmetrix ? app?.app_name : app?.name;

                  return (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <MyLink href={`/app/${hrefApp}`} target="_blank" rel="noopener noreferrer">
                            <Image
                              src={isLetsmetrix ? app?.app_icon : app.icon_url}
                              width={50}
                              height={50}
                              alt={app?.name}
                            />
                          </MyLink>
                        }
                        title={
                          <MyLink
                            href={`/app/${hrefApp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="app-name-store"
                          >
                            {nameApp}
                          </MyLink>
                        }
                        description={
                          app?.built_for_shopify && (
                            <Tooltip title="Built for shopify">
                              <div className="built4-shopify">
                                <Image
                                  src="/image/diamond.svg"
                                  alt="diamond"
                                  width={20}
                                  height={20}
                                  className="diamond-icon"
                                />
                                <strong>{app?.rank_bfs ? <>{app?.rank_bfs}</> : null}</strong>
                              </div>
                            </Tooltip>
                          )
                        }
                      />
                      <Button type="primary" onClick={() => handleShowMore(hrefApp, nameApp)}>
                        Open Timeline
                      </Button>
                    </List.Item>
                  );
                }}
              />
              {storeData?.apps.length > MAX_ITEMS && (
                <div className="show-data">
                  <Button type="text" onClick={() => toggleExpand('apps')}>
                    {expandedSections.apps ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <>
              {storeData?.apps && storeData?.apps.length > 0 && (
                <Card title={<Title level={4}>Apps</Title>} bordered className="info-store-card">
                  <List
                    itemLayout="horizontal"
                    dataSource={storeData?.apps.slice(0, expandedSections.apps ? storeData?.apps.length : MAX_ITEMS)}
                    renderItem={(app) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <MyLink href={`/app/${app.token}`} target="_blank" rel="noopener noreferrer">
                              <Image src={app.icon_url} alt={app.name} width={50} height={50} />
                            </MyLink>
                          }
                          title={
                            <MyLink
                              href={`/app/${app.token}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="app-name-store"
                            >
                              {app.name}
                            </MyLink>
                          }
                          description={
                            <div className="install-rating">
                              <span className="rate">
                                <StarFilled /> <span className="count-rate">{app.average_rating}</span>
                              </span>
                              {app.installed_at ? <span>{`Installed At: ${formatDate(app.installed_at)}`}</span> : ''}
                              {app.free_trial_duration ? (
                                <span>{`Free Trial Duration: ${formatDuration(app.free_trial_duration)}`}</span>
                              ) : (
                                ''
                              )}
                            </div>
                          }
                        />
                        <Button type="primary" onClick={() => handleAppClick(app)}>
                          Open Detail
                        </Button>
                      </List.Item>
                    )}
                  />

                  {storeData?.apps.length > MAX_ITEMS && (
                    <div className="show-data">
                      <Button type="text" onClick={() => toggleExpand('apps')}>
                        {expandedSections.apps ? 'View Less' : 'View More'}
                      </Button>
                    </div>
                  )}
                </Card>
              )}
            </>
          )}

          {storeData?.apps_other && storeData?.apps_other.length > 0 && (
            <Card title={<Title level={4}>Other Apps</Title>} bordered className="info-store-card">
              <List
                itemLayout="horizontal"
                dataSource={storeData?.apps_other.slice(
                  0,
                  expandedSections.apps_other ? storeData?.apps_other.length : MAX_ITEMS,
                )}
                renderItem={(app) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <MyLink href={`/app/${app.token}`} target="_blank" rel="noopener noreferrer">
                          <Image src={app.icon_url} alt={app.name} width={50} height={50} />
                        </MyLink>
                      }
                      title={
                        <MyLink
                          href={`/app/${app.token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="app-name-store"
                        >
                          {app.name}
                        </MyLink>
                      }
                      description={
                        <div className="install-rating">
                          <span className="rate">
                            <StarFilled /> <span className="count-rate">{app.average_rating}</span>
                          </span>
                          {app.installed_at ? <span>{`Installed At: ${formatDate(app.installed_at)}`}</span> : ''}
                          {app.free_trial_duration ? (
                            <span>{`Free Trial Duration: ${formatDuration(app.free_trial_duration)}`}</span>
                          ) : (
                            ''
                          )}
                        </div>
                      }
                    />
                    <Button type="primary" onClick={() => handleAppClick(app)}>
                      Open Detail
                    </Button>
                  </List.Item>
                )}
              />

              {storeData?.apps_other.length > MAX_ITEMS && (
                <div className="show-data">
                  <Button type="text" onClick={() => toggleExpand('apps_other')}>
                    {expandedSections.apps_other ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Card>
          )}

          {storeData?.categories && storeData?.categories.length > 0 && (
            <Card title={<Title level={4}>Categories</Title>} bordered className="info-store-card">
              <Row>
                {storeData?.categories
                  .slice(0, expandedSections.categories ? storeData?.categories.length : MAX_ITEMS_CATE_COL)
                  .map((category, index) => {
                    const categoryTags = category.split('/').filter((tag) => tag !== '');
                    return categoryTags.map((tag, tagIndex) => (
                      <Tag className="tag-cate" key={`${index}-${tagIndex}`}>
                        {tag}
                      </Tag>
                    ));
                  })}
              </Row>

              {storeData?.categories.length > MAX_ITEMS_CATE_COL && (
                <div className="show-data">
                  <Button type="text" onClick={() => toggleExpand('categories')}>
                    {expandedSections.categories ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Card>
          )}

          {storeData?.collections && storeData?.collections.length > 0 && (
            <Card title={<Title level={4}>Collections</Title>} bordered className="info-store-card">
              <Row>
                {storeData?.collections
                  .slice(0, expandedSections.collections ? storeData?.collections.length : MAX_ITEMS_CATE_COL)
                  .map((collection, index) => (
                    <Tag className="tag-cate" key={index}>
                      {collection}
                    </Tag>
                  ))}
              </Row>

              {storeData?.collections.length > MAX_ITEMS_CATE_COL && (
                <div className="show-data">
                  <Button type="text" onClick={() => toggleExpand('collections')}>
                    {expandedSections.collections ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Card>
          )}

          {storeData?.features && storeData?.features.length > 0 && (
            <Card title={<Title level={4}>Features</Title>} bordered className="info-store-card">
              <Row gutter={[16, 16]}>
                {storeData?.features
                  .slice(0, expandedSections.features ? storeData?.features.length : MAX_ITEMS_OTHER)
                  .map((feature, index) => (
                    <Col key={index} xs={24} sm={12} md={8}>
                      <Card hoverable>
                        <Title level={5}>{feature}</Title>
                      </Card>
                    </Col>
                  ))}
              </Row>

              {storeData?.features.length > MAX_ITEMS && (
                <div className="show-data">
                  <Button type="text" onClick={() => toggleExpand('features')}>
                    {expandedSections.features ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Card>
          )}

          {storeData?.technologies && storeData?.technologies.length > 0 && (
            <Card title={<Title level={4}>Technologies</Title>} bordered className="info-store-card">
              <Row gutter={[16, 16]}>
                {storeData?.technologies
                  .slice(0, expandedSections.technologies ? storeData?.technologies.length : MAX_ITEMS_OTHER)
                  .map((tech, index) => (
                    <Col key={index} xs={24} sm={12} md={8}>
                      <Card hoverable>
                        <Image src={tech.icon_url} alt={tech.name} width={40} height={40} />
                        <Title level={5} style={{ textAlign: 'center' }}>
                          {tech.name}
                        </Title>
                      </Card>
                    </Col>
                  ))}
              </Row>

              {storeData?.technologies.length > MAX_ITEMS_OTHER && (
                <div className="show-data">
                  <Button type="text" onClick={() => toggleExpand('technologies')}>
                    {expandedSections.technologies ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Card>
          )}

          <Modal
            title={<h3>{`App Event Details for ${modalAppName} in ${modalStoreName}`}</h3>}
            visible={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
            width={800}
            className="modal-open-timeline"
          >
            <Spin spinning={isEventLoading} indicator={<LoadingOutlined spin />} size="large">
              {eventDetails && Object.keys(eventDetails).length > 0 ? (
                <Timeline style={{ marginTop: 30 }}>
                  {Object.entries(eventDetails).map(([date, events]) => (
                    <Timeline.Item key={date} color="#ffc225">
                      <Title level={5}>{date}</Title>
                      {events.map((event, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                          <Paragraph>
                            {getEventIcon(event.type)}
                            <span>
                              {new Date(event.occurredAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'UTC',
                              })}
                            </span>
                          </Paragraph>
                          {event.charge && (
                            <div>
                              <Title level={5} style={{ color: '#1890ff', margin: 0 }}>
                                {event.charge.name}
                              </Title>
                              {event.charge.billingOn && (
                                <Paragraph type="secondary">
                                  Billing On:{' '}
                                  {new Date(event.charge.billingOn).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    timeZone: 'UTC',
                                  })}
                                </Paragraph>
                              )}
                              <Paragraph type="secondary">
                                {event.billing_interval === 'EVERY_30_DAYS' ? (
                                  <>
                                    ${event.charge.amount.amount} {event.charge.amount.currencyCode} billed every 30
                                    days, starting immediately.
                                  </>
                                ) : (
                                  <>
                                    ${event.charge.amount.amount} {event.charge.amount.currencyCode}
                                  </>
                                )}
                              </Paragraph>
                            </div>
                          )}
                          {index < events.length - 1 && <Divider style={{ margin: '15px 0' }} />}
                        </div>
                      ))}
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <Empty description="No event details available." />
              )}
            </Spin>
          </Modal>

          <Modal
            title={<h3>{`App Details for ${selectedApp?.name} (1/1/2025)`}</h3>}
            visible={isModalVisibleOther}
            onCancel={handleModalCloseStore}
            footer={null}
            width={1200}
            className="modal-open-timeline"
          >
            {selectedApp ? (
              <div className="content-open-detail">
                {selectedApp.platform && <Paragraph type="secondary">Platform: {selectedApp.platform}</Paragraph>}

                {selectedApp.description && (
                  <>
                    <Title level={4}>Description:</Title>
                    <Paragraph>{selectedApp.description}</Paragraph>
                    <Divider />
                  </>
                )}

                {selectedApp?.integrates_with && Array.isArray(selectedApp.integrates_with) && (
                  <>
                    <Title level={4}>Integration:</Title>
                    <Paragraph>{selectedApp.integrates_with.join(', ')}</Paragraph>
                    <Divider />
                  </>
                )}

                {selectedApp.categories && (
                  <>
                    <Title level={4}>Categories:</Title>
                    {selectedApp.categories
                      .slice(0, expandedSections.categories_modal ? selectedApp.categories.length : 20)
                      .map((category, index) => (
                        <Tag className="tag-cate" key={index}>
                          {category}
                        </Tag>
                      ))}
                    {selectedApp.categories.length > 20 && (
                      <div style={{ textAlign: 'center' }}>
                        <Button type="text" onClick={() => toggleExpand('categories_modal')} className="show-item">
                          {expandedSections.categories_modal ? 'View Less' : 'View More'}
                        </Button>
                      </div>
                    )}
                    <Divider />
                  </>
                )}

                {selectedApp.plans && selectedApp.plans.length > 0 && (
                  <>
                    <Title level={4}>Plans:</Title>
                    <Row gutter={[8, 8]}>
                      {selectedApp.plans.map((plan, index) => (
                        <Col key={index} xs={24} sm={12} md={8}>
                          <Card bordered>
                            <Title level={5}>{plan.name}</Title>
                            <Paragraph>{plan.monthly_cost}</Paragraph>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    <Divider />
                  </>
                )}

                {(selectedApp.installs || selectedApp.installs_30d || selectedApp.installs_90d) && (
                  <>
                    <Title level={4}>Installs:</Title>
                    <Row gutter={[8, 8]}>
                      {selectedApp.installs && (
                        <Col xs={24} sm={12} md={8}>
                          <Card bordered>
                            <Title level={5}>Installs</Title>
                            <Paragraph>{selectedApp.installs}</Paragraph>
                          </Card>
                        </Col>
                      )}
                      {selectedApp.installs_30d && (
                        <Col xs={24} sm={12} md={8}>
                          <Card bordered>
                            <Title level={5}>Installs (30 Days)</Title>
                            <Paragraph>{selectedApp.installs_30d}</Paragraph>
                          </Card>
                        </Col>
                      )}
                      {selectedApp.installs_90d && (
                        <Col xs={24} sm={12} md={8}>
                          <Card bordered>
                            <Title level={5}>Installs (90 Days)</Title>
                            <Paragraph>{selectedApp.installs_90d}</Paragraph>
                          </Card>
                        </Col>
                      )}
                    </Row>
                    <Divider />
                  </>
                )}

                {(selectedApp.review_count || selectedApp.reviews_30d || selectedApp.reviews_90d) && (
                  <>
                    <Title level={4}>Reviews:</Title>
                    <Row gutter={[8, 8]}>
                      {selectedApp.review_count && (
                        <Col xs={24} sm={12} md={8}>
                          <Card bordered>
                            <Title level={5}>Review Count</Title>
                            <Paragraph>{selectedApp.review_count}</Paragraph>
                          </Card>
                        </Col>
                      )}
                      {selectedApp.reviews_30d && (
                        <Col xs={24} sm={12} md={8}>
                          <Card bordered>
                            <Title level={5}>Reviews (30 Days)</Title>
                            <Paragraph>{selectedApp.reviews_30d}</Paragraph>
                          </Card>
                        </Col>
                      )}
                      {selectedApp.reviews_90d && (
                        <Col xs={24} sm={12} md={8}>
                          <Card bordered>
                            <Title level={5}>Reviews (90 Days)</Title>
                            <Paragraph>{selectedApp.reviews_90d}</Paragraph>
                          </Card>
                        </Col>
                      )}
                    </Row>
                  </>
                )}
              </div>
            ) : (
              <Empty description="No app details available" />
            )}
          </Modal>
        </div>
      ) : (
        <Empty description="No data available" />
      )}
    </>
  );
}
