import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import useCreateUpdateStopWordsController from './create-update-stopwords-controller';
import { FormInstance } from 'antd/es/form';

interface ICreateUpdateStopWords {
  form: FormInstance;
  isModalVisible?: boolean;
  stopWordId: string;
  setStopWordId: (stopWordId: string[]) => void;
  setIsModalVisible: (isModalVisible: boolean) => void;
}

const CreateUpdateStopWords: React.FC<ICreateUpdateStopWords> = ({
  form,
  isModalVisible,
  stopWordId,
  setStopWordId,
  setIsModalVisible,
}) => {
  const { t, onCancel, isLoading, handleFieldChange, disableSave, onSave } =
    useCreateUpdateStopWordsController(
      form,
      stopWordId,
      setStopWordId,
      setIsModalVisible
    );
  return (
    <Modal
      title={
        stopWordId.length
          ? t('common.labels.edit_stop_word')
          : t('common.labels.add_stop_word')
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
            label={t('common.labels.term')}
            name="term"
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.term'),
                }),
              },
            ]}>
            <Input
              className="w-100 m-0"
              placeholder={t('common.labels.enter_term')}
              autoFocus={true}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUpdateStopWords;
