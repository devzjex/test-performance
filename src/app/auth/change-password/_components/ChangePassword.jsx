'use client';

import { Form } from 'antd';
import React, { useState } from 'react';
import './ChangePassword.scss';
import AuthForm from '@/layouts/auth-form/AuthForm';
import Image from 'next/image';
import AuthApiService from '@/api-services/api/auth/AuthApiService';
import { useRouter } from 'next/navigation';
import { LayoutPaths, Paths } from '@/utils/router';
import Button from '@/components/ui/button/Button';
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined } from '@ant-design/icons';
import Input from '@/components/ui/input/Input';
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from '@/common/constants';
import Auth from '@/utils/store/Authentication';
import { ETypeNotification } from '@/common/enums';
import { showNotification } from '@/utils/functions';
import MyLink from '@/components/ui/link/MyLink';

export default function ChangePassword({ token }) {
  const [form] = Form.useForm();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState({
    newPass: false,
    confirmPass: false,
  });
  const tokenLocal = Auth.getAccessToken();
  const isTokenParams = token ? token : tokenLocal;

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

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(rule, value) {
      if (!value) {
        return Promise.reject('Confirm password is required');
      } else if (value !== getFieldValue('newPass')) {
        return Promise.reject('Confirm password does not match');
      } else {
        return Promise.resolve();
      }
    },
  });

  const onChangePass = async () => {
    setLoadingSearch(true);
    try {
      const newPassword = form.getFieldValue('newPass');
      const password = form.getFieldValue('password');
      const new_password = form.getFieldValue('new_password');

      if (!isTokenParams) {
        showNotification(ETypeNotification.SUCCESS, 'Token is missing');
        return;
      }

      const result = token
        ? await AuthApiService.changePassword({
            token,
            body: { new_password: newPassword },
          })
        : await AuthApiService.changePasswordLogged({
            tokenLocal,
            body: { password, new_password },
          });

      if (result.code === 200 || result.code === 0) {
        showNotification(ETypeNotification.SUCCESS, `Change password in successfully`);
        router.push(token ? `${LayoutPaths.Auth}${Paths.LoginApp}` : `${LayoutPaths.Guest}`);
        form.resetFields();
      } else if (result.code === 101) {
        showNotification(ETypeNotification.ERROR, 'Wrong old password');
      } else {
        showNotification(ETypeNotification.ERROR, 'The new password cannot be the same as the old password');
      }
    } catch (error) {
      showNotification(ETypeNotification.ERROR, 'An error occurred');
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <AuthForm>
      <div className="change-password">
        <div className="logo">
          <Image src="/image/logo-primary.svg" alt="" onClick={() => router.push('/')} width={100} height={100} />
        </div>
        <div className="description">Please enter your new password below.</div>
        <div className="auth-box">
          <Form form={form} className="form-login">
            {token ? (
              <>
                <Form.Item name="newPass" required rules={[validateNewPassword]}>
                  <Input
                    type={showPassword.newPass ? 'text' : 'password'}
                    prefix={<LockOutlined />}
                    suffix={
                      showPassword.newPass ? (
                        <EyeOutlined onClick={() => setShowPassword({ ...showPassword, newPass: false })} />
                      ) : (
                        <EyeInvisibleOutlined onClick={() => setShowPassword({ ...showPassword, newPass: true })} />
                      )
                    }
                    placeholder="New password"
                    size="large"
                  />
                </Form.Item>
                <Form.Item name="confirmPass" required rules={[validateConfirmPassword]}>
                  <Input
                    type={showPassword.confirmPass ? 'text' : 'password'}
                    prefix={<LockOutlined />}
                    suffix={
                      showPassword.confirmPass ? (
                        <EyeOutlined onClick={() => setShowPassword({ ...showPassword, confirmPass: false })} />
                      ) : (
                        <EyeInvisibleOutlined onClick={() => setShowPassword({ ...showPassword, confirmPass: true })} />
                      )
                    }
                    placeholder="Confirm password"
                    size="large"
                  />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item name="password" required rules={[]}>
                  <Input
                    type={showPassword.newPass ? 'text' : 'password'}
                    prefix={<LockOutlined />}
                    suffix={
                      showPassword.newPass ? (
                        <EyeOutlined onClick={() => setShowPassword({ ...showPassword, newPass: false })} />
                      ) : (
                        <EyeInvisibleOutlined onClick={() => setShowPassword({ ...showPassword, newPass: true })} />
                      )
                    }
                    placeholder="Old password"
                    size="large"
                  />
                </Form.Item>
                <Form.Item name="new_password" required rules={[validateNewPassword]}>
                  <Input
                    type={showPassword.confirmPass ? 'text' : 'password'}
                    prefix={<LockOutlined />}
                    suffix={
                      showPassword.confirmPass ? (
                        <EyeOutlined onClick={() => setShowPassword({ ...showPassword, confirmPass: false })} />
                      ) : (
                        <EyeInvisibleOutlined onClick={() => setShowPassword({ ...showPassword, confirmPass: true })} />
                      )
                    }
                    placeholder="New password"
                    size="large"
                  />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button
                className="changePW-button"
                title="Change password"
                size="large"
                htmlType="submit"
                onClick={onChangePass}
                loading={loadingSearch}
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
