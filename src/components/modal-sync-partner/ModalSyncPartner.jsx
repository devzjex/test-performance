'use client';

import { AutoComplete, Button, Empty, Form, Input, Modal, Select, Spin, message } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LoadingOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import './ModalSyncPartner.scss';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import dynamic from 'next/dynamic';
import ShopifyApiService from '@/api-services/api/ShopifyApiService';
import Image from 'next/image';
import SearchDataApiService from '@/api-services/api/SearchDataApiService';
import { debounce } from 'lodash';
import MyLink from '../ui/link/MyLink';

const ModalConnectShopify = dynamic(() => import('../ui/modal/ModalConnectShopify'), {
  ssr: false,
});

export default function ModalSyncPartner(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [listPartner, setListPartner] = useState([]);
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const handleOk = () => {
    props.disableModal();
  };

  const handleCancel = () => {
    props.disableModal();
  };

  const fetchDataListPartner = async () => {
    const dataListPartner = await ShopifyApiService.listPartnerConnected();
    if (dataListPartner && dataListPartner.code === 0) {
      setListPartner(dataListPartner.results);
    } else {
      message.error('Get list partner connected error');
    }
  };

  useEffect(() => {
    fetchDataListPartner();
  }, []);

  const addPartnerAppId = async (values) => {
    setIsLoading(true);
    try {
      const data = { appId: selectedApp.appId, appGid: values.appGid, partnerApiId: values.partnerApiId };

      const result = await DetailAppApiService.saveAppGid(data);
      if (result && result.code === 0) {
        message.success('Add partner app id success');
        props.disableModal();
        props.fetchDataMyPartner();
      } else {
        message.error('Add partner app id error');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChange = (value) => {
    setSelectValue(value);
  };

  const openCreateNewPartnerModal = () => {
    setIsModalVisible(true);
  };

  const partnerOptions =
    listPartner &&
    listPartner.map((partner) => {
      const labelPartner = partner.partner_shop_name
        ? `${partner.partner_shop_name} - ${partner.partner_api_id}`
        : partner.partner_api_id;
      return {
        value: partner.partner_api_id,
        label: labelPartner,
      };
    });

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value) => {
        if (!value) return;
        setSearchLoading(true);
        try {
          const response = await SearchDataApiService.searchData(value, 1, 25);
          const apps = response.data.apps;

          if (apps.length === 0) {
            setSearchResults([
              {
                label: <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description="No results found" />,
              },
            ]);
          } else {
            const results = apps.map((app) => ({
              app_id: app.detail.app_id,
              value: app.detail.name,
              label: (
                <div key={app.detail.app_id} style={{ display: 'flex', alignItems: 'center' }}>
                  {app.detail && app.detail.app_icon ? (
                    <Image src={app.detail.app_icon} alt={app.detail.name} width={25} height={25} />
                  ) : (
                    <Image src={'/image/no-image.webp'} alt={'no image'} width={25} height={35} className="no-image" />
                  )}
                  &nbsp;
                  <span>{app.detail.name}</span>
                </div>
              ),
              appIcon: app.detail.app_icon,
            }));
            setSearchResults(results);
          }
        } catch (error) {
          console.error('Failed to fetch search results:', error);
        } finally {
          setSearchLoading(false);
        }
      }, 300),
    [],
  );

  const onSearchApp = useCallback(
    (value) => {
      setSearchLoading(true);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleSelect = (value, option) => {
    setSelectedApp({
      appIcon: option.appIcon,
      appId: option.app_id,
    });
  };

  return (
    <>
      <Modal
        width={420}
        title={'Add App ID from partner'}
        visible={true}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="popup-add-partner-app-id">
          <Form form={form} name="addPartner" onFinish={addPartnerAppId} layout="vertical">
            <Form.Item label="App" name="appId" rules={[{ required: true, message: 'App is required' }]}>
              <AutoComplete
                options={searchResults}
                onSearch={onSearchApp}
                onSelect={handleSelect}
                notFoundContent={
                  searchLoading ? (
                    <Spin
                      indicator={<LoadingOutlined spin />}
                      size="small"
                      style={{ display: 'flex', justifyContent: 'center' }}
                    />
                  ) : null
                }
                popupMatchSelectWidth={false}
              >
                <Input
                  className="input-style"
                  size="large"
                  placeholder="Find an app by name"
                  prefix={
                    selectedApp ? (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Image src={selectedApp.appIcon} alt={selectedApp.appIcon} width={20} height={20} />
                      </div>
                    ) : (
                      <SearchOutlined />
                    )
                  }
                />
              </AutoComplete>
            </Form.Item>
            <Form.Item label="Partner" name="partnerApiId" rules={[{ required: true, message: 'Partner is required' }]}>
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Search and select partners"
                onChange={handleSelectChange}
                value={selectValue || undefined}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <div className="options-btn" onClick={openCreateNewPartnerModal}>
                      <Button type="link" icon={<PlusCircleOutlined />} className="btn-create_new_partner">
                        Create New Partner
                      </Button>
                    </div>
                  </>
                )}
                options={partnerOptions}
                popupMatchSelectWidth={false}
              />
            </Form.Item>
            <Form.Item label="App GID" name="appGid" rules={[{ required: true, message: 'App GID is required' }]}>
              <Input placeholder="App GID" />
            </Form.Item>
            <div className="link-usage">
              <MyLink
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.letsmetrix.com/get-started/connect-shopify-api/sync-app-with-partner-data"
              >
                How to sync app with Partner data
              </MyLink>
            </div>
            <div className="button-add-partner">
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Add
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
      {isModalVisible && (
        <ModalConnectShopify
          visible={isModalVisible}
          disableModal={() => setIsModalVisible(false)}
          setNewPartnerId={(newPartnerId) => {
            setListPartner((prevList) => [...prevList, { partner_api_id: newPartnerId, partner_shop_name: '' }]);
            setSelectValue(newPartnerId);
            form.setFieldsValue({ partnerApiId: newPartnerId });
          }}
          listPartner={listPartner}
        />
      )}
    </>
  );
}
