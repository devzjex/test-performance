'use client';

import React from 'react';
import { Card, Row, Col, Tooltip, Badge } from 'antd';
import './OurPartnerList.scss';
import Image from 'next/image';
import { StarFilled, UsergroupAddOutlined } from '@ant-design/icons';
import MyLink from '@/components/ui/link/MyLink';

const { Meta } = Card;

const partners = [
  {
    apps: [
      {
        detail: {
          app_id: 'facebook-multi-pixels',
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/74a0e40319bfc5a6f89d1e2217cf4281/icon/CMmc8emH8_sCEAE=.png',
          name: 'Omega Facebook Pixel Meta Feed',
          built_for_shopify: true,
        },
      },
      {
        detail: {
          app_id: 'facebook-chat-1',
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/4d5c4e1411c21a7e51df4f06eed328b9/icon/CJjx3KjMpowDEAE=.png',
          name: 'O: WhatsApp Chat, Contact Form',
          built_for_shopify: true,
        },
      },
      {
        detail: {
          app_id: 'tiktok-multi-pixels',
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/ba6b98a6f0321c296c7d9a18edecbfd1/icon/COyHmMfQrYoDEAE=.png',
          name: 'TikShop: Omega Pixel & Catalog',
          built_for_shopify: true,
        },
      },
      {
        detail: {
          app_id: 'twitter-multi-pixels',
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/6e4df4bbba65c31b8086b1c1f13746c0/icon/CK_Qte-N6IIDEAE=.png',
          name: 'Omega Twitter Pixel,Conversion',
          built_for_shopify: true,
        },
      },
      {
        detail: {
          app_id: 'pinterest-multi-pixels',
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/63426c3192e8bf64b5aa5660f3eda9a9/icon/CIXW2vGN6IIDEAE=.png',
          name: 'Omega ‑ Multi Pinterest Pixels',
          built_for_shopify: true,
        },
      },
      {
        detail: {
          app_id: 'omega-multi-snapchat-pixels',
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/cb750df4030cd0b2de17012b1dcf8acb/icon/CInRnPON6IIDEAE=.png',
          name: 'Omega ‑ Multi Snapchat Pixels',
          built_for_shopify: true,
        },
      },
      {
        detail: {
          app_id: 'facebook-events-by-omega',
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/231462bfe60455f8303cdd1b19e0000a/icon/CN2oiJnXlP4CEAE=.png',
          name: 'Omega Event Calendar',
          built_for_shopify: false,
        },
      },
      {
        detail: {
          app_id: 'our-team-by-omega',
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/699064d3834e653ca1c7c0dc705a2bf7/icon/CPGIhc30lu8CEAE=.png',
          name: 'Omega Team Showcase',
          built_for_shopify: false,
        },
      },
    ],
    avg_star: 4.7,
    id: 'omegaapps',
    name: 'Omega',
    review_count: 2994,
  },
  {
    apps: [
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/61e38414699017d5eb5658fa4a9df17d/icon/CM26s5Hfpf4CEAE=.png',
          app_id: 'request-for-quote-by-omega',
          name: 'O:Request a Quote ‑ Hide Price',
          built_for_shopify: true,
        },
      },
    ],
    avg_star: 4.9,
    id: 'quote-snap',
    name: 'Quote Snap',
    review_count: 654,
  },
  {
    apps: [
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/59855db23a211ce9ce602feeb5b798c3/icon/CILe7eaCuIgDEAE=.png',
          app_id: 'synctrack',
          name: 'Synctrack PayPal Tracking Sync',
          built_for_shopify: true,
        },
      },
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/c8b114a1e7f36661cad123dac2c63dce/icon/COCSidLCt4gDEAE=.png',
          app_id: 'omega-estimated-shipping-date',
          name: 'S: Estimated Delivery Date ETA',
          built_for_shopify: true,
        },
      },
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/dca43d86b7e76de55d3cfefd415e3931/icon/CNuX2f7Ct4gDEAE=.png',
          app_id: 'omega-order-tracking',
          name: 'Synctrack Order Tracking',
          built_for_shopify: true,
        },
      },
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/6aabf8f0561b8b4989e4ecab397df34b/icon/COaJ8dnct4gDEAE=.png',
          app_id: 'omega-returns-drive',
          name: 'Synctrack: Returns & Exchanges',
          built_for_shopify: true,
        },
      },
    ],
    avg_star: 4.8,
    id: 'synctrack',
    name: 'Synctrack',
    review_count: 1671,
  },
  {
    apps: [
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/1fea2c06cad29a7a2ff47ed9c5b1b5cc/icon/CKv3zsyr-vcCEAE=.png',
          app_id: 'blockify',
          name: 'Blockify Fraud Filter, Blocker',
          built_for_shopify: true,
        },
      },
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/e03e0948951b94a7b424d1a55634d891/icon/CNe60o2awokDEAE=.png',
          app_id: 'blockify-age-verification',
          name: 'Blockify Age Verification 18+',
          built_for_shopify: true,
        },
      },
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/ea2ade25c2da95bcb2e4e80b473ec410/icon/COr3pu3RvIcDEAE=.png',
          app_id: 'blockify-checkout-rules',
          name: 'Blockify Checkout Rules & COD',
          built_for_shopify: true,
        },
      },
    ],
    avg_star: 4.9,
    id: 'blockify',
    name: 'Blockify',
    review_count: 914,
  },
  {
    apps: [
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/8086a640c26b0f1a50682c9334730f58/icon/CMe6452x0IgDEAE=.png',
          app_id: 'trustify',
          name: 'Trustify: Review & Testimonial',
          built_for_shopify: true,
        },
      },
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/21878ca913d14238051e5aa44b58942e/icon/CMyMoozOt4kDEAE=.png',
          app_id: 'google-reviews-importer',
          name: 'Trustify: Google Reviews Badge',
          built_for_shopify: false,
        },
      },
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/8bc511ee23ed5706e4efcc7284675fe9/icon/CIPQ8pe6gP0CEAE=.png',
          app_id: 'related-videos-by-omega',
          name: 'Omega Product Video Gallery',
          built_for_shopify: false,
        },
      },
    ],
    avg_star: 4.9,
    id: 'trustify2',
    name: 'Trustify (Omega)',
    review_count: 1688,
  },
  {
    apps: [
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/6b2b8ff7415c82eba60cc5446d15596c/icon/CNqZ_LvI3YcDEAE=.png',
          app_id: 'eu-cookies-notification',
          name: 'Consentik GDPR Cookie Consent',
          built_for_shopify: true,
        },
      },
    ],
    avg_star: 4.9,
    id: 'consentik-omega',
    name: 'Consentik',
    review_count: 428,
  },
  {
    apps: [
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/32acb355119836c1d4cf245b88ab534c/icon/CN6h1IbbmowDEAE=.png',
          app_id: 'delivery-date-omega',
          name: 'DingDoong Pickup Delivery Date',
          built_for_shopify: true,
        },
      },
    ],
    avg_star: 4.9,
    id: 'dingdoong4',
    name: 'DingDoong',
    review_count: 215,
  },
  {
    apps: [
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/ca22a759b17b6e834f1fdd2372b2920b/icon/CJ3BgPCfsoUDEAE=.png',
          app_id: 'tagfly',
          name: 'T: Google Tag & Conversion API',
          built_for_shopify: true,
        },
      },
    ],
    avg_star: 4.8,
    id: 'xipat3',
    name: 'TagFly',
    review_count: 113,
  },
  {
    apps: [
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/0522be592625a9de384dbb686a2e8ad6/icon/CJbS_ayQ1ocDEAE=.jpeg',
          app_id: 'google-shopping-feed-pro',
          name: 'FeedNexa Google Shopping Feed',
          built_for_shopify: true,
        },
      },
    ],
    avg_star: 4.9,
    id: 'feednexa',
    name: 'FeedNexa (Omega)',
    review_count: 143,
  },
  {
    apps: [
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/aeca27f78916a0b6c0916b621906aaf3/icon/CIyWqe704YgDEAE=.png',
          app_id: 'quantity-price-breaks-limit-purchase',
          name: 'P: Volume Discounts & Quantity',
          built_for_shopify: true,
        },
      },
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/8a2e7afa34251cea5eca3a7535b17bb9/icon/CK7lvO-304kDEAE=.png',
          app_id: 'pareto-limit-purchase',
          name: 'Pareto ‑ Order Limit Quantity',
          built_for_shopify: true,
        },
      },
    ],
    avg_star: 4.9,
    id: 'pareto8',
    name: 'Pareto',
    review_count: 307,
  },
  {
    apps: [
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/08d540a770b93d06d72825dfa7b7c7da/icon/CLmyiKmLzfgCEAE=.png',
          app_id: 'order-tagger-by-omega',
          name: 'O: Auto Tag & Flow Automation',
          built_for_shopify: true,
        },
      },
    ],
    avg_star: 4.6,
    id: 'rubix7',
    name: 'Flowise',
    review_count: 94,
  },
  {
    apps: [
      {
        detail: {
          app_icon:
            'https://cdn.shopify.com/app-store/listing_images/8c0a481582640b812e4cc81e79809be1/icon/CMydz8v0lu8CEAE=.png',
          app_id: 'floatify',
          name: 'Floatify: Social & CTA Buttons',
          built_for_shopify: false,
        },
      },
    ],
    avg_star: 4.9,
    id: 'xipat',
    name: 'Garketing (Omega)',
    review_count: 240,
  },
];

