import { Button, Form, Input, Modal } from 'antd';
import React from 'react';
import { TFunction } from 'react-i18next';
import { I301Redirect } from '../../../../types';
import useAdd301RedirectController from './add-redirection-controller';
import { UseQueryResult } from 'react-query';

interface IAddRedirection {
  isEdit: boolean;
  t: TFunction<'translation', undefined>;
  isModalVisible?: boolean;
  addRedirectButtonLoading: boolean;
  editRedirectData: I301Redirect;
  redirectId: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  list301Redirects: UseQueryResult<
    {
      items: I301Redirect[];
      totalCount: number;
    },
    unknown
  >;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const AddRedirection: React.FC<IAddRedirection> = ({
  isEdit,
  t,
  isModalVisible,
  addRedirectButtonLoading,
  redirectId,
  setIsEdit,
  list301Redirects,
  setIsModalVisible,
  editRedirectData,
}) => {
  const { form, onCancel, disableSave, onCreateRedirect, handleFieldChange } =
    useAdd301RedirectController(
      setIsEdit,
      redirectId,
      isEdit,
      list301Redirects,
      setIsModalVisible,
      editRedirectData
    );

  return (
    <Modal
      title={
        isEdit
          ? t('common.labels.edit_redirect_modal')
          : t('common.labels.add_redirect_modal')
      }
      className="CustomModal CustomModal-small"
      open={isModalVisible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={addRedirectButtonLoading}
          disabled={disableSave}
          onClick={form.submit}>
          {t('common.labels.save')}
        </Button>,
      ]}
      centered>
      <Form
        layout="vertical"
        form={form}
        id="redirect-form"
        onFieldsChange={handleFieldChange}
        onFinish={onCreateRedirect}
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}>
        <Form.Item
          label={t('common.labels.source_url')}
          name="oldURL"
          rules={[
            {
              required: true,
              message: t('common.messages.required', {
                entity: t('common.labels.source_url'),
              }),
            },
          ]}>
          <Input placeholder={t('common.labels.source_url_here')} />
        </Form.Item>
        <Form.Item
          label={t('common.labels.destination_url')}
          name="newURL"
          rules={[
            {
              required: true,
              message: t('common.messages.required', {
                entity: t('common.labels.destination_url'),
              }),
            },
          ]}>
          <Input placeholder={t('common.labels.url_here')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRedirection;
