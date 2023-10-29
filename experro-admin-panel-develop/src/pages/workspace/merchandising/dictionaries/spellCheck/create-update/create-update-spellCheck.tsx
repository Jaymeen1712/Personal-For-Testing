import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import useCreateUpdateStopWordsController from './create-update-spellCheck-controller';
import { FormInstance } from 'antd/es/form';

interface ICreateUpdateStopWords {
  form: FormInstance;
  isModalVisible?: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
  setSpellCheckId: (spellCheckId: string[]) => void;
  spellCheckId: string;
}

const CreateUpdateSpellCheck: React.FC<ICreateUpdateStopWords> = ({
  isModalVisible,
  setIsModalVisible,
  setSpellCheckId,
  form,
  spellCheckId,
}) => {
  const { t, isLoading, disableSave, handleFieldChange, onCancel, onSave } =
    useCreateUpdateStopWordsController(
      form,
      spellCheckId,
      setSpellCheckId,
      setIsModalVisible
    );

  return (
    <Modal
      title={
        spellCheckId.length
          ? t('common.labels.edit_spell_check')
          : t('common.labels.add_spell_check')
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
        layout="vertical"
        onFieldsChange={handleFieldChange}
        form={form}>
        <div className="m-b-8">
          <Form.Item
            label={t('common.labels.misspell')}
            name="term"
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.misspell'),
                }),
              },
            ]}>
            <Input
              className="w-100 m-0"
              placeholder={t('common.labels.enter_term')}
              autoFocus={true}
            />
          </Form.Item>
          <Form.Item
            label={t('common.labels.suggested_correction')}
            name="suggested_correction"
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.suggested_correction'),
                }),
              },
            ]}>
            <Input
              className="w-100 m-0"
              placeholder={t('common.labels.enter_suggested_correction')}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUpdateSpellCheck;
