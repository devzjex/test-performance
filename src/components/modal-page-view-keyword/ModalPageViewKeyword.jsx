import { Table, message, Modal, Tooltip, Spin } from 'antd';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import React, { useEffect, useRef, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

export default function ModalPageViewKeyword(props) {
  const fromDate = useRef(props.fromDate);
  const toDate = useRef(props.toDate);
  const [dataKeyPageViewEvent, setDataKeyPageViewEvent] = useState([]);
  const [loading, setLoading] = useState(false);
  const host_id = props.appId;
  const keyword = props.keywordName;

  const asyncFetch = async (id, fromDate, toDate) => {
    setLoading(true);
    try {
      const dataPViewEvent = await DetailAppApiService.getPageViewKeywordChangeByLang(
        id,
        keyword,
        'uk',
        fromDate,
        toDate,
        host_id === id ? '' : id,
      );
      if (dataPViewEvent.code === 0) {
        const groupedData = groupAndSumData(dataPViewEvent.data);
        setDataKeyPageViewEvent(groupedData);
      }
    } catch (error) {
      message.error('Unable to get data unique page view.', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    asyncFetch(host_id, fromDate.current, toDate.current);
  }, []);

  // Hàm nhóm và tính tổng các trường cho search_type = "search" và "search_ad"
  const groupAndSumData = (data) => {
    const searchData = data.filter((item) => item.keywords.search_type === 'search');
    const searchAdData = data.filter((item) => item.keywords.search_type === 'search_ad');

    const summedSearchData = calculateSumAndAverage(searchData);
    const summedSearchAdData = calculateSumAndAverage(searchAdData);

    const result = [];
    if (searchData.length > 0) result.push({ _id: 'search', keywords: summedSearchData });
    if (searchAdData.length > 0) result.push({ _id: 'search_ad', keywords: summedSearchAdData });

    return result;
  };

  // Hàm tính tổng và trung bình cho các trường
  const calculateSumAndAverage = (data) => {
    const totalCount = data.length;

    if (totalCount === 0) {
      return {
        avgPos: 0,
        avgTimeOnPage: 0,
        bounceRate: 0,
        event_count_addbutton: 0,
        newUsers: 0,
        pageviews: 0,
        totalEvents: 0,
        uniqueEvents: 0,
        uniquePageviews: 0,
        users: 0,
      };
    }

    const summedData = data.reduce(
      (acc, item) => {
        acc.avgPos += item.keywords.avgPos;
        acc.avgTimeOnPage += item.keywords.avgTimeOnPage;
        acc.bounceRate += item.keywords.bounceRate;
        acc.event_count_addbutton += item.keywords.event_count_addbutton;
        acc.newUsers += item.keywords.newUsers;
        acc.pageviews += item.keywords.pageviews;
        acc.totalEvents += item.keywords.totalEvents;
        acc.uniqueEvents += item.keywords.uniqueEvents;
        acc.uniquePageviews += item.keywords.uniquePageviews;
        acc.users += item.keywords.users;
        return acc;
      },
      {
        avgPos: 0,
        avgTimeOnPage: 0,
        bounceRate: 0,
        event_count_addbutton: 0,
        newUsers: 0,
        pageviews: 0,
        totalEvents: 0,
        uniqueEvents: 0,
        uniquePageviews: 0,
        users: 0,
      },
    );

    summedData.avgPos = summedData.avgPos / totalCount;
    summedData.bounceRate = summedData.bounceRate / totalCount;

    return summedData;
  };

  const columns = [
    {
      title: 'Keyword',
      dataIndex: 'keyword',
      key: 'keyword',
      width: 150,
    },
    {
      title: 'Search Type',
      dataIndex: 'search_type',
      key: 'search_type',
      width: 120,
    },
    {
      title: <Tooltip title="Unique Events">U.Events</Tooltip>,
      dataIndex: 'uniqueEvents',
      key: 'uniqueEvents',
      width: 100,
    },
    {
      title: <Tooltip title="Unique Pageviews">U.Pviews</Tooltip>,
      dataIndex: 'uniquePageviews',
      key: 'uniquePageviews',
      width: 100,
    },
    {
      title: <Tooltip title="Average Position">Avg Position</Tooltip>,
      dataIndex: 'avgPos',
      key: 'avgPos',
      render: (text) => parseFloat(text).toFixed(2),
      width: 120,
    },
    {
      title: <Tooltip title="Average Time on Page">Avg.ToP</Tooltip>,
      dataIndex: 'avgTimeOnPage',
      key: 'avgTimeOnPage',
      width: 120,
    },
    {
      title: <Tooltip title="Bounce Rate">%Bounce</Tooltip>,
      dataIndex: 'bounceRate',
      key: 'bounceRate',
      render: (text) => <>{`${parseFloat(text).toFixed(2)}%`}</>,
      width: 120,
    },
    {
      title: <Tooltip title="Event Count (Add Button)">E.Count</Tooltip>,
      dataIndex: 'event_count_addbutton',
      key: 'event_count_addbutton',
      width: 70,
    },
    {
      title: <Tooltip title="New Users">N.Users</Tooltip>,
      dataIndex: 'newUsers',
      key: 'newUsers',
      width: 70,
    },
    {
      title: <Tooltip title="Pageviews">P.Views</Tooltip>,
      dataIndex: 'pageviews',
      key: 'pageviews',
      width: 70,
    },
    {
      title: <Tooltip title="Total Events">T.Events</Tooltip>,
      dataIndex: 'totalEvents',
      key: 'totalEvents',
      width: 70,
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      width: 70,
    },
  ];

  const renderData = () => {
    const tableData = dataKeyPageViewEvent.map((item) => {
      return {
        keyword: keyword,
        search_type: item._id.includes('search_ad') ? 'search_ad' : 'search',
        avgPos: item.keywords.avgPos,
        avgTimeOnPage: item.keywords.avgTimeOnPage,
        bounceRate: item.keywords.bounceRate,
        event_count_addbutton: item.keywords.event_count_addbutton,
        newUsers: item.keywords.newUsers,
        pageviews: item.keywords.pageviews,
        totalEvents: item.keywords.totalEvents,
        uniqueEvents: item.keywords.uniqueEvents,
        uniquePageviews: item.keywords.uniquePageviews,
        users: item.keywords.users,
      };
    });

    return (
      <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
        <Table dataSource={tableData} columns={columns} pagination={false} loading={false} />
      </Spin>
    );
  };

  return (
    <Modal
      width={'80%'}
      title={props.isPViewText ? 'Detail Unique Page Views keyword' : 'Detail Unique Events keyword'}
      visible={true}
      footer={null}
      onOk={() => props.disableModal()}
      onCancel={() => props.disableModal()}
    >
      <div className="popup-detail-position">{renderData()}</div>
    </Modal>
  );
}
