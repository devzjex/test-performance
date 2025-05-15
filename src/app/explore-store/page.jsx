import LayoutMain from '@/layouts/main/LayoutMain';
import React from 'react';
import ExploreStore from './_components/ExploreStore';
import StoreApiService from '@/api-services/api/StoreApiService';
import { cookies } from 'next/headers';

export default async function ExploreStorePage() {
  const token = cookies().get('accessToken')?.value;

  let initialAllAppStore = {
    storeAllApp: [],
    listStore: [],
  };

  try {
    const [dataStoreApp, dataListApp] = await Promise.all([
      StoreApiService.getAllAppStoreToServer(token),
      StoreApiService.searchStoresToServer('', 1, 20, '', '', 'letsmetrix', token),
    ]);

    if (dataStoreApp.code === 0 && dataListApp.code === 0) {
      initialAllAppStore = {
        storeAllApp: dataStoreApp.list_app,
        listStore: dataListApp.list_store.map((item) => ({
          ...item,
          id: item._id,
          domain: item.shop_domain,
          name: item.shop_name,
          apps: item.apps,
        })),
      };
    }
  } catch (error) {
    console.error('Error fetching all app store:', error);
  }

  return (
    <LayoutMain>
      <ExploreStore initialAllAppStore={initialAllAppStore} />
    </LayoutMain>
  );
}
