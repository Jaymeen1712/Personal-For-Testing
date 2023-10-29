import React from 'react';
import { Form, Button, TreeSelect, Input, Spin } from 'antd';
import get from 'lodash.get';
import { LoadingOutlined } from '@ant-design/icons';

import useCreateUpdateUser from './create-update-user-controller';
import { MAX_TAG_COUNT } from '../../../../utills/enums';
import SearchIcon from '../../../../images/icons/search-icon';
import { RowRecord } from '../../../../types';
import DownArrowIcon from '../../../../images/icons/arrow-left-icon';

const { SHOW_PARENT } = TreeSelect;

const CreateUpdateUser: React.FC = () => {
  const {
    userId,
    form,
    t,
    getUser,
    onCancel,
    onSaveAndAddNewClick,
    onFinish,
    onFinishFailed,
    createUser,
    updateUser,
    isAddNewEnabled,
    onBackButtonClick,
    listRoles,
    listGroup,
    selectedRoles,
    onChangeRoleTree,
    onValueChange,
    isSaveAndSaveAddNewDisable,
    onChangeGroupTree,
    selectedGroups,
  } = useCreateUpdateUser();

  return (
    <Form
      layout="vertical"
      name="user-form"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      form={form}
      initialValues={getUser.data}
      key={get(getUser.data, 'email', '')}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      onValuesChange={onValueChange}>
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onBackButtonClick}>
            <DownArrowIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {userId
                ? t('common.labels.edit_user')
                : t('common.labels.add_user')}
            </span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              {t('common.labels.add_user_details')}
            </span>
          </div>
        </div>
        <div className="headerright"></div>
      </div>

      {getUser.isLoading || listRoles.isLoading ? (
        <Spin
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      ) : (
        <>
          <div className="page-content-top m-b-32">
            <Form.Item
              className="w-480"
              label={t('common.labels.firstName')}
              name="firstName"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.firstName'),
                  }),
                },
              ]}>
              <Input placeholder={t('common.labels.firstName_placeholder')} />
            </Form.Item>
            <Form.Item
              className="w-480"
              label={t('common.labels.lastName')}
              name="lastName"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.lastName'),
                  }),
                },
              ]}>
              <Input placeholder={t('common.labels.lastName_placeholder')} />
            </Form.Item>

            <Form.Item
              className="w-480"
              label={t('common.labels.email')}
              name="email"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.email'),
                  }),
                },
              ]}>
              <Input
                placeholder={t('common.labels.email_placeholder')}
                disabled={getUser.data && getUser.data.email ? true : false}
              />
            </Form.Item>

            <Form.Item
              className="w-480"
              label={t('common.labels.roles')}
              name="roles"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.role'),
                  }),
                },
              ]}>
              <TreeSelect
                allowClear={false}
                id="roles"
                placeholder={t('common.labels.roles_placeholder')}
                treeData={listRoles.isSuccess ? listRoles.data : undefined}
                treeNodeLabelProp="displayTitle"
                treeCheckable
                treeDefaultExpandAll
                treeDefaultExpandedKeys={listRoles?.data?.map(
                  (data) => data.value
                )}
                onChange={onChangeRoleTree}
                filterTreeNode={(search, item: RowRecord) =>
                  item.displayTitle
                    ?.toLowerCase()
                    .indexOf(search.toLowerCase()) >= 0
                }
                showCheckedStrategy={SHOW_PARENT}
                showSearch={true}
                showArrow={true}
                suffixIcon={
                  <span className="select-search-icon">
                    <SearchIcon />
                  </span>
                }
                maxTagCount={2}
                maxTagPlaceholder={
                  selectedRoles &&
                  selectedRoles.length > MAX_TAG_COUNT &&
                  `+ ${selectedRoles.length - MAX_TAG_COUNT} Selected`
                }
              />
            </Form.Item>

            <Form.Item
              className="w-480"
              label={t('common.labels.groups')}
              name="groups">
              <TreeSelect
                allowClear={false}
                id="groups"
                treeCheckable
                onChange={onChangeGroupTree}
                placeholder={t('common.labels.group_placeholder')}
                suffixIcon={
                  <span className="select-search-icon">
                    <SearchIcon />
                  </span>
                }
                showSearch
                filterTreeNode={(search, item: RowRecord) =>
                  item.label?.toLowerCase().indexOf(search.toLowerCase()) >= 0
                }
                maxTagCount={2}
                maxTagPlaceholder={
                  selectedGroups &&
                  selectedGroups.length > MAX_TAG_COUNT &&
                  `+ ${selectedGroups.length - MAX_TAG_COUNT} Selected`
                }
                showArrow={true}
                treeData={listGroup.isSuccess ? listGroup.data : undefined}
              />
            </Form.Item>
            <div className="ant-row footer-btn-panel w-480">
              <Button
                id={t('common.labels.save')}
                type="primary"
                htmlType="submit"
                loading={
                  userId
                    ? updateUser?.isLoading
                      ? true
                      : false
                    : createUser?.isLoading && isAddNewEnabled === false
                    ? true
                    : false
                }
                disabled={isSaveAndSaveAddNewDisable}>
                {t('common.labels.save')}
              </Button>
              {!userId && (
                <Button
                  id={t('common.labels.save_add_new')}
                  type="primary"
                  htmlType="submit"
                  onClick={onSaveAndAddNewClick}
                  loading={isAddNewEnabled}
                  disabled={isSaveAndSaveAddNewDisable}>
                  {t('common.labels.save_add_new')}
                </Button>
              )}

              <Button id={t('common.labels.cancel')} onClick={onCancel}>
                {t('common.labels.cancel')}
              </Button>
            </div>
          </div>
        </>
      )}
    </Form>
  );
};

export default CreateUpdateUser;
