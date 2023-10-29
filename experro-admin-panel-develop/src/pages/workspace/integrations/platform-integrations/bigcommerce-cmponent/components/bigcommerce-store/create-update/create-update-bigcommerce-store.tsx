import { Button, Form, Input, Modal, Select, Spin } from 'antd';
import get from 'lodash.get';
import React from 'react';

import useCreateUpdateBigcommerceStore from './create-update-bigcommerce-store-controller';
import SearchIcon from '../../../../../../../../images/icons/search-icon';
import ArrowLeftIcon from '../../../../../../../../images/icons/arrow-left-icon';
import { LoadingOutlined } from '@ant-design/icons';
import BigCommerceLogoIcon from '../../../../../../../../images/icons/bigcommerce-logo-icon';

const CreateUpdateBigcommerceStore: React.FC = () => {
  const {
    t,
    onCancel,
    onFinish,
    form,
    getBigcommerceStore,
    storeId,
    createBigcommerceStore,
    updateBigcommerceStore,
    listEnvironment,
    addedEnvironmentsOfStores,
    onValuesChange,
    isSaveButtonVisible,
    isConnectingModalVisible,
  } = useCreateUpdateBigcommerceStore();

  return (
    <>
      <Form
        // @ts-ignore
        onValuesChange={onValuesChange}
        layout="vertical"
        name="user-form"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        form={form}
        initialValues={getBigcommerceStore.data}
        key={get(getBigcommerceStore.data, 'id', '')}
        // @ts-ignore
        onFinish={onFinish}
        autoComplete="off">
        <div className="headerinner ant-row ant-space-align-start ant-row-space-between m-b-32">
          <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
            <div className="hamburgericon" onClick={onCancel}>
              <ArrowLeftIcon />
            </div>
            <div className="w-100 ant-row ant-space-vertical">
              <span className="ant-page-header-heading-title">
                {storeId
                  ? t('common.labels.edit_store')
                  : t('common.labels.add_store')}
              </span>
              <span className="ant-page-header-heading-sub-title m-t-4">
                {t('common.labels.store_description')}
              </span>
            </div>
          </div>
        </div>

        <div className="ant-row environment-section m-t-48">
          <div className="environment-section-left">
            {listEnvironment.isSuccess && listEnvironment.data && (
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
                  showArrow
                  suffixIcon={<span className="select-search-icon"><SearchIcon /></span>}
                  optionFilterProp="children"
                  mode="multiple"
                  disabled={!!storeId}
                  placeholder={t('common.labels.select_environment')}>
                  {listEnvironment.data?.map((env) => {
                    if (
                      addedEnvironmentsOfStores.some((ele) => ele === env.id)
                    ) {
                      return (
                        <Select.Option disabled value={env.id} key={env.title}>
                          {env.title}
                        </Select.Option>
                      );
                    } else {
                      return (
                        <Select.Option
                          disabled={false}
                          value={env.id}
                          key={env.title}>
                          {env.title}
                        </Select.Option>
                      );
                    }
                  })}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              label={t('common.labels.store_name')}
              name="storeName"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.store_name'),
                  }),
                },
                {
                  max: 255,
                  message: t('common.messages.max_length', {
                    entity: t('common.labels.store_name'),
                  }),
                },
                {
                  whitespace: true,
                  message: t('common.messages.please_provide'),
                },
              ]}
              className="w-100">
              <Input
                placeholder={t('common.labels.store_name')}
                disabled={!!storeId}
              />
            </Form.Item>

            <Form.Item
              className="w-100"
              label={t('common.labels.store_hash')}
              name="storeHash"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.store_hash'),
                  }),
                },
                {
                  max: 255,
                  message: t('common.messages.max_length', {
                    entity: t('common.labels.store_hash'),
                  }),
                },
                {
                  whitespace: true,
                  message: t('common.messages.please_provide'),
                },
              ]}>
              <Input
                placeholder={t('common.labels.store_hash')}
                disabled={storeId ? true : false}
              />
            </Form.Item>

            <Form.Item
              className="w-100"
              label={t('common.labels.store_token')}
              name="accessToken"
              initialValue={storeId ? '**********' : ''}
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.store_token'),
                  }),
                },
                {
                  max: 255,
                  message: t('common.messages.max_length', {
                    entity: t('common.labels.store_token'),
                  }),
                },
                {
                  whitespace: true,
                  message: t('common.messages.please_provide'),
                },
              ]}>
              <Input placeholder={t('common.labels.store_token')} />
            </Form.Item>

            <Form.Item
              className="w-100"
              label={t('common.labels.client_id')}
              name="clientId"
              initialValue={storeId ? '**********' : ''}
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.client_id'),
                  }),
                },
                {
                  max: 255,
                  message: t('common.messages.max_length', {
                    entity: t('common.labels.client_id'),
                  }),
                },
                {
                  whitespace: true,
                  message: t('common.messages.please_provide'),
                },
              ]}>
              <Input placeholder={t('common.labels.client_id')} />
            </Form.Item>

            <Form.Item
              className="w-100"
              label={t('common.labels.client_secret')}
              name="clientSecret"
              initialValue={storeId ? '**********' : ''}
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.client_secret'),
                  }),
                },
                {
                  max: 255,
                  message: t('common.messages.max_length', {
                    entity: t('common.labels.client_secret'),
                  }),
                },
                {
                  whitespace: true,
                  message: t('common.messages.please_provide'),
                },
              ]}>
              <Input placeholder={t('common.labels.client_secret')} />
            </Form.Item>
            <div className="form-top-border">
              <Button
                id={t('common.labels.save')}
                type="primary"
                htmlType="submit"
                disabled={isSaveButtonVisible && !storeId}
                loading={
                  storeId
                    ? updateBigcommerceStore.isLoading
                    : createBigcommerceStore.isLoading
                }>
                {storeId
                  ? t('common.labels.update')
                  : t('common.labels.connect')}
              </Button>
              <Button id={t('common.labels.cancel')} onClick={onCancel}>
                {t('common.labels.cancel')}
              </Button>
            </div>
          </div>
          {/* <div className="environment-section-right">
              <OnBoardBanner
              header={t('common.labels.quick_guide')}
              description={t('common.labels.how_setup_domain')}
              image={Environment}
              className="small"
              />
            </div> */}
        </div>
      </Form>
      <Modal

        title={
          <div className="ant-row ant-space-align-center">
            <BigCommerceLogoIcon />
            <h3 className="m-0 title-default">Integrating to Bigcommerce</h3>
          </div>
        }
        className="sync-loader confirm-modal"
        open={isConnectingModalVisible}
        // open={true}
        centered
        footer={''}
        closable={false}>
        <div className="text-center">
          <Spin
            className="m-t-16"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
          <p>Connecting....</p>
        </div>
      </Modal>
    </>
  );
};

export default CreateUpdateBigcommerceStore;
