import React from 'react';
import { Button, Form, Input, Modal } from 'antd';

import { Radio } from 'antd';
import useCreateUpdateRuleController from './create-update-rule-controller';

interface ICreateUpdateRule {
  isEditRule?: boolean;
  onSetEditRule?: (val: boolean) => void;
  environment: string | null;
  isAddRuleModalVisible: boolean;
  onCancelRuleModalVisible: (val: boolean) => void;
}

const CreateUpdateRule: React.FC<ICreateUpdateRule> = ({
  isEditRule,
  onSetEditRule,
  environment,
  isAddRuleModalVisible,
  onCancelRuleModalVisible,
}) => {
  const {
    t,
    form,
    onFinish,
    options,
    applicableValue,
    onChangeApplicable,
    disableSave,
    isLoading,
    onHandleFieldChange,
    onCancelModal,
  } = useCreateUpdateRuleController(
    environment,
    onCancelRuleModalVisible,
    onSetEditRule,
    isEditRule
  );

  return (
    <>
      <Modal
        title={
          isEditRule
            ? t('common.labels.edit_site_rule')
            : t('common.labels.add_site_rule')
        }
        open={isAddRuleModalVisible}
        centered
        onCancel={onCancelModal}
        className="CustomModal CustomModal-small"
        footer={[
          <Button key="back" onClick={onCancelModal}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            type="primary"
            htmlType="submit"
            disabled={disableSave}
            loading={isLoading}
            onClick={onFinish}>
            {t('common.labels.save')}
          </Button>,
        ]}>
        <Form
          form={form}
          autoComplete="off"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout="vertical"
          onFieldsChange={onHandleFieldChange}>
          <Form.Item
            label={t('common.labels.rule_name')}
            name="title"
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.rule_name'),
                }),
              },
            ]}>
            <Input placeholder={t('common.labels.rule_name_placeholder')} />
          </Form.Item>
          <Form.Item label={t('common.labels.description')} name="description">
            <Input.TextArea
              placeholder={t('common.labels.enter_description')}
            />
          </Form.Item>

          {!isEditRule && (
            <Form.Item
              label="Applicable on"
              name="widgetType"
              className="custom-radio-group">
              <Radio.Group
                options={options}
                onChange={onChangeApplicable}
                value={applicableValue}
                optionType="button"
                buttonStyle="solid"
                size="middle"
                defaultValue="global"
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default CreateUpdateRule;
