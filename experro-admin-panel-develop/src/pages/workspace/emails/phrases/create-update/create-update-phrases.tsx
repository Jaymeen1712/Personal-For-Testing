import React from 'react';
import { TFunction } from 'react-i18next';
import { FormInstance } from 'antd/es/form';
import { Button, Form, Input, Typography } from 'antd';

import { NAME_REGEX_NOT_ALLOW_SPACE_CAPS_PATTERN } from '../../../../../utills';
import Modal from '../../../../../components/modal';
import CopyableIcon from '../../../../../images/icons/copyable-icon';

const { Paragraph } = Typography;

interface ICreateUpdatePhrases {
  editRecordId: string;
  t: TFunction<'translation', undefined>;
  isCreateUpdatePhrasesModalVisible: boolean;
  onHideCreateUpdatePhraseModal: () => void;
  onShortCodeCopy: () => void;
  handleFieldChange: () => void;
  onAddPhrase: () => void;
  form: FormInstance;
  onNameChange: () => void;
  shortCode: string;
  disableSave: boolean;
}

const CreateUpdatePhrases: React.FC<ICreateUpdatePhrases> = ({
  editRecordId,
  t,
  isCreateUpdatePhrasesModalVisible,
  onHideCreateUpdatePhraseModal,
  handleFieldChange,
  onAddPhrase,
  form,
  onNameChange,
  shortCode,
  disableSave,
  onShortCodeCopy,
}) => {
  return (
    <Modal
      classname="CustomModal CustomModal-small"
      title={
        editRecordId
          ? t('common.labels.edit_phrase')
          : t('common.labels.add_phrase')
      }
      isModalVisibility={isCreateUpdatePhrasesModalVisible}
      hideModal={onHideCreateUpdatePhraseModal}
      footer={[
        <Button key="back" onClick={onHideCreateUpdatePhraseModal}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          key="submit"
          disabled={disableSave}
          onClick={onAddPhrase}
          type="primary">
          {t('common.labels.save')}
        </Button>,
      ]}>
      <Form
        autoComplete="off"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        onFieldsChange={handleFieldChange}
        form={form}>
        <Form.Item
          name="name"
          label={t('common.labels.name')}
          rules={[
            {
              required: true,
              message: t('common.messages.required', {
                entity: t('common.labels.name'),
              }),
            },
            {
              pattern: NAME_REGEX_NOT_ALLOW_SPACE_CAPS_PATTERN,
              message: t('common.messages.invalid_lowercase_alphabetic'),
            },
          ]}>
          <Input
            onChange={onNameChange}
            placeholder={t('common.labels.enter_name')}
            className="w-100"
          />
        </Form.Item>

        <Form.Item
          name="value"
          label={t('common.labels.value')}
          rules={[
            {
              required: true,
              message: t('common.messages.required', {
                entity: t('common.labels.value'),
              }),
            },
          ]}>
          <Input
            placeholder={t('common.labels.enter_value')}
            className="w-100"
          />
        </Form.Item>

        {/* {shortCode && ( */}
        <Form.Item name="shortCode" label={t('common.labels.shortCode')}>
          {/*<Input*/}
          {/*  disabled={true}*/}
          {/*  placeholder={t('common.labels.enter_value_to_generate_shortCode')}*/}
          {/*  className="w-100"*/}
          {/*/>*/}

          <Paragraph
            className="copyable-dashed-border ant-row ant-row-middle ant-row-space-between"
            copyable={
              shortCode.length > 0
                ? {
                    text: shortCode,
                    icon: shortCode && <CopyableIcon />,
                    onCopy: onShortCodeCopy,
                  }
                : false
            }>
            <div className="copyable-text">
              {shortCode.length > 0 ? (
                shortCode
              ) : (
                <div className="shortcode-placeholder">
                  {t('common.messages.shortcode_placeholder')}
                </div>
              )}
            </div>
          </Paragraph>
        </Form.Item>
        {/* )} */}
      </Form>
    </Modal>
  );
};

export default CreateUpdatePhrases;
