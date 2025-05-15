import AuthorizedInstance from '@/api-services/authorized';
import CommonCall from '@/api-services/network/CommonCall';
import env from '@/utils/env';
import { DOMAIN, URL_API, URL_SUB_API } from '@/constants/ApiUrl';

const AppService = AuthorizedInstance(env.api.baseUrl.app);

export default class AuthApiService {
  static async loginApp({ body }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  }

  static async registryTrialSubscriptions(data) {
    const response = await CommonCall(`${URL_SUB_API}/registry`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  static async resetPassword({ params, body }) {
    const response = await AppService.fetch(`/auth/reset_password`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      params,
    });
    return response;
  }

  static async changePassword({ token, params, body }) {
    const response = await AppService.fetch(`/auth/create_new_password`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response;
  }

  static async changeSetPassword({ tokenLocal, params, body }) {
    const response = await AppService.fetch(`/auth/set_password`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenLocal}`,
      },
      params,
    });
    return response;
  }

  static async changePasswordLogged({ tokenLocal, params, body }) {
    const response = await AppService.fetch(`/auth/change_password`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenLocal}`,
      },
      params,
    });
    return response;
  }

  static async googleLogin({ params }) {
    const response = await AppService.fetch(`/google_login`, {
      method: 'GET',
      params,
    });
    return response;
  }

  static async loginGoogle(state, code) {
    const response = await CommonCall(
      `${URL_API}google_login_callback?redirect_url=${DOMAIN}google_login_callback&state=${state}&code=${code}`,
      {
        method: 'GET',
      },
    );
    return response;
  }

  static async logoutPage() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
