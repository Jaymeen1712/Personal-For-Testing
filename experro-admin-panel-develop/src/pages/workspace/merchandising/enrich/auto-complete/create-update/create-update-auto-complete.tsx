import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import useCreateUpdateStopWordsController from './create-update-auto-complete-controller';

interface ICreateUpdateAutoComplete {
  isModalVisible?: boolean;
  autoCompleteId: string;
  setAutoCompleteId: (autoCompleteId: string[]) => void;
  setIsModalVisible: (isModalVisible: boolean) => void;
}

const CreateUpdateAutoComplete: React.FC<ICreateUpdateAutoComplete> = ({
  isModalVisible,
  autoCompleteId,
  setAutoCompleteId,
  setIsModalVisible,
}) => {
  const {
    t,
    form,
    onCancel,
    isLoading,
    handleFieldChange,
    disableSave,
    onSave,
  } = useCreateUpdateStopWordsController(
    autoCompleteId,
    setAutoCompleteId,
    setIsModalVisible
  );
  return (
    <Modal
      title={
        autoCompleteId.length
          ? t('common.labels.edit_search_term')
          : t('common.labels.add_search_term')
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
          loading={isLoading}
          disabled={disableSave}
          onClick={onSave}>
          {t('common.labels.save')}
        </Button>,
      ]}
      centered>
      <Form
        autoComplete="off"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFieldsChange={handleFieldChange}
        layout="vertical"
        form={form}>
        <div className="m-b-8">
          <Form.Item
            label={t('common.labels.uppercase_search_term')}
            name="searchTerm"
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.search_term'),
                }),
              },
            ]}>
            <Input
              className="w-100 m-0"
              placeholder={
                autoCompleteId.length
                  ? ''
                  : t('common.labels.enter_search_term')
              }
              autoFocus={true}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUpdateAutoComplete;
