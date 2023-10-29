import { Button, Form, Input, Select } from 'antd';
import React from 'react';

import SearchIcon from '../../../../../../../images/icons/search-icon';
import useStoreFieldController from './store-field-controller';
import ArrowLeftIcon from '../../../../../../../images/icons/arrow-left-icon';

const StoreField = () => {
  const {
    onBackButtonClick,
    t,
    onConnectButtonClick,
    form,
    environmentList,
    // appDetails,
    isStoreUpdate,
    shopifyEnvironmentList,
    isSubmitButtonEnabled,
    onValuesChange,
    storeId,
    isSubmitLoading,
  } = useStoreFieldController();
  return (
    <>
      <div className="headerinner">
        <div className="ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon ant-row" onClick={onBackButtonClick}>
            <ArrowLeftIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {isStoreUpdate
                ? t('common.labels.edit_store')
                : t('common.labels.add_store')}
            </span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              {t('common.labels.store_description')}
            </span>
          </div>
        </div>
      </div>
      <Form
        layout="vertical"
        form={form}
        onValuesChange={onValuesChange}
        className="w-480 m-t-32"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}>
        <div className="custom-label-input">
          <Form.Item
            label="Environment"
            name="environmentIds"
            rules={[
              {
                required: true,
                message: t('common.messages.at_least_required', {
                  entity: t('common.labels.environment'),
                }),
              },
            ]}>
            <Select
              disabled={isStoreUpdate}
              showArrow
              suffixIcon={
                <span className="select-search-icon">
                  <SearchIcon />
                </span>
              }
              optionFilterProp="children"
              mode="multiple"
              placeholder={t('common.labels.select_environment')}>
              {environmentList.map(
                (environment) =>
                  (isStoreUpdate ||
                    (!isStoreUpdate &&
                      !shopifyEnvironmentList.includes(environment.id))) && (
                    <Select.Option key={environment.id}>
                      {environment.title}
                    </Select.Option>
                  )
              )}
            </Select>
          </Form.Item>
        </div>
        <div className="custom-label-input">
          <Form.Item
            name="name"
            label={t('common.labels.store_name')}
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.store_name'),
                }),
              },
              {
                whitespace: true,
                message: t('common.messages.please_provide'),
              },
            ]}>
            <Input placeholder="Enter Store name" disabled={isStoreUpdate} />
          </Form.Item>
        </div>

        <div className="custom-label-input">
          <Form.Item
            name="storeName"
            label={t('common.labels.shopify_store_name')}
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.shopify_store_name'),
                }),
              },
              {
                whitespace: true,
                message: t('common.messages.please_provide'),
              },
            ]}>
            <Input
              placeholder="Enter Shopify store name"
              disabled={isStoreUpdate}
            />
          </Form.Item>
        </div>

        <div className="custom-label-input">
          <Form.Item
            name="storefrontAccessToken"
            label={t('common.labels.storefront_access_token')}
            extra={t('common.messages.storefront_access_token_description')}
            initialValue={storeId ? '********' : ''}
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.storefront_access_token'),
                }),
              },
              {
                whitespace: true,
                message: t('common.messages.please_provide'),
              },
            ]}>
            <Input placeholder="Enter Storefront access token" />
          </Form.Item>
        </div>

        <div className="custom-label-input">
          <Form.Item
            name="adminAccessToken"
            label={t('common.labels.admin_access_token')}
            initialValue={storeId ? '********' : ''}
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.admin_access_token'),
                }),
              },
              {
                whitespace: true,
                message: t('common.messages.please_provide'),
              },
            ]}>
            <Input placeholder="Enter Admin access token" />
          </Form.Item>
        </div>

        <div className="custom-label-input">
          <Form.Item
            name="apiKey"
            label={t('common.labels.api_key')}
            initialValue={storeId ? '********' : ''}
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.api_key'),
                }),
              },
              {
                whitespace: true,
                message: t('common.messages.please_provide'),
              },
            ]}>
            <Input placeholder="Enter Api key" />
          </Form.Item>
        </div>
        <div className="custom-label-input">
          <Form.Item
            name="secretKey"
            label={t('common.labels.secret_key')}
            initialValue={storeId ? '********' : ''}
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.secret_key'),
                }),
              },
              {
                whitespace: true,
                message: t('common.messages.please_provide'),
              },
            ]}>
            <Input placeholder="Enter Secret key" />
          </Form.Item>
        </div>
        {/* <div className="custom-label-input">
          <Form.Item
            name="adminApiKey"
            label="Admin api key"
            rules={[
              {
                required: true,
                message: 'Admin api key is required.',
              },
              {
                whitespace: true,
                message: t('common.messages.please_provide'),
              },
            ]}>
            <Input placeholder="Enter admin api key" />
          </Form.Item>
        </div> */}
        {/* <div className="custom-label-input">
          <Form.Item
            name="adminSecretKey"
            label="Admin secret key"
            rules={[
              {
                required: true,
                message: 'admin secret key is required.',
              },
              {
                whitespace: true,
                message: t('common.messages.please_provide'),
              },
            ]}>
            <Input placeholder="Enter admin secret key" />
          </Form.Item>
        </div> */}
        <div className="custom-label-input">
          <Form.Item
            name="storeDomain"
            label={t('common.labels.store_domain')}
            extra={t('common.messages.store_domain_description')}
            initialValue="myshopify.com"
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.store_domain'),
                }),
              },
              {
                whitespace: true,
                message: t('common.messages.please_provide'),
              },
            ]}>
            <Input placeholder="Enter Store domain" disabled={isStoreUpdate} />
          </Form.Item>
        </div>
      </Form>
      {/*{!appDetails?.isEnabled && (*/}
      <div className="m-t-32 form-top-border w-480">
        <Button
          disabled={isSubmitButtonEnabled}
          onClick={onConnectButtonClick}
          key="save"
          type="primary"
          loading={isSubmitLoading}>
          {isStoreUpdate
            ? t('common.labels.update')
            : t('common.labels.connect')}
        </Button>
        <Button
          key="cancel"
          onClick={() => {
            onBackButtonClick();
          }}>
          {t('common.labels.cancel')}
        </Button>
      </div>
      {/*)}*/}
    </>
  );
};
export default StoreField;
