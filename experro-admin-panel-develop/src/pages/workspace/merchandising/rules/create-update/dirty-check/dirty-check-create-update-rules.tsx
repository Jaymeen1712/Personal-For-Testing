import React from 'react';
import { Button, Modal } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

import useDirtyCheckCreateUpdateRulesController from './dirty-check-create-update-rules-controller';

interface IDirtyCheckCreateUpdateRules {
  isDirtyCheckModelVisible: boolean;
  buttonLoading: boolean;
  setIsDirtyCheckModelVisible: (isDirtyCheckModelVisible: boolean) => void;
  setCheckedProduct: (checkedProduct: CheckboxValueType[]) => void;
  setSelectedProductsCategories: (
    selectedProductsCategories: {
      label: string;
      value: string;
      id?: string;
      toggle?: boolean;
    }[]
  ) => void;
  setSelectedProductSearchRule: (
    selectedProductSearchRule: {
      id: string;
      text: string;
      className?: string;
    }[]
  ) => void;
  setSelectedProductGlobal: (
    selectedProductGlobal: { id: string; text: string; className?: string }[]
  ) => void;
  saveRule: () => void;
}

const DirtyCheckCreateUpdateRules: React.FC<IDirtyCheckCreateUpdateRules> = ({
  isDirtyCheckModelVisible,
  buttonLoading,
  setIsDirtyCheckModelVisible,
  setCheckedProduct,
  setSelectedProductsCategories,
  setSelectedProductSearchRule,
  setSelectedProductGlobal,
  saveRule,
}) => {
  const { t, discardDirtyCheckModel, onSaveDirtyCheckButton, onCancel } =
    useDirtyCheckCreateUpdateRulesController({
      setIsDirtyCheckModelVisible,
      setCheckedProduct,
      setSelectedProductsCategories,
      setSelectedProductSearchRule,
      setSelectedProductGlobal,
      saveRule,
    });

  return (
    <Modal
      title={t('common.labels.un_saved_changes')}
      open={isDirtyCheckModelVisible}
      className="confirm-modal"
      onCancel={onCancel}
      footer={[
        <Button onClick={discardDirtyCheckModel} key="cancel">
          {t('common.labels.discard')}
        </Button>,
        <Button
          onClick={onSaveDirtyCheckButton}
          type="primary"
          key="Save"
          loading={buttonLoading}>
          {t('common.labels.save')}
        </Button>,
      ]}
      centered>
      <p>{t('common.labels.un_saved_changes_message')}</p>
    </Modal>
  );
};

export default DirtyCheckCreateUpdateRules;
