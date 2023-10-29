import React from 'react';
import { Button, Modal, Form, Input } from 'antd';

import useAddNewModalController from './add-new-modal-controller';

const AddNewModal: React.FC<{
  onAddNewRecordButtonClick: (val: boolean) => void;
  recordEditDetails?: {
    isEdit: boolean;
    contentModalDataId: string;
    versionId: string;
  };
}> = ({ onAddNewRecordButtonClick, recordEditDetails }) => {
  const {
    form,
    t,
    onValueChange,
    onSave,
    pageTemple,
    createTitle,
    updateRecord,
    isAddNewRecordButtonDisabled,
  } = useAddNewModalController(onAddNewRecordButtonClick, recordEditDetails);


  return (
    <>
      <Modal
        title={
          recordEditDetails?.isEdit
            ? t('common.labels.edit_record')
            : t('common.labels.new_record')
        }
        className="CustomModal CustomModal-small"
        visible
        onCancel={() => {
          onAddNewRecordButtonClick(false);
        }}
        centered
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              onAddNewRecordButtonClick(false);
            }}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="save"
            type="primary"
            disabled={isAddNewRecordButtonDisabled}
            onClick={onSave}
            loading={
              recordEditDetails?.isEdit
                ? updateRecord.isLoading
                : createTitle.isLoading
            }>
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
            <Input
              maxLength={255}
              placeholder={t('common.labels.enter_record_name')}
            />
          </Form.Item>
          {pageTemple && (
            <Form.Item
              key="pageTemple"
              label={t('common.labels.page_slug')}
              name="pageSlug"
              initialValue="/"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.page_slug'),
                  }),
                },
              ]}
              normalize={(value) => value.trimStart()}>
              <Input />
            </Form.Item>
          )}

          {/* <Form.Item
            className="display-none"
            key="contentModalId"
            name="contentModalId"
            label={t('common.labels.collection_types')}
            rules={[{ required: true }]}
            initialValue={contentModalId}>
            <Select
              placeholder={t('common.messages.content_modal_placeholder')}
              suffixIcon={<DownArrowIcon />}
              allowClear
              disabled>
              {contentModalList.map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  );
};
export default AddNewModal;
