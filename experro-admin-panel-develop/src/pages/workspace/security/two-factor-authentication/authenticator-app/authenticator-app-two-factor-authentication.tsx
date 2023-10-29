import { Button, Form, Input } from 'antd';
import React from 'react';
import { TFunction } from 'react-i18next';
import { FormInstance } from 'antd/es/form';

interface IAppTwoFactorAuthentication {
  t: TFunction<'translation', undefined>;
  onVerify: () => void;
  validateQrForm: FormInstance;
  generateQrTwoFactorAuthentication?: string;
}

const AuthenticatorAppTwoFactorAuthentication: React.FC<
  IAppTwoFactorAuthentication
> = ({ t, onVerify, validateQrForm, generateQrTwoFactorAuthentication }) => {
  return (
    <div className="security-box p-24 m-t-16 ant-row ant-row-space-between">
      <div>
        <h3 className="m-0 m-b-32">{t('common.labels.auth_verification_header')}</h3>

        <div className="m-b-24">
          <p className="m-0 m-b-8 dark-black">
           {t('common.labels.step1_authenticate_using_app')}
          </p>
          <p className="m-0 gray-text">
            <small>
              {t('common.labels.step1_authenticate_using_app_description')}
            </small>
          </p>
        </div>
        <div className="m-b-24">
          <p className="m-0 m-b-8 dark-black">
           {t('common.labels.step2_authenticate_using_app')}
          </p>
          <p className="m-0 gray-text">
            <small>
              {t('common.labels.step2_authenticate_using_app_description')}
            </small>
          </p>
        </div>
        <div className="m-b-32">
          <p className="m-0 m-b-8 dark-black">
           {t('common.labels.step3_authenticate_using_app')}
          </p>
          <p className="m-0 gray-text">
            <small>
              {t('common.labels.step3_authenticate_using_app_description')}
            </small>
          </p>
        </div>

        <div>
          <Form
            onFinish={onVerify}
            autoComplete="off"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            layout="vertical"
            form={validateQrForm}
            className="ant-row ant-space-align-end">
            <Form.Item
              className="display-block m-r-16 margin-button m-0 w-480"
              label={t('common.labels.enter_code_validation')}
              name="code"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.code'),
                  }),
                },
              ]}>
              <Input placeholder={t('common.labels.enter_code_validation')} />
            </Form.Item>

            <Form.Item className="m-0">
              <Button type="primary" htmlType="submit">
                {t('common.labels.verify')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <div>
        {generateQrTwoFactorAuthentication && (
          <img src={`${generateQrTwoFactorAuthentication}`} alt="qr-code" width={148} height={148}/>
        )}
      </div>
    </div>
  );
};

export default AuthenticatorAppTwoFactorAuthentication;
