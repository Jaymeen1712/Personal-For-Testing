import React from 'react';
import { Button, Tooltip } from 'antd';

import { onSidebarToggle, SIDEBAR_KEYS } from '../../../utills';
import EditIcon from '../../../images/icons/edit-icon';
import useContentModelController from './content-model-controller';
import { Route, Switch } from 'react-router-dom';
import { BannerContentModelType } from './banner';
import CreateUpdateFolderModal from './create-update-folder-modal';
import CreateUpdateModel from './create-update-modal';
import ContentFields from './content-fields';
import FieldModal from './field-modal';
import FieldFormModal from './field-form-modal';
import ReorderModal from './reorder-modal';
import SubSideBar from '../../../components/sub-sidebar/sub-sidebar';
import HamburgerIcon from '../../../images/icons/hamburger-icon';
import PlusIcon from '../../../images/icons/plus-icon';

const ContentModel: React.FC<{
  onMainSidebarActiveItem?: (val: string) => void;
}> = ({ onMainSidebarActiveItem }) => {
  const {
    t,
    menuItems,
    path,
    isAddNewModelVisible,
    onAddNewModelVisibilityChange,
    isAddNewFolderVisible,
    onAddNewFolderVisibilityChange,
    modelGroupList,
    onSubSidebarMenuItemClick,
    selectedContentModelId,
    onSubSidebarOpenChange,
    isHeaderButtonVisible,
    onAddFieldClick,
    isCreateFieldModalVisible,
    isCreateFieldFormModalVisible,
    setIsCreateFieldFormModalVisible,
    onEditFieldStatusChange,
    onCreateField,
    titleSubTitle,
    hideCreateFieldModal,
    actAsWebPage,
    hideCreateFormFieldModal,
    hideUpdateFormFieldModal,
    selectedFieldType,
    isLocalizationEnable,
    editFieldIdAndStatus,
    selectedContentDetails,
    editModelStatus,
    onEditModelDetails,
    editNewModelStatusChange,
    editFolderStatus,
    openFolderId,
    addNewType,
    componentGroupList,
    onAddNewType,
    componentsList,
    canCreateContentModelField,
    canUpdateContentModel,
    modelInternalName,
    modelList,
    isReorderModalVisible,
    reorderType,
    menuDataObject,
    componentMenuDataObject,
    onReorderModalCancelClick,
    titleAndSubtitleChange,
    changeModalAndGroupList,
    sortable,
    changeTableSortOrderStatus,
  } = useContentModelController({ onMainSidebarActiveItem });
  return (
    <div className="page-wrapper">
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.CONTENT_MODEL}
        subSidebarMenuItems={menuItems}
        onSubSidebarMenuItemClick={onSubSidebarMenuItemClick}
        subSidebarActiveItemKey={selectedContentModelId}
        onSubSidebarParentMenuItemClick={onSubSidebarOpenChange}
        openSubSidebarMenuItems={openFolderId}
        title={titleSubTitle.title}
        subTitle={titleSubTitle.subTitle}
        isEnvironmentSelectorVisible={true}>
        <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
          <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
            <div className="hamburgericon" onClick={onSidebarToggle}>
              <HamburgerIcon />
            </div>
            <div className="w-100 ant-row ant-space-vertical">
              <span className="ant-page-header-heading-title">
                {titleSubTitle.title}
              </span>
              <span className="ant-page-header-heading-sub-title m-t-4">
                {titleSubTitle.subTitle}
              </span>
            </div>
          </div>
          <div className="headerright">
            <div className="ant-row ant-row-end ant-space-align-center">
              {isHeaderButtonVisible && (
                <div className="ant-row ant-row-end ant-space-align-center">
                  <Tooltip
                    title={
                      !canUpdateContentModel &&
                      (addNewType === 'component'
                        ? t('common.messages.error_component_update')
                        : t('common.messages.error_model_update'))
                    }>
                    <Button
                      disabled={!canUpdateContentModel || sortable}
                      size="middle"
                      icon={<EditIcon />}
                      key="edit"
                      onClick={onEditModelDetails}
                    />
                  </Tooltip>
                  <Tooltip
                    title={
                      !canCreateContentModelField &&
                      t('common.messages.error_model_field_create')
                    }>
                    <Button
                      disabled={!canCreateContentModelField || sortable}
                      type="primary"
                      htmlType="button"
                      onClick={onAddFieldClick}
                      key="add-new"
                      icon={
                        <span className="anticon">
                          <PlusIcon />
                        </span>
                      }>
                      {t('common.labels.add_field')}
                    </Button>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
        <CreateUpdateModel
          isVisible={isAddNewModelVisible}
          onModalVisibilityChange={onAddNewModelVisibilityChange}
          modelGroupList={modelGroupList}
          componentGroupList={componentGroupList}
          editModelStatus={editModelStatus}
          editNewModelStatusChange={editNewModelStatusChange}
          addNewType={addNewType}
          modelInternalName={modelInternalName}
          changeModalAndGroupList={changeModalAndGroupList}
        />

        <CreateUpdateFolderModal
          isVisible={isAddNewFolderVisible}
          onModalVisibilityChange={onAddNewFolderVisibilityChange}
          editFolderStatus={editFolderStatus}
          addNewType={addNewType}
          titleAndSubtitleChange={titleAndSubtitleChange}
        />
        {isReorderModalVisible && (
          <ReorderModal
            reorderType={reorderType}
            data={
              reorderType === 'model' ? menuDataObject : componentMenuDataObject
            }
            onReorderModalCancelClick={onReorderModalCancelClick}
          />
        )}

        <Switch>
          <Route exact path={`${path}/model/`}>
            <BannerContentModelType
              type="model"
              onAddContentType={() => {
                onAddNewModelVisibilityChange(true);
                onAddNewType('model');
              }}
            />
          </Route>

          <Route exact path={`${path}/component/`}>
            <BannerContentModelType
              type="component"
              onAddContentType={() => {
                onAddNewModelVisibilityChange(true);
                onAddNewType('component');
              }}
            />
          </Route>

          <Route path={`${path}/:category/:contentModelId/list-field/:type`}>
            <ContentFields
              isCreateFieldFormModalVisible={isCreateFieldFormModalVisible}
              onCreateField={onCreateField}
              onEditFieldStatusChange={onEditFieldStatusChange}
              setIsCreateFieldFormModalVisible={
                setIsCreateFieldFormModalVisible
              }
              onAddFieldClick={onAddFieldClick}
              addNewType={addNewType}
              modelInternalName={modelInternalName}
              sortable={sortable}
              changeTableSortOrderStatus={changeTableSortOrderStatus}
            />

            <FieldModal
              isModalVisible={isCreateFieldModalVisible}
              hideModal={hideCreateFieldModal}
              showCreateFormFieldModal={onCreateField}
              actAsWebPage={actAsWebPage}
            />

            {isCreateFieldFormModalVisible && (
              <FieldFormModal
                addNewType={addNewType}
                isModalVisible={isCreateFieldFormModalVisible}
                hideModal={hideCreateFormFieldModal}
                hideUpdateModal={hideUpdateFormFieldModal}
                selectedFieldType={selectedFieldType}
                editFieldIdAndStatus={editFieldIdAndStatus}
                componentsList={componentsList}
                selectedContentDetails={selectedContentDetails}
                isLocalizationEnable={isLocalizationEnable}
                modelList={modelList}
              />
            )}
          </Route>
        </Switch>
      </SubSideBar>
    </div>
  );
};
export default ContentModel;
