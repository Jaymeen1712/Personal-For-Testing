import React from 'react';
import {Button, Modal} from 'antd';

import useViewContentInModalController from './view-content-in-modal-controller';
import FieldListComponent from '../../common-components/field-list-component';

const ViewContentInModal: React.FC<{
  contentModalId: string;
  contentModalDataId: string;
  versionId: string;
  contentModalInternalName: string;
  onContentLibraryPopupVisibilityChange: (val: boolean) => void;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  form: any;
}> = ({
        contentModalId,
        contentModalDataId,
        versionId,
        contentModalInternalName,
        onContentLibraryPopupVisibilityChange,
        form,
      }) => {
  const {
    mappingObject,
    headerTitleAndSubtitle,
    collapseActiveKey,
    onCollapseActiveKeyChange,
    addNewComponent,
    deleteNewComponent,
    onSaveButtonClick,
    t,
    saveButtonLoading,
  } = useViewContentInModalController(
    contentModalId,
    contentModalDataId,
    versionId,
    form,
    onContentLibraryPopupVisibilityChange
  );
  return (
    <Modal
      className="CustomModal CustomModal-xlarge"
      visible
      onCancel={() => onContentLibraryPopupVisibilityChange(false)}
      title={headerTitleAndSubtitle?.title}
      footer={[
        <Button
          key="cancel"
          onClick={() => onContentLibraryPopupVisibilityChange(false)}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={onSaveButtonClick}
          loading={saveButtonLoading}>
          {t('common.labels.save')}
        </Button>,
      ]}>
      {mappingObject.length > 0 && (
        <>
          <FieldListComponent
            mappingObject={mappingObject}
            collapseActiveKey={collapseActiveKey}
            onCollapseActiveKeyChange={onCollapseActiveKeyChange}
            addNewComponent={addNewComponent}
            deleteNewComponent={deleteNewComponent}
            form={form}
            contentModalInternalName={contentModalInternalName}
            isViewContentInPopupOpen={true}
          />
        </>
      )}
    </Modal>
  );
};
export default ViewContentInModal;
