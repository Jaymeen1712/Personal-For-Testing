import Modal from '../../../../../components/modal';
import React from 'react';
import { TFunction } from 'react-i18next';

interface ICreateNewRecoveryKeyModal {
  t: TFunction<'translation', undefined>;
  isCreateNewRecoveryKeyModalVisible: boolean;
  onHideGenerateNewKeyModal: () => void;
  onCreateNewRecoveryKey: () => void;
}

const CreateNewRecoveryKeyModalTwoFactorAuthentication: React.FC<
  ICreateNewRecoveryKeyModal
> = ({
  t,
  isCreateNewRecoveryKeyModalVisible,
  onHideGenerateNewKeyModal,
  onCreateNewRecoveryKey,
}) => {
  return (
    <Modal
      title={t('common.labels.create_new_recovery_key')}
      classname='confirm-modal'
      isModalVisibility={isCreateNewRecoveryKeyModalVisible}
      okText={t('common.labels.create')}
      hideModal={onHideGenerateNewKeyModal}
      onOK={onCreateNewRecoveryKey}
      okButtonProps={{ style: { background: '#4F46E5', border: '#4F46E5' } }}>
      <div className="user-delete-modal">
        <p className="m-0 gray-text">
          {t('common.labels.create_new_recovery_ke_content')}
        </p>
      </div>
    </Modal>
  );
};

export default CreateNewRecoveryKeyModalTwoFactorAuthentication;
