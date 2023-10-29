import React from 'react';
import { Button, Modal } from 'antd';
import { useTranslation } from 'react-i18next';

interface IDeleteModal {
  contentModalDataId?: string;
  isVisible: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<IDeleteModal> = ({
  contentModalDataId,
  isVisible,
  isLoading,
  onCancel,
  onDelete,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal
        className="confirm-modal"
        title={t('common.labels.entity_delete', {
          entity: 'title',
        })}
        open={isVisible}
        onCancel={onCancel}
        centered={true}
        footer={[
          <Button key="back" onClick={onCancel}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={onDelete}
            loading={isLoading}
            danger>
            {t('common.labels.delete')}
          </Button>,
        ]}>
        <p>
          {contentModalDataId
            ? t('common.messages.delete_rule_description')
            : t('common.messages.delete_widget_description')}
        </p>
      </Modal>
    </>
  );
};

export default DeleteModal;
