import React from 'react';
import { Form, Button, Input, Select, TreeSelect } from 'antd';
import get from 'lodash.get';

import useCreateUpdateWorkspaceUser from './add-update-workspace-user-controller';
import ArrowLeftIcon from '../../../../images/icons/arrow-left-icon';
import SearchIcon from '../../../../images/icons/search-icon';
import DownArrowIcon from '../../../../images/icons/downarrow-icon';
import Plusaddnewuser from '../../../../images/icons/plus-add-new-user';
import { RowRecord } from '../../../../types';

interface IAddUpdateWorkspaceUser {
  onMainSidebarActiveItem?: (val: string) => void;
}

const AddUpdateWorkspaceUser: React.FC<IAddUpdateWorkspaceUser> = ({
  onMainSidebarActiveItem,
}) => {
  const {
    userId,
    form,
    t,
    getUser,
    onCancel,
    onFinish,
    workspaceName,
    addUser,
    disableSave,
    handleFieldChange,
    permissions,
    listRoles,
    listUsers,
    onAddNewUser,
  } = useCreateUpdateWorkspaceUser({ onMainSidebarActiveItem });

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
      onFieldsChange={handleFieldChange}
      autoComplete="off">
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onCancel}>
            <ArrowLeftIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {userId
                ? `${t('common.labels.edit_user')} in ${workspaceName}`
                : `${t('common.labels.add_user')} to ${workspaceName}`}
            </span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              {t('common.labels.add_user_details')}
            </span>
          </div>
        </div>
        <div className="headerright"></div>
      </div>
      <div className="page-content-top m-b-32">
        {userId && !permissions.canManageGlobalUserAndSecurity() ? (
          <>
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
              <Input
                disabled
                placeholder={t('common.labels.firstName_placeholder')}
              />
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
              <Input
                disabled
                placeholder={t('common.labels.lastName_placeholder')}
              />
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
              <Input disabled placeholder={t('common.labels.email')} />
            </Form.Item>
            <Form.Item
              className="w-480"
              label={t('common.labels.roles')}
              name="roles"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.workspace_roles'),
                  }),
                },
              ]}>
              <Select
                disabled={!permissions.canUpdateRole()}
                allowClear
                id="roles"
                placeholder={t('common.labels.roles_placeholder')}
                suffixIcon={
                  <span className="select-search-icon">
                    <SearchIcon />
                  </span>
                }
                showSearch
                optionFilterProp="children"
                showArrow={true}
                mode="multiple">
                {listRoles?.data?.map((group) => (
                  <Select.Option key={group.value} value={group.value}>
                    {group.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              className="w-480"
              label={t('common.labels.users')}
              name="userIds"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.workspace_user'),
                  }),
                },
              ]}>
              <TreeSelect
                allowClear
                id="userIds"
                treeCheckable
                placeholder={t('select_user')}
                suffixIcon={<DownArrowIcon />}
                showSearch
                filterTreeNode={(search, item: RowRecord) =>
                  item.label?.toLowerCase().indexOf(search.toLowerCase()) >= 0
                }
                showArrow={true}
                treeData={listUsers.data}
                notFoundContent={
                  permissions.canManageGlobalUserAndSecurity() ? (
                    <div className="no-user-text">
                      <p>{t('common.messages.no_user_found')}</p>
                      <Button
                        type="link"
                        className="text-blue"
                        onClick={onAddNewUser}
                        icon={
                          <span className="anticon">
                            <Plusaddnewuser />
                          </span>
                        }>
                        {t('common.labels.add_new_user')}
                      </Button>
                    </div>
                  ) : (
                    <div>{t('common.messages.no_user_found')}</div>
                  )
                }
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
                    entity: t('common.labels.workspace_roles'),
                  }),
                },
              ]}>
              <TreeSelect
                disabled={!permissions.canUpdateRole()}
                allowClear
                id="roles"
                treeCheckable
                placeholder={t('common.labels.roles_placeholder')}
                suffixIcon={
                  <span className="select-search-icon">
                    <SearchIcon />
                  </span>
                }
                showSearch
                filterTreeNode={(search, item: RowRecord) =>
                  item.label?.toLowerCase().indexOf(search.toLowerCase()) >= 0
                }
                showArrow={true}
                treeData={listRoles.data}
              />
            </Form.Item>
          </>
        )}
        <div className="ant-row footer-btn-panel w-480 test">
          <Button
            id={t('common.labels.save')}
            type="primary"
            htmlType="submit"
            disabled={disableSave}
            loading={addUser?.isLoading ? true : false}>
            {t('common.labels.save')}
          </Button>
          <Button id={t('common.labels.cancel')} onClick={onCancel}>
            {t('common.labels.cancel')}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default AddUpdateWorkspaceUser;
