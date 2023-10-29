import React from 'react';
import { Button, Form, Modal, Checkbox, Tooltip } from 'antd';

import useSaveAndPublishModal from './save-and-publish-controller';

const SaveAndPublishModal = () => {
  const {
    t,
    onSave,
    onCancel,
    form,
    environmentList,
    // isModalVisibility,
    onChange,
    isEnvironmentSelected,
    loading,
  } = useSaveAndPublishModal();

  return (
    <>
      <Modal
        title={t('common.labels.save_and_publish')}
        className="CustomModal"
        // visible={isModalVisibility}
        visible
        footer={[
          <Button key="cancel" onClick={onCancel}>
            {t('common.labels.cancel')}
          </Button>,

          <Button
            key="save"
            type="primary"
            onClick={onSave}
            loading={loading}
            disabled={!isEnvironmentSelected}>
            {t('common.labels.publish')}
          </Button>,
        ]}
        onCancel={onCancel}
        centered>
        <Form
          layout="vertical"
          onValuesChange={onChange}
          form={form}
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}>
          <Form.Item
            name="environment"
            className="schedule-row"
            label={t('common.labels.publish_environment')}>
            <Checkbox.Group>
              {environmentList?.map((item) => (
                <Tooltip
                  placement="bottom"
                  title={
                    item.isDisable &&
                    t('common.messages.error_permission_publish')
                  }>
                  <Checkbox value={item.id} disabled={item.isDisable}>
                    {item.title}
                  </Checkbox>
                </Tooltip>
              ))}
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SaveAndPublishModal;
