'use client';

import { Button, Form, Input, Modal, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import './ModalAddPartner.scss';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import dynamic from 'next/dynamic';
import ShopifyApiService from '@/api-services/api/ShopifyApiService';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import MyLink from '../ui/link/MyLink';

const ModalConnectShopify = dynamic(() => import('../ui/modal/ModalConnectShopify'), {
  ssr: false,
});

export default function ModalAddPartner({
  partnerId,
  disableModal,
  fetchDataSyncPartner,
  fetchDataMyPartner,
  fetchListAppInPartners,
  getUniqueAppsInPartner,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [listPartner, setListPartner] = useState([]);
  const [form] = Form.useForm();
  const pathname = usePathname();
  const isPathMyPartner = pathname === '/my-partner';
  const appId = pathname.split('/')[2];

  const handleOk = () => {
    disableModal();
  };

  const handleCancel = () => {
    disableModal();
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
    if (isPathMyPartner) {
      fetchListAppInPartners();
    } else {
      fetchDataListPartner();
    }
  }, []);

  const addPartnerAppId = async (values) => {
    setIsLoading(true);

    const data = isPathMyPartner
      ? { appId: values.appId, appGid: values.appGid, partnerApiId: partnerId }
      : { appId: appId, appGid: values.appGid, partnerApiId: selectValue };

    const result = await DetailAppApiService.saveAppGid(data);
    if (result && result.code === 0) {
      message.success('Add partner app id success');
      disableModal();
      const data = isPathMyPartner ? fetchDataMyPartner() : fetchDataSyncPartner();
      return data;
    } else {
      message.error('Add partner app id error');
    }
    setIsLoading(false);
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

  const appInPartnerOptions =
    getUniqueAppsInPartner?.map((appInPartner) => ({
      value: appInPartner.appId,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image src={appInPartner.appIcon} width={24} height={24} alt={appInPartner.name} />
          <span>{appInPartner.name}</span>
        </div>
      ),
    })) || [];

  return (
    <>
      <Modal
        width={420}
        title={`${isPathMyPartner ? 'Add App to partner' : 'Add App ID from partner'}`}
        visible={true}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="popup-add-partner-app-id">
          <Form form={form} name="addPartner" onFinish={addPartnerAppId} layout="vertical">
            {isPathMyPartner ? (
              <Form.Item label="App" name="appId" rules={[{ required: true, message: 'App is required' }]}>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select App"
                  options={appInPartnerOptions}
                  optionLabelProp="label"
                  popupMatchSelectWidth={false}
                />
              </Form.Item>
            ) : (
              <Form.Item
                label="Partner"
                name="partnerApiId"
                rules={[{ required: true, message: 'Partner is required' }]}
              >
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
            )}
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
