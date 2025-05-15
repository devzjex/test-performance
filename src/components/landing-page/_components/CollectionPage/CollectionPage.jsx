import FadeInSection from '@/components/ui/fade-in-section/FadeInSection';
import { Col, Row, Typography } from 'antd';
import React from 'react';
import TableApp from '../../table-app/TableApp';
import dayjs from 'dayjs';
import './CollectionPage.scss';

export default function CollectionPage({ data, isLoading }) {
  const renderDataSource = (data) => {
    if (data) {
      return data.map((item) => {
        return {
          key: item.detail.app_id,
          app: {
            img: item.detail.app_icon,
            name: item.detail.name || ' ',
            desc: item.detail.metatitle || ' ',
            slug: item.detail.app_id,
          },
          diffRank:
            item.count ||
            item.review_count ||
            item.detail.review_count ||
            (item.detail.launched ? dayjs(item.detail.launched).fromNow() : ' '),
        };
      });
    }
    return [];
  };

  return (
    <FadeInSection>
      <div className="layoutLandingPageCollection">
        <div className="container">
          <Row justify="center">
            <Typography.Title className="primary-color" level={3}>
              App Collection
            </Typography.Title>
          </Row>
          <Row justify="space-between">
            <Col className="bordered">
              <TableApp
                item={{
                  title: 'New Release',
                  data: renderDataSource(data?.topApp?.topRelease || []),
                }}
                loading={isLoading}
              />
            </Col>
            <Col className="borderedLeft">
              {[
                {
                  title: 'Top Movers',
                  data: renderDataSource(data?.topApp?.topMovers || []),
                },
                {
                  title: 'Most Reviewed',
                  data: renderDataSource(data?.topApp?.topReviews || []),
                },
              ].map((item, index) => (
                <div key={index} className="borderedLeftStyled">
                  <TableApp item={item} loading={isLoading} />
                </div>
              ))}
            </Col>
          </Row>
        </div>
      </div>
    </FadeInSection>
  );
}
