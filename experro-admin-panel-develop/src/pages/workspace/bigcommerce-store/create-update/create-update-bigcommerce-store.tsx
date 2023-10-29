import { Button, Form, Input, Select, Tooltip } from 'antd';
import get from 'lodash.get';
import React from 'react';
// import OnBoardBanner from '../../../../components/on-board-banner';
import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../../utills';
import useCreateUpdateBigcommerceStore from './create-update-bigcommerce-store-controller';
import SearchIcon from '../../../../images/icons/search-icon';
import { QuestionCircleOutlined } from '@ant-design/icons';
import SubSideBar from '../../../../components/sub-sidebar';
import HamburgerIcon from '../../../../images/icons/hamburger-icon';

interface ICreateUpdateBigcommerceStore {
  onMainSidebarActiveItem?: (val: string) => void;
}

const CreateUpdateBigcommerceStore: React.FC<ICreateUpdateBigcommerceStore> = ({
  onMainSidebarActiveItem,
}) => {
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
  } = useCreateUpdateBigcommerceStore({ onMainSidebarActiveItem });

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
        <SubSideBar
          isGlobalPage={false}
          sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
          subSidebarActiveItemKey={
            SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.ECOMMERCE_PLUGINS.BIGCOMMERCE
          }>
          <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
            <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
              <div className="hamburgericon">
                <HamburgerIcon />
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
            <div className="headerright">
              <div className="ant-row ant-row-end">
                <Button id={t('common.labels.cancel')} onClick={onCancel}>
                  {t('common.labels.cancel')}
                </Button>
                <Button
                  id={t('common.labels.save')}
                  type="primary"
                  htmlType="submit"
                  disabled={isSaveButtonVisible}
                  loading={
                    storeId
                      ? updateBigcommerceStore.isLoading
                      : createBigcommerceStore.isLoading
                  }>
                  {t('common.labels.save')}
                </Button>
              </div>
            </div>
          </div>
          <div className="ant-row environment-section">
            <div className="environment-section-left">
              {listEnvironment.isSuccess && listEnvironment.data && (
                <Form.Item
                  label="Select Environment"
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
                    disabled={storeId ? true : false}
                    placeholder={t('common.labels.select')}>
                    {listEnvironment.data?.map((env) => {
                      if (
                        addedEnvironmentsOfStores.some((ele) => ele === env.id)
                      ) {
                        return (
                          <Select.Option
                            disabled
                            value={env.id}
                            key={env.title}>
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
                className="w-100"
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
                ]}>
                <Input
                  placeholder={t('common.labels.store_name')}
                  disabled={storeId ? true : false}
                />
              </Form.Item>

              <Form.Item
                label={t('common.labels.store_hash')}
                name="storeHash"
                className="w-100"
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
                label={t('common.labels.store_token')}
                name="accessToken"
                className="w-100"
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
                <Input
                  placeholder={t('common.labels.store_token')}
                  disabled={storeId ? true : false}
                />
              </Form.Item>

              <div className="w-100 position-relative">
                <Form.Item
                  label={t('common.labels.client_id')}
                  name="clientId"
                  className="w-100"
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
                  <Input
                    placeholder={t('common.labels.client_id')}
                    disabled={storeId ? true : false}
                  />
                </Form.Item>
                <Tooltip
                  className="link-label"
                  overlayClassName="custom-tooltip custom-large"
                  title={t('common.messages.bigcommerce_client_id_msg')}
                  placement="right">
                  <QuestionCircleOutlined />
                </Tooltip>
              </div>

              <div className="w-100 position-relative">
                <Form.Item
                  label={t('common.labels.client_secret')}
                  name="clientSecret"
                  className="w-100"
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
                  <Input
                    placeholder={t('common.labels.client_secret')}
                    disabled={storeId ? true : false}
                  />
                </Form.Item>
                <Tooltip
                  className="link-label"
                  overlayClassName="custom-tooltip custom-large"
                  title={t('common.messages.bigcommerce_client_secret_msg')}
                  placement="right">
                  <QuestionCircleOutlined />
                </Tooltip>
              </div>

            </div>
          </div>
        </SubSideBar>
      </Form>
    </>
  );
};

export default CreateUpdateBigcommerceStore;
