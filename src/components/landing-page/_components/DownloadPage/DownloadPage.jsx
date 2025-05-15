import FadeInSection from '@/components/ui/fade-in-section/FadeInSection';
import { COLUMNS } from '@/constants/MenuItem';
import { LayoutPaths, Paths } from '@/utils/router';
import { Col, Row, Typography } from 'antd';
import React from 'react';
import './DownloadPage.scss';
import MyLink from '@/components/ui/link/MyLink';

export default function DownloadPage() {
  return (
    <FadeInSection>
      <div className="layoutLandingPageDownload">
        <div className="container">
          <Row justify={'center'}>
            <Row style={{ height: '100%' }}>
              <Col xl={12} lg={24} className="mt-30">
                <Row>
                  <Typography.Text className="downloadTitle">Ready to win your App Market?</Typography.Text>
                </Row>
                <Row>
                  <MyLink href={`${LayoutPaths.Auth}${Paths.LoginApp}`} className="buttonGetKey">
                    Get your key to success
                  </MyLink>
                </Row>
              </Col>
              <Col xl={12} className="downloadCols">
                <Row align="bottom" justify="center" style={{ height: '100%' }}>
                  {COLUMNS.map((item, index) => (
                    <Col
                      key={index}
                      className="cols"
                      style={{
                        height: item.height,
                        background: item.color,
                      }}
                    />
                  ))}
                </Row>
              </Col>
            </Row>
          </Row>
        </div>
      </div>
    </FadeInSection>
  );
}
