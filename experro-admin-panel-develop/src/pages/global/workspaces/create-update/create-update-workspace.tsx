import React from 'react';
import { Form, Button, Typography, Select, Input, Modal } from 'antd';

import useCreateUpdateWorkspace from './create-update-workspace-controller';
import { IWorkspace } from '../../../../types';
import CopyableIcon from '../../../../images/icons/copyable-icon';
import DownArrowIcon from '../../../../images/icons/downarrow-icon';

const { Paragraph } = Typography;
const { TextArea } = Input;

interface ICreateUpdateWorkspace {
  isModalVisible: boolean;
  hideModal: () => void;
  storeLink: string;
  initialValue?: IWorkspace;
  setStoreLink: (storeLink: string) => void;
}

const CreateUpdateWorkspace: React.FC<ICreateUpdateWorkspace> = ({
  isModalVisible,
  hideModal,
  storeLink,
  setStoreLink,
  initialValue,
}) => {
  const {
    form,
    t,
    workspaceId,
    onSave,
    createWorkspace,
    updateWorkspace,
    listCurrency,
    listTimeZones,
    browserTZ,
  } = useCreateUpdateWorkspace({
    hideModal,
    setStoreLink,
    initialValue,
  });

  return (
    <Modal
      open={isModalVisible}
      title={
        initialValue?.id
          ? t('common.labels.edit') + ' ' + initialValue?.name
          : initialValue?.name
          ? t('common.labels.clone_workspace_title')
          : t('common.labels.create_workspace_title')
      }
      onCancel={hideModal}
      className="CustomModal"
      footer={[
        <Button key="back" onClick={hideModal}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSave}
          loading={
            workspaceId
              ? updateWorkspace.isLoading
                ? true
                : false
              : createWorkspace.isLoading
              ? true
              : false
          }>
          {workspaceId ? t('common.labels.save') : t('common.labels.next')}
        </Button>,
      ]}
      centered>
      <Form
        autoComplete="off"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        initialValues={
          initialValue && {
            ...initialValue,
            timezone: initialValue?.timezone
              ? initialValue?.timezone
              : browserTZ,
            currency: initialValue.currency ? initialValue.currency : 'USD',
          }
        }
        form={form}>
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
          <Input
            placeholder={t('common.labels.workspace_name_placeholder')}
            className="w-100"
          />
        </Form.Item>
        <Form.Item
          name="description"
          label={t('common.labels.workspace_description')}>
          <TextArea
            placeholder={t('common.labels.workspace_description_placeholder')}
            className="w-100"
          />
        </Form.Item>
        <Form.Item
          name="timezone"
          label={t('common.labels.timezone')}
          rules={[
            {
              required: true,
              message: t('common.messages.at_least_required', {
                entity: t('common.labels.timezone'),
              }),
            },
          ]}>
          <Select
            optionFilterProp="children"
            showSearch={true}
            placeholder={t('common.labels.timezone')}
            suffixIcon={<DownArrowIcon />}
            className="w-100">
            {listTimeZones.data?.map((timezone) => (
              <Select.Option value={timezone.value}>
                {timezone.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {storeLink && (
          <Form.Item label={t('common.labels.workspace_link')}>
            <Paragraph
              copyable={{ icon: <CopyableIcon /> }}
              className="copyable-dashed-border ant-row ant-row-middle ant-row-space-between">
              <div className="copyable-text" title={storeLink}>{storeLink}</div>
            </Paragraph>
          </Form.Item>
        )}
        {(storeLink || initialValue?.id) && (
          <Form.Item
            name="currency"
            label={t('common.labels.field_currency_title')}
            className="w-100"
            rules={[
              {
                required: true,
                message: t('common.messages.at_least_required', {
                  entity: t('common.labels.field_currency_title'),
                }),
              },
            ]}>
            <Select
              optionFilterProp="children"
              showSearch={true}
              placeholder={t('common.labels.form_field_currency_title')}
              suffixIcon={<DownArrowIcon />}>
              {listCurrency.data?.map((currency) => (
                <Select.Option value={currency.value} key={currency.value}>
                  {currency.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CreateUpdateWorkspace;
