'use client';

import React, { useEffect, useRef, useState } from 'react';
import './DetailAppPage.scss';
import {
  convertDataChartChangeLog,
  createData,
  dataKeywords,
  mergedObject,
  openNotification,
  renderButtonAddKey,
  renderTabTitle,
} from '@/utils/functions';
import WatchingAppsCurrent from '@/utils/store/WatchingAppsCurrent';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import { Breadcrumb, Button, DatePicker, Form, message, Modal, Tabs, Tooltip } from 'antd';
import {
  ExclamationCircleFilled,
  HomeOutlined,
  PlusOutlined,
  ReloadOutlined,
  RightOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isBetween from 'dayjs/plugin/isBetween';
import InfoApp from '@/components/info-app/InfoApp';
import CategoryCollectionPos from '@/components/category-collection-pos/CategoryCollectionPos';
import { useDispatch } from 'react-redux';
import { getListMyApps } from '@/redux/slice/my-apps/MyApps';
import ChartChangeLog from '@/components/chart/chart-change-log/ChartChangeLog';
import DataGA from '@/components/data-ga/DataGA';
import ChartWeeklyRating from '@/components/chart/chart-weekly-rating/ChartWeeklyRating';
import ChartCategory from '@/components/chart/chart-category/ChartCategory';
import CustomerLifecycle from '@/components/chart/customer-lifecycle/CustomerLifecycle';
import Retention from '@/components/chart/retention/Retention';
import ChurnAndReinstall from '@/components/chart/churn-and-reinstall/ChurnAndReinstall';
import ChartInstallUnInstall from '@/components/chart/chart-install-unInstall/ChartInstallUnInstall';
import EarningByPlan from '@/components/chart/earning-by-plan/EarningByPlan';
import ChartMerchantEarnings from '@/components/chart/chart-merchant-earnings/ChartMerchantEarnings';
import SelectCartHeader from '@/components/select-cart-header/SelectCartHeader';
import TableKeyword from '@/components/table-keyword/TableKeyword';
import SelectByLanguage from '@/components/ui/select-language/SelectByLanguage';
import Image from 'next/image';
import MyLink from '@/components/ui/link/MyLink';

const ModalKeywordFrequency = dynamic(() => import('@/components/modal-keyword-frequency/ModalKeywordFrequency'), {
  ssr: false,
});
const ModalSuggestKeywordAI = dynamic(() => import('@/components/modal-keyword-ai/ModalSuggestKeywordAI'), {
  ssr: false,
});
const ModalPageViewKeyword = dynamic(() => import('@/components/modal-page-view-keyword/ModalPageViewKeyword'), {
  ssr: false,
});
const ModalAddKeyword = dynamic(() => import('@/components/modal-add-keyword/ModalAddKeyword'), {
  ssr: false,
});
const ModalSettingCompare = dynamic(() => import('@/components/modal-setting-compare/ModalSettingCompare'), {
  ssr: false,
});
const ModalEditListingApp = dynamic(() => import('@/components/modal-edit-listing-app/ModalEditListingApp'), {
  ssr: false,
});
const ModalPositionKeyword = dynamic(() => import('@/components/modal-position-keyword/ModalPositionKeyword'), {
  ssr: false,
});
const ModalCompetitor = dynamic(() => import('@/components/modal-competitor/ModalCompetitor'), {
  ssr: false,
});
const ModalKeywordHidden = dynamic(() => import('@/components/modal-keyword-hidden/ModalKeywordHidden'), {
  ssr: false,
});
const ModalOverallCompare = dynamic(() => import('@/components/modal-overall-compare/ModalOverallCompare'), {
  ssr: false,
});
const ModalAddPartner = dynamic(() => import('@/components/modal-add-partner/ModalAddPartner'), {
  ssr: false,
});
const ModalCompareList = dynamic(() => import('@/components/modal-compare-list/ModalCompareList'), {
  ssr: false,
});

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(isBetween);

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const { confirm } = Modal;

export default function DetailAppPage({ app_id, initialDataAppInfo, initialPanes, initialDataCateCollections, token }) {
  const idDetail = app_id;
  const [loadingAppInfo, setLoadingAppInfo] = useState(false);
  const [infoApp, setInfoApp] = useState(initialDataAppInfo.appDetail);
  const [isFollow, setIsFollow] = useState(false);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [activeState, setActiveState] = useState(1);
  const [competitor, setCompetitor] = useState(initialPanes);
  const [dataDetailApp, setDataDetailApp] = useState();
  const [dataCatCollection, setDataCatCollection] = useState(initialDataCateCollections);
  const [dataAllTab, setDataAllTab] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataByDate, setDataByDate] = useState([]);
  const [dataCustomLifecycle, setDataCustomLifecycle] = useState([]);
  const [retentionData, setRetentionData] = useState([]);
  const [countKeyword, setCountKeyword] = useState(0);
  const [dataKeywordsChange, setDataKeywordsChange] = useState();
  const [keywordPosition, setKeywordPosition] = useState([]);
  const [dataKeywordsShow, setDataKeywordsShow] = useState([]);
  const [loadingChangeLanguage, setLoadingChangeLanguage] = useState(false);
  const [id, setId] = useState(idDetail);
  const AppName = useRef('');
  const [selectedValue, setSelectedValue] = useState('D');
  const [language, setLanguage] = useState('uk');
  const [form] = Form.useForm();
  const dataSortedKeyword = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const keywordName = useRef('');
  const keywordNamePopular = useRef('');
  const keywordNamePView = useRef('');
  const [dataByDateSelected, setDataByDateSelected] = useState([]);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState();
  const [isPViewText, setIsPViewText] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInfoApp(id);
    }
  }, []);

  const getAppInformation = async (id, fromDate, toDate, isNewTab) => {
    const appInfo = await DetailAppApiService.getAppInfoLogged(id, fromDate, toDate);

    const watchingAppData = {
      app_icon: appInfo?.data?.detail?.app_icon,
      app_id: appInfo?.data?.detail?.app_id,
      built_for_shopify: appInfo?.data?.detail?.built_for_shopify,
      highlights: appInfo?.data?.detail?.highlights,
      name: appInfo?.data?.detail?.name,
      review_count: appInfo?.data?.detail?.review_count,
      star: appInfo?.data?.detail?.star,
      pricing: appInfo?.data?.detail?.pricing,
      tagline: appInfo?.data?.detail?.tagline,
      delete: appInfo?.data?.delete,
      unlisted: appInfo?.data?.unlisted,
    };

    if (!isNewTab) {
      if (appInfo.data.delete || appInfo.data.unlisted) {
        openNotification(appInfo.data.delete);
      }
      setLoadingAppInfo(false);
      setInfoApp({
        isBuilt4Shopify: appInfo.data.detail.built_for_shopify,
        data: appInfo.data,
        isOwner: appInfo.is_owner,
        gaConnected: appInfo.ga_connected,
        partnerConnected: appInfo.shopify_connected,
        canAddGId: appInfo.must_add_shopify_app_id,
      });
      setIsFollow(appInfo.is_follow);
      setFromDate(appInfo.start_date);
      setToDate(appInfo.end_date);
      AppName.current = appInfo.data.detail.name;
      WatchingAppsCurrent.addToListWatchingApps(watchingAppData);
      const panes = [
        {
          appId: appInfo.data.app_id,
          title: {
            ...appInfo,
            built_for_shopify: appInfo.data.detail.built_for_shopify,
            name: appInfo.data.detail.name || '',
          },
          content: <></>,
          changed: appInfo.changed,
          name: appInfo.data.detail.name || '',
          isFollow: {
            appId: appInfo.data.app_id,
            isFollow: appInfo.is_follow,
          },
          key: '1',
          closable: false,
        },
      ];
      if (appInfo.competitor) {
        appInfo.competitor.map((item) => {
          const activeKey = (panes && panes.length ? +panes[panes.length - 1].key : 0) + 1;
          panes.push({
            appId: item.app_id,
            title: {
              ...item,
              name: item.name,
            },
            content: <></>,
            changed: item.changed,
            name: item.name || '',
            isFollow: {
              appId: item.app_id,
              isFollow: item.is_follow,
            },
            key: activeKey,
          });
        });
      }
      setActiveState(panes[0].key);
      setCompetitor(panes);
    }
    return appInfo;
  };

  const getCatCollectionPos = async (id, fromDate, toDate) => {
    const [dataCategory, dataCollection] = await Promise.all([
      DetailAppApiService.getCategoryPosition(id, fromDate, toDate),
      DetailAppApiService.getCollectionPosition(id, fromDate, toDate),
    ]);
    setDataCatCollection({
      dataCategory: dataCategory.data,
      dataCollection: dataCollection.data,
    });
    return { dataCategory, dataCollection };
  };

  const getAppInfo = async (id, fromDate, toDate, isNewTab) => {
    setLoadingAppInfo(true);
    const [ratingChange, reviewsChange, changeLog, dataCategoryPos, appInfo, catCollectionPos] = await Promise.all([
      DetailAppApiService.getRatingChange(id, fromDate, toDate),
      DetailAppApiService.getReviewsChange(id, fromDate, toDate),
      DetailAppApiService.getChangeLog(id, fromDate, toDate),
      DetailAppApiService.getCategoryPositionChange(id, fromDate, toDate),
      getAppInformation(id, fromDate, toDate, isNewTab),
      getCatCollectionPos(id, fromDate, toDate),
    ]);
    setLoadingAppInfo(false);
    setDataDetailApp({
      dataCategoryPos: dataCategoryPos.data,
      ratingChange: ratingChange.data,
      reviewsChange: reviewsChange.data.filter((item) => item.type === 'Review'),
      changeLog: changeLog.data,
    });
    const dataFetchTab = {
      dataCategory: catCollectionPos.dataCategory.data,
      dataCollection: catCollectionPos.dataCollection.data,
      dataCategoryPos: dataCategoryPos.data,
      ratingChange: ratingChange.data,
      reviewsChange: reviewsChange.data.filter((item) => item.type === 'Review'),
      changeLog: changeLog.data,
      appInfo: appInfo,
      resultCheck: appInfo && appInfo.data.detail.built_for_shopify,
    };
    return dataFetchTab;
  };

  const asyncKeywordByLanguage = async (id, language, fromDate, toDate, compare_app_id) => {
    const [dataKey, dataKeyChangeBestMatch] = await Promise.all([
      DetailAppApiService.getPositionKeywordByLang(id, language, fromDate, toDate, compare_app_id),
      DetailAppApiService.getPositionKeywordChangeByLang(id, language, fromDate, toDate, compare_app_id),
    ]);
    setDataKeywordsChange({
      bestMatch: dataKeyChangeBestMatch.data.best_match,
      popular: dataKeyChangeBestMatch.data.popular,
    });
    if (dataKey.data.result.length > 0) {
      setKeywordPosition(dataKey.data.result);
      setDataKeywordsShow(dataKeywords(dataKey.data.result));
    }
    setLoading(false);
    setLoadingChangeLanguage(false);
    return { dataKey, dataKeyChangeBestMatch, dataKeyChangeBestMatch };
  };

  const getAppInfoLogged = async (id, fromDate, toDate, compare_app_id) => {
    setLoading(true);
    const appId = compare_app_id ? compare_app_id : id;
    const [
      gaData,
      dataEarning,
      dataInstall,
      dataUninstall,
      dataMerchant,
      keywordPositionByLanguage,
      dataRetention,
      dataEarningByPlan,
      dataUninstallTime,
      dataReinstallShopByTime,
    ] = await Promise.all([
      DetailAppApiService.getGaData(appId, fromDate, toDate),
      DetailAppApiService.getEarning(appId, fromDate, toDate),
      DetailAppApiService.getInstallApp(appId, fromDate, toDate),
      DetailAppApiService.getUninstallApp(appId, fromDate, toDate),
      DetailAppApiService.getMerchantApp(appId, fromDate, toDate),
      asyncKeywordByLanguage(id, language, fromDate, toDate, compare_app_id),
      DetailAppApiService.getRetentionApp(appId, fromDate, toDate),
      DetailAppApiService.getEarningByPlan(appId, fromDate, toDate),
      DetailAppApiService.getUninstallByTime(appId, fromDate, toDate),
      DetailAppApiService.getReinstallShopByTime(appId),
    ]);
    const resultChart = {
      earning_by_date: dataEarning.data?.earning_by_date,
      install_by_date: dataInstall.data,
      merchant_by_date: dataMerchant.data,
      total_earning: dataEarning.data?.total_earning,
      total_earning_before: dataEarning.data?.total_earning_before,
      uninstall_by_date: dataUninstall.data,
      earning_by_pricing: dataEarningByPlan.data,
      uninstalled_shop_1_14_days: dataUninstallTime.data?.uninstalled_shop_1_14_days,
      uninstalled_shop_15_90_days: dataUninstallTime.data?.uninstalled_shop_15_90_days,
      uninstalled_shop_91_days: dataUninstallTime.data?.uninstalled_shop_91_days,
      uninstalled_shop_the_same_day: dataUninstallTime.data?.uninstalled_shop_the_same_day,
      average_diff_days_15_90_days: dataUninstallTime.data?.average_diff_days_15_90_days,
      average_diff_days_1_14_days: dataUninstallTime.data?.average_diff_days_1_14_days,
      average_diff_days_same_day: dataUninstallTime.data?.average_diff_days_same_day,
      dataRetention: dataRetention.data,
      reinstalled_shop_1_14_days: dataReinstallShopByTime.data?.reinstalled_shop_1_14_days,
      reinstalled_shop_15_90_days: dataReinstallShopByTime.data?.reinstalled_shop_15_90_days,
      reinstalled_shop_91_days: dataReinstallShopByTime.data?.reinstalled_shop_91_days,
      reinstalled_shop_the_same_day: dataReinstallShopByTime.data?.reinstalled_shop_the_same_day,
      re_average_diff_days_15_90_days: dataReinstallShopByTime.data?.average_diff_days_15_90_days,
      re_average_diff_days_1_14_days: dataReinstallShopByTime.data?.average_diff_days_1_14_days,
      re_average_diff_days_same_day: dataReinstallShopByTime.data?.average_diff_days_same_day,
    };
    if (!compare_app_id) {
      var dataGa = [];
      dataGa = gaData.data;
      var dataChartDetail = [];
      if (dataEarning && dataEarning.code === 0) {
        setDataByDate(resultChart);
        dataChartDetail = resultChart;
        setDataCustomLifecycle({
          dataGa: dataGa,
          data: dataChartDetail,
        });
      } else {
        setDataCustomLifecycle({
          dataGa: dataGa,
        });
        setDataByDate([]);
      }

      let count = 0;
      setRetentionData(dataRetention.data);
      keywordPositionByLanguage.dataKey.data.result.map((item) => {
        if (!item.show) {
          count++;
        }
      });
      setCountKeyword(count);
    }
    const dataFetchTab = {
      gaData: gaData.data,
      keywordPosition: keywordPositionByLanguage.dataKey.data.result,
      keywordPositionChange: {
        best_match: keywordPositionByLanguage.dataKeyChangeBestMatch,
        popular: keywordPositionByLanguage.dataKeyChangeBestMatch,
      },
      ...resultChart,
    };
    return dataFetchTab;
  };

  const fetchInfoApp = (id, fromDate, toDate) => {
    Promise.all([getAppInfo(id, fromDate, toDate), getAppInfoLogged(id, fromDate, toDate)]).then((result) => {
      if (result) {
        const dataTabNew = [
          {
            id: result[0].appInfo?.data.app_id,
            value: mergedObject(result),
          },
        ];
        setDataAllTab(dataTabNew);
      }
    });
  };

  const onChangeDateRange = (dates, dateStrings) => {
    if (dateStrings) {
      setFromDate(dateStrings[0]);
      setToDate(dateStrings[1]);
    }
  };

  const disabledFutureDate = (current) => {
    return current && current > dayjs().startOf('day');
  };

  const searchByDate = () => {
    fetchInfoApp(id, fromDate, toDate);
    setSelectedValue('D');
  };

  const fetchNewTab = async (activeKey) => {
    setLoadingAppInfo(true);
    const index = competitor.findIndex((item) => +item.key === +activeKey);
    const dataTab = competitor[index];
    setId(activeKey == 1 ? dataTab.appId : idDetail);
    const indexTab = dataAllTab.findIndex((item) => {
      return item.id === dataTab.appId;
    });
    setLanguage('uk');
    const resultTab = {};
    if (indexTab !== -1) {
      Object.assign(resultTab, dataAllTab[indexTab].value);
    } else {
      await Promise.all([
        getAppInfo(dataTab.appId, fromDate, toDate, true),
        getAppInfoLogged(competitor[0].appId, fromDate, toDate, dataTab.appId),
      ]).then((result) => {
        if (result) {
          const dataTabNew = {
            id: dataTab.appId,
            value: mergedObject(result),
          };
          const resultTabNew = [...dataAllTab];
          resultTabNew.push(dataTabNew);
          setDataAllTab(resultTabNew);
          Object.assign(resultTab, mergedObject(result));
        }
      });
    }
    var dataGa = [];
    if (resultTab && Object.keys(resultTab).length !== 0) {
      setKeywordPosition(resultTab.keywordPosition);
      setDataKeywordsChange({
        bestMatch: resultTab.keywordPositionChange.best_match.data,
        popular: resultTab.keywordPositionChange.popular.data,
      });
      setFromDate(resultTab.appInfo.start_date);
      setToDate(resultTab.appInfo.end_date);
      setIsFollow(resultTab.appInfo.is_follow);
      setInfoApp({
        isBuilt4Shopify: resultTab.appInfo.data.detail.built_for_shopify,
        data: resultTab.appInfo.data,
        isOwner: resultTab.appInfo.is_owner,
        gaConnected: resultTab.appInfo.ga_connected,
        partnerConnected: resultTab.appInfo.shopify_connected,
        canAddGId: resultTab.appInfo.must_add_shopify_app_id,
      });
      setDataDetailApp({
        dataCategoryPos: resultTab.dataCategoryPos,
        ratingChange: resultTab.ratingChange,
        reviewsChange: resultTab.reviewsChange,
        changeLog: resultTab.changeLog,
      });
      setDataCatCollection({
        dataCategory: resultTab.dataCategory,
        dataCollection: resultTab.dataCollection,
      });
      dataGa = resultTab.gaData;
      let count = 0;
      resultTab.keywordPosition.map((item) => {
        if (!item.show) {
          count++;
        }
      });
      setCountKeyword(count);
      setDataKeywordsShow(dataKeywords(resultTab.keywordPosition));
      setLoadingAppInfo(false);
    }

    var dataChartDetail = [];
    const {
      earning_by_date,
      install_by_date,
      merchant_by_date,
      total_earning,
      uninstall_by_date,
      total_earning_before,
      uninstalled_shop_1_14_days,
      uninstalled_shop_15_90_days,
      uninstalled_shop_91_days,
      uninstalled_shop_the_same_day,
      average_diff_days_1_14_days,
      average_diff_days_15_90_days,
      average_diff_days_same_day,
      dataRetention,
    } = resultTab;
    const resultChart = {
      earning_by_date,
      install_by_date,
      merchant_by_date,
      total_earning,
      uninstall_by_date,
      total_earning_before,
      uninstalled_shop_1_14_days,
      uninstalled_shop_15_90_days,
      uninstalled_shop_91_days,
      uninstalled_shop_the_same_day,
      average_diff_days_1_14_days,
      average_diff_days_15_90_days,
      average_diff_days_same_day,
      dataRetention,
    };
    if (resultChart) {
      setDataByDate(resultChart);
      dataChartDetail = resultChart;
    } else {
      setDataByDate([]);
    }
    setRetentionData(resultTab.dataRetention);
    setDataCustomLifecycle({
      dataGa: dataGa,
      data: dataChartDetail,
    });
  };

  const onChangeTab = (activeKey) => {
    setActiveState(activeKey);
    fetchNewTab(activeKey);
  };

  const fetchDataSyncPartner = () => {
    fetchInfoApp(id, fromDate, toDate);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1275);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveKeyword = async (values) => {
    const result = await DetailAppApiService.createKeyword(values.keyName, id);
    if (result.code === 0) {
      form.resetFields();
      setLanguage('uk');
      asyncKeywordByLanguage(id, 'uk', fromDate, toDate);
      setModalShow();
      message.success(result.message);
    } else {
      message.error('Add keyword error');
    }
  };

  const dataTabNew = (item) => {
    const activeKey = (competitor && competitor.length ? +competitor[competitor.length - 1].key : 0) + 1;
    setCompetitor((prev) => [
      ...prev,
      {
        appId: item.app_id,
        title: {
          ...item,
          changed: {},
        },
        content: <></>,
        changed: item.changed,
        name: item.name || '',
        isFollow: {
          appId: item.app_id,
          isFollow: item.is_follow,
        },
        key: activeKey,
      },
    ]);
  };

  const addKeywordHidden = async (keyword) => {
    const result = await DetailAppApiService.createKeyword([keyword.keyword], id);
    if (result.code === 0) {
      setLanguage('uk');
      asyncKeywordByLanguage(id, 'uk', fromDate, toDate);
      setCountKeyword((prev) => prev - 1);
      message.success('Add keyword success');
    } else {
      message.error('Add keyword error');
    }
  };

  const handleFollowApp = async (id, isFollow) => {
    setLoadingFollow(true);
    const result = await DetailAppApiService.handleFollowApp(id, !isFollow);
    if (result && result.code == 0) {
      message.success(isFollow ? 'Unfollow app successfully!' : 'Follow app successfully!');
      setIsFollow(!isFollow);
      setLoadingFollow(false);
    } else {
      message.error('Follow app failed!');
    }
  };

  const operations = (isFollow) => {
    const isConnectedGA = infoApp.gaConnected === true;
    const competitorLength = competitor.length > 1;

    const sortAppId = competitor.map((app) => app.appId).sort((a, b) => a.localeCompare(b));
    const sortedCompareApps = sortAppId.slice(1).join('-lmtvs-');
    const compareUrl = `/app/${sortAppId[0]}/compare-app/vs/${sortedCompareApps}`;

    const renderCompareButton = (url) => (
      <MyLink href={url} target="_blank">
        <Button type="primary" className="button-compare" icon={<SwapOutlined />}>
          Compare
        </Button>
      </MyLink>
    );

    const renderSettingButton = () => (
      <Tooltip title="Setting">
        <Button
          onClick={() => setModalShow('isOpenSetting')}
          className="icon-button"
          shape="circle"
          icon={<SettingOutlined />}
        />
      </Tooltip>
    );

    const renderFollowButton = () => (
      <Button
        className={isFollow ? 'button-follow' : 'button-unfollow'}
        onClick={() => handleFollowApp(id, isFollow)}
        icon={<StarOutlined />}
        loading={loadingFollow}
        type={isFollow ? 'primary' : 'default'}
      >
        {isFollow ? 'Unfollow' : 'Follow'}
      </Button>
    );

    const renderCompareButtonShowModal = () => {
      return (
        <Button type="primary" className="button-compare" onClick={showModal} icon={<SwapOutlined />}>
          Compare
        </Button>
      );
    };

    return (
      <>
        {competitor && competitorLength && activeState == 1 && isConnectedGA ? (
          <>
            {renderSettingButton()}
            {renderCompareButton(compareUrl)}
          </>
        ) : competitor && competitor.length === 1 && activeState == 1 && isConnectedGA ? (
          <>
            {renderSettingButton()}
            {renderCompareButtonShowModal()}
          </>
        ) : !isConnectedGA && competitor && competitorLength && activeState ? (
          <>{renderCompareButton(compareUrl)}</>
        ) : isConnectedGA && competitor && competitorLength && activeState ? (
          <>{renderCompareButton(compareUrl)}</>
        ) : !isConnectedGA ? (
          <>{renderCompareButtonShowModal()}</>
        ) : null}
        {activeState == 1 && renderFollowButton()}
      </>
    );
  };

  const removeTab = async (key) => {
    const index = competitor.findIndex((item) => +item.key === +key);
    const dataTab = competitor[index];
    const result = await DetailAppApiService.deleteCompetitor(idDetail, dataTab.appId);
    if (result && result.code === 0) {
      setCompetitor((prev) => {
        const idx = prev.findIndex((item) => +item.key === +key);
        prev.splice(idx, 1);
        return [...prev];
      });
      if (activeState === key) {
        setActiveState(competitor[0].key);
        fetchNewTab(competitor[0].key);
      } else {
      }
      message.success('Delete competitor success!');
    }
  };

  const onEditTab = (targetKey, action) => {
    if (action === 'remove') {
      confirm({
        title: 'Are you sure you want to delete this tab?',
        icon: <ExclamationCircleFilled />,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
          try {
            removeTab(targetKey);
          } catch (error) {
            message.error("Competitor's deletion failed!");
          }
        },
        okButtonProps: {
          className: 'custom-ok-button',
        },
        cancelButtonProps: {
          className: 'custom-cancel-button',
        },
      });
    }
  };

  const trackingApp = async () => {
    const result = await DetailAppApiService.handleTrackingApp(id, !infoApp.isOwner);
    if (result && result.code == 0) {
      setInfoApp((prev) => {
        return { ...prev, isOwner: !infoApp.isOwner };
      });
      dispatch(getListMyApps());
      message.success(`${infoApp.isOwner ? 'Remove from your list apps' : 'Added app'} successfully!`);
    } else {
      message.error('Follow app failed!');
    }
  };

  const syncGoogleAnalytic = async () => {
    const result = await DetailAppApiService.gaLogin(id);
    if (result && result.code == 0) {
      window.location.href = result.authorization_url;
    }
  };

  const reloadKeyword = () => async () => {
    const result = await DetailAppApiService.reloadKeyword(id);
    if (result.code === 0) {
      message.success('Reload keyword success');
    } else {
      message.error('Reload keyword error');
    }
  };

  const onConfirm = () => {
    setModalShow('isEditKeyword');
    trackingApp();
  };

  const saveOrder = async () => {
    if (dataSortedKeyword.current) {
      const listKeyword = [];
      dataSortedKeyword.current.map((item) => {
        listKeyword.push(item.keyword.keyword);
      });
      if (listKeyword.length > 0) {
        const result = await DetailAppApiService.saveKeywordPriority(id, listKeyword);
        if (result && result.code === 0) {
          setLanguage('uk');
          message.success('Keyword position swap saved in section successfully');
          setDataKeywordsShow(dataSortedKeyword.current);
        } else {
          message.error('Error trying to save priority');
        }
      }
    }
  };

  const handleSelectChange = (value) => {
    setLanguage(value);
    setLoadingChangeLanguage(true);
    asyncKeywordByLanguage(id, value, fromDate, toDate);
  };

  const getDataEarningAndMerchantApp = async (id, fromDate, toDate, selectedValue) => {
    const [dataEarning, dataMerchant] = await Promise.all([
      DetailAppApiService.getEarning(id, fromDate, toDate),
      DetailAppApiService.getMerchantApp(id, fromDate, toDate),
    ]);
    const resultChart = {
      earning_by_date: dataEarning.data?.earning_by_date,
      merchant_by_date: dataMerchant.data,
      total_earning: dataEarning.data?.total_earning,
      total_earning_before: dataEarning.data?.total_earning_before,
    };
    if (dataEarning && dataEarning.code === 0) {
      if (selectedValue === 'W') {
        let weeklyMerchant = [];
        resultChart.merchant_by_date.forEach((item) => {
          const week = dayjs(item.date).format('YYYY-[W]WW');
          const existingWeekIndex = weeklyMerchant.findIndex((entry) => entry.date === week);
          if (existingWeekIndex !== -1) {
            weeklyMerchant[existingWeekIndex].merchant = item.merchant;
          } else {
            weeklyMerchant.push({ date: week, merchant: item.merchant });
          }
        });

        let weeklyEarning = [];
        resultChart.earning_by_date.forEach((item) => {
          const weekEarning = dayjs(item.date).format('YYYY-[W]WW');
          const existingWeekIndex = weeklyEarning.findIndex((entry) => entry.date === weekEarning);
          if (existingWeekIndex !== -1) {
            weeklyEarning[existingWeekIndex].active_charge += item.active_charge;
            weeklyEarning[existingWeekIndex].amount += item.amount;
            weeklyEarning[existingWeekIndex].cancel_charge += item.cancel_charge;
            weeklyEarning[existingWeekIndex].frozen_charge += item.frozen_charge;
            weeklyEarning[existingWeekIndex].unfrozen_charge += item.unfrozen_charge;
          } else {
            weeklyEarning.push({
              active_charge: item.active_charge,
              amount: item.amount,
              cancel_charge: item.cancel_charge,
              date: weekEarning,
              frozen_charge: item.frozen_charge,
              unfrozen_charge: item.unfrozen_charge,
            });
          }
        });

        resultChart.merchant_by_date = weeklyMerchant;
        resultChart.earning_by_date = weeklyEarning;
        setDataByDateSelected(resultChart);
      }

      if (selectedValue === 'M') {
        let monthlyMerchant = [];
        resultChart.merchant_by_date.forEach((item) => {
          const month = dayjs(item.date).format('YYYY/MM');
          const existingMonthIndex = monthlyMerchant.findIndex((entry) => entry.date === month);
          if (existingMonthIndex !== -1) {
            monthlyMerchant[existingMonthIndex].merchant = item.merchant;
          } else {
            monthlyMerchant.push({ date: month, merchant: item.merchant });
          }
        });
        let monthlyEarning = [];
        resultChart.earning_by_date.forEach((item) => {
          const monthEarning = dayjs(item.date).format('YYYY/MM');
          const existingMonthIndex = monthlyEarning.findIndex((entry) => entry.date === monthEarning);
          if (existingMonthIndex !== -1) {
            monthlyEarning[existingMonthIndex].active_charge += item.active_charge;
            monthlyEarning[existingMonthIndex].amount += item.amount;
            monthlyEarning[existingMonthIndex].cancel_charge += item.cancel_charge;
            monthlyEarning[existingMonthIndex].frozen_charge += item.frozen_charge;
            monthlyEarning[existingMonthIndex].unfrozen_charge += item.unfrozen_charge;
          } else {
            monthlyEarning.push({
              active_charge: item.active_charge,
              amount: item.amount,
              cancel_charge: item.cancel_charge,
              date: monthEarning,
              frozen_charge: item.frozen_charge,
              unfrozen_charge: item.unfrozen_charge,
            });
          }
        });

        resultChart.merchant_by_date = monthlyMerchant;
        resultChart.earning_by_date = monthlyEarning;
        setDataByDateSelected(resultChart);
      }

      if (selectedValue === 'Q') {
        const merchantByQuarter = [];
        const earningByQuarter = [];
        for (let i = 0; i < 8; i++) {
          const startQuarter = dayjs(toDate)
            .subtract((i + 1) * 3, 'months')
            .startOf('quarter');
          const endQuarter = dayjs(toDate)
            .subtract(i * 3, 'months')
            .startOf('quarter');

          const quarterStartDate = startQuarter.format('YYYY-MM');
          const quarterEndDate = endQuarter.format('YYYY-MM');

          const merchantInQuarter = resultChart.merchant_by_date.filter((item) =>
            dayjs(item.date).isBetween(startQuarter, endQuarter, null, '[]'),
          );
          const merchant = merchantInQuarter.map((item) => item.merchant);
          merchantByQuarter.push({
            date: `${quarterStartDate}-${quarterEndDate}`,
            merchant: merchant.pop(),
          });

          const earningInQuarter = resultChart.earning_by_date.filter((item) =>
            dayjs(item.date).isBetween(startQuarter, endQuarter, null, '[]'),
          );
          const totalActiveCharge = earningInQuarter.reduce((total, item) => total + item.active_charge, 0);
          const totalAmount = earningInQuarter.reduce((total, item) => total + item.amount, 0);
          const totalCancelCharge = earningInQuarter.reduce((total, item) => total + item.cancel_charge, 0);
          const totalFrozenCharge = earningInQuarter.reduce((total, item) => total + item.frozen_charge, 0);
          const totalUnfrozenCharge = earningInQuarter.reduce((total, item) => total + item.unfrozen_charge, 0);
          const dateEarning = `${quarterStartDate}-${quarterEndDate}`;
          earningByQuarter.push({
            active_charge: totalActiveCharge,
            amount: totalAmount,
            cancel_charge: totalCancelCharge,
            date: dateEarning,
            frozen_charge: totalFrozenCharge,
            unfrozen_charge: totalUnfrozenCharge,
          });
        }

        resultChart.merchant_by_date = merchantByQuarter.reverse();
        resultChart.earning_by_date = earningByQuarter;
        setDataByDateSelected(resultChart);
      }

      if (selectedValue === 'Y') {
        let yearlyMerchant = [];
        resultChart.merchant_by_date.forEach((item) => {
          const month = dayjs(item.date).format('YYYY');
          const existingMonthIndex = yearlyMerchant.findIndex((entry) => entry.date === month);
          if (existingMonthIndex !== -1) {
            yearlyMerchant[existingMonthIndex].merchant = item.merchant;
          } else {
            yearlyMerchant.push({ date: month, merchant: item.merchant });
          }
        });
        let yearEarning = [];
        resultChart.earning_by_date.forEach((item) => {
          const monthEarning = dayjs(item.date).format('YYYY');
          const existingMonthIndex = yearEarning.findIndex((entry) => entry.date === monthEarning);
          if (existingMonthIndex !== -1) {
            yearEarning[existingMonthIndex].active_charge += item.active_charge;
            yearEarning[existingMonthIndex].amount += item.amount;
            yearEarning[existingMonthIndex].cancel_charge += item.cancel_charge;
            yearEarning[existingMonthIndex].frozen_charge += item.frozen_charge;
            yearEarning[existingMonthIndex].unfrozen_charge += item.unfrozen_charge;
          } else {
            yearEarning.push({
              active_charge: item.active_charge,
              amount: item.amount,
              cancel_charge: item.cancel_charge,
              date: monthEarning,
              frozen_charge: item.frozen_charge,
              unfrozen_charge: item.unfrozen_charge,
            });
          }
        });

        resultChart.merchant_by_date = yearlyMerchant;
        resultChart.earning_by_date = yearEarning;

        setDataByDateSelected(resultChart);
      }

      setDataByDateSelected(resultChart);
    } else {
      setDataByDateSelected([]);
    }
    return resultChart;
  };

  const filterData = async (selected, id, fromDate, toDate) => {
    setLoadingAppInfo(true);
    let filtered = [];
    try {
      switch (selected) {
        case 'D':
          filtered = await getDataEarningAndMerchantApp(id, fromDate, toDate);
          break;
        case 'W':
          let fromDateWeek = dayjs(toDate).subtract(21, 'weeks').startOf('week').format('YYYY-MM-DD');
          const dataFor21Weeks = await getDataEarningAndMerchantApp(id, fromDateWeek, toDate, selected);
          filtered = dataFor21Weeks;
          break;
        case 'M':
          const fromDateYearAgo = dayjs(toDate).subtract(11, 'months').startOf('month').format('YYYY-MM-DD');
          const toDateCurrentMonth = dayjs(toDate).endOf('month').format('YYYY-MM-DD');
          const dataFor12Months = await getDataEarningAndMerchantApp(id, fromDateYearAgo, toDateCurrentMonth, selected);
          filtered = dataFor12Months;
          break;
        case 'Q':
          const quartersData = [];
          const quarter = 8;
          const fromDateQuarter = dayjs(toDate)
            .subtract(quarter * 3, 'months')
            .startOf('quarter')
            .format('YYYY-MM-DD');
          const toDateQuarter = dayjs(toDate).format('YYYY-MM-DD');
          const dataForQuarter = await getDataEarningAndMerchantApp(id, fromDateQuarter, toDateQuarter, selected);
          quartersData.push(dataForQuarter);
          filtered = quartersData;
          break;
        case 'Y':
          const yearsData = [];
          const year = 5;
          const fromDateYear = dayjs(toDate).subtract(year, 'years').startOf('year').format('YYYY-MM-DD');
          const toDateYear = dayjs(toDate).format('YYYY-MM-DD');
          const dataForYear = await getDataEarningAndMerchantApp(id, fromDateYear, toDateYear, selected);
          yearsData.push(dataForYear);
          filtered = yearsData;
          break;
        default:
          break;
      }
      setSelectedValue(selected);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingAppInfo(false);
    }
    return filtered;
  };

  const handleSelectFilter = (value) => {
    filterData(value, id, fromDate, toDate);
  };

  const openDetailPosition = (item) => () => {
    keywordName.current = item.keyword;
    setModalShow('isPositionKeyword');
  };

  const openDetailPositionPopular = (item) => () => {
    keywordNamePopular.current = item.keyword;
    setModalShow('isPositionPopularKeyword');
  };

  const openDetailPView = (item, isPView) => () => {
    keywordNamePView.current = item.keyword;
    setModalShow('isPageViewKeyword');
    setIsPViewText(isPView);
  };

  const changeShowBadge = async (item) => {
    const result = await DetailAppApiService.changeKeywordInChart(id, item.keyword, !item.show_in_chart);
    if (result && result.code == 0) {
      item.show_in_chart = !item.show_in_chart;
      let dataNew = [...keywordPosition];
      const index = keywordPosition.findIndex((i) => i.keyword === item.keyword);
      dataNew[index] = item;
      setKeywordPosition(dataNew);
    }
  };

  const removeKeyword = (item) => async () => {
    if (item) {
      setLoadingChangeLanguage(true);
      const result = await DetailAppApiService.deleteKeyword(item.keyword, id);
      if (result.code === 0) {
        asyncKeywordByLanguage(id, language, fromDate, toDate);
        message.success('Delete keyword success');
      } else {
        message.error('Delete keyword error');
      }
      setLoadingChangeLanguage(false);
    }
  };

  const onChangeSort = (pagination, filters, sorter, extra) => {
    dataSortedKeyword.current = extra.currentDataSource;
  };

  return (
    <div className="detail-app">
      {/*Start Modal */}
      <div className="popup-detail-add-partner">
        {modalShow === 'isVisibleAddPartner' && (
          <ModalAddPartner appId={id} disableModal={() => setModalShow()} fetchDataSyncPartner={fetchDataSyncPartner} />
        )}
      </div>
      <div className="popup-detail-position-key">
        {modalShow === 'isPositionKeyword' && (
          <ModalPositionKeyword
            appId={id}
            disableModal={() => setModalShow()}
            fromDate={fromDate}
            toDate={toDate}
            keywordName={keywordName.current}
            language={language}
          />
        )}
      </div>
      <div className="popup-detail-position-popular-key">
        {modalShow === 'isPositionPopularKeyword' && (
          <ModalPositionKeyword
            appId={id}
            disableModal={() => setModalShow()}
            fromDate={fromDate}
            toDate={toDate}
            keywordName={keywordNamePopular.current}
            language={language}
            isPopular
          />
        )}
      </div>
      <div className="popup-detail-page-view-key">
        {modalShow === 'isPageViewKeyword' && (
          <ModalPageViewKeyword
            appId={id}
            disableModal={() => setModalShow()}
            fromDate={fromDate}
            toDate={toDate}
            keywordName={keywordNamePView.current}
            language={language}
            isPViewText={isPViewText}
          />
        )}
      </div>
      <div className="popup-add-competitor">
        {modalShow === 'isVisibleCompetitor' && (
          <ModalCompetitor
            appId={id}
            disableModal={() => setModalShow()}
            dataTabNew={dataTabNew}
            competitor={competitor}
            infoApp={infoApp}
          />
        )}
      </div>
      <div className="popup-keyword-hidden">
        {modalShow === 'isVisibleKeywordHidden' && (
          <ModalKeywordHidden
            appId={id}
            disableModal={() => setModalShow()}
            keywordPosition={keywordPosition}
            addKeywordHidden={addKeywordHidden}
          />
        )}
      </div>
      <div className="popup-keyword-hidden">
        {modalShow === 'isVisibleKeywordFrequency' && (
          <ModalKeywordFrequency
            appId={competitor && competitor.find((comp) => comp.key == activeState)?.appId}
            disableModal={() => setModalShow()}
            dataKeywordsShow={dataKeywordsShow}
            addKeywordHidden={addKeywordHidden}
            detailApp={infoApp.data.detail}
          />
        )}
      </div>
      <div className="popup-keyword-hidden">
        {modalShow === 'isVisibleSuggestKeywordAI' && (
          <ModalSuggestKeywordAI
            appId={id}
            disableModal={() => setModalShow()}
            dataKeywordsShow={dataKeywordsShow}
            addKeywordHidden={addKeywordHidden}
          />
        )}
      </div>
      <div>{modalShow === 'isVisibleCompare' && <ModalOverallCompare handleOk={() => setModalShow()} id={id} />}</div>
      <div className="popup-keyword-hidden">
        {modalShow === 'isVisibleEditApp' && (
          <ModalEditListingApp
            appId={id}
            disableModal={() => setModalShow()}
            data={{
              app_id: infoApp.data.app_id,
              detail: infoApp.data.detail,
              keyword_pos: keywordPosition,
            }}
          />
        )}
      </div>
      <div>
        {modalShow === 'isOpenSetting' && (
          <ModalSettingCompare
            setIsOpenSetting={setModalShow}
            compareApps={competitor}
            setCompetitor={setCompetitor}
            addCompetitor={() => setModalShow('isVisibleCompetitor')}
          />
        )}
      </div>
      <div className="popup-change-keyword">
        {modalShow === 'isEditKeyword' && (
          <ModalAddKeyword
            saveKeyword={saveKeyword}
            handleEditOk={() => setModalShow()}
            keywordExist={dataKeywordsShow}
            id={id}
          />
        )}
      </div>
      <div className="popup-compare-apps">
        <ModalCompareList
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          appId={id}
          infoApp={infoApp?.data || {}}
        />
      </div>
      {/*End Modal */}

      <div className="detail-developers-header">
        <div className="container">
          <Breadcrumb
            items={[
              {
                href: '/',
                title: <HomeOutlined />,
              },
              {
                title: <span>App</span>,
              },
              {
                title: <span>{AppName.current || ''}</span>,
              },
            ]}
            separator={<RightOutlined />}
          />
        </div>
      </div>

      <div className="competitor">
        <div className={isMobile ? 'p-20' : 'container'}>
          <Tabs
            type={activeState != 1 || (infoApp && infoApp.gaConnected && activeState == 1) ? 'editable-card' : 'card'}
            tabBarExtraContent={!loadingAppInfo && operations(isFollow)}
            addIcon={
              activeState != 1 || (infoApp && infoApp.gaConnected && activeState == 1) ? (
                <div className="add-competitor">
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setModalShow('isVisibleCompetitor')}
                  >
                    Add competitor
                  </Button>
                </div>
              ) : (
                <></>
              )
            }
            onChange={(e) => {
              onChangeTab(e);
              asyncKeywordByLanguage(id, language, fromDate, toDate);
            }}
            activeKey={activeState}
            onEdit={onEditTab}
          >
            {competitor &&
              competitor.map((pane) => (
                <TabPane
                  disabled={loading}
                  tab={renderTabTitle(pane.title, pane.key, activeState)}
                  key={pane.key}
                  closable={pane.closable}
                >
                  {pane.content}
                </TabPane>
              ))}
          </Tabs>
        </div>
      </div>

      <div className={isMobile ? 'p-20' : 'container'}>
        <div className="header-detail-app-info">
          <div className="header-detail-app-info-left">
            <div>
              <InfoApp
                id={id}
                editListingApp={() => setModalShow('isVisibleEditApp')}
                editPartnerAppId={() => setModalShow('isVisibleAddPartner')}
                AppName={AppName}
                infoApp={infoApp}
                loadingAppInfo={loadingAppInfo}
                setInfoApp={setInfoApp}
                fetchDataSyncPartner={fetchDataSyncPartner}
                trackingApp={trackingApp}
              />
            </div>
          </div>
          <CategoryCollectionPos
            isUnlist={infoApp?.data?.delete || infoApp?.data?.unlisted}
            dataCategory={dataCatCollection && dataCatCollection.dataCategory}
            dataCollection={dataCatCollection && dataCatCollection.dataCollection}
            infoApp={infoApp}
            token={token}
          />
        </div>
      </div>

      <div className="selected-date_range container">
        {fromDate && toDate && (
          <div className="date-range">
            <span className="title-name">Date Range: </span>
            <div className="date-picker">
              <RangePicker
                defaultValue={[dayjs(fromDate, dateFormat), dayjs(toDate, dateFormat)]}
                format={dateFormat}
                allowClear={false}
                onChange={onChangeDateRange}
                disabledDate={disabledFutureDate}
                style={{ marginRight: '10px' }}
              />

              <Button
                type="primary"
                loading={loadingAppInfo}
                icon={<SearchOutlined />}
                className="icon-search-date"
                onClick={searchByDate}
              >
                Search
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="body-detail-app">
        <div className={isMobile ? 'p-20' : 'container'}>
          <div className="table-keyword-position">
            <div className="header-table">
              <div className="button-add">
                {activeState && infoApp && activeState == 1 && (
                  <div className="left">
                    {!infoApp.gaConnected && (
                      <span style={{ marginRight: '10px' }}>
                        <MyLink href={''} onClick={syncGoogleAnalytic}>
                          Connect GA
                        </MyLink>{' '}
                        to show values of all columns
                      </span>
                    )}
                    <Tooltip
                      title="Suggest Keyword AI"
                      className="reload"
                      onClick={() => setModalShow('isVisibleSuggestKeywordAI')}
                    >
                      <Image src={'/image/ai-keyword.png'} width={30} height={28} alt="icon-keyword-frequency" />
                    </Tooltip>
                    <Tooltip
                      title="Keyword Frequency"
                      className="reload"
                      onClick={() => setModalShow('isVisibleKeywordFrequency')}
                    >
                      <Image src={'/image/keyword-frequency.png'} width={20} height={19} alt="icon-keyword-frequency" />
                    </Tooltip>
                    <Tooltip title="Reload All" className="reload" onClick={reloadKeyword()}>
                      <ReloadOutlined />
                    </Tooltip>
                    {renderButtonAddKey(
                      infoApp.isOwner,
                      !infoApp.isOwner ? onConfirm : () => setModalShow('isEditKeyword'),
                    )}
                  </div>
                )}
                {activeState && activeState != 1 && (
                  <Tooltip
                    title="Keyword Frequency"
                    className="reload"
                    onClick={() => setModalShow('isVisibleKeywordFrequency')}
                  >
                    <Image src={'/image/keyword-frequency.png'} width={20} height={19} alt="icon-keyword-frequency" />
                  </Tooltip>
                )}
                <div
                  className={`save-order ${dataKeywordsShow.length === 0 ? 'disabled' : ''}`}
                  onClick={dataKeywordsShow.length !== 0 ? saveOrder : null}
                >
                  Save order
                </div>

                <div className="language">
                  <SelectByLanguage
                    selectValue={language}
                    handleSelectChange={handleSelectChange}
                    disabled={loadingChangeLanguage || dataKeywordsShow.length == 0}
                  />
                </div>
              </div>
            </div>
            <TableKeyword
              openDetailPosition={openDetailPosition}
              openDetailPositionPopular={openDetailPositionPopular}
              openDetailPView={openDetailPView}
              changeShowBadge={changeShowBadge}
              removeKeyword={removeKeyword}
              dataKeywordsShow={dataKeywordsShow}
              setDataKeywordsShow={setDataKeywordsShow}
              onChangeSort={onChangeSort}
              loading={loadingChangeLanguage || loading}
              appId={id}
              tabKey={activeState}
              infoApp={infoApp}
              countKeyword={countKeyword}
              setModalShow={setModalShow}
            />
          </div>
          {infoApp && infoApp.isOwner && infoApp.partnerConnected && (
            <>
              <div className="chart-merchant-growth-earnings">
                <div className="filter-chart">
                  <SelectCartHeader
                    title={'Select filter by time period: '}
                    value={selectedValue}
                    onChange={handleSelectFilter}
                  />
                </div>
                <ChartMerchantEarnings
                  loading={loadingAppInfo}
                  value={dataByDate}
                  filterSelected={dataByDateSelected}
                  selectedValue={selectedValue}
                />
              </div>
              {dataByDate && dataByDate.earning_by_pricing && dataByDate.earning_by_pricing.length >= 1 && (
                <div>
                  <EarningByPlan value={dataByDate} />
                </div>
              )}

              <div className="chart-retention">
                <ChartInstallUnInstall loading={loadingAppInfo} value={dataByDate} />
              </div>
              <div className="churn-reinstall">
                <ChurnAndReinstall
                  loading={loadingAppInfo}
                  value={dataByDate}
                  appId={id}
                  fromDate={fromDate}
                  toDate={toDate}
                />
              </div>
              <div className="chart-install-uninstall">
                <Retention fromDate={fromDate} toDate={toDate} retention={retentionData} id={id} />
              </div>
            </>
          )}
          <div className="customer-lifecycle">
            {infoApp && infoApp.isOwner && (infoApp.gaConnected || infoApp.partnerConnected) && (
              <CustomerLifecycle value={dataCustomLifecycle} infoApp={infoApp} />
            )}
          </div>

          <div className="chart-weekly-category-keyword">
            <ChartCategory
              loading={loadingAppInfo}
              dataBestMatch={
                dataDetailApp?.dataCategoryPos?.best_match ? createData(dataDetailApp.dataCategoryPos.best_match) : null
              }
              dataPopular={
                dataDetailApp?.dataCategoryPos?.popular ? createData(dataDetailApp.dataCategoryPos.popular) : null
              }
              dataWeeklyChangeBestMatch={
                dataKeywordsChange &&
                createData(
                  dataKeywordsChange.bestMatch.best_match
                    ? dataKeywordsChange.bestMatch.best_match
                    : dataKeywordsChange.bestMatch,
                )
              }
              dataWeeklyChangePopular={
                dataKeywordsChange &&
                createData(
                  dataKeywordsChange.popular.popular ? dataKeywordsChange.popular.popular : dataKeywordsChange.popular,
                )
              }
            />
          </div>
          <div className="chart-weekly-review-rating">
            <div className="chart-weekly-reviews">
              <ChartWeeklyRating
                isReview
                value={dataDetailApp && createData(dataDetailApp.reviewsChange)}
                loading={loadingAppInfo}
                infoApp={infoApp}
              />
            </div>
            <div className="chart-weekly-rating">
              <ChartWeeklyRating
                value={dataDetailApp && createData(dataDetailApp.ratingChange)}
                loading={loadingAppInfo}
                infoApp={infoApp}
              />
            </div>
          </div>
          <div className="chart-weekly-change-trend">
            <div id="chart-log-weekly" className="chart-weekly-change">
              <ChartChangeLog
                value={
                  dataDetailApp &&
                  convertDataChartChangeLog(dataDetailApp && dataDetailApp.changeLog ? dataDetailApp.changeLog : [])
                }
                loading={loadingAppInfo}
                infoApp={infoApp}
              />
            </div>
          </div>
          <div className="data-from-ga">
            {infoApp && infoApp.isOwner && infoApp.gaConnected && (
              <DataGA value={dataCustomLifecycle && dataCustomLifecycle.dataGa} appId={idDetail} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
