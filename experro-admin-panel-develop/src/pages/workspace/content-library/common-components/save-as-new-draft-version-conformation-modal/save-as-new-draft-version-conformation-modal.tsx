import { Button, Modal } from 'antd';
import React from 'react';

const SaveAsNewDraftVersionConformationModal: React.FC<{
  isModalVisible: boolean;
  modalVisibilityChange: (val: boolean) => void;
  onSaveButtonClick: () => void;
  t: (str: string) => string;
}> = ({ isModalVisible, modalVisibilityChange, onSaveButtonClick, t }) => {
  return (
    <Modal
      title={t('common.labels.save_changes')}
      className="confirm-modal"
      open={isModalVisible}
      centered
      onCancel={() => modalVisibilityChange(false)}
      footer={[
        <Button
          onClick={() => {
            modalVisibilityChange(false);
          }}
          key="cancel">
          {t('common.labels.cancel')}
        </Button>,
        <Button onClick={onSaveButtonClick} type="primary" key="Save">
          {t('common.labels.save_as_version')}
        </Button>,
      ]}>
      <p>{t('common.messages.save_as_new_draft_modal_message')}</p>
    </Modal>
  );
};
export default SaveAsNewDraftVersionConformationModal;
