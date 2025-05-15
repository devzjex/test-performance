'use client';

import { ETypeNotification } from '@/common/enums';
import { LayoutPaths, Paths } from '@/utils/router';
import Button from '@/components/ui/button/Button';
import AuthForm from '@/layouts/auth-form/AuthForm';
import { showNotification } from '@/utils/functions';
import { Form } from 'antd';
import React from 'react';
import './CheckYourEmailPage.scss';
import { useSearchParams } from 'next/navigation';
import AuthApiService from '@/api-services/api/auth/AuthApiService';
import MyLink from '@/components/ui/link/MyLink';

export default function CheckYourEmailPage() {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get('email');

  const handleSubmit = async () => {
    try {
      const data = { email: urlEmail };
      const result = await AuthApiService.resetPassword({ body: data });
      if (result.code === 200) {
        showNotification(ETypeNotification.SUCCESS, 'Request has been successfully sent to your email.');
      }
    } catch (err) {
      showNotification(ETypeNotification.ERROR, 'An error occurred');
    }
  };

  return (
    <div className="CheckYourEmail">
      <AuthForm>
        <div className="CheckYourEmail-title">Check your email</div>
        <div className="CheckYourEmail-description">We’ve sent a password recover instructions to your email.</div>
        <Form layout="vertical" form={form} className="CheckYourEmail-form">
          <div className="CheckYourEmail-submit">
            <Button
              title="Open email"
              size="large"
              htmlType="submit"
              link="https://mail.google.com/mail/u/0/#search/omega"
              target="_blank"
            />
          </div>
        </Form>
        <div className="CheckYourEmail-description">
          <MyLink href={`${LayoutPaths.Auth}${Paths.LoginApp}`}>
            <u>Skip, I'll confirm later</u>
          </MyLink>
        </div>

        <div className="CheckYourEmail-description">
          <i>
            Did not receive the email?
            {` `}
            <u className="cursor-pointer" onClick={() => handleSubmit()}>
              Please resend
            </u>
            .
          </i>
        </div>
      </AuthForm>
    </div>
  );
}