const OurPartnerList = () => {
  return (
    <div className="container container-our-partner">
      <Row gutter={[16, 16]}>
        {partners.map((partner) => (
          <Col xs={24} sm={12} md={8} lg={6} key={partner.id}>
            <Card
              hoverable
              title={
                <MyLink href={`/developer/${partner.id}`}>
                  <h3>{partner.name}</h3>
                </MyLink>
              }
              extra={<UsergroupAddOutlined className="card-extra-icon" />}
            >
              <Meta
                description={
                  <div>
                    <p className="partner-reviews">
                      <strong>Avg.Rating:</strong> {partner.avg_star} <StarFilled className="star-icon" />
                    </p>
                    <p className="partner-reviews">
                      <strong>Avg.Total Reviews:</strong> {partner.review_count}
                    </p>
                    <div className="partner-apps">
                      {partner.apps.slice(0, 5).map((app, index) => (
                        <Badge
                          key={index}
                          count={
                            app.detail.built_for_shopify ? (
                              <Image
                                src="/image/diamond.svg"
                                alt="diamond"
                                width={15}
                                height={15}
                                className="diamond-icon"
                              />
                            ) : null
                          }
                          offset={[-4, 2]}
                        >
                          <Tooltip title={app.detail.name}>
                            <div className="partner-app-icon">
                              <MyLink href={`/app/${app.detail.app_id}`}>
                                <Image
                                  src={app.detail.app_icon}
                                  alt={app.detail.app_id}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </MyLink>
                            </div>
                          </Tooltip>
                        </Badge>
                      ))}
                      {partner.apps.length > 5 && (
                        <Tooltip
                          title={partner.apps
                            .slice(5)
                            .map((app) => app.detail.name)
                            .join(', ')}
                        >
                          <MyLink href={`/developer/${partner.id}`}>
                            <div className="partner-app-more">+{partner.apps.length - 5}</div>
                          </MyLink>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default OurPartnerList;
