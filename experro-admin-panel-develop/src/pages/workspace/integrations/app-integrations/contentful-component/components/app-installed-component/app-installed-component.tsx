import React from 'react';
import useAppInstalledComponentController from './app-installed-component-controller';
import { Button, Form, Input, Modal, Spin } from 'antd';
import IntegrationsHeader from '../../../../header/integration-header';
import ContentfulLogoIcon from '../../../../../../../images/icons/contentful-logo-icon';
import { LoadingOutlined } from '@ant-design/icons';

const AppInstalledComponent = () => {
  const {
    onAppUninstallButtonClick,
    onBackButtonClick,
    t,
    onFinish,
    form,
    appDetails,
    isAppUninstallIsLoading,
    isUninstallAppModalVisible,
    isFormSubmitting,
    isStoreConnected,
    isStoreDetailsEditable,
    onEditStoreClick,
    onDisconnectButtonClick,
    isAppDisconnectingIsLoading,
    isDetailsLoading,
    isDisconnectAppModalVisible,
    isConnectingModalVisible,
    toggleDisconnectAppModal,
    toggleUninstallAppModal,
    onHeaderBackButtonClick,
  } = useAppInstalledComponentController();
  return (
    <div>
      <IntegrationsHeader
        isListHeader={false}
        onBackButtonClick={onHeaderBackButtonClick}
        integrationName="Contentful"
        onAppUninstallButtonClick={() => toggleUninstallAppModal(true)}
        isAppInstalled={true}
        isAppUninstallIsLoading={isAppUninstallIsLoading}
        icon={<ContentfulLogoIcon />}
        titleText={t('common.labels.contentful_title_text')}
      />
      {isDetailsLoading ? (
        <Spin
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      ) : (
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
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
              label={t('common.labels.space_id')}
              extra={t('common.labels.subtitle_space_id')}
              rules={[
                {
                  required: true,
                  message: t('common.messages.error_space_id_required'),
                },
                {
                  whitespace: true,
                  message: t('common.messages.please_provide'),
                },
              ]}>
              <Input
                placeholder={t('common.labels.Enter_space_id')}
                disabled={!isStoreDetailsEditable}
              />
            </Form.Item>
          </div>
          <div className="custom-label-input">
            <Form.Item
              name="accessToken"
              label={t('common.labels.access_token')}
              extra={t('common.labels.subtitle_access_token')}
              rules={[
                {
                  required: true,
                  message: t('common.messages.error_access_token_required'),
                },
                {
                  whitespace: true,
                  message: t('common.messages.please_provide'),
                },
              ]}>
              <Input
                placeholder={t('common.labels.enter_access_token')}
                disabled={!isStoreDetailsEditable}
              />
            </Form.Item>
          </div>
          <div className="custom-label-input">
            <Form.Item
              name="integrationEnvironmentId"
              label={t('common.labels.environment_id')}
              rules={[
                {
                  required: true,
                  message: t('common.messages.environment_id_is_required'),
                },
                {
                  whitespace: true,
                  message: t('common.messages.please_provide'),
                },
              ]}>
              <Input
                placeholder={t('common.labels.Enter_environment_id')}
                disabled={isStoreConnected}
              />
            </Form.Item>
          </div>
          {!isStoreDetailsEditable
            ? !appDetails?.isEnabled && (
                <div className="m-t-32 form-top-border w-480">
                  <Button
                    key="edit"
                    type="primary"
                    onClick={onEditStoreClick}
                    loading={isFormSubmitting}>
                    {t('common.labels.edit')}
                  </Button>
                  <Button
                    key="disconnect"
                    loading={isAppDisconnectingIsLoading}
                    onClick={() => toggleDisconnectAppModal(true)}>
                    {t('common.labels.disconnect')}
                  </Button>
                </div>
              )
            : !appDetails?.isEnabled && (
                <div className="m-t-32 form-top-border w-480">
                  <Button
                    key="save"
                    type="primary"
                    htmlType="submit"
                    loading={isFormSubmitting}>
                    {isStoreConnected
                      ? t('common.labels.save')
                      : t('common.labels.connect')}
                  </Button>
                  <Button key="cancel" onClick={onBackButtonClick}>
                    {t('common.labels.cancel')}
                  </Button>
                </div>
              )}
        </Form>
      )}
      <Modal
        title={t('common.labels.uninstall_platform')}
        className="confirm-modal"
        open={isUninstallAppModalVisible}
        okText={t('common.labels.uninstall')}
        onOk={onAppUninstallButtonClick}
        okButtonProps={{ style: { background: 'red', border: 'red' } }}
        confirmLoading={isAppUninstallIsLoading}
        onCancel={() => toggleUninstallAppModal(false)}
        centered>
        <p>{t('common.messages.uninstall_platform')}</p>
      </Modal>

      <Modal
        title={t('common.labels.disconnect_app')}
        open={isDisconnectAppModalVisible}
        okText={t('common.labels.disconnect')}
        onOk={onDisconnectButtonClick}
        okButtonProps={{ style: { background: 'red', border: 'red' } }}
        confirmLoading={isAppDisconnectingIsLoading}
        onCancel={() => toggleDisconnectAppModal(false)}
        centered>
        <p>{t('common.messages.disconnect_app')}</p>
      </Modal>

      <Modal
        title={
          <div className="ant-row ant-space-align-center">
            <ContentfulLogoIcon />
            <h3 className="m-0">Connecting to Contentful</h3>
          </div>
        }
        className="sync-loader"
        open={isConnectingModalVisible}
        // open={true}
        centered
        footer={''}
        closable={false}>
        <div className="text-center">
          <Spin
            // className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
          <p>Connecting....</p>
        </div>
      </Modal>
    </div>
  );
};
export default AppInstalledComponent;
