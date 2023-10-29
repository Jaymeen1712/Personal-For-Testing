import React from 'react';
import useAppInstalledComponentController from './app-installed-component-controller';
import { Button, Form, Input } from 'antd';
import AffirmIcon from '../../../../../../../images/icons/affirm-icon';
import IntegrationsHeader from '../../../../header/integration-header';

const AppInstalledComponent = () => {
  const {
    onAppUninstallButtonClick,
    onBackButtonClick,
    t,
    onConnectButtonClick,
    form,
    appDetails,
    isUpdateAppConfigurationLoading,
    isAppUninstallIsLoading,
  } = useAppInstalledComponentController();
  return (
    <div>
      <IntegrationsHeader
        isListHeader={false}
        onBackButtonClick={onBackButtonClick}
        integrationName="Affirm"
        onAppUninstallButtonClick={onAppUninstallButtonClick}
        isAppInstalled={true}
        isAppUninstallIsLoading={isAppUninstallIsLoading}
        icon={<AffirmIcon />}
        titleText="Affirm"
      />
      <Form
        layout="vertical"
        form={form}
        className="w-480 m-t-32"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}>
        <div className="custom-label-input">
          <Form.Item
            name="spaceId"
            label="Public key"
            extra="You can find public key from your affirm dashboard."
            rules={[
              {
                required: true,
                message: 'Public key is required.',
              },
              {
                whitespace: true,
                message: t('common.messages.please_provide'),
              },
            ]}>
            <Input placeholder="Enter public key" />
          </Form.Item>
        </div>
        <div className="custom-label-input">
          <Form.Item
            name="accessToken"
            label="Private key"
            extra="You can find private key from your affirm dashboard."
            rules={[
              {
                required: true,
                message: 'Private key id is required.',
              },
              {
                whitespace: true,
                message: t('common.messages.please_provide'),
              },
            ]}>
            <Input placeholder="Enter private key" />
          </Form.Item>
        </div>
        {/*<div className="custom-label-input">*/}
        {/*  <Form.Item*/}
        {/*    name="integrationEnvironmentId"*/}
        {/*    label={t('common.labels.environment_id')}*/}
        {/*    rules={[*/}
        {/*      {*/}
        {/*        required: true,*/}
        {/*        message: t('common.messages.environment_id_is_required'),*/}
        {/*      },*/}
        {/*      {*/}
        {/*        whitespace: true,*/}
        {/*        message: t('common.messages.please_provide'),*/}
        {/*      },*/}
        {/*    ]}>*/}
        {/*    <Input placeholder={t('common.labels.Enter_environment_id')} />*/}
        {/*  </Form.Item>*/}
        {/*</div>*/}
      </Form>
      {!appDetails?.isEnabled && (
        <div className="m-t-32 form-top-border w-480">
          <Button
            onClick={onConnectButtonClick}
            key="save"
            type="primary"
            loading={isUpdateAppConfigurationLoading}>
            {t('common.labels.connect')}
          </Button>
          <Button
            key="cancel"
            onClick={() => {
              onBackButtonClick();
            }}>
            {t('common.labels.cancel')}
          </Button>
        </div>
      )}
    </div>
  );
};
export default AppInstalledComponent;
