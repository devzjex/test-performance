import FadeInSection from '@/components/ui/fade-in-section/FadeInSection';
import { Button, Col, Row, Typography } from 'antd';
import Image from 'next/image';
import React from 'react';
import { showOnboarding } from '@/redux/slice/onboarding/OnboardingState';
import { useDispatch } from 'react-redux';
import './UnlockPage.scss';

export default function UnlockPage({ data }) {
  const dispatch = useDispatch();

  const handleOnboarding = () => {
    dispatch(showOnboarding());
  };

  return (
    <div className="layoutLandingPageUnlock">
      <FadeInSection>
        <Row className="dashboardExplore" justify={'center'}>
          <Col lg={14} sm={18} xs={22}>
            <FadeInSection>
              <Row className="textMarket">
                <Typography.Text className={`dashboardExploreTextUnderstand primary-color`}>
                  How to use Letsmetrix
                </Typography.Text>
              </Row>
              <Row className="textMarket">
                <Typography.Text className="dashboardExploreText">
                  Unlock the full potential of Letsmetrix in 3 simple steps
                </Typography.Text>
              </Row>
              {data?.count && (
                <Row justify={'space-between'}>
                  {[
                    {
                      image: '/image/user-orange.png',
                      title: 'Step 1',
                      value: 'Create a free account',
                      width: 35,
                      height: 35,
                    },
                    {
                      image: '/image/shopify-logo.png',
                      title: 'Step 2',
                      value: 'Connect Shopify API',
                      width: 45,
                      height: 45,
                    },
                    {
                      image: '/image/GAnalytics.png',
                      title: 'Step 3',
                      value: 'Sync GA with Letsmetrix',
                      width: 35,
                      height: 33,
                    },
                  ].map((item, index) => (
                    <Col key={index} className="dashboardExploreBox">
                      <Row>
                        <Image src={item.image} width={item.width} height={item.height} alt="icon" />
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
              <Row justify={'center'}>
                <Button onClick={handleOnboarding} className={`wrapperButton mt-30`} type="primary">
                  Get started guided
                </Button>
              </Row>
            </FadeInSection>
          </Col>
        </Row>
      </FadeInSection>
    </div>
  );
}
