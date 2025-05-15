'use client';

import { useEffect, useState } from 'react';
import { MailOutlined } from '@ant-design/icons';
import { Col, Layout, Row, Typography } from 'antd';
import Image from 'next/image';
import styles from './FooterPage.module.scss';
import { linkUnderline, menuLinks } from '@/constants/MenuItem';
import { usePathname } from 'next/navigation';
import MyLink from '@/components/ui/link/MyLink';

const { Footer } = Layout;

const FooterPage = () => {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleLinkClick = (hash) => {
    setCurrentHash(hash);
  };

  return (
    <Footer className={styles.footerContent}>
      <div className={`${styles.footerSasi} container`}>
        <Row gutter={50} className={styles.flexWidth} justify="space-between">
          <Col lg={5} sm={8} xs={16}>
            <Row justify="center" className="image-footer">
              <Typography.Text>Copyright © 2025 Lets Metrix LTD</Typography.Text>
              <Image
                src="/image/footer-sasi.webp"
                style={{ marginTop: '10px', display: 'block' }}
                width={75}
                height={50}
                className="img-fluid"
                alt="Logo"
              />
            </Row>
            <Row
              justify="center"
              gutter={15}
              style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center' }}
            >
              <Col>
                <MyLink href="https://x.com/letsmetrix" target="_blank" rel="nofollow">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 30 30">
                    <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"></path>
                  </svg>
                </MyLink>
              </Col>
              <Col>
                <MyLink href="https://www.youtube.com/@Letsmetrix" target="_blank" rel="nofollow">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
                    <path
                      fill="#FF0000"
                      d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"
                    ></path>
                  </svg>
                </MyLink>
              </Col>
              <Col>
                <MyLink href="https://www.facebook.com/letsmetrix" target="_blank" rel="nofollow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 50 50">
                    <path
                      fill="#1877F2"
                      d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M37,19h-2c-2.14,0-3,0.5-3,2 v3h5l-1,5h-4v15h-5V29h-4v-5h4v-3c0-4,2-7,6-7c2.9,0,4,1,4,1V19z"
                    ></path>
                  </svg>
                </MyLink>
              </Col>
            </Row>
          </Col>
          <Col lg={3} sm={12} xs={12} className={`${styles.menuLink} flex flex-col justify-start link-title`}>
            {menuLinks.map((item, index) => {
              const isActive =
                pathname === item.href || (item.href.startsWith('/#') && `#${item.href.split('#')[1]}` === currentHash);
              return (
                <MyLink
                  key={index}
                  href={item.href}
                  className={`${styles.link} ${styles.textStart}`}
                  style={{
                    color: isActive ? '#805b00' : '#cc9200',
                  }}
                  onClick={() => handleLinkClick(`#${item.href.split('#')[1]}`)}
                >
                  {item.title}
                </MyLink>
              );
            })}
          </Col>
          <Col lg={6} sm={8} xs={24}>
            <div className={styles.footerEmail}>
              <MailOutlined className={styles.footerEmailIcon} />
              <span>
                <MyLink href="mailto:contact@letsmetrix.com">contact@letsmetrix.com</MyLink>
              </span>
            </div>
          </Col>
          {linkUnderline.map((item, index) => (
            <Col key={index} lg={3} sm={8} xs={8} className={styles.footerMobile}>
              <MyLink className={styles.linkUnderline} href={item.href}>
                {item.title}
              </MyLink>
            </Col>
          ))}
        </Row>
      </div>
    </Footer>
  );
};

export default FooterPage;
