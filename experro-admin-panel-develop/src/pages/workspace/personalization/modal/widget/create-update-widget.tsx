import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import useCreateUpdateWidgetController from './create-update-widget-controller';

interface ICreateUpdateWidget {
  environment: string | null;
  isEditWidget: boolean;
  isAddWidgetModalVisible: boolean;
  onSetWidgetModalVisible: (val: boolean) => void;
  onSetEditWidget: (val: boolean) => void;
}

const CreateUpdateWidget: React.FC<ICreateUpdateWidget> = ({
  environment,
  isEditWidget,
  isAddWidgetModalVisible,
  onSetWidgetModalVisible,
  onSetEditWidget,
}) => {
  const {
    t,
    form,
    onFinish,
    onCancelModal,
    getWidgetDetails,
    disableSave,
    isWidgetLoading,
    onHandleFieldChange,
  } = useCreateUpdateWidgetController(
    environment,
    isEditWidget,
    onSetWidgetModalVisible,
    onSetEditWidget
  );

  return (
    <>
      <Modal
        title={
          isEditWidget
            ? t('common.labels.edit_custom_widget')
            : t('common.labels.add_custom_widget')
        }
        open={isAddWidgetModalVisible}
        onCancel={onCancelModal}
        centered
        className="CustomModal CustomModal-small"
        footer={[
          <Button key="back" onClick={onCancelModal}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            type="primary"
            htmlType="submit"
            disabled={disableSave}
            loading={isWidgetLoading}
            onClick={onFinish}>
            {t('common.labels.save')}
          </Button>,
        ]}>
        <Form
          autoComplete="off"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout="vertical"
          form={form}
          onFieldsChange={onHandleFieldChange}
          key={getWidgetDetails.data?.id}>
          <Form.Item
            label={t('common.labels.widget_name')}
            name="name"
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.widget_name'),
                }),
              },
            ]}>
            <Input placeholder={t('common.labels.enter_widget_name')} />
          </Form.Item>
          <Form.Item label={t('common.labels.description')} name="description">
            <Input.TextArea
              placeholder={t('common.labels.enter_description')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUpdateWidget;
