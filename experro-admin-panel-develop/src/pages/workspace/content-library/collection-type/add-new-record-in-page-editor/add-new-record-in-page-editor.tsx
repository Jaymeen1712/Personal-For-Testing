import { Button, Modal, Form, Input } from 'antd';

import useAddNewRecordInPageEditorController from './add-new-record-in-page-editor-controller';
import React from 'react';

const AddNewRecordInPageEditor: React.FC<{
  onNewRecordInPopupVisibilityChange: (val: boolean) => void;
  contentModalId: string;
  contentModalInternalName: string;
}> = ({
  onNewRecordInPopupVisibilityChange,
  contentModalId,
  contentModalInternalName,
}) => {
  const { t, onSaveButtonClick, form, onValueChange, loading } =
    useAddNewRecordInPageEditorController(
      onNewRecordInPopupVisibilityChange,
      contentModalId,
      contentModalInternalName
    );
  return (
    <>
      <Modal
        title={t('common.labels.new_record')}
        className="CustomModal CustomModal-small"
        centered
        visible
        onCancel={() => {
          onNewRecordInPopupVisibilityChange(false);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              onNewRecordInPopupVisibilityChange(false);
            }}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={onSaveButtonClick}
            loading={loading}>
            {t('common.labels.save')}
          </Button>,
        ]}>
        <Form
          layout="vertical"
          form={form}
          onValuesChange={onValueChange}
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}>
          <Form.Item
            key="title"
            label={t('common.labels.record_name')}
            name="title"
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.title'),
                }),
              },
            ]}
            normalize={(value) => value.trimStart()}>
            <Input maxLength={255} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddNewRecordInPageEditor;
