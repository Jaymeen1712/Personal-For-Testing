import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/es/form';
import useCreateUpdatePhrasesController from './create-update-phrases-controller';

interface ICreateUpdatePhrases {
  form: FormInstance;
  isModalVisible: boolean;
  phraseId: string;
  setIsModalVisible: (isModalVisible: boolean) => void;
  setPhraseId: (phraseId: string[]) => void;
}

const CreateUpdatePhrases: React.FC<ICreateUpdatePhrases> = ({
  form,
  isModalVisible,
  phraseId,
  setIsModalVisible,
  setPhraseId,
}) => {
  const { t, onCancel, isLoading, handleFieldChange, disableSave, onSave } =
    useCreateUpdatePhrasesController(
      form,
      phraseId,
      setIsModalVisible,
      setPhraseId
    );

  return (
    <Modal
      title={
        phraseId.length
          ? t('common.labels.edit_phrase')
          : t('common.labels.add_phrase')
      }
      className="CustomModal CustomModal-small"
      open={isModalVisible}
      onCancel={onCancel}
      footer={[
        <Button key="cancelPhrase" onClick={onCancel}>
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
        layout="vertical"
        onFieldsChange={handleFieldChange}
        form={form}>
        <div className="m-b-8">
          <Form.Item
            label={t('common.labels.phrase')}
            name="phrase"
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.phrase'),
                }),
              },
            ]}>
            <Input
              className="w-100 m-0"
              placeholder={t('common.labels.enter_phrase')}
              autoFocus={true}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUpdatePhrases;
