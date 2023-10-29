import { Button, Modal } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

// @ts-ignore
const DeleteModal = ({ isModalOpen, handleCancel, deleteRecord, handleOk }) => {
  const { t } = useTranslation();
  return (
    <Modal
      className='confirm-modal'
      title={t('common.labels.delete_record')}
      centered
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="deleteRecordCancel" onClick={handleCancel}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          key="deleteRecordDelete"
          type="primary"
          loading={deleteRecord.isLoading}
          danger
          onClick={handleOk}>
          {t('common.labels.delete')}
        </Button>,
      ]}>
      <p>{t('common.labels.delete_content_library_message')}</p>
    </Modal>
  );
};

export default DeleteModal;
