import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class StoreApiService {
  static async searchStores(search, page, size, appId, category, source) {
    const body = {
      q: search,
      page: page,
      per_page: size,
      app_id: appId,
      category: category,
      source: source,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const result = await CommonCall(`${URL_API}store/search_store`, header);
    return result;
  }

  static async getDetailStore(domain, source) {
    const url = `${URL_API}store/detail_store?shop_domain=${encodeURIComponent(domain)}&source=${encodeURIComponent(
      source,
    )}`;
    const result = await CommonCall(url);
    return result;
  }

  static async getDetailAppInStore(domain, id) {
    const result = await CommonCall(`${URL_API}/store/detail_app_in_store/${domain}/${id}`);
    return result;
  }

  static async getAllAppStore() {
    const result = await CommonCall(`${URL_API}store/all_app`);
    return result;
  }

  static async getAllAppStoreToServer(token) {
    const result = await fetch(`${URL_API}store/all_app`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await result.json();
    return data;
  }

  static async searchStoresToServer(search, page, size, appId, category, source, token) {
    const body = {
      q: search,
      page: page,
      per_page: size,
      app_id: appId,
      category: category,
      source: source,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const result = await fetch(`${URL_API}store/search_store`, header);

    const data = await result.json();
    return data;
  }

  static async getDetailStoreToServer(domain, source, token) {
    const url = `${URL_API}store/detail_store?shop_domain=${encodeURIComponent(domain)}&source=${encodeURIComponent(
      source,
    )}`;
    const header = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const result = await fetch(url, header);

    const data = await result.json();
    return data;
  }
}
