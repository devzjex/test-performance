'use client';

import React, { useEffect, useState } from 'react';
import './LoginPage.scss';
import AuthForm from '@/layouts/auth-form/AuthForm';
import { Form } from 'antd';
import Input from '@/components/ui/input/Input';
import Checkbox from '@/components/ui/checkbox/Checkbox';
import Button from '@/components/ui/button/Button';
import GoogleButton from '@/components/ui/google-button/GoogleButton';
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ETypeNotification } from '@/common/enums';
import { showNotification, validationRules } from '@/utils/functions';
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from '@/common/constants';
import { LayoutPaths, Paths } from '@/utils/router';
import { loginApps, resetLoginError } from '@/redux/slice/auth/LoginApp';
import Auth from '@/utils/store/Authentication';
import MyLink from '@/components/ui/link/MyLink';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const {
    isLoading: loginAppLoading,
    error: loginError,
    user,
    accessToken,
    refreshToken,
    username,
    accessStore,
    hasPassword,
  } = useSelector((state) => state.loginApp);
  const previousUrl = Auth.getPreviousUrl() || '/';

  const handleSubmit = (values) => {
    dispatch(loginApps(values));
    router.refresh();
  };

  useEffect(() => {
    if (user && accessToken) {
      Auth.setAccessToken(accessToken);
      Auth.setCurrentUser(user);
      Auth.setCurrentUserName(username);
      Auth.setRefreshToken(refreshToken);
      Auth.setIsStore(accessStore);
      Auth.setIsHasPassword(hasPassword);
      router.push(previousUrl);
    }
  }, [user, accessToken, refreshToken, username, accessStore, router]);

  useEffect(() => {
    if (loginError) {
      showNotification(ETypeNotification.ERROR, loginError || 'An error occurred');
      dispatch(resetLoginError());
    }
  }, [loginError, dispatch]);

  return (
    <div className="LoginApp">
      <AuthForm>
        <div className="LoginApp-logo">
          <Image src="/image/logo-primary.svg" alt="" onClick={() => router.push('/')} width={100} height={100} />
        </div>
        <div className="LoginApp-description">
          Start your 14 day free trial <br />
          <span>
            Don't have an account yet? <MyLink href={`${LayoutPaths.Auth}${Paths.Register}`}>Sign Up</MyLink>
          </span>
        </div>
        <Form layout="vertical" form={form} className="LoginApp-form" onFinish={handleSubmit}>
          <Form.Item
            name="username"
            rules={[validationRules.required(), validationRules.minLength(4), validationRules.maxLength(60)]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" size="large" className="user-name" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[validationRules.required(), validationRules.minLength(5), validationRules.maxLength(60)]}
          >
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
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <div className="LoginApp-remember flex justify-between items-center">
            <Form.Item>
              <Checkbox label="Remember me" />
            </Form.Item>
            <MyLink href={`${LayoutPaths.Auth}${Paths.ResetPassword}`}>Forgot your password?</MyLink>
          </div>
          <div className="LoginApp-submit">
            <Button
              className="signIn-button"
              title="Sign In"
              size="large"
              htmlType="submit"
              loading={loginAppLoading}
            />
          </div>
        </Form>
        <div className="LoginApp-third-party flex items-center justify-center text-center">
          <span>or log in with Google</span>
        </div>
        <div className="LoginApp-socials">
          <GoogleButton />
        </div>

        <div className="LoginApp-term">
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
      </AuthForm>
    </div>
  );
}
