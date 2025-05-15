'use client';

import { useState, useEffect } from 'react';
import { Breadcrumb, Carousel, Typography } from 'antd';
import './BlogDetail.scss';
import ItemSlider from './item-slider/ItemSlider';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import MyLink from '@/components/ui/link/MyLink';

function BlogDetail({ initialDetailBlog, initialRecentBlog }) {
  const blogDetail = {
    title: initialDetailBlog.title,
    date: initialDetailBlog.date,
    content: initialDetailBlog.content,
    author: initialDetailBlog.author,
    imgUrl: initialDetailBlog.imgUrl,
  };
  const recentBlogs = initialRecentBlog.recentBlogs;

  const [headings, setHeadings] = useState([]);
  const [activeHeadingId, setActiveHeadingId] = useState(null);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const extractHeadings = (content) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const headings = Array.from(doc.querySelectorAll('h2')).map((h2, index) => ({
        text: h2.textContent,
        id: `post-h2-${index + 1}`,
      }));
      return headings;
    };

    const headings = extractHeadings(blogDetail.content);
    setHeadings(headings);
  }, [blogDetail.content]);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / totalHeight) * 100;

    if (scrollPercentage > 15) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  };

  const debouncedHandleScroll = debounce(handleScroll, 200);

  useEffect(() => {
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, []);

  const customDiv = (html) => {
    const htmlContent = html.replace(/<img /g, '<img loading="lazy" ');
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>;
  };

  const myDate = new Date(blogDetail.date);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
      setActiveHeadingId(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const headingsInViewport = headings.filter((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= window.innerHeight && rect.bottom >= 0;
        }
        return false;
      });

      if (headingsInViewport.length > 0) {
        setActiveHeadingId(headingsInViewport[0].id);
      }
    };

    const debouncedHandleScroll = debounce(handleScroll, 200);

    window.addEventListener('scroll', debouncedHandleScroll);

    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, [headings]);

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
                href: '/blogs',
                title: <span>Blogs</span>,
              },
              {
                title: <span>{blogDetail.title}</span>,
              },
            ]}
            separator={<RightOutlined />}
          />
        </div>
      </div>
      <div className="container-blog container">
        <div className="content-blog">
          <div className="blog-detail">
            <h1>{blogDetail.title}</h1>
            <div className="blog-meta">
              <i>Author:</i> <strong>{blogDetail.author}</strong> | <i>Created Date:</i>{' '}
              {myDate.toLocaleDateString('en-GB')}
            </div>
            <div className="content">{customDiv(blogDetail.content)}</div>
          </div>
          <div className="sidebar">
            <div className="table-of-contents">
              <Typography.Title level={4}>Table of Contents</Typography.Title>
              <ul>
                {headings.map((heading, index) => (
                  <li key={heading.id} className={activeHeadingId === heading.id ? 'active' : ''}>
                    <MyLink
                      href={`#${heading.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToHeading(heading.id);
                      }}
                    >
                      <span className="index-text">{index + 1}</span>
                      <span>{heading.text}</span>
                    </MyLink>
                  </li>
                ))}
              </ul>
            </div>
            {!isHidden && (
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
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 30 30">
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
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
                      <path
                        fill="#555"
                        d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"
                      ></path>
                    </svg>
                  </MyLink>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="widget-area container">
          <Typography.Title level={2} className="primary-color">
            Recent Posts
          </Typography.Title>
          <Carousel
            dots={true}
            slidesToShow={4}
            slidesToScroll={1}
            infinite
            arrows
            autoplay
            responsive={[
              {
                breakpoint: 1700,
                settings: {
                  slidesToShow: 3,
                },
              },
              {
                breakpoint: 1340,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: 998,
                settings: {
                  slidesToShow: 1,
                },
              },
            ]}
          >
            {recentBlogs.map((blog) => (
              <div key={blog.slug}>
                <ItemSlider blog={blog} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </>
  );
}
export default BlogDetail;
