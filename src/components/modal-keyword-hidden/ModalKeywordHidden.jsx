'use client';

import { Avatar, message, Modal, Progress, Table, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import './ModalKeywordHidden.scss';
import { UpOutlined, DownOutlined, PlusCircleTwoTone, QuestionCircleOutlined } from '@ant-design/icons';
import Image from 'next/image';
import dayjs from 'dayjs';
import { renderDifficulty, scoreCalculate } from '@/utils/functions';
import MyLink from '../ui/link/MyLink';

export default function ModalKeywordHidden(props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1800) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const handleOk = () => {
    props.disableModal();
  };

  const handleCancel = () => {
    props.disableModal();
  };

  const columnsKeyword = [
    {
      title: 'Keywords',
      dataIndex: 'keyword',
      width: 200,
      render: (item) => (
        <>
          {item.isSuggest ? (
            <Tooltip title="Keyword obtained from AI bot">
              <span style={{ color: '#5cbdb9' }}>
                {item.keyword}
                <Image src="/image/icon-ai.webp" alt="" width={20} height={20} style={{ marginLeft: '5px' }} />
              </span>
            </Tooltip>
          ) : (
            <MyLink href={'/key/' + item.keyword_slug}>{item.keyword}</MyLink>
          )}
        </>
      ),
    },
    {
      title: 'Top 5 apps',
      dataIndex: 'rank',
      width: 180,
      render: (item) => (
        <Avatar.Group>
          {item.top_5_apps && item.top_5_apps.length > 0
            ? item.top_5_apps.map((item, index) => (
                <Tooltip key={index} title={item.app_name} placement="top">
                  <a href={`${item.app_id}`}>
                    <Avatar
                      style={{
                        cursor: 'pointer',
                        margin: '0 1px',
                        border: item.app_id === props.appId ? '2px solid #ff9900' : '1px solid white',
                        boxShadow: item.app_id === props.appId ? '0 0 10px rgba(255, 0, 0, 1)' : 'none',
                      }}
                      src={item.app_icon}
                    />
                  </a>
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
      dataIndex: 'rank',
      width: 160,
      render: (item) => (
        <div className="flex items-center">
          {item.total_apps ? (
            <>
              <Tooltip title={`${item.total_apps} results`}>
                <Tag className="difficult-tag" color={renderDifficulty(item.total_apps).color}>
                  {scoreCalculate(item.total_apps)}
                </Tag>
              </Tooltip>
              <Tooltip title={renderDifficulty(item.total_apps).difficulty}>
                <Progress
                  percent={(item.total_apps / 900) * 100}
                  strokeColor={renderDifficulty(item.total_apps).color}
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
      title: <Tooltip title="App Ranking Position">Position</Tooltip>,
      dataIndex: 'rank',
      sorter: (a, b) => sorterColumn(a.rank.rank, b.rank.rank),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
      width: 110,
      render: (item) => (
        <>
          <div className="detail-position">
            {item.rank}
            {item.before_rank && item.rank && item.before_rank - item.rank > 0 ? (
              <span className="calular-incre">
                <UpOutlined /> {item.before_rank - item.rank}{' '}
              </span>
            ) : (
              ''
            )}
            {item.before_rank && item.rank && item.before_rank - item.rank < 0 ? (
              <span className="calular-decre">
                <DownOutlined /> {item.rank - item.before_rank}{' '}
              </span>
            ) : (
              ''
            )}
          </div>
        </>
      ),
    },
    {
      title: <Tooltip title="Unique Pageviews">U.Pviews</Tooltip>,
      dataIndex: 'uniquePageviews',
      sorter: (a, b) => sorterColumn(a.uniquePageviews, b.uniquePageviews),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
      width: 100,
    },
    {
      title: <Tooltip title="Unique Events">U.Events</Tooltip>,
      dataIndex: 'uniqueEvents',
      sorter: (a, b) => sorterColumn(a.uniqueEvents, b.uniqueEvents),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
      width: 100,
    },
    // {
    //   title: <Tooltip title="Average Time on Page">Avg.ToP</Tooltip>,
    //   dataIndex: 'avgTimeOnPage',
    //   sorter: (a, b) => sorterColumnTime(a.avgTimeOnPage, b.avgTimeOnPage),
    //   sortDirections: ['descend', 'ascend'],
    //   showSorterTooltip: false,
    //   width: 100,
    // },
    // {
    //   title: <Tooltip title="Bounce Rate">%Bounce</Tooltip>,
    //   dataIndex: 'bounceRate',
    //   sorter: (a, b) => sorterColumnBounce(a.bounceRate, b.bounceRate),
    //   sortDirections: ['descend', 'ascend'],
    //   showSorterTooltip: false,
    //   width: 100,
    // },
    {
      title: <Tooltip title="Average Position">Avg.Pos</Tooltip>,
      dataIndex: 'avgPos',
      sorter: (a, b) => sorterColumn(a.avgPos, b.avgPos),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
      width: 100,
    },
    {
      title: '',
      dataIndex: 'action',
      render: (item) => (
        <div className="action-popup-keyword">
          <div className="add-keyword" onClick={() => addKeywordGA(item)}>
            <PlusCircleTwoTone />
          </div>
        </div>
      ),
      width: 100,
    },
  ];

  const sorterColumn = (a, b) => {
    if (a === ' ') {
      a = 0;
    }
    if (b === ' ') {
      b = 0;
    }
    return a - b;
  };

  const addKeywordGA = async (item) => {
    if (!item || !item.keyword) {
      message.error('Error: Keyword is null or undefined', item);
      return;
    }

    try {
      await props.addKeywordHidden(item);
    } catch (error) {
      message.error('API error add keyword:', error);
    }
  };

  const dataKeywordsHidden = (keywordPosition) => {
    const data = [];
    keywordPosition &&
      keywordPosition.map((item, index) => {
        if (!item.show) {
          data.push({
            key: index,
            keyword: item,
            uniquePageviews:
              item.ga_keyword && (item.ga_keyword.uniquePageviews || item.ga_keyword.uniquePageviews === 0)
                ? item.ga_keyword.uniquePageviews
                : ' ',
            uniqueEvents:
              item.ga_keyword && (item.ga_keyword.uniqueEvents || item.ga_keyword.uniqueEvents === 0)
                ? item.ga_keyword.uniqueEvents
                : ' ',
            conversion_rate:
              item.ga_keyword && item.ga_keyword.uniquePageviews
                ? parseFloat((item.ga_keyword.uniqueEvents * 100) / item.ga_keyword.uniquePageviews).toFixed(2)
                : ' ',
            avgTimeOnPage:
              item.ga_keyword && (item.ga_keyword.avgTimeOnPage || item.ga_keyword.avgTimeOnPage === 0)
                ? dayjs(item.ga_keyword.avgTimeOnPage * 1000).format('mm:ss')
                : ' ',
            bounceRate:
              item.ga_keyword && (item.ga_keyword.bounceRate || item.ga_keyword.bounceRate === 0)
                ? item.ga_keyword.bounceRate.toFixed(2) + '%'
                : ' ',
            avgPos:
              item.ga_keyword && (item.ga_keyword.avgPos || item.ga_keyword.avgPos === 0)
                ? item.ga_keyword.avgPos.toFixed(2)
                : ' ',
            rank: item,
            updateTime: item,
            action: item,
            priority: item.priority,
          });
        }
      });
    return data;
  };

  return (
    <Modal
      width={isMobile ? '100%' : '72%'}
      title="Merchants also search"
      visible={true}
      footer={null}
      onOk={handleOk}
      onCancel={handleCancel}
      className="modal-key"
    >
      <div className="popup-add-competitor">
        <div className="list-key-hidden">
          <Table
            columns={columnsKeyword}
            dataSource={dataKeywordsHidden(props.keywordPosition)}
            pagination={false}
            scroll={{ y: 500, x: 991 }}
          />
        </div>
      </div>
    </Modal>
  );
}
