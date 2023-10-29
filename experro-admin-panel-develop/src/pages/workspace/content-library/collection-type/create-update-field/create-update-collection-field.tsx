// @ts-nocheck

import React from 'react';
import { Form, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import 'react-nestable/dist/styles/index.css';

import useCreateUpdateCollectionController from './create-update-collection-controller';
import MediaManager from '../../../media-manager';
import AddNewModal from '../../common-components/add-new-record-modal';
import DeleteModal from '../../common-components/delete-model';
import ScheduleVersionPublish from '../../common-components/schedule-version-publish';
import SaveNewVersionModal from '../../common-components/save-new-version-modal';
import WarningUnSaveChanges from '../../common-components/warning-unsave-change';
// import ScheduleVersionUnPublish from '../../common-components/schedule-version-unpublish';
import SaveAndPublish from '../../common-components/save-and-publish-modal';
import { ContentModelList } from '../../../../../types';
import FieldListHeader from '../../common-components/headers/field-list-header';
import FieldListRightSideBar from '../../common-components/field-list-right-side-bar';
import FieldListComponent from '../../common-components/field-list-component';
import ViewContentInModal from '../view-content-in-modal';
import AddNewRecordInPageEditor from '../add-new-record-in-page-editor';
import SaveAsNewDraftVersionConformationModal from '../../common-components/save-as-new-draft-version-conformation-modal';

const CreateUpdateCollectionField: React.FC<{
  selectedContentModalDetails: ContentModelList;
}> = ({ selectedContentModalDetails }) => {
  const {
    mappingObject,
    workspaceLanguageList,
    versionList,
    onLanguageChange,
    onVersionChange,
    addNewComponent,
    deleteNewComponent,
    iframeMediaManagerPopUp,
    onOkDeleteModelClick,
    deleteRecord,
    t,
    currentVersionId,
    isSpinnerActive,
    onCloseIframeMediaManagerPopUp,
    onSaveAsNewVersionClick,
    form,
    nextVersionNumber,
    versionNo,
    relationFieldValues,
    versionName,
    onWorkingPopupDiscard,
    onWaringPopUpSaveClick,
    waringPopUpLoading,
    recordId,
    createdBy,
    modifiedBy,
    createdAt,
    modifiedAt,
    languageAvailableInRecord,
    rightSideMenuClose,
    isModalVisible,
    languagesList,
    currentVersionStatus,
    collapseActiveKey,
    onCollapseActiveKeyChange,
    isEcommerceRedirectionTabVisible,
    lastSyncAt,
    editRecordDetailsModalVisible,
    onEditRecordButtonClick,
    deleteRecordModalVisible,
    onDeleteRecordButtonClick,
    onDeleteRecordModalCancelClick,
    changerRightSideMenuClose,
    providerIdEsi,
    defaultTemplateId,
    headerTitleAndSubtitle,
    onRecordSaveButtonClick,
    creatUpdateRecordIsLoading,
    creatUpdatePageEditorIsLoading,
    isSaveAsNewVersionModalVisible,
    changeSaveAsNewVersionModalVisibility,
    onSaveAndPublishButtonClick,
    onScheduleVersionUnPublishClick,
    onScheduleVersionUnPublishLoading,
    isScheduleVersionPublishModalVisible,
    changeScheduleVersionPublishModalVisibility,
    saveFormData,
    isIFrameVisible,
    fieldComponentLoader,
    pageEditorStatus,
    iframeMediaManagerPopUpVisible,
    IFrameUrl,
    isContentLibraryPopupOpen,
    onContentLibraryPopupVisibilityChange,
    viewContentInModalData,
    isAddNewRecordInPopupOpen,
    onNewRecordInPopupVisibilityChange,
    contentModalDataForNewRecordPopup,
    isEcommerceModal,
    isSaveAsNewDraftVersionConformationModalVisible,
    onSaveAsNewDraftVersionModalVisibilityChange,
    providerEsi,
    storeHash
  } = useCreateUpdateCollectionController(selectedContentModalDetails);
  return (
    <>
      <FieldListHeader
        selectedContentModalDetails={selectedContentModalDetails}
        headerTitleAndSubtitle={headerTitleAndSubtitle}
        onEditRecordButtonClick={onEditRecordButtonClick}
        onDeleteRecordButtonClick={onDeleteRecordButtonClick}
        currentVersionStatus={currentVersionStatus}
        onSaveButtonClick={onRecordSaveButtonClick}
        creatUpdateRecordIsLoading={creatUpdateRecordIsLoading}
        creatUpdatePageEditorIsLoading={creatUpdatePageEditorIsLoading}
        changeSaveAsNewVersionModalVisibility={
          changeSaveAsNewVersionModalVisibility
        }
        onSaveAndPublishButtonClick={onSaveAndPublishButtonClick}
        onScheduleVersionUnPublishClick={onScheduleVersionUnPublishClick}
        onScheduleVersionUnPublishLoading={onScheduleVersionUnPublishLoading}
        changeScheduleVersionPublishModalVisibility={
          changeScheduleVersionPublishModalVisibility
        }
        currentVersionId={currentVersionId}
        isVersionHistoryButtonDisable={versionList?.length < 2}
        onSaveAsNewDraftVersionModalVisibilityChange={
          onSaveAsNewDraftVersionModalVisibilityChange
        }
      />
      <Form
        layout="vertical"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        form={form}
        validateTrigger="onBlur">
        {fieldComponentLoader || isSpinnerActive ? (
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        ) : isIFrameVisible ? (
          <>
            {pageEditorStatus && (
              <iframe
                title={t('common.labels.collection')}
                height="100%"
                width="100%"
                id="page_editor_iframe"
                src={IFrameUrl}></iframe>
            )}

            {iframeMediaManagerPopUpVisible && (
              <MediaManager
                accept={'image'}
                showSubmenuIcon={false}
                isPopUp={true}
                multiple={false}
                onCancel={onCloseIframeMediaManagerPopUp}
                onInsert={(file, url) => {
                  iframeMediaManagerPopUp(file, url);
                }}
              />
            )}
            {isContentLibraryPopupOpen && (
              <ViewContentInModal
                contentModalId={viewContentInModalData.contentModalId}
                contentModalDataId={viewContentInModalData.contentModalDataId}
                versionId={viewContentInModalData.versionId}
                contentModalInternalName={
                  viewContentInModalData.contentModalInternalName
                }
                onContentLibraryPopupVisibilityChange={
                  onContentLibraryPopupVisibilityChange
                }
                form={form}
              />
            )}
            {isAddNewRecordInPopupOpen && (
              <AddNewRecordInPageEditor
                contentModalId={
                  contentModalDataForNewRecordPopup.contentModalId
                }
                contentModalInternalName={
                  contentModalDataForNewRecordPopup.contentModalInternalName
                }
                onNewRecordInPopupVisibilityChange={
                  onNewRecordInPopupVisibilityChange
                }
              />
            )}
          </>
        ) : (
          <div className="content-library-page">
            <div className={`content-library-page-inner ${rightSideMenuClose}`}>
              <FieldListComponent
                mappingObject={mappingObject}
                collapseActiveKey={collapseActiveKey}
                onCollapseActiveKeyChange={onCollapseActiveKeyChange}
                addNewComponent={addNewComponent}
                deleteNewComponent={deleteNewComponent}
                form={form}
                contentModalInternalName={
                  selectedContentModalDetails?.internalName
                }
                isEcommerceModal={isEcommerceModal}
                providerEsi={providerEsi}
                storeHash={storeHash}
              />

              <FieldListRightSideBar
                selectedContentModalDetails={selectedContentModalDetails}
                headerTitleAndSubtitle={headerTitleAndSubtitle}
                isEcommerceRedirectionTabVisible={
                  isEcommerceRedirectionTabVisible
                }
                versionNo={versionNo}
                versionName={versionName}
                changerRightSideMenuClose={changerRightSideMenuClose}
                languageAvailableInRecord={languageAvailableInRecord}
                languagesList={languagesList}
                versionList={versionList}
                onVersionChange={onVersionChange}
                onLanguageChange={onLanguageChange}
                workspaceLanguageList={workspaceLanguageList}
                currentVersionStatus={currentVersionStatus}
                providerIdEsi={providerIdEsi}
                createdBy={createdBy}
                modifiedBy={modifiedBy}
                createdAt={createdAt}
                modifiedAt={modifiedAt}
                lastSyncAt={lastSyncAt}
                recordId={recordId}
                defaultTemplateId={defaultTemplateId}
                relationFieldValues={relationFieldValues}
                currentVersionId={currentVersionId}
                providerEsi={providerEsi}
                storeHash={storeHash}
              />
            </div>

            {editRecordDetailsModalVisible && (
              <AddNewModal
                onAddNewRecordButtonClick={onEditRecordButtonClick}
                recordEditDetails={{
                  isEdit: true,
                  contentModalDataId: recordId,
                  versionId: currentVersionId,
                }}
              />
            )}

            {deleteRecordModalVisible && (
              <DeleteModal
                isModalOpen={deleteRecordModalVisible}
                handleCancel={onDeleteRecordModalCancelClick}
                deleteRecord={deleteRecord}
                handleOk={onOkDeleteModelClick}
              />
            )}

            {isScheduleVersionPublishModalVisible && (
              <ScheduleVersionPublish
                changeScheduleVersionPublishModalVisibility={
                  changeScheduleVersionPublishModalVisibility
                }
                saveFormData={saveFormData}
              />
            )}

            {/*{isModalVisible.unpublish && <ScheduleVersionUnPublish />}*/}

            {isSaveAsNewVersionModalVisible && (
              <SaveNewVersionModal
                isModalVisible={isSaveAsNewVersionModalVisible}
                onSave={onSaveAsNewVersionClick}
                changeSaveAsNewVersionModalVisibility={
                  changeSaveAsNewVersionModalVisibility
                }
                nextVersionNo={nextVersionNumber}
                type="saveAsNew"
              />
            )}
          </div>
        )}
      </Form>
      {isModalVisible.warningModalOfVersion && (
        <WarningUnSaveChanges
          onWorkingPopupDiscard={onWorkingPopupDiscard}
          onWaringPopUpSaveClick={onWaringPopUpSaveClick}
          loading={waringPopUpLoading}
        />
      )}
      {isModalVisible.warningModalOfSidebar && (
        <WarningUnSaveChanges
          onWorkingPopupDiscard={onWorkingPopupDiscard}
          onWaringPopUpSaveClick={onWaringPopUpSaveClick}
          loading={waringPopUpLoading}
        />
      )}
      {isModalVisible.warningModalOfRelation && (
        <WarningUnSaveChanges
          onWorkingPopupDiscard={onWorkingPopupDiscard}
          onWaringPopUpSaveClick={onWaringPopUpSaveClick}
          loading={waringPopUpLoading}
        />
      )}
      {isModalVisible.warningModalOfGoBack && (
        <WarningUnSaveChanges
          onWorkingPopupDiscard={onWorkingPopupDiscard}
          onWaringPopUpSaveClick={onWaringPopUpSaveClick}
          loading={waringPopUpLoading}
        />
      )}

      {isModalVisible.isSaveAndPublish && <SaveAndPublish />}

      {isSaveAsNewDraftVersionConformationModalVisible && (
        <SaveAsNewDraftVersionConformationModal
          isModalVisible={isSaveAsNewDraftVersionConformationModalVisible}
          modalVisibilityChange={onSaveAsNewDraftVersionModalVisibilityChange}
          onSaveButtonClick={onRecordSaveButtonClick}
          t={t}
        />
      )}
    </>
  );
};
export default CreateUpdateCollectionField;
