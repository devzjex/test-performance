'use client';

import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import { LoadingOutlined, PlusCircleTwoTone, QuestionCircleOutlined } from '@ant-design/icons';
import { Avatar, message, Modal, Progress, Spin, Table, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import './ModalKeywordFrequency.scss';
import { renderDifficulty, scoreCalculate } from '@/utils/functions';
import MyLink from '../ui/link/MyLink';

export default function ModalKeywordFrequency(props) {
  const [keywordFrequencyData, setKeywordFrequencyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const fetchDaTaKeywordFrequency = async (id) => {
    setLoading(true);
    try {
      const frequencyResponse = await DetailAppApiService.fetchKeywordFrequency(id);
      if (frequencyResponse?.code === 0) {
        setKeywordFrequencyData(frequencyResponse.data);
      } else {
        message.error('Failed to fetch keyword frequency data');
      }
    } catch (error) {
      message.error(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaTaKeywordFrequency(props.appId);
  }, []);

  const addKeywordGA = async (item) => {
    if (!item || !item.keyword) {
      message.error('Error: Keyword is null or undefined', item);
      return;
    }

    try {
      await props.addKeywordHidden(item);
      setKeywordFrequencyData((prev) => [...prev, item.keyword]);
    } catch (error) {
      message.error('API error add keyword:', error);
    }
  };

  const handleCellClick = (value, record, column) => {
    const keyword = record.keyword;
    let content;

    const renderCountContent = (content) => {
      return `
        <div>
          <div><h3>App Detail</h3><p>${content.app_details}</p></div>
          <div><h3>App Intro</h3><p>${content.app_introduction}</p></div>
          <div><h3>App Name</h3><p>${content.name}</p></div>
          <div><h3>Integrations</h3><p>${content.integrations.join(' ').replace(/\s+/g, ', ')}</p></div>
          <div><h3>Tagline</h3><p>${content.tagline}</p></div>
          <div><h3>Features</h3><ul>${content.features.map((item) => `<li>${item.title}</li>`).join('')}</ul></div>
          <div><h3>Meta Description</h3><p>${content.metadesc}</p></div>
          <div><h3>Meta Title</h3><p>${content.metatitle}</p></div>
          <div><h3>Pricing Description</h3><ul>${content.pricing_plan
            .map((item) => `<li>${item.desc}</li>`)
            .join('')}</ul></div>
        </div>
      `;
    };

    if (column === 'count') {
      content = renderCountContent(props.detailApp);
    } else {
      content = props.detailApp?.[column];
    }

    const contentMapping = {
      tagline: (content) => `<div><h3>Tagline</h3><p>${content}</p></div>`,
      app_introduction: (content) => `<div><h3>App Introduction</h3><p>${content}</p></div>`,
      name: (content) => `<div><h3>App Name</h3><p>${content}</p></div>`,
      app_details: (content) => `<div><h3>App Detail</h3><p>${content}</p></div>`,
      metatitle: (content) => `<div><h3>Meta Title</h3><p>${content}</p></div>`,
      metadesc: (content) => `<div><h3>Meta Description</h3><p>${content}</p></div>`,
      integrations: (content) => `<div><h3>Integrations</h3><p>${content.join(' ').replace(/\s+/g, ', ')}</p></div>`,
      features: (content) =>
        `<div><h3>Features</h3><ul>${content.map((item) => `<li>${item.title}</li>`).join('')}</ul></div>`,
      pricing_plan: (content) =>
        `<div><h3>Pricing Description</h3><ul>${content.map((item) => `<li>${item.desc}</li>`).join('')}</ul></div>`,
    };

    const formatContent = (column, content) => {
      return contentMapping[column] ? contentMapping[column](content) : content;
    };

    content = formatContent(column, content);

    if (content && typeof content === 'string') {
      const count = (content.match(new RegExp(keyword, 'gi')) || []).length;
      const highlightedContent = content.replace(
        new RegExp(`(${keyword})`, 'gi'),
        '<span class="highlight-keyword">$1</span>',
      );

      setSelectedDetail({ detail: highlightedContent, keyword, count });
    } else {
      message.error(`No content found for column: ${column}`);
    }
  };

  const columnsKeywordFrequency = [
    {
      title: <Tooltip title="Keyword">Keyword</Tooltip>,
      dataIndex: 'keyword',
      render: (keyword) => <span className="kw-frequency">{keyword}</span>,
      width: 150,
    },
    {
      title: 'Top 5 apps',
      dataIndex: 'top_5_apps',
      width: 180,
      render: (item) => (
        <Avatar.Group>
          {item && item.length > 0
            ? item.map((item, index) => (
                <Tooltip key={index} title={item.app_name} placement="top">
                  <MyLink href={`${item.app_id}`}>
                    <Avatar
                      style={{
                        cursor: 'pointer',
                        margin: '0 1px',
                        border: item.app_id === props.appId ? '2px solid #ff9900' : '1px solid white',
                        boxShadow: item.app_id === props.appId ? '0 0 10px rgba(255, 0, 0, 1)' : 'none',
                      }}
                      src={item.app_icon}
                    />
                  </MyLink>
                </Tooltip>
              ))
            : ' '}
        </Avatar.Group>
      ),
    },
    {
      title: (
        <Tooltip title="Based on total search results">
          Difficulty <QuestionCircleOutlined style={{ color: '#90', marginLeft: '3px' }} />
        </Tooltip>
      ),
      dataIndex: 'total_apps',
      width: 160,
      render: (item) => (
        <div className="flex items-center">
          {item ? (
            <>
              <Tooltip title={`${item} results`}>
                <Tag className="difficult-tag" color={renderDifficulty(item).color}>
                  {scoreCalculate(item)}
                </Tag>
              </Tooltip>
              <Tooltip title={renderDifficulty(item).difficulty}>
                <Progress
                  percent={(item / 900) * 100}
                  strokeColor={renderDifficulty(item).color}
                  showInfo={false}
                  trailColor="#ccc"
                  className="difficulty"
                />
              </Tooltip>
            </>
          ) : (
            ' '
          )}
        </div>
      ),
    },
    {
      title: <Tooltip title="Total Count">TC</Tooltip>,
      dataIndex: 'count',
      render: (count, record) => (
        <span onClick={() => handleCellClick(count, record, 'count')} className="value-keyword-frequency">
          {count}
        </span>
      ),
      width: 80,
    },
    {
      title: <Tooltip title="App Detail">AD</Tooltip>,
      dataIndex: 'details',
      render: (details, record) => (
        <span
          onClick={() => handleCellClick(details?.app_detail, record, 'app_details')}
          className="value-keyword-frequency"
        >
          {details?.app_detail || ''}
        </span>
      ),
      width: 80,
    },
    {
      title: <Tooltip title="App Introduction">A.Intro</Tooltip>,
      dataIndex: 'details',
      render: (details, record) => (
        <span
          onClick={() => handleCellClick(details?.app_introduction, record, 'app_introduction')}
          className="value-keyword-frequency"
        >
          {details?.app_introduction || ''}
        </span>
      ),
      width: 80,
    },
    {
      title: <Tooltip title="App Name">AN</Tooltip>,
      dataIndex: 'details',
      render: (details, record) => (
        <span onClick={() => handleCellClick(details?.app_name, record, 'name')} className="value-keyword-frequency">
          {details?.app_name || ''}
        </span>
      ),
      width: 80,
    },
    {
      title: <Tooltip title="Integrations">Integra</Tooltip>,
      dataIndex: 'details',
      render: (details, record) => (
        <span
          onClick={() => handleCellClick(details?.integrations, record, 'integrations')}
          className="value-keyword-frequency"
        >
          {details?.integrations || ''}
        </span>
      ),
      width: 80,
    },
    {
      title: <Tooltip title="Tagline">Tagline</Tooltip>,
      dataIndex: 'details',
      render: (details, record) => (
        <span onClick={() => handleCellClick(details?.tagline, record, 'tagline')} className="value-keyword-frequency">
          {details?.tagline || ''}
        </span>
      ),
      width: 80,
    },
    {
      title: <Tooltip title="Features">Feat</Tooltip>,
      dataIndex: 'details',
      render: (details, record) => (
        <span
          onClick={() => handleCellClick(details?.features, record, 'features')}
          className="value-keyword-frequency"
        >
          {details?.features || ''}
        </span>
      ),
      width: 80,
    },
    {
      title: <Tooltip title="Meta Description">MD</Tooltip>,
      dataIndex: 'details',
      render: (details, record) => (
        <span
          onClick={() => handleCellClick(details?.metadesc, record, 'metadesc')}
          className="value-keyword-frequency"
        >
          {details?.metadesc || ''}
        </span>
      ),
      width: 80,
    },
    {
      title: <Tooltip title="Meta Title">MT</Tooltip>,
      dataIndex: 'details',
      render: (details, record) => (
        <span
          onClick={() => handleCellClick(details?.metatitle, record, 'metatitle')}
          className="value-keyword-frequency"
        >
          {details?.metatitle || ''}
        </span>
      ),
      width: 80,
    },
    {
      title: <Tooltip title="Pricing Description">PD</Tooltip>,
      dataIndex: 'details',
      render: (details, record) => (
        <span
          onClick={() => handleCellClick(details?.pricing_desc, record, 'pricing_plan')}
          className="value-keyword-frequency"
        >
          {details?.pricing_desc || ''}
        </span>
      ),
      width: 80,
    },
    {
      title: '',
      dataIndex: 'action',
      render: (item, record) => {
        const keywordExists = props.dataKeywordsShow.some((key) => key.keyword.keyword === record.keyword);
        return (
          <div className="action-keyword-frequency">
            <Tooltip title={keywordExists ? 'This keyword has been added app' : ''}>
              <div
                className="add-keyword-frequency"
                onClick={() => {
                  if (!keywordExists) {
                    addKeywordGA(record);
                  }
                }}
                style={{ cursor: keywordExists ? 'not-allowed' : 'pointer' }}
              >
                <PlusCircleTwoTone />
              </div>
            </Tooltip>
          </div>
        );
      },
      width: 50,
    },
  ];

  return (
    <Modal
      width={'75%'}
      title="Keyword Frequency"
      visible={true}
      footer={null}
      onOk={() => props.disableModal()}
      onCancel={() => props.disableModal()}
      className="modal-key-frequency"
    >
      <div className="list-key-frequency">
        <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
          <Table
            columns={columnsKeywordFrequency}
            dataSource={keywordFrequencyData}
            pagination={false}
            scroll={{ y: 500, x: 991 }}
            loading={false}
          />
        </Spin>
      </div>

      {selectedDetail && (
        <Modal
          title={`Keyword Frequency: ${selectedDetail.keyword}`}
          visible={true}
          footer={null}
          onOk={() => setSelectedDetail(null)}
          onCancel={() => setSelectedDetail(null)}
          className="modal-detail-value"
        >
          <div dangerouslySetInnerHTML={{ __html: selectedDetail.detail }} />
        </Modal>
      )}
    </Modal>
  );
}
