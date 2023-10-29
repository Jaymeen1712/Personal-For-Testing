import React from 'react';
import { Button, Form, Input, Modal, Radio, Switch } from 'antd';
import get from 'lodash.get';

import useSmtpConfigController from './smtp-config-controller';

const SmtpConfig = () => {
  const {
    t,
    form,
    switchValue,
    isSwitchDisableModalVisible,
    onSwitchChange,
    onDisableSmtpData,
    onSmtpData,
    onHideDisableSwitchButton,
    isAuthenticationSwitch,
    onAuthenticationSwitchChange,
    getSmtpEmails,
    permission,
    onValueChange,
    isSaveButtonVisible,
  } = useSmtpConfigController();

  return (
    <>
      <Form
        onValuesChange={onValueChange}
        autoComplete="off"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        form={form}
        onFinish={onSmtpData}
        name="smtp-form"
        key={get(getSmtpEmails.data, 'fromName', '')}
        initialValues={getSmtpEmails.data}>
        <Form.Item name="isSmtpEnable" className="m-b-32">
          <div className="ant-row email-top-switch">
            <Switch
              checked={switchValue}
              // @ts-ignore
              onChange={
                permission.canUpdateEmailTemplatesSmtp() &&
                permission.canReadEmailTemplatesSmtp()
                  ? onSwitchChange
                  : permission.canReadEmailTemplatesSmtp() &&
                    getSmtpEmails.data?.isSmtpEnable &&
                    onSwitchChange
              }
              className="m-r-24"
            />
            <div>
              <p className="title-default m-b-8">
                {t('common.labels.use_personal_smtp')}
              </p>
              <p className="m-0 gray-text">
                <small>{t('common.labels.use_personal_smtp_subtitle')}</small>
              </p>
            </div>
          </div>
        </Form.Item>

        {switchValue && permission.canReadEmailTemplatesSmtp() && (
          <div className="email-form">
            <Form.Item
              name="fromName"
              label={t('common.labels.form_name')}
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.form_name'),
                  }),
                },
              ]}
              className="w-400">
              <Input placeholder={t('common.labels.enter_name')} />
            </Form.Item>

            <Form.Item
              name="fromEmail"
              label={t('common.labels.form_email')}
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.form_email'),
                  }),
                },
              ]}
              className="w-400">
              <Input placeholder={t('common.labels.enter_email')} />
            </Form.Item>

            <Form.Item
              name="smtpHost"
              label={t('common.labels.smtp_host')}
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.smtp_host'),
                  }),
                },
              ]}
              className="w-400">
              <Input placeholder={t('common.labels.enter_host')} />
            </Form.Item>

            <Form.Item
              name="smtpPort"
              label={t('common.labels.smtp_port')}
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.smtp_port'),
                  }),
                },
              ]}
              className="w-400">
              <Input placeholder={t('common.labels.enter_port')} />
            </Form.Item>

            <Form.Item
              name="encryptionType"
              label={t('common.labels.Encryption')}
              className="w-480 star-icon"
              initialValue="None">
              <Radio.Group>
                <Radio value="None"> {t('common.labels.none')} </Radio>
                <Radio value="SSL"> {t('common.labels.ssl')} </Radio>
                <Radio value="TLS"> {t('common.labels.tls')} </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="isAuthenticationEnable"
              label={t('common.labels.authentication')}
              className="w-400 label-switch-inline">
              <Switch
                // @ts-ignore
                onChange={
                  permission.canUpdateEmailTemplatesSmtp() &&
                  permission.canReadEmailTemplatesSmtp() &&
                  onAuthenticationSwitchChange
                }
                checked={isAuthenticationSwitch}
                size="small"
              />
              {/* <span>{t('common.labels.authentication')}</span> */}
            </Form.Item>

            {isAuthenticationSwitch && (
              <div className="email-form-auth w-400">
                <Form.Item
                  name="smtpUsername"
                  label={t('common.labels.smtp_user_name')}
                  rules={[
                    {
                      required: true,
                      message: t('common.messages.required', {
                        entity: t('common.labels.smtp_user_name'),
                      }),
                    },
                  ]}>
                  <Input placeholder={t('common.labels.enter_user_name')} />
                </Form.Item>

                <Form.Item
                  name="smtpPassword"
                  label={t('common.labels.smtp_password')}
                  rules={[
                    {
                      required: true,
                      message: t('common.messages.required', {
                        entity: t('common.labels.smtp_password'),
                      }),
                    },
                  ]}>
                  <Input.Password
                    placeholder={t('common.labels.enter_password')}
                  />
                </Form.Item>
              </div>
            )}

            {permission.canUpdateEmailTemplatesSmtp() && (
              <div className="footer-btn-panel w-400">
                <Button
                  disabled={isSaveButtonVisible}
                  id={t('common.labels.save')}
                  type="primary"
                  htmlType="submit">
                  {t('common.labels.save')}
                </Button>
              </div>
            )}
          </div>
        )}
      </Form>

      <Modal
        className="confirm-modal"
        title={t('common.labels.disable_smtp')}
        open={isSwitchDisableModalVisible}
        okText={t('common.labels.disable')}
        onOk={onDisableSmtpData}
        onCancel={onHideDisableSwitchButton}
        centered
        okButtonProps={{
          danger: true,
        }}>
        <div className="user-delete-modal">
          <p className="m-0 gray-text">
            {t('common.labels.smtp_disable_modal_message')}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default SmtpConfig;
