'use client';

import { PlusCircleTwoTone } from '@ant-design/icons';
import { Card, message, Modal, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import './ModalSuggestKeywordAI.scss';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import Image from 'next/image';

export default function ModalSuggestKeywordAI(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    props.disableModal();
  };

  const handleCancel = () => {
    props.disableModal();
  };

  const fetchSuggestKeyword = async (id) => {
    setLoading(true);
    try {
      const suggestResponse = await DetailAppApiService.getSuggestKeyword(id);
      if (suggestResponse?.code === 0) {
        const filteredData = suggestResponse.keywords.filter(
          (item) => !props.dataKeywordsShow.some((key) => key.keyword.keyword.toLowerCase() === item.toLowerCase()),
        );
        setData(filteredData);
      } else {
        message.error('Failed to fetch keyword suggest data');
      }
    } catch (error) {
      message.error(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestKeyword(props.appId);
  }, []);

  const addKeyword = async (item) => {
    if (!item || !item.keyword) {
      message.error('Error: Keyword is null or undefined', item);
      return;
    }

    try {
      await props.addKeywordHidden(item.keyword);
      setData((prev) => prev.filter((key) => key !== item.key));
    } catch (error) {
      message.error('API error add keyword:', error);
    }
  };

  const renderSuggestKey = (keys) => {
    return keys.map((item) => {
      return {
        key: item,
        keyword: {
          keyword: item,
          isSuggest: true,
        },
        uniquePageviews: ' ',
        uniqueEvents: ' ',
        conversion_rate: ' ',
        avgTimeOnPage: ' ',
        bounceRate: ' ',
        avgPos: ' ',
        rank: ' ',
        updateTime: ' ',
        action: {
          keyword: item,
          isSuggest: true,
        },
        priority: ' ',
      };
    });
  };

  return (
    <Modal
      width={'72%'}
      title="Suggest Keywords AI"
      visible={true}
      footer={null}
      onOk={handleOk}
      onCancel={handleCancel}
      className="modal-key-suggest-keywords"
      loading={loading}
    >
      <div className="container-suggest-kw">
        <div className="card-container">
          {renderSuggestKey(data).map((item) => (
            <Card
              key={item.key}
              className="keyword-card"
              title={
                <Tooltip title="Keyword obtained from AI bot">
                  <span style={{ color: '#5cbdb9' }}>
                    {item.keyword.keyword}
                    <Image src="/image/icon-ai.webp" alt="" width={20} height={20} style={{ marginLeft: '5px' }} />
                  </span>
                </Tooltip>
              }
              extra={
                <div onClick={() => item && item.keyword && addKeyword(item)}>
                  <PlusCircleTwoTone style={{ fontSize: 18, cursor: 'pointer' }} />
                </div>
              }
            ></Card>
          ))}
        </div>
      </div>
    </Modal>
  );
}
