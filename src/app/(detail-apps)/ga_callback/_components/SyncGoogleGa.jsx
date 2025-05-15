'use client';

import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import './SyncGoogleGa.scss';
import { useRouter } from 'next/navigation';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';

function SyncGoogleGa() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [state, setState] = useState(null);
  const [code, setCode] = useState(null);

  useEffect(() => {
    setIsClient(true);

    if (isClient) {
      const urlParams = new URLSearchParams(window.location.search);
      setState(urlParams.get('state'));
      setCode(urlParams.get('code'));
      setError(urlParams.get('error'));
    }
  }, [isClient]);

  useEffect(() => {
    async function syncGoogle() {
      if (error) {
        const result = await DetailAppApiService.gaSyncGoogle(state, '');
        if (result) {
          const id = result.app_id;
          if (id) {
            router.push(`/app/${id}?error=access_denied`);
          } else {
            router.push('/');
          }
        }
      } else {
        if (state && code) {
          const result = await DetailAppApiService.gaSyncGoogle(state, code);
          if (result && result.code == 0) {
            const id = result.app_id;
            message.success(result.message);
            if (id) {
              router.push(`/app/${id}`);
            } else {
              router.push('/');
            }
            return;
          }
          router.push(result && result.app_id ? `/app/${result.app_id}` : '/');
          message.error(result.message);
        }
      }
    }
    syncGoogle();
  }, []);
  return (
    <div className="flex flex-col items-center">
      <div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="text-spin">Waiting for Google Analytics connection...</p>
    </div>
  );
}
export default SyncGoogleGa;
