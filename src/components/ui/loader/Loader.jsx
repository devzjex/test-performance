import { Spin } from 'antd';
import React from 'react';
import styles from './Loader.module.scss';
import { LoadingOutlined } from '@ant-design/icons';

export default function Loader({ size = 'large', style = {}, className = '' }) {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderWrapper}>
        <Spin indicator={<LoadingOutlined spin />} size={size} style={style} className={styles.spinner} />
      </div>
    </div>
  );
}
