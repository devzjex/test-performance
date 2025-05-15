'use client';

import './WatchingApps.scss';
import React, { useRef } from 'react';
import { Row, Col, Empty } from 'antd';
import ItemDetail from './ItemDetail';
import WatchingAppsCurrent from '@/utils/store/WatchingAppsCurrent';

function WatchingApps() {
  const dataWatchingApps = useRef(JSON.parse(WatchingAppsCurrent.getListWatchingApps()));
  return (
    <div className="watching-apps container">
      <div className="header-watching-apps">Watching Apps</div>
      <div className="list-watching-apps container-fluid">
        {dataWatchingApps.current ? (
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {dataWatchingApps.current &&
              dataWatchingApps.current.reverse().map((item, index) => {
                return (
                  <Col
                    style={{ marginTop: '15px' }}
                    className="gutter-row"
                    xs={24} // 1 cột trên màn hình mobile
                    sm={12} // 2 cột trên tablet nhỏ
                    md={12} // 2 cột trên tablet lớn
                    lg={8} // 3 cột trên desktop
                    key={'' + index}
                  >
                    <ItemDetail value={{ detail: item }} />
                  </Col>
                );
              })}
          </Row>
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
}
export default WatchingApps;
