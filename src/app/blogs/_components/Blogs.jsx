'use client';

import React, { useState } from 'react';
import './Blogs.scss';
import { encodeQueryParams, getParameterQuery } from '@/utils/functions';
import { Pagination, message, Spin, Row, Col, Typography, Card, Tag, Rate } from 'antd';
import BlogsApiService from '@/api-services/api/BlogsApiService';
import Image from 'next/image';
import { LoadingOutlined } from '@ant-design/icons';
import MyLink from '@/components/ui/link/MyLink';

const { Meta } = Card;

const ListBlogs = ({ initialDataBlogs }) => {
  const [blogs, setBlogs] = useState(initialDataBlogs.data);
  const [isLoading, setIsLoading] = useState(false);

  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 9;

  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState(initialDataBlogs.total);
  const [selectedTags, setSelectedTags] = useState([]);

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page,
      per_page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    fetchBlogs(page, per_page);
  };

  const fetchBlogs = async (page, per_page) => {
    setIsLoading(true);
    try {
      let result = await BlogsApiService.getAllBlogs(page, per_page);
      if (result && result.code == 0) {
        setBlogs(result.data);
        setTotal(result.total_app);
      }
    } catch (error) {
      message.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTitle = (author, title, date) => {
    return (
      <div className="item-title">
        <div className="item-title-content-blog">{title}</div>
        <div className="item-title-author">
          Author: {author} - {date}
        </div>
      </div>
    );
  };

  const renderTags = (tags) => {
    return (
      <div className="tag">
        <div className="item-tag">
          {tags.map((item, index) => (
            <Tag key={index}>{item}</Tag>
          ))}
        </div>
      </div>
    );
  };

  const handleTagClick = (tag) => {
    setSelectedTags((prevTags) => (prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]));
  };

  const clearFilter = () => {
    setSelectedTags([]);
  };

  const filteredBlogs =
    selectedTags.length > 0 ? blogs.filter((blog) => selectedTags.some((tag) => blog.tags.includes(tag))) : blogs;

  return (
    <Spin spinning={isLoading} indicator={<LoadingOutlined spin />} size="large">
      <div className="container">
        <div className="container-blogs">
          <Row style={{ marginBottom: '30px' }}>
            <Col span={24} className="text-center">
              <Typography.Title level={1} className="primary-color">
                Insights and Inspiration
              </Typography.Title>
            </Col>
            <Col span={24} className="text-center">
              <Typography.Text style={{ fontSize: '38px' }}>
                Get Ahead of Your Competition with Our Trending Statistics
              </Typography.Text>
            </Col>
          </Row>
          <Row gutter={[30, 30]}>
            <Col xs={24} sm={24} md={16} lg={18} className="blog-section">
              <Row gutter={[30, 30]}>
                {filteredBlogs.map((blog) => (
                  <Col xs={24} sm={12} md={8} lg={8} key={blog.slug}>
                    <MyLink href={`/blogs/${blog.slug}`} className="item-title-link">
                      <Card
                        cover={
                          <div className="image-blog">
                            <Image
                              alt="example"
                              src={`https://api-wix.letsmetrix.com` + blog.imagePath}
                              height={200}
                              width={360}
                            />
                          </div>
                        }
                        className="card-blog"
                      >
                        <Meta
                          title={renderTags(blog.tags)}
                          description={renderTitle(
                            blog.author,
                            blog.title,
                            new Date(blog.createdAt).toLocaleDateString('en-GB'),
                          )}
                        />
                      </Card>
                    </MyLink>
                  </Col>
                ))}
              </Row>

              {total > 0 && blogs.length > 9 && (
                <div className="pagination">
                  <Pagination
                    pageSize={numberPage}
                    current={currentPage}
                    onChange={(page, pageSize) => {
                      setCurrentPage(page);
                      setNumberPage(pageSize);
                      onChangePage(page, pageSize);
                    }}
                    total={total}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} blogs`}
                  />
                </div>
              )}
            </Col>

            <Col xs={24} sm={24} md={6} lg={6} className="sidebar-section">
              <div className="sidebar">
                <div className="related-apps">
                  <Typography.Title level={4} className="sidebar-title">
                    Related Apps
                  </Typography.Title>
                  <MyLink href="/app/facebook-multi-pixels" className="related-app-card">
                    <Card className="sidebar-card">
                      <div className="app-info">
                        <Image
                          src="https://cdn.shopify.com/app-store/listing_images/74a0e40319bfc5a6f89d1e2217cf4281/icon/CMmc8emH8_sCEAE=.png"
                          width={100}
                          height={100}
                          alt="icon-app"
                          className="app-icon"
                        />
                        <div className="app-details">
                          <Typography.Text className="app-title">Omega Facebook Pixel Ad Report</Typography.Text>
                          <Rate value={4.9} className="app-rating" disabled={true} />
                          <Typography.Text className="app-reviews">(1k Reviews)</Typography.Text>
                        </div>
                      </div>
                      <Typography.Text className="app-desc">
                        Avoid losing sales by running retargeting ads from your pixel by{' '}
                        <MyLink href="/developer/omegaapps" className="app-dev-link">
                          Omega
                        </MyLink>
                      </Typography.Text>
                    </Card>
                  </MyLink>
                </div>
                <div className="tags-blog">
                  <div className="clear-filter">
                    <Typography.Title level={4} className="sidebar-title">
                      Tags
                    </Typography.Title>
                    {selectedTags.length > 0 && (
                      <button className="clear-button" onClick={clearFilter}>
                        ✖ Clear
                      </button>
                    )}
                  </div>
                  <div className="tag-list">
                    {[...new Set(blogs.flatMap((blog) => blog.tags))].map((tag, index) => (
                      <Tag
                        key={index}
                        className={`sidebar-tag ${selectedTags.includes(tag) ? 'active-tag' : ''}`}
                        onClick={() => handleTagClick(tag)}
                        style={{ cursor: 'pointer' }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
                <div className="contact-blog">
                  <Typography.Title level={4} className="sidebar-title">
                    Need help or have questions?
                  </Typography.Title>
                  <MyLink href="mailto:contact@letsmetrix.com" className="contact-button">
                    Contact Support
                  </MyLink>
                  <Typography.Text className="contact-email">
                    Email: <b>contact@letsmetrix.com</b>
                  </Typography.Text>
                  <div className="social-icons">
                    <MyLink
                      href="https://x.com/letsmetrix"
                      target="_blank"
                      rel="nofollow"
                      className="social-icon icon-twitter"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="24"
                        height="24"
                        viewBox="0 0 30 30"
                      >
                        <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"></path>
                      </svg>
                    </MyLink>
                    <MyLink
                      href="https://www.facebook.com/letsmetrix"
                      target="_blank"
                      rel="nofollow"
                      className="social-icon icon-facebook"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 50 50">
                        <path
                          fill="#555"
                          d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M37,19h-2c-2.14,0-3,0.5-3,2 v3h5l-1,5h-4v15h-5V29h-4v-5h4v-3c0-4,2-7,6-7c2.9,0,4,1,4,1V19z"
                        ></path>
                      </svg>
                    </MyLink>
                    <MyLink
                      href="https://www.youtube.com/@Letsmetrix"
                      target="_blank"
                      rel="nofollow"
                      className="social-icon icon-youtube"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="30"
                        height="30"
                        viewBox="0 0 50 50"
                      >
                        <path
                          fill="#555"
                          d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"
                        ></path>
                      </svg>
                    </MyLink>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};

export default ListBlogs;
