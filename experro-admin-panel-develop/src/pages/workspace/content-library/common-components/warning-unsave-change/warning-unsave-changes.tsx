import { Button, Modal } from 'antd';
import React from 'react';

import useWarningUnsavedChangesController from './warning-unsaved-changes-controller';

const WarningUnSaveChanges: React.FC<{
  onWorkingPopupDiscard: () => void;
  onWaringPopUpSaveClick: () => void;
  loading: boolean;
}> = ({ onWorkingPopupDiscard, onWaringPopUpSaveClick, loading }) => {
  const { t, onCancel } = useWarningUnsavedChangesController();
  return (
    <Modal
      className="confirm-modal"
      title={t('common.labels.save_changes')}
      onCancel={onCancel}
      visible
      footer={[
        <Button onClick={onWorkingPopupDiscard} key="cancel">
          {t('common.labels.discard')}
        </Button>,
        <Button
          onClick={onWaringPopUpSaveClick}
          type="primary"
          key="Save"
          loading={loading}>
          {t('common.labels.save')}
        </Button>,
      ]}
      centered>
      <p>{t('common.labels.save_changes_subtitle')}</p>
    </Modal>
  );
};

export default WarningUnSaveChanges;
