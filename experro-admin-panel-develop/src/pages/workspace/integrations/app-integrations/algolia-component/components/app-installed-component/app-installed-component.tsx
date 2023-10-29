import React from 'react';
import useAppInstalledComponentController from './app-installed-component-controller';
import { Button, Form, Input } from 'antd';
import AlgoliaIcon from '../../../../../../../images/icons/algolia-icon';
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
        integrationName="Algolia"
        onAppUninstallButtonClick={onAppUninstallButtonClick}
        isAppInstalled={true}
        isAppUninstallIsLoading={isAppUninstallIsLoading}
        icon={<AlgoliaIcon />}
        titleText="Algolia - Search and Discovery"
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
            label="Algolia access key"
            extra="You need to add an Algolia API key which has the correct ACL permission."
            rules={[
              {
                required: true,
                message: 'Algolia access key is required.',
              },
              {
                whitespace: true,
                message: t('common.messages.please_provide'),
              },
            ]}>
            <Input placeholder="Enter key" />
          </Form.Item>
        </div>
        <div className="custom-label-input">
          <Form.Item
            name="accessToken"
            label="Algolia app ID"
            extra="You can find your Account Id in the URL of the Algolia dashboard or in the top left of your dashboard."
            rules={[
              {
                required: true,
                message: 'Algolia app id is required.',
              },
              {
                whitespace: true,
                message: t('common.messages.please_provide'),
              },
            ]}>
            <Input placeholder="Enter ID" />
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
