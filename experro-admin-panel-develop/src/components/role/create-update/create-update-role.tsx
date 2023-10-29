import React from 'react';
import { Button, Select, Input, Switch, Tabs, Form } from 'antd';
import get from 'lodash.get';

import {
  Settings,
  ContentLibraryTab,
  ContentModelTab,
  Insights,
  Personalization,
  Merchandising,
  Audience,
} from '../components';
import useCreateUpdateRole from './create-update-role-controller';
import DownArrowIcon from '../../../images/icons/downarrow-icon';
import ArrowLeftIcon from '../../../images/icons/arrow-left-icon';
import { allowSpecificDomain } from '../../../utills';

interface ICreateUpdateRole {
  onMainSidebarActiveItem?: (val: string) => void;
}

const CreateUpdateRole: React.FC<ICreateUpdateRole> = ({
  onMainSidebarActiveItem,
}) => {
  const {
    onCancel,
    onFinish,
    t,
    form,
    roleDetails,
    workspaces,
    workspaceValue,
    onChange,
    // listLanguage,
    stopPropagation,
    shouldUpdateComponent,
    roleId,
    workspaceId,
    editWorkspaceId,
    selectedWorkspaceId,
    currentWorkspaceName,
    createGlobalRole,
    createWorkspaceRole,
    updateGlobalRole,
    updateWorkspaceRole,
    allContentModels,
    listEnvironment,
    onValueChange,
    onBackButtonClick,
    isSaveButtonVisible,
    userEmailId,
  } = useCreateUpdateRole({ onMainSidebarActiveItem });

  return (
    <>
      {roleDetails.isSuccess && workspaces.isSuccess && (
        <Form
          layout="vertical"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          autoComplete="off"
          onFinish={onFinish}
          form={form}
          onValuesChange={onValueChange}
          key={get(roleDetails.data, 'roleName', '')}>
          {/* <SubSideBar
            sidebarActiveItemKey={
              workspaceId
                ? SIDEBAR_KEYS.WORKSPACE.SETTINGS
                : SIDEBAR_KEYS.GLOBAL.SETTINGS
            }
            subSidebarActiveItemKey={
              workspaceId
                ? SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.ADMINISTRATION.ROLES
                : SUB_SIDEBAR_KEYS.GLOBAL.SETTINGS.GENERAL.ROLES
            }
            isGlobalPage={!workspaceId}> */}
          <div className="headerinner ant-row ant-space-align-center ant-row-space-between ">
            <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
              <div className="hamburgericon" onClick={onBackButtonClick}>
                <ArrowLeftIcon />
              </div>
              <div className="w-100 ant-row ant-space-vertical">
                <span className="ant-page-header-heading-title">
                  {roleId
                    ? workspaceId
                      ? `${t(
                          'common.labels.edit_role'
                        )} in ${currentWorkspaceName}`
                      : t('common.labels.edit_role')
                    : workspaceId
                    ? `${t(
                        'common.labels.add_role'
                      )} to ${currentWorkspaceName}`
                    : t('common.labels.add_role')}
                </span>
                <span className="ant-page-header-heading-sub-title m-t-4">
                  {t('common.labels.role-subtitle')}
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
                  loading={
                    createGlobalRole?.isLoading ||
                    createWorkspaceRole?.isLoading ||
                    updateGlobalRole?.isLoading ||
                    updateWorkspaceRole?.isLoading
                  }
                  disabled={isSaveButtonVisible}>
                  {t('common.labels.save')}
                </Button>
              </div>
            </div>
          </div>
          <div className="page-content-top w-480 m-b-32">
            {!workspaceId && (
              <Form.Item
                name="workspace"
                label={t('common.labels.global-or-workspace')}
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: t('common.messages.required', {
                      entity: t('common.labels.global_or_workspace'),
                    }),
                  },
                ]}>
                <Select
                  suffixIcon={<DownArrowIcon />}
                  optionFilterProp="children"
                  onSelect={onChange}
                  disabled={!!roleId}
                  placeholder={t(
                    'common.labels.global-or-workspace-placeholder'
                  )}>
                  <Select.Option value="global">
                    {t('common.labels.global')}
                  </Select.Option>
                  {workspaces.data?.map((ele) => (
                    <Select.Option value={ele.id} key={ele.id}>
                      {ele.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              name="roleName"
              id="roleName"
              label={t('common.labels.role-name')}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.role-name'),
                  }),
                },
              ]}>
              <Input
                size="middle"
                placeholder={t('common.labels.role-name-placeholder')}
              />
            </Form.Item>

            <Form.Item
              name="roleDescription"
              id="roleDescription"
              label={t('common.labels.description')}
              wrapperCol={{ span: 24 }}>
              <Input.TextArea
                placeholder={t('common.labels.role-description-placeholder')}
                className="large-textarea"
              />
            </Form.Item>
          </div>
          <div className="page-content-bottom">
            {workspaceValue && (
              <div className="w-480">
                <div className="m-b-24">
                  <p className="m-0 font-normal gray-text">
                    {t('common.labels.permissions')}
                  </p>
                </div>
              </div>
            )}

            {workspaceValue &&
              (workspaceValue === 'global' ? (
                <div className="w-480">
                  <div className="ant-row ant-space-align-center ant-row-space-between">
                    <div className="role-permission-content">
                      <p className="m-0 font-semibold">
                        {t('common.labels.manage-workspace')}
                      </p>

                      <p className="m-0 gray-text">
                        {t('common.labels.manage-workspace-permission')}
                      </p>
                    </div>
                    <Form.Item
                      className="m-0"
                      name="canManageWorkspace"
                      valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </div>

                  <div className="ant-row ant-space-align-center ant-row-space-between">
                    <div className="role-permission-content">
                      <p className="m-0 font-semibold">
                        {t('common.labels.manage-users')}
                      </p>
                      <p className="m-0 gray-text">
                        {t('common.labels.manage-users-permission')}
                      </p>
                    </div>
                    <Form.Item
                      className="m-0"
                      name="canManageUserAndSecurity"
                      valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </div>
                </div>
              ) : (
                <Tabs defaultActiveKey="1" className="add-role-tab">
                  <Tabs.TabPane
                    tab={t('common.labels.content_library')}
                    key="1"
                    forceRender>
                    <ContentLibraryTab
                      form={form}
                      t={t}
                      stopPropagation={stopPropagation}
                      workspaceId={workspaceId || workspaceValue}
                      selectedWorkspaceId={selectedWorkspaceId}
                      editWorkspaceId={editWorkspaceId}
                      allContentModels={allContentModels}
                      // singleTypeContentModels={singleTypeContentModels}
                      // listLanguage={listLanguage}
                      listEnvironment={listEnvironment}
                    />
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    tab={t('common.labels.content-modal')}
                    key="2"
                    forceRender>
                    <ContentModelTab
                      form={form}
                      t={t}
                      stopPropagation={stopPropagation}
                      allContentModels={allContentModels}
                      // singleTypeContentModels={singleTypeContentModels}
                      // listLanguage={listLanguage}
                    />
                  </Tabs.TabPane>
                  {allowSpecificDomain(userEmailId) && (
                    <Tabs.TabPane
                      tab={t('common.labels.insights')}
                      key="3"
                      forceRender>
                      <Insights
                        form={form}
                        shouldUpdateComponent={shouldUpdateComponent}
                        workspaceId={workspaceId || workspaceValue}
                        selectedWorkspaceId={selectedWorkspaceId}
                        editWorkspaceId={editWorkspaceId}
                      />
                    </Tabs.TabPane>
                  )}

                  <Tabs.TabPane
                    tab={t('common.labels.settings')}
                    key="4"
                    forceRender>
                    <Settings form={form} />
                  </Tabs.TabPane>
                  {allowSpecificDomain(userEmailId) && (
                    <Tabs.TabPane
                      tab={t('common.labels.personalization')}
                      key="5"
                      forceRender>
                      <Personalization form={form} />
                    </Tabs.TabPane>
                  )}

                  {allowSpecificDomain(userEmailId) && (
                    <Tabs.TabPane
                      tab={t('common.labels.discovery')}
                      key="6"
                      forceRender>
                      <Merchandising form={form} />
                    </Tabs.TabPane>
                  )}

                  {allowSpecificDomain(userEmailId) && (
                    <Tabs.TabPane
                      tab={t('common.labels.audience')}
                      key="7"
                      forceRender>
                      <Audience form={form} />
                    </Tabs.TabPane>
                  )}
                </Tabs>
              ))}
          </div>
          {/* </SubSideBar> */}
        </Form>
      )}
    </>
  );
};

export default CreateUpdateRole;
