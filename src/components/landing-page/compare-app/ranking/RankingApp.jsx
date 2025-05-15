'use client';

import React, { useState } from 'react';
import './RankingApp.scss';
import { Table, Tooltip } from 'antd';
import { BASE_URL } from '@/common/constants';
import {
  DoubleRightOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  StarFilled,
  UpOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import MyLink from '@/components/ui/link/MyLink';

export default function RankingApp({ compareAppData, initialDataTopKeyWord }) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllCollections, setShowAllCollections] = useState(false);
  const [showAllMostPopularPositions, setShowAllMostPopularPositions] = useState(false);
  const [showAllMPPCollections, setShowAllMPPCollections] = useState(false);

  const topKeywords = initialDataTopKeyWord;
  const dataAppCompare = compareAppData[1]?.app_compare || [];
  const dataAppHostCate = compareAppData[0]?.app_host?.categories || [];
  const dataAppHostCollection = compareAppData[0]?.app_host?.collections || [];
  const dataAppHostCollectionPopular = compareAppData[0]?.app_host?.collections_popular || [];

  const appCompare = dataAppCompare.flatMap((item) => item.categories);
  const hostCategories = Array.isArray(dataAppHostCate) ? dataAppHostCate : [];
  const combinedCategories = [...hostCategories, ...appCompare];
  const uniqueCategories = Array.from(
    new Map(
      combinedCategories
        .filter((category) => category !== null && category !== undefined)
        .map((category) => [category.category_name, category]),
    ).values(),
  );

  const handleSeeMoreClick = () => {
    setShowAllCategories((prev) => !prev);
  };

  const categoriesToShow = showAllCategories ? uniqueCategories : uniqueCategories.slice(0, 5);

  //Collections-ranking
  const collectionCompare = dataAppCompare.flatMap((item) => item.collections);
  const hostCollections = Array.isArray(dataAppHostCollection) ? dataAppHostCollection : [];
  const combinedCollections = [...hostCollections, ...collectionCompare];
  const uniqueCollections = Array.from(
    new Map(
      combinedCollections
        .filter((collection) => collection !== null && collection !== undefined)
        .map((collection) => [collection.collection_name, collection]),
    ).values(),
  );

  const handleSeeMoreClickCollection = () => {
    setShowAllCollections((prev) => !prev);
  };

  const collectionsToShow = showAllCollections ? uniqueCollections : uniqueCollections.slice(0, 5);

  //Most Popular Positions
  const mostPopularPositionCompare = dataAppCompare.flatMap((item) => item.categories_popular);
  const hostCategoriesPopular = Array.isArray(dataAppHostCollectionPopular) ? dataAppHostCollectionPopular : [];
  const combinedMostPopularPositions = [...hostCategoriesPopular, ...mostPopularPositionCompare];
  const uniqueMostPopularPositions = Array.from(
    new Map(
      combinedMostPopularPositions
        .filter((categories_popular) => categories_popular !== null && categories_popular !== undefined)
        .map((categories_popular) => [categories_popular.category_name, categories_popular]),
    ).values(),
  );

  const handleSeeMoreClickMostPopular = () => {
    setShowAllMostPopularPositions((prev) => !prev);
  };

  const mostPopularPositionToShow = showAllMostPopularPositions
    ? uniqueMostPopularPositions
    : uniqueMostPopularPositions.slice(0, 5);

  //Most Popular Positions by Collections
  const mostPopularPositionCollectionCompare = dataAppCompare.flatMap((item) => item.collections_popular);
  const hostCollectionsPopular = Array.isArray(dataAppHostCollectionPopular) ? dataAppHostCollectionPopular : [];
  const combinedMostPopularPositionCollections = [...hostCollectionsPopular, ...mostPopularPositionCollectionCompare];
  const uniqueMostPopularPositionCollections = Array.from(
    new Map(
      combinedMostPopularPositionCollections
        .filter((collections_popular) => collections_popular !== null && collections_popular !== undefined)
        .map((collections_popular) => [collections_popular.collection_name, collections_popular]),
    ).values(),
  );

  const handleSeeMoreClickMPCollections = () => {
    setShowAllMPPCollections((prev) => !prev);
  };

  const mostPopularPositionCollectionToShow = showAllMPPCollections
    ? uniqueMostPopularPositionCollections
    : uniqueMostPopularPositionCollections.slice(0, 5);

  const dataKeywords = topKeywords
    ? topKeywords.map((item) => {
        return {
          app_id: item?._id,
          keywords: item?.keywords,
        };
      })
    : [];

  const transposedDataRanking = [
    {
      key: 'categories',
      title:
        uniqueCategories.length > 0 ? (
          <div className="ranking">
            <span>Category Positions</span>
            {categoriesToShow.map((category, index) => (
              <ul key={index}>
                <li className="text-nowarp">
                  <Tooltip title={category.category_name}>
                    <MyLink href={`${BASE_URL}category/${category.category_id}`} target="__blank">
                      {category.category_name}
                    </MyLink>
                  </Tooltip>
                </li>
              </ul>
            ))}
            {uniqueCategories.length > 5 && (
              <div className="see-more" onClick={handleSeeMoreClick}>
                <span>
                  {showAllCategories ? (
                    <>
                      Show Less <DoubleRightOutlined className="rotate-icon-hide" />
                    </>
                  ) : (
                    <>
                      Show More <DoubleRightOutlined className="rotate-icon" />
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            <span className="not-data">Category Positions</span>
            <div>Not available</div>
          </>
        ),
      values: [compareAppData[0]?.app_host || {}, ...dataAppCompare].map((item = {}) => {
        const appCompareCategories = item?.categories || [];

        const filteredCategories = uniqueCategories.map((uniqueCategory) => {
          const matchedCategory = appCompareCategories.find(
            (categoryApp) => categoryApp.category_id === uniqueCategory.category_id,
          );

          return (
            matchedCategory || {
              category_name: uniqueCategory.category_name,
              rank: '...',
              total_apps: '...',
              page: '...',
              before_rank: '...',
            }
          );
        });

        const categoriesToShow = showAllCategories ? filteredCategories : filteredCategories.slice(0, 5);
        const allRanksEmpty = filteredCategories.every((category) => category.rank === '...');

        return (
          <ul className="categories-ranking" key={item.app_id}>
            {allRanksEmpty ? (
              <li className="no-data">Not Available</li>
            ) : (
              <>
                {categoriesToShow.map((category, index) => (
                  <li key={index} className="item">
                    <div className="positions">
                      <div className="current-rank">
                        <span>{category.rank === '...' ? '...................' : category.rank}</span>
                      </div>
                      <span>{category.rank === '...' ? null : <>&nbsp;/&nbsp;</>}</span>
                      <div className="total-rank">
                        <span>{category.total_apps === '...' ? null : category.total_apps}</span>
                      </div>
                      <div className="icon">
                        {category.rank === '...' ? null : category.before_rank - category.rank < 0 ? (
                          <div className="rank-down rank">
                            <DownOutlined />
                            <div className="down">
                              <span>{Math.abs(category.before_rank - category.rank)}</span>
                            </div>
                          </div>
                        ) : category.before_rank - category.rank > 0 ? (
                          <div className="rank-up rank">
                            <UpOutlined />
                            <div className="down">
                              <span>{Math.abs(category.before_rank - category.rank)}</span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="current-page">
                      {category.page === '...' ? null : <span>Page {category.page}</span>}
                    </div>
                  </li>
                ))}
              </>
            )}
          </ul>
        );
      }),
    },
    {
      key: 'collections',
      title:
        uniqueCollections.length > 0 ? (
          <div className="ranking">
            <span>Collection Positions</span>
            {collectionsToShow.map((collection, index) => (
              <ul key={index}>
                <li className="text-nowarp">
                  <Tooltip title={collection.collection_name}>
                    <MyLink href={`${BASE_URL}collection/${collection.collection_id}`} target="__blank">
                      {collection.collection_name}
                    </MyLink>
                  </Tooltip>
                </li>
              </ul>
            ))}
            {uniqueCollections.length > 5 && (
              <div className="see-more" onClick={handleSeeMoreClickCollection}>
                <span>
                  {showAllCollections ? (
                    <>
                      Show Less <DoubleRightOutlined className="rotate-icon-hide" />
                    </>
                  ) : (
                    <>
                      Show More <DoubleRightOutlined className="rotate-icon" />
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            <span className="not-data">Collection Positions</span>
            <div>Not available</div>
          </>
        ),
      values: [compareAppData[0]?.app_host || {}, ...dataAppCompare].map((item = {}) => {
        const appCompareCollections = item?.collections || [];
        const filteredCollections = uniqueCollections.map((uniqueCollection) => {
          const matchedCollection = appCompareCollections.find(
            (collectionApp) => collectionApp.collection_id === uniqueCollection.collection_id,
          );

          return (
            matchedCollection || {
              collection_name: uniqueCollection.collection_name,
              rank: '...',
              total_apps: '...',
              page: '...',
              before_rank: '...',
            }
          );
        });

        const categoriesToShow = showAllCollections ? filteredCollections : filteredCollections.slice(0, 5);
        const allRanksEmpty = filteredCollections.every((collection) => collection.rank === '...');

        return (
          <ul className="collections-ranking" key={item.app_id}>
            {allRanksEmpty ? (
              <li className="no-data">Not Available</li>
            ) : (
              categoriesToShow.map((collection, index) => (
                <li key={index} className="item">
                  <div className="positions">
                    <div className="current-rank">
                      <span>{collection.rank === '...' ? '...................' : collection.rank}</span>
                    </div>
                    <span>{collection.rank === '...' ? null : <>&nbsp;/&nbsp;</>}</span>
                    <div className="total-rank">
                      <span>{collection.total_apps === '...' ? null : collection.total_apps}</span>
                    </div>
                    <div className="icon">
                      {collection.rank === '...' ? null : collection.before_rank - collection.rank < 0 ? (
                        <div className="rank-down rank">
                          <DownOutlined />
                          <div className="down">
                            <span>{Math.abs(collection.before_rank - collection.rank)}</span>
                          </div>
                        </div>
                      ) : collection.before_rank - collection.rank > 0 ? (
                        <div className="rank-up rank">
                          <UpOutlined />
                          <div className="down">
                            <span>{Math.abs(collection.before_rank - collection.rank)}</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="current-page">
                    {collection.page === '...' ? null : <span>Page {collection.page}</span>}
                  </div>
                </li>
              ))
            )}
          </ul>
        );
      }),
    },
    {
      key: 'categories_popular',
      title:
        uniqueMostPopularPositions.length > 0 ? (
          <div className="ranking">
            <span>Most Popular Positions</span>
            {mostPopularPositionToShow.map((category, index) => (
              <ul key={index}>
                <li className="text-nowarp">
                  <Tooltip title={category.category_name}>
                    <MyLink href={`${BASE_URL}category/${category.category_id}`} target="__blank">
                      {category.category_name}
                    </MyLink>
                  </Tooltip>
                </li>
              </ul>
            ))}
            {uniqueMostPopularPositions.length > 5 && (
              <div className="see-more" onClick={handleSeeMoreClickMostPopular}>
                <span>
                  {showAllMostPopularPositions ? (
                    <>
                      Show Less <DoubleRightOutlined className="rotate-icon-hide" />
                    </>
                  ) : (
                    <>
                      Show More <DoubleRightOutlined className="rotate-icon" />
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            <span className="not-data">Most Popular Positions</span>
            <div>Not available</div>
          </>
        ),
      values: [compareAppData[0]?.app_host || {}, ...dataAppCompare].map((item = {}) => {
        const appCompareMostPopularPositions = item?.categories_popular || [];

        const filteredMostPopularPositions = uniqueMostPopularPositions.map((uniqueMPP) => {
          const matchedCategory = appCompareMostPopularPositions.find(
            (categoryApp) => categoryApp.category_id === uniqueMPP.category_id,
          );

          return (
            matchedCategory || {
              category_name: uniqueMPP.category_name,
              rank: '...',
              total_apps: '...',
              page: '...',
              before_rank: '...',
            }
          );
        });

        const mostPopularPositionsToShow = showAllMostPopularPositions
          ? filteredMostPopularPositions
          : filteredMostPopularPositions.slice(0, 5);
        const allRanksEmpty = filteredMostPopularPositions.every((category) => category.rank === '...');

        return (
          <ul className="categories-ranking" key={item.app_id}>
            {allRanksEmpty ? (
              <li className="no-data">Not Available</li>
            ) : (
              mostPopularPositionsToShow.map((category, index) => (
                <li key={index} className="item">
                  <div className="positions">
                    <div className="current-rank">
                      <span>{category.rank === '...' ? '...................' : category.rank}</span>
                    </div>
                    <span>{category.rank === '...' ? null : <>&nbsp;/&nbsp;</>}</span>
                    <div className="total-rank">
                      <span>{category.total_apps === '...' ? null : category.total_apps}</span>
                    </div>
                    <div className="icon">
                      {category.rank === '...' ? null : category.before_rank - category.rank < 0 ? (
                        <div className="rank-down rank">
                          <DownOutlined />
                          <div className="down">
                            <span>{Math.abs(category.before_rank - category.rank)}</span>
                          </div>
                        </div>
                      ) : category.before_rank - category.rank > 0 ? (
                        <div className="rank-up rank">
                          <UpOutlined />
                          <div className="down">
                            <span>{Math.abs(category.before_rank - category.rank)}</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="current-page">
                    {category.page === '...' ? null : <span>Page {category.page}</span>}
                  </div>
                </li>
              ))
            )}
          </ul>
        );
      }),
    },
    {
      key: 'collections_popular',
      title:
        uniqueMostPopularPositionCollections.length > 0 ? (
          <div className="ranking">
            <span>Most Popular Positions by Collections</span>
            {mostPopularPositionCollectionToShow.map((collection, index) => (
              <ul key={index}>
                <li className="text-nowarp">
                  <Tooltip title={collection.collection_name}>
                    <MyLink href={`${BASE_URL}collection/${collection.collection_id}`} target="__blank">
                      {collection.collection_name}
                    </MyLink>
                  </Tooltip>
                </li>
              </ul>
            ))}
            {uniqueMostPopularPositionCollections.length > 5 && (
              <div className="see-more" onClick={handleSeeMoreClickMPCollections}>
                <span>
                  {showAllMPPCollections ? (
                    <>
                      Show Less <DoubleRightOutlined className="rotate-icon-hide" />
                    </>
                  ) : (
                    <>
                      Show More <DoubleRightOutlined className="rotate-icon" />
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            <span className="not-data">Most Popular Positions by Collections</span>
            <div>Not available</div>
          </>
        ),
      values: [compareAppData[0]?.app_host || {}, ...dataAppCompare].map((item = {}) => {
        const appCompareMPPCollections = item?.collections_popular || [];

        const filteredMPPCollections = uniqueMostPopularPositionCollections.map((uniqueMPP) => {
          const matchedCollection = appCompareMPPCollections.find(
            (collectionApp) => collectionApp.collection_id === uniqueMPP.collection_id,
          );

          return (
            matchedCollection || {
              collection_name: uniqueMPP.collection_name,
              rank: '...',
              total_apps: '...',
              page: '...',
              before_rank: '...',
            }
          );
        });

        const mostPPCollectionToShow = showAllMPPCollections
          ? filteredMPPCollections
          : filteredMPPCollections.slice(0, 5);
        const allRanksEmpty = filteredMPPCollections.every((collection) => collection.rank === '...');

        return (
          <ul className="collections-ranking-most" key={item.app_id}>
            {allRanksEmpty ? (
              <li className="no-data">Not Available</li>
            ) : (
              mostPPCollectionToShow.map((collection, index) => (
                <li key={index} className="item">
                  <div className="positions">
                    <div className="current-rank">
                      <span>{collection.rank === '...' ? '...................' : collection.rank}</span>
                    </div>
                    <span>{collection.rank === '...' ? null : <>&nbsp;/&nbsp;</>}</span>
                    <div className="total-rank">
                      <span>{collection.total_apps === '...' ? null : collection.total_apps}</span>
                    </div>
                    <div className="icon">
                      {collection.rank === '...' ? null : collection.before_rank - collection.rank < 0 ? (
                        <div className="rank-down rank">
                          <DownOutlined />
                          <div className="down">
                            <span>{Math.abs(collection.before_rank - collection.rank)}</span>
                          </div>
                        </div>
                      ) : collection.before_rank - collection.rank > 0 ? (
                        <div className="rank-up rank">
                          <UpOutlined />
                          <div className="down">
                            <span>{Math.abs(collection.before_rank - collection.rank)}</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="current-page">
                    {collection.page === '...' ? null : <span>Page {collection.page}</span>}
                  </div>
                </li>
              ))
            )}
          </ul>
        );
      }),
    },
    {
      key: 'topKeywords',
      title: (
        <div className="ranking">
          <span>
            Top Keywords{' '}
            <Tooltip title="Based on the information of the app's title, description and tagline, get the keywords that the app has ranking in the top when searching by that keyword on Shopify.">
              <ExclamationCircleOutlined />
            </Tooltip>
          </span>
        </div>
      ),
      values: [compareAppData[0]?.app_host || {}, ...dataAppCompare].map((appItem = {}, index) => {
        const correspondingKeywords = dataKeywords.find((keywordItem) => keywordItem.app_id === appItem.app_id);

        if (!correspondingKeywords || !correspondingKeywords.keywords) {
          return (
            <div className="ai-keyword" key={index}>
              <span>No keywords available</span>
            </div>
          );
        }

        const keywordRanks = Object.entries(
          correspondingKeywords?.keywords.reduce((acc, keyword) => {
            const { rank } = keyword;
            acc[rank] = acc[rank] ? [...acc[rank], keyword.keyword] : [keyword.keyword];
            return acc;
          }, {}),
        );

        return (
          <>
            <div className="ai-keyword">
              {correspondingKeywords?.keywords ? (
                <ul>
                  {keywordRanks
                    .sort((a, b) => a[0] - b[0])
                    .map(([rank, keywords], index) => (
                      <li key={rank}>
                        <Tooltip title={keywords.join(', ')}>
                          <span className="index-rank">{index + 1}</span> {keywords.slice(0, 3).join(', ')}
                          {keywords.length > 3 && `...`}
                        </Tooltip>
                      </li>
                    ))}
                </ul>
              ) : (
                <span>No keywords available</span>
              )}
            </div>
          </>
        );
      }),
    },
  ];

  const columnsRanking = [
    {
      title: 'Apps',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      width: 200,
    },
    ...[compareAppData[0]?.app_host || {}, ...dataAppCompare].map((item = {}, index) => ({
      title: (
        <>
          {item?.detail && item.detail.name ? (
            <div className="app">
              <div className="image">
                <Image src={item.detail.app_icon} width={90} height={90} alt="Icon App" />
              </div>
              <div className="title-app">
                <Tooltip title={item.detail.name}>
                  <span className="app-name">{item.detail.name}</span>
                </Tooltip>
                <div className="rating">
                  <span className="star">
                    <StarFilled />
                    {item.detail.star}
                  </span>
                  <span>&nbsp;|&nbsp;</span>
                  <MyLink href={`${BASE_URL}app/${item.detail.app_id}/reviews`} className="review-count">
                    {item.detail.review_count} reviews
                  </MyLink>
                </div>
                <MyLink
                  href={`${BASE_URL}app/${item.detail.app_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-detail"
                >
                  View Details
                </MyLink>
              </div>
            </div>
          ) : (
            ''
          )}
        </>
      ),
      dataIndex: `value${index}`,
      key: `value${index}`,
      width: 347,
    })),
  ];

  const dataSourceRanking = transposedDataRanking.map((row) => {
    const rowData = { key: row.key, title: row.title };
    row.values.forEach((value, index) => {
      rowData[`value${index}`] = value;
    });
    return rowData;
  });

  return (
    <div className="app-ranking">
      <Table
        dataSource={dataSourceRanking}
        columns={columnsRanking}
        pagination={false}
        scroll={{ x: 1500 }}
        className="table-app"
      />
    </div>
  );
}
