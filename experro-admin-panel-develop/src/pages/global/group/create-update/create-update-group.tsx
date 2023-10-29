import React from 'react';
import { Form, Button, Input, TreeSelect, Spin } from 'antd';
import get from 'lodash.get';
import { LoadingOutlined } from '@ant-design/icons';

import useCreateUpdateGroup from './create-update-group-controller';
import { MAX_TAG_COUNT } from '../../../../utills';
import SearchIcon from '../../../../images/icons/search-icon';
import { RowRecord } from '../../../../types';
import DownArrowIcon from '../../../../images/icons/arrow-left-icon';

const { TextArea } = Input;
const { SHOW_PARENT } = TreeSelect;

const CreateUpdateGroup: React.FC = () => {
  const {
    onFinish,
    detailsGroup,
    groupId,
    onCancel,
    t,
    cloneGroupId,
    updateGroup,
    createGroup,
    form,
    onBackButtonClick,
    listRoles,
    listUsers,
    onChangeRoleTree,
    selectedRoles,
    onValueChange,
    isSaveDisable,
    onChangeUserTree,
    selectedUsers,
  } = useCreateUpdateGroup();

  return (
    <Form
      autoComplete="off"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={detailsGroup.data}
      key={get(detailsGroup.data, 'name', '')}
      name="group-form"
      onValuesChange={onValueChange}>
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onBackButtonClick}>
            <DownArrowIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {groupId
                ? t('common.labels.edit_group')
                : cloneGroupId
                ? t('common.labels.clone_group')
                : t('common.labels.add_group')}
            </span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              {t('common.labels.group_subheader')}
            </span>
          </div>
        </div>
        <div className="headerright"></div>
      </div>

      {detailsGroup.isLoading || listRoles.isLoading ? (
        <Spin
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      ) : (
        <div className="page-content-top m-b-32">
          <Form.Item
            className="w-480"
            label={t('common.labels.groupName')}
            name="name"
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.groupName'),
                }),
              },
            ]}>
            <Input placeholder={t('common.labels.group_name_placeholder')} />
          </Form.Item>
          <Form.Item
            className="w-480"
            label={t('common.labels.description')}
            name="description">
            <TextArea placeholder={t('common.labels.enter_description')} />
          </Form.Item>

          <Form.Item
            className="w-480"
            label={t('common.labels.roles')}
            name="roleIds"
            rules={[
              {
                required: true,
                message: t('common.messages.at_least_required', {
                  entity: t('common.labels.role'),
                }),
              },
            ]}>
            <TreeSelect
              allowClear={false}
              id="roles"
              placeholder={t('common.labels.roles_placeholder')}
              treeData={listRoles.isSuccess ? listRoles.data : undefined}
              // value={!listRoles.isFetching ? listRoles.data : undefined}
              treeNodeLabelProp="displayTitle"
              treeCheckable
              treeDefaultExpandAll
              treeDefaultExpandedKeys={listRoles?.data?.map(
                (data) => data.value
              )}
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
              onChange={onChangeRoleTree}
              maxTagPlaceholder={
                selectedRoles &&
                selectedRoles.length > MAX_TAG_COUNT &&
                `+ ${selectedRoles.length - MAX_TAG_COUNT} Selected`
              }
            />
          </Form.Item>

          <Form.Item
            className="w-480"
            label={t('common.labels.users')}
            name="userIds"
            rules={[
              {
                required: true,
                message: t('common.messages.at_least_required', {
                  entity: t('common.labels.user'),
                }),
              },
            ]}>
            <TreeSelect
              allowClear={false}
              treeCheckable
              placeholder={t('common.labels.users_placeholder')}
              treeData={listUsers.isSuccess ? listUsers.data : undefined}
              suffixIcon={
                <span className="select-search-icon">
                  <SearchIcon />
                </span>
              }
              filterTreeNode={(search, item: RowRecord) =>
                item.label?.toLowerCase().indexOf(search.toLowerCase()) >= 0
              }
              showSearch
              showArrow
              onChange={onChangeUserTree}
              maxTagCount={2}
              maxTagPlaceholder={
                selectedUsers &&
                selectedUsers.length > MAX_TAG_COUNT &&
                `+ ${selectedUsers.length - MAX_TAG_COUNT} Selected`
              }
            />
          </Form.Item>
          <div className="ant-row footer-btn-panel w-480">
            <Button
              id={t('common.labels.save')}
              type="primary"
              htmlType="submit"
              loading={
                groupId
                  ? updateGroup?.isLoading
                    ? true
                    : false
                  : createGroup?.isLoading
                  ? true
                  : false
              }
              disabled={isSaveDisable}>
              {t('common.labels.save')}
            </Button>
            <Button id={t('common.labels.cancel')} onClick={onCancel}>
              {t('common.labels.cancel')}
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
};

export default CreateUpdateGroup;
