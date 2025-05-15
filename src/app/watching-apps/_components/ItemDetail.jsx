'use client';

import { Badge, Row, Typography } from 'antd';
import './ItemDetail.scss';
import { StarFilled, SketchOutlined, DeleteOutlined } from '@ant-design/icons';
import { renderBadge } from '@/utils/functions';
import Image from 'next/image';

function ItemDetail(props) {
  const appDetail = props.value.detail;

  const renderContent = () => {
    return (
      <>
        {props.value ? (
          <div className="info-item">
            <div className={appDetail.built_for_shopify ? 'item-develop mt-10' : 'item-develop'}>
              <div className="image-item">
                {props.value.detail && props.value.detail.app_icon ? (
                  <Image src={props.value.detail.app_icon} width={90} height={90} alt="App Icon" />
                ) : (
                  <Image src="/image/no-image.webp" width={90} height={90} alt="No icon app" />
                )}
              </div>
              <div style={{ width: '100%' }}>
                <div className="text-item">
                  <a href={'/app/' + appDetail.app_id}>{appDetail ? appDetail.name : ''}</a>
                </div>
                <Row className="review">
                  <StarFilled /> <span>{appDetail ? appDetail.star + ' (' + appDetail.review_count + ') ' : ''}</span>
                  <Typography.Paragraph
                    className={appDetail.pricing ? 'price' : 'price-empty'}
                    ellipsis={{
                      tooltip: appDetail.pricing,
                      rows: 1,
                    }}
                  >
                    {appDetail.pricing || ''}
                  </Typography.Paragraph>
                </Row>
                <Typography.Paragraph
                  className="tagline"
                  ellipsis={{
                    tooltip: appDetail.tagline || '',
                    rows: 1,
                  }}
                >
                  {appDetail ? appDetail.tagline : ''}
                </Typography.Paragraph>
              </div>
            </div>
            <div>{renderBadge(appDetail.highlights)}</div>
          </div>
        ) : (
          ''
        )}
      </>
    );
  };

  return (
    <div className="item-app">
      {appDetail.built_for_shopify ? (
        <Badge.Ribbon
          className="built-shopify"
          text={
            <div className="built-shopify-label">
              <SketchOutlined /> Built for shopify
            </div>
          }
        >
          {renderContent()}
        </Badge.Ribbon>
      ) : appDetail.delete || appDetail.unlisted ? (
        <Badge.Ribbon
          className="delete-shopify"
          text={
            <div className="delete-shopify-label">
              <DeleteOutlined /> This app has been deleted
            </div>
          }
          color="red"
        >
          {renderContent()}
        </Badge.Ribbon>
      ) : (
        renderContent()
      )}
    </div>
  );
}
export default ItemDetail;
