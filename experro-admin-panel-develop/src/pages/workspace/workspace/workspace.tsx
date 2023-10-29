import React from 'react';
import { Button, Form, Input, Select, Typography } from 'antd';
import get from 'lodash.get';

import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../utills';
import DeleteWorkspaceModal from './delete-workspace-modal/delete-workspace-modal';
import useWorkspaceController from './workspace-controller';
import DownArrowIcon from '../../../images/icons/downarrow-icon';
import SubSideBar from '../../../components/sub-sidebar';
import WorkspaceHeader from './workspace-header';
import CopyableIcon from '../../../images/icons/copyable-icon';

const { TextArea } = Input;
const { Paragraph } = Typography;

interface IWorkspace {
  onMainSidebarActiveItem?: (val: string) => void;
}

const Workspace: React.FC<IWorkspace> = ({ onMainSidebarActiveItem }) => {
  const {
    t,
    onFinish,
    isModalVisible,
    hideModal,
    form,
    OnDeleteWorkspace,
    isButtonDisable,
    onFieldChange,
    canManageGlobalWorkspace,
    updateWorkspace,
    detailsWorkspace,
    listCurrency,
    listTimeZones,
  } = useWorkspaceController({ onMainSidebarActiveItem });

  return (
    <div className="page-content page-wrapper">
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.WORKSPACE
        }
        isEnvironmentSelectorVisible={true}
        isEnvironmentSelectorDisable={true}
        environmentSelectDefaultValue={'All'}
        disableEnvironmentToolTipMessage={t(
          'common.messages.shared_across_the_workspace'
        )}>
        <Form
          layout="vertical"
          name="workspace-form"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          form={form}
          initialValues={
            detailsWorkspace &&
            detailsWorkspace.data &&
            (detailsWorkspace.data?.currency
              ? {
                  ...detailsWorkspace.data,
                  currency: detailsWorkspace.data.currency,
                }
              : { ...detailsWorkspace.data, currency: 'USD' })
          }
          key={get(detailsWorkspace?.data, 'id', '')}
          onFinish={onFinish}
          onFieldsChange={onFieldChange}
          autoComplete="off">
          <WorkspaceHeader isButtonDisable={isButtonDisable} t={t} />
          <div className="page-content-top w-480 m-b-32">
            <Form.Item
              name="name"
              label={t('common.labels.workspace_name')}
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.workspace_name'),
                  }),
                },
              ]}>
              <Input disabled={!canManageGlobalWorkspace} />
            </Form.Item>
            <Form.Item
              name="description"
              label={t('common.labels.description')}>
              <TextArea
                placeholder={t('common.labels.enter_description')}
                disabled={!canManageGlobalWorkspace}
                className="large-textarea"
              />
            </Form.Item>
            <Form.Item
              name="timezone"
              label={t('common.labels.workspace_time_zone')}
              rules={[
                {
                  required: true,
                  message: t('common.messages.at_least_required', {
                    entity: t('common.labels.timezone'),
                  }),
                },
              ]}>
              <Select
                disabled={!canManageGlobalWorkspace}
                placeholder={t('common.labels.timezone')}
                showSearch={true}
                optionFilterProp="children"
                suffixIcon={<DownArrowIcon />}>
                {listTimeZones?.data?.map((timezone) => (
                  <Select.Option value={timezone.value}>
                    {timezone.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="currency"
              label={t('common.labels.field_currency_title')}
              rules={[
                {
                  required: true,
                  message: t('common.messages.at_least_required', {
                    entity: t('common.labels.field_currency_title'),
                  }),
                },
              ]}>
              <Select
                placeholder={t('common.labels.form_field_currency_title')}
                disabled={!canManageGlobalWorkspace}
                defaultValue="USD"
                showSearch={true}
                optionFilterProp="children"
                suffixIcon={<DownArrowIcon />}>
                {listCurrency?.data?.map((currency) => (
                  <Select.Option value={currency.value} key={currency.value}>
                    {currency.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="storeLink"
              label={t('common.labels.workspace_link')}>
              {detailsWorkspace?.data && (
                <Paragraph
                  className="copyable-dashed-border ant-row ant-row-middle ant-row-space-between"
                  copyable={{
                    text: `https://${window.location.host}/workspaces/${detailsWorkspace.data.id}/dashboard/traffic`,
                    icon: <CopyableIcon />,
                  }}>
                  <div
                    className="copyable-text"
                    title={`https://${window.location.host}/workspaces/${detailsWorkspace.data.id}/dashboard/traffic`}>
                    {`https://${window.location.host}/workspaces/${detailsWorkspace.data.id}/dashboard/traffic`}
                  </div>
                </Paragraph>
              )}
            </Form.Item>

            {canManageGlobalWorkspace && (
              <div className="footer-btn-panel">
                <Button
                  id={t('common.labels.update')}
                  type="primary"
                  htmlType="submit"
                  loading={!!updateWorkspace?.isLoading}
                  disabled={isButtonDisable}>
                  {t('common.labels.save')}
                </Button>
                <Button
                  id={t('common.labels.delete_workspace')}
                  danger
                  type="text"
                  // className="text-red"
                  htmlType="button"
                  onClick={OnDeleteWorkspace}>
                  {t('common.labels.delete_workspace')}
                </Button>
              </div>
            )}
          </div>

          <DeleteWorkspaceModal
            workspace={detailsWorkspace?.data}
            hideDeleteModal={hideModal}
            isDeleteModalVisible={isModalVisible}
          />
        </Form>
      </SubSideBar>
    </div>
  );
};

export default Workspace;
