'use client';

import React, { useState } from 'react';
import { Typography, Card, Breadcrumb } from 'antd';
import { motion } from 'framer-motion';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import styles from './DescriptionContent.module.scss';

const { Paragraph } = Typography;

export default function DescriptionContent({ text, dataText, maxLength = 600 }) {
  const [expanded, setExpanded] = useState(false);

  const formattedText = text && text.replace(/\\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  const isLongText = formattedText && formattedText.length > maxLength;
  const displayText = expanded || !isLongText ? formattedText : formattedText.slice(0, maxLength) + '....';

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
                href: '/categories',
                title: <span>Categories</span>,
              },
              {
                title: <span>{dataText && dataText.data && dataText.data.text ? dataText.data.text : ''}</span>,
              },
            ]}
            separator={<RightOutlined />}
          />
        </div>
      </div>

      {text ? (
        <Card className={styles.descriptionCard}>
          <motion.div
            initial={{ height: 160, opacity: 1 }}
            animate={{ height: expanded ? 'auto' : 160, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className={`${styles.descriptionContent} container`}
          >
            <h1 className={styles.title}>
              Top {dataText && dataText.data && dataText.data.text ? dataText.data.text : ''} apps
            </h1>
            <Paragraph className={styles.descriptionText}>{displayText}</Paragraph>
          </motion.div>

          {isLongText && text && (
            <div className="container">
              <span onClick={() => setExpanded(!expanded)} className={styles.readMore}>
                {expanded ? 'Read Less' : 'Read More'}
              </span>
            </div>
          )}
        </Card>
      ) : (
        <div className={`${styles.descHeader} container`}>
          <h1 className={styles.title}>
            Top {dataText && dataText.data && dataText.data.text ? dataText.data.text : ''} apps
          </h1>
        </div>
      )}
    </>
  );
}
