// @ts-nocheck
import React from 'react';
import { Spin, Form } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import 'react-nestable/dist/styles/index.css';

import useCreateUpdateSingleFieldController from './create-update-single-field-controller';
import ScheduleVersionPublish from '../../common-components/schedule-version-publish/schedule-version-publish';
import SaveNewVersionModal from '../../common-components/save-new-version-modal';
import WarningUnSaveChanges from '../../common-components/warning-unsave-change';
// import ScheduleVersionUnPublish from '../../common-components/schedule-version-unpublish';
import SaveAndPublish from '../../common-components/save-and-publish-modal/save-and-publish';
import FieldListHeader from '../../common-components/headers/field-list-header';
import { ContentModelList } from '../../../../../types';
import FieldListRightSideBar from '../../common-components/field-list-right-side-bar';
import FieldListComponent from '../../common-components/field-list-component';
import SaveAsNewDraftVersionConformationModal from '../../common-components/save-as-new-draft-version-conformation-modal';

const CreateUpdateSingleField: React.FC<{
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
    currentVersionId,
    isSpinnerActive,
    onSaveAsNewVersionClick,
    onCancelSaveAsNewVersionClick,
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
    changerRightSideMenuClose,
    headerTitleAndSubtitle,
    onRecordSaveButtonClick,
    creatUpdateRecordIsLoading,
    isSaveAsNewVersionModalVisible,
    changeSaveAsNewVersionModalVisibility,
    onSaveAndPublishButtonClick,
    onScheduleVersionUnPublishClick,
    onScheduleVersionUnPublishLoading,
    isScheduleVersionPublishModalVisible,
    changeScheduleVersionPublishModalVisibility,
    saveFormData,
    fieldComponentLoader,
    isSaveAsNewDraftVersionConformationModalVisible,
    onSaveAsNewDraftVersionModalVisibilityChange,
    t,
  } = useCreateUpdateSingleFieldController();

  return (
    <>
      <FieldListHeader
        selectedContentModalDetails={selectedContentModalDetails}
        headerTitleAndSubtitle={headerTitleAndSubtitle}
        currentVersionStatus={currentVersionStatus}
        onSaveButtonClick={onRecordSaveButtonClick}
        creatUpdateRecordIsLoading={creatUpdateRecordIsLoading}
        creatUpdatePageEditorIsLoading={false}
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
            className="HV-center single-type-loader"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        ) : (
          <div className="content-library-page">
            <div className={`content-library-page-inner ${rightSideMenuClose}`}>
              <FieldListComponent
                mappingObject={mappingObject}
                collapseActiveKey={collapseActiveKey}
                onCollapseActiveKeyChange={onCollapseActiveKeyChange}
                addNewComponent={addNewComponent}
                deleteNewComponent={deleteNewComponent}
                contentModalInternalName={
                  selectedContentModalDetails?.internalName
                }
              />

              <FieldListRightSideBar
                selectedContentModalDetails={selectedContentModalDetails}
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
                createdBy={createdBy}
                modifiedBy={modifiedBy}
                createdAt={createdAt}
                modifiedAt={modifiedAt}
                recordId={recordId}
                relationFieldValues={relationFieldValues}
                currentVersionId={currentVersionId}
              />
            </div>

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
                onCancel={onCancelSaveAsNewVersionClick}
                changeSaveAsNewVersionModalVisibility={
                  changeSaveAsNewVersionModalVisibility
                }
                // form={form}
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
export default CreateUpdateSingleField;
