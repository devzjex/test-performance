'use client';

import AuthApiService from '@/api-services/api/auth/AuthApiService';
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from '@/common/constants';
import { ETypeNotification } from '@/common/enums';
import Input from '@/components/ui/input/Input';
import AuthForm from '@/layouts/auth-form/AuthForm';
import Auth from '@/utils/store/Authentication';
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';
import './page.scss';
import Button from '@/components/ui/button/Button';
import { LayoutPaths } from '@/utils/router';
import { showNotification } from '@/utils/functions';
import { useRouter } from 'next/navigation';
import MyLink from '@/components/ui/link/MyLink';

export default function SetPasswordPage() {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tokenLocal = Auth.getAccessToken();
  const router = useRouter();

  const validateNewPassword = ({ getFieldValue }) => ({
    validator(rule, value) {
      const re = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]*$/;
      if (!value) {
        return Promise.reject('New password is required');
      } else if (!re.test(value)) {
        return Promise.reject('Password must contain at least one letter and one number');
      } else {
        return Promise.resolve();
      }
    },
  });

  const onChangePass = async () => {
    setIsLoading(true);
    try {
      const newPassword = form.getFieldValue('newPass');

      if (!tokenLocal) {
        showNotification(ETypeNotification.SUCCESS, 'Token is missing');
        return;
      }

      const result = await AuthApiService.changeSetPassword({
        tokenLocal,
        body: { new_password: newPassword },
      });

      if (result.code === 0) {
        showNotification(ETypeNotification.SUCCESS, `Set password in successfully`);
        router.push(`${LayoutPaths.Guest}`);
        form.resetFields();
      }
    } catch (error) {
      showNotification(ETypeNotification.ERROR, 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm>
      <div className="set-password">
        <div className="logo">
          <Image
            src="/image/logo-primary.svg"
            alt="logo-lmt"
            onClick={() => router.push(`${LayoutPaths.Guest}`)}
            width={100}
            height={100}
          />
        </div>
        <div className="description">Please enter your new password below.</div>
        <div className="auth-box">
          <Form form={form} className="form-login">
            <Form.Item name="newPass" required rules={[validateNewPassword]}>
              <Input
                type={showPassword ? 'text' : 'password'}
                prefix={<LockOutlined />}
                suffix={
                  showPassword ? (
                    <EyeOutlined onClick={() => setShowPassword(false)} />
                  ) : (
                    <EyeInvisibleOutlined onClick={() => setShowPassword(true)} />
                  )
                }
                placeholder="New password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                className="changePW-button"
                title="Set password"
                size="large"
                htmlType="submit"
                onClick={onChangePass}
                loading={isLoading}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="term">
          Registering to this website, you accept our{' '}
          <MyLink href={TERMS_OF_USE_URL} target="_blank" rel="noreferrer">
            terms of use
          </MyLink>{' '}
          and{' '}
          <MyLink href={PRIVACY_POLICY_URL} target="_blank" rel="noreferrer">
            privacy statements
          </MyLink>
          .
        </div>
      </div>
    </AuthForm>
  );
}
