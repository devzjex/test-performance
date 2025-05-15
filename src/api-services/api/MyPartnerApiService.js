import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';
import { getDataByDate } from './DashboardApiService';

export default class MyPartnerApiService {
  static async getMyPartners() {
    const response = await CommonCall(`${URL_API}organization/list`);
    return response;
  }
  static async getListAppInPartnerts(partnerId) {
    const response = await CommonCall(`${URL_API}organization/app_in_partner/${partnerId}`);
    return response;
  }
  static async getAppDetailPartnerId(partnerId, fromDate, toDate) {
    const header = { method: 'GET' };
    const api = getDataByDate('organization/dashboard/', partnerId, fromDate, toDate);
    const response = await CommonCall(api, header);
    return response;
  }

  static async getMyPartnersToServer(token) {
    const response = await fetch(`${URL_API}organization/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  }

  static async getAppDetailPartnerIdToServer(partnerId, fromDate, toDate, token) {
    const header = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const api = getDataByDate('organization/dashboard/', partnerId, fromDate, toDate);
    const response = await fetch(api, header);

    const data = await response.json();
    return data;
  }
}
