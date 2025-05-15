'use client';

import React from 'react';
import { Rate, List, Tag, Popover, Empty } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import './ReviewItem.scss';
import MyLink from '@/components/ui/link/MyLink';

export default function ReviewItem(props) {
  const renderTag = (label) => {
    return <Tag>{label}</Tag>;
  };

  const content = (item) => {
    return (
      <div style={{ maxWidth: '500px' }}>
        <span style={{ fontWeight: 'bold' }}>Explain</span>: {item.reason}
      </div>
    );
  };

  const handleShowReply = (id) => {
    if (props.showReply.includes(id)) {
      props.setShowReply((prev) => prev.filter((item) => item !== id));
      return;
    }
    props.setShowReply((prev) => [...prev, id]);
  };

  return (
    <List
      itemLayout="vertical"
      dataSource={props.data?.data || []}
      size="large"
      locale={{
        emptyText: <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />,
      }}
      renderItem={(item) => (
        <List.Item
          key={item.title}
          style={{
            backgroundColor: item.is_deleted ? '#ffe6e6' : '',
          }}
        >
          <List.Item.Meta
            title={
              <div className="header-review">
                <div>
                  <MyLink
                    href={`/dashboard/review?nameReviewer=${item.reviewer_name}&reviewer_location=${item.reviewer_location}`}
                    style={{
                      fontWeight: 500,
                      textDecoration: 'underline',
                    }}
                  >
                    {item.reviewer_name}{' '}
                  </MyLink>
                  <span className="label-tag">
                    {item.negative && renderTag('Negative')}
                    {item.positive && renderTag('Positive')}
                    {item.objective && renderTag('Objective')}
                    {item.subjective && renderTag('Subjective')}
                  </span>
                  {item.reason && (
                    <Popover content={() => content(item)} title="">
                      <QuestionCircleOutlined />
                    </Popover>
                  )}
                  {item.is_deleted && (
                    <Tag
                      icon={<DeleteOutlined />}
                      style={{
                        borderRadius: '4px',
                        marginLeft: '10px',
                      }}
                      color="#cd201f"
                    >
                      Deleted
                    </Tag>
                  )}
                </div>

                <span className="lable-star">
                  <Rate disabled={true} style={{ color: '#ffc225', marginRight: '10px' }} value={item.star} />
                  <span className="created-date">
                    <MyLink
                      href={`/dashboard/review?created_at=${item.create_date}`}
                      style={{ textDecoration: 'underline' }}
                    >
                      {item.create_date}{' '}
                    </MyLink>
                  </span>
                </span>
              </div>
            }
          />
          {item.reviewer_name_count && item.reviewer_name_count > 1 && (
            <div className="total">Has {item.reviewer_name_count} other reviews</div>
          )}
          <div className="locale">
            Location:{' '}
            <MyLink href={`/dashboard/review?reviewer_location=${item.reviewer_location}`}>
              {item.reviewer_location}
            </MyLink>
            {item.time_spent_using_app ? ` - ${item.time_spent_using_app}` : ''}
          </div>
          {item.content}
          {item.reply_content && (
            <p className="view-reply" onClick={() => handleShowReply(item.int_id)}>
              {props.showReply.includes(item.int_id) ? 'Hide Reply' : 'Show Reply'}
            </p>
          )}
          <div className={`view-reply-content ${props.showReply.includes(item.int_id) ? 'show' : ''}`}>
            <div className="view-reply-author">
              {props.appName} replied {item.reply_time}
            </div>
            <div>{item.reply_content}</div>
          </div>
        </List.Item>
      )}
    />
  );
}
