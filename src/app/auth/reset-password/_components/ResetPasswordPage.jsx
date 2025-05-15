'use client';

import React, { useEffect, useState } from 'react';
import './ResetPasswordPage.scss';
import AuthForm from '@/layouts/auth-form/AuthForm';
import { Form } from 'antd';
import Input from '@/components/ui/input/Input';
import Button from '@/components/ui/button/Button';
import { LayoutPaths, Paths } from '@/utils/router';
import { showNotification, validationRules } from '@/utils/functions';
import { useRouter } from 'next/navigation';
import { MailOutlined } from '@ant-design/icons';
import AuthApiService from '@/api-services/api/auth/AuthApiService';
import { ETypeNotification } from '@/common/enums';
import MyLink from '@/components/ui/link/MyLink';

export default function ResetPasswordPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);

  const handleSubmit = async (values) => {
    setResetPasswordLoading(true);
    try {
      const result = await AuthApiService.resetPassword({ body: values });
      if (result.code === 200) {
        setEmail(values.email);
        showNotification(ETypeNotification.SUCCESS, 'Request has been successfully sent to your email.');
      }
    } catch (err) {
      setError('An error has occurred! Please try again.');
    } finally {
      setResetPasswordLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      showNotification(ETypeNotification.ERROR, 'An error occurred');
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    if (email) {
      router.push(`${LayoutPaths.Auth}${Paths.CheckYourEmail}?email=${email}`);
    }
  }, [email, router]);

  return (
    <div className="ResetPassword">
      <AuthForm>
        <div className="ResetPassword-title">Reset Password</div>
        <div className="ResetPassword-description">
          Please enter the email associated with your account and we'll send. a email with instuctions to reset your
          password.
        </div>
        <Form layout="vertical" form={form} className="ResetPassword-form" onFinish={handleSubmit}>
          <Form.Item name="email" rules={[validationRules.required(), validationRules.email()]}>
            <Input prefix={<MailOutlined />} placeholder="Email " size="large" />
          </Form.Item>
          <div className="ResetPassword-submit">
            <Button title="Send Instructions" size="large" htmlType="submit" loading={resetPasswordLoading} />
          </div>
        </Form>
        <div className="ResetPassword-description">
          <i>
            You remember your password?{' '}
            <span>
              <MyLink href={`${LayoutPaths.Auth}${Paths.LoginApp}`}>Sign in</MyLink>
            </span>
          </i>
        </div>
      </AuthForm>
    </div>
  );
}
