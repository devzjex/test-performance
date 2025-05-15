import FadeInSection from '@/components/ui/fade-in-section/FadeInSection';
import { Col, Row, Typography } from 'antd';
import Image from 'next/image';
import React from 'react';
import './UnlockInsightsPage.scss';

export default function UnlockInsightsPage({ data }) {
  return (
    <div className="layoutLandingPageUnlockInsights">
      <FadeInSection>
        <Row className="dashboardExplore" justify={'center'}>
          <Col lg={15} sm={18} xs={22}>
            <FadeInSection>
              <Row className="textMarket">
                <Typography.Text className={`dashboardExploreTextUnderstand primary-color`}>
                  Unlock Insights with a visual Dashboard
                </Typography.Text>
              </Row>
              <Row className="textMarket">
                <Typography.Text className="dashboardExploreText">
                  Easily access and analyze key data through our intuitive, user-friendly dashboard for better
                  decision-making and optimized performance.
                </Typography.Text>
              </Row>
              {data?.count && (
                <Row justify={'space-between'}>
                  {[
                    {
                      image: '/image/keyword-analytics.png',
                      title: 'Keywords Analysis',
                      value: '10+ Attribution with:',
                      cotent: [
                        "Manual Keywords – Optimize your app's visibility using custom keywords.",
                        'Suggested Keywords – Leverage expert recommendations for improved reach.',
                        'AI-Generated Keywords – Enhance your strategy with AI-driven.',
                      ],
                    },
                    {
                      image: '/image/merchant-analytics.png',
                      title: 'Merchant Analytics',
                      value: 'Optimize app performance and business strategies',
                      cotent: [
                        'User growth and earning',
                        'Churn & Reinstall',
                        'Customer Lifecycle / Conversation rate',
                        'App position',
                        'Review & Ratings',
                        'Change log tracking',
                        'User acquisition',
                        'Traffic attribution',
                      ],
                    },
                    {
                      image: '/image/compaetitor-research.gif',
                      title: 'Competitor Research',
                      value:
                        'Conduct competitor research with Letsmetrix’s user-friendly and detailed app comparison tables',
                      cotent: ['App info', 'Ranking', 'Review', 'Top Keywords', 'Pricing', 'Popular Comparisons'],
                    },
                  ].map((item, index) => (
                    <Col key={index} className="dashboardExploreBox">
                      <div className="content">
                        <div className="contentLeft">
                          <Typography.Text level={1} className="contentLeftTitle">
                            {item.title}
                          </Typography.Text>
                          <div className="contentLeftChildren">
                            <Typography.Text className="typographyText">{item.value}</Typography.Text>
                            <ul>
                              {item.cotent.map((text, idx) => (
                                <li key={idx}>
                                  <Typography.Text className="typographyText">{text}</Typography.Text>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="imageUnlock">
                          <Image
                            src={item.image}
                            width={663}
                            height={435}
                            alt="icon"
                            style={{ objectFit: 'cover' }}
                            unoptimized
                          />
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </FadeInSection>
          </Col>
        </Row>
      </FadeInSection>
    </div>
  );
}
