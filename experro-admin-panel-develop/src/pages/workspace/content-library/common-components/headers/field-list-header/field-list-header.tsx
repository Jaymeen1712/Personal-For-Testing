import { Button, Dropdown, Menu, Tooltip, Select } from 'antd';
import React from 'react';

import EllipsisIcon from '../../../../../../images/icons/ellipsis-icon';
import useFieldListHeaderController from './field-list-header-controller';
import HamburgerIcon from '../../../../../../images/icons/hamburger-icon';
import { ContentModelList } from '../../../../../../types';
import VersionDetailsSubHeader from '../version-details-sub-header';
import DownArrowIcon from '../../../../../../images/icons/downarrow-icon';
import ArrowLeftIcon from '../../../../../../images/icons/arrow-left-icon';
import CopyableIcon from '../../../../../../images/icons/copyable-icon';
import FilterDropDownIcon from '../../../../../../images/icons/filterdropdown-icon';

const FieldListHeader: React.FC<{
  selectedContentModalDetails: ContentModelList;
  headerTitleAndSubtitle: {
    title: '';
    subtitle: '';
  };
  currentVersionStatus: {
    id: string;
    name: string;
    status: string;
  }[];
  onEditRecordButtonClick?: (val: boolean) => void;
  onDeleteRecordButtonClick?: (val: boolean) => void;
  onSaveButtonClick: () => void;
  onSaveAndPublishButtonClick: () => void;
  creatUpdateRecordIsLoading: boolean;
  creatUpdatePageEditorIsLoading: boolean;
  changeSaveAsNewVersionModalVisibility: (val: boolean) => void;
  changeScheduleVersionPublishModalVisibility: (val: boolean) => void;
  onSaveAsNewDraftVersionModalVisibilityChange: (val: boolean) => void;
  onScheduleVersionUnPublishClick: () => void;
  onScheduleVersionUnPublishLoading: boolean;
  currentVersionId: string;
  isVersionHistoryButtonDisable: boolean;
}> = ({
  selectedContentModalDetails,
  onEditRecordButtonClick,
  onDeleteRecordButtonClick,
  headerTitleAndSubtitle,
  currentVersionStatus,
  onSaveButtonClick,
  creatUpdateRecordIsLoading,
  creatUpdatePageEditorIsLoading,
  changeSaveAsNewVersionModalVisibility,
  onSaveAndPublishButtonClick,
  onScheduleVersionUnPublishClick,
  onScheduleVersionUnPublishLoading,
  changeScheduleVersionPublishModalVisibility,
  currentVersionId,
  isVersionHistoryButtonDisable,
  onSaveAsNewDraftVersionModalVisibilityChange,
}) => {
  const {
    t,
    canUpdateRecord,
    canDeleteRecord,
    isIFrameVisible,
    defaultEnvironmentId,
    environmentList,
    onEnvChange,
    onPreviewButtonClick,
    onIFramePopCloseButtonClick,
    environmentStatus,
    canPublishRecord,
    onCollapseChange,
    onVersionHistoryButtonClick,
    // isModalIsEcommerceBrand,
    onCopyUrlClick,
  } = useFieldListHeaderController(
    selectedContentModalDetails?.internalName,
    headerTitleAndSubtitle,
    currentVersionStatus,
    currentVersionId,
    selectedContentModalDetails?.type
  );
  const { Option } = Select;
  return (
    <div className="headerinner ant-row ant-row-no-wrap ant-space-align-start ant-row-space-between content-library-header">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon">
          {selectedContentModalDetails?.type === 'collection' ? (
            <div
              className="hamburgericon"
              onClick={onIFramePopCloseButtonClick}>
              <ArrowLeftIcon />
            </div>
          ) : (
            <div onClick={onCollapseChange}>
              <HamburgerIcon />
            </div>
          )}
        </div>
        <div className="w-100 ant-row ant-space-vertical ant-space-align-start">
          <span className="ant-page-header-heading-title">
            {headerTitleAndSubtitle.title}
          </span>
          {selectedContentModalDetails?.actAsWebPage && (
            <span className="ant-page-header-heading-sub-title m-t-4 hover-copy-link">
              <span
                className="heading-sub-title-with-copy"
                title={headerTitleAndSubtitle.subtitle}>
                {headerTitleAndSubtitle.subtitle}
              </span>
              <span className="anticon" onClick={onCopyUrlClick}>
                <CopyableIcon />
              </span>
            </span>
          )}
        </div>
        {environmentStatus && (
          <div className="m-t-2">
            <VersionDetailsSubHeader
              currentVersionStatus={currentVersionStatus}
            />
          </div>
        )}
      </div>
      {environmentStatus && (
        <div className="headerright">
          <div className="ant-row ant-row-end ant-space-align-center">
            {isIFrameVisible && (
              <Select
                className="m-r-16"
                suffixIcon={<FilterDropDownIcon />}
                defaultValue={defaultEnvironmentId}
                onChange={(value) => {
                  onEnvChange(value);
                }}>
                {environmentList &&
                  environmentList.map((value, index) => (
                    <Option value={value.id}>{value.title}</Option>
                  ))}
              </Select>
            )}

            {!isIFrameVisible &&
              !selectedContentModalDetails?.internalName.includes(
                'ecommerce_'
              ) && (
                <Dropdown
                  trigger={['click']}
                  placement="bottomRight"
                  overlay={
                    <div className="table-dropdown">
                      <Menu>
                        {selectedContentModalDetails?.type === 'collection' && (
                          <>
                            <Menu.Item
                              key="EditMenu"
                              onClick={() => {
                                onEditRecordButtonClick &&
                                  onEditRecordButtonClick(true);
                              }}
                              disabled={!canUpdateRecord}>
                              <Tooltip
                                placement="left"
                                title={
                                  !canUpdateRecord &&
                                  t('common.messages.error_edit_record')
                                }>
                                {t('common.labels.edit_details')}
                              </Tooltip>
                            </Menu.Item>
                          </>
                        )}

                        {selectedContentModalDetails?.isVersionable && (
                          <Menu.Item
                            key="VersionHistoryMenu"
                            onClick={onVersionHistoryButtonClick}
                            disabled={isVersionHistoryButtonDisable}>
                            {t('common.labels.version_history')}
                          </Menu.Item>
                        )}
                        {selectedContentModalDetails?.type === 'collection' && (
                          <>
                            <Menu.Item
                              disabled={!canDeleteRecord}
                              key="DeleteMenu"
                              danger
                              onClick={() => {
                                onDeleteRecordButtonClick &&
                                  onDeleteRecordButtonClick(true);
                              }}>
                              <Tooltip
                                placement="left"
                                title={
                                  !canDeleteRecord &&
                                  t('common.messages.error_delete_record')
                                }>
                                {t('common.labels.delete')}
                              </Tooltip>
                            </Menu.Item>
                          </>
                        )}
                      </Menu>
                    </div>
                  }>
                  <Button
                    size="middle"
                    type="text"
                    icon={<EllipsisIcon />}
                    key="VersionHistoryMenuButton"
                    className="m-l-12 ant-row ant-space-align-center ant-row-center"></Button>
                </Dropdown>
              )}
            {selectedContentModalDetails?.actAsWebPage && (
              <Button key="preview" className="" onClick={onPreviewButtonClick}>
                {t('common.labels.preview')}
              </Button>
            )}
            <Tooltip
              placement="bottom"
              title={
                !canUpdateRecord && t('common.messages.error_edit_record')
              }>
              <div
                className={`combine-buttons m-r-16 m-l-16 ${
                  (isIFrameVisible && environmentStatus !== 'PUBLISHED') ||
                  !selectedContentModalDetails?.isVersionable
                    ? 'editor-button'
                    : ''
                }`}>
                <Button
                  disabled={!canUpdateRecord}
                  key="save"
                  type="primary"
                  loading={
                    isIFrameVisible
                      ? creatUpdatePageEditorIsLoading
                      : creatUpdateRecordIsLoading
                  }
                  onClick={() => {
                    environmentStatus === 'PUBLISHED' &&
                    selectedContentModalDetails?.isVersionable
                      ? onSaveAsNewDraftVersionModalVisibilityChange(true)
                      : onSaveButtonClick();
                  }}>
                  {selectedContentModalDetails?.isVersionable
                    ? t('common.labels.save')
                    : t('common.labels.save_and_publish')}
                </Button>
                {(isIFrameVisible && environmentStatus !== 'PUBLISHED') ||
                !selectedContentModalDetails?.isVersionable ? (
                  ''
                ) : (
                  <Dropdown
                    disabled={!canUpdateRecord}
                    className={`button-down-arrow ${
                      isIFrameVisible && 'm-r-16'
                    }`}
                    placement="bottomRight"
                    trigger={['click']}
                    overlay={
                      <div className="table-dropdown content-library-dropdown">
                        <Menu>
                          {!isIFrameVisible && (
                            <Menu.Item
                              disabled={!canUpdateRecord}
                              key="SaveAsNewVersion"
                              onClick={() => {
                                changeSaveAsNewVersionModalVisibility(true);
                              }}>
                              {t('common.labels.save_as_new_version')}
                            </Menu.Item>
                          )}

                          {environmentStatus === 'PUBLISHED' && (
                            <Menu.Item
                              disabled={!canPublishRecord}
                              key="SaveAndPublish"
                              onClick={onSaveAndPublishButtonClick}>
                              <Tooltip
                                placement="left"
                                title={
                                  !canPublishRecord &&
                                  t('common.messages.error_permission_publish')
                                }>
                                {t('common.labels.save_and_publish')}
                              </Tooltip>
                            </Menu.Item>
                          )}
                        </Menu>
                      </div>
                    }>
                    <Button type="primary" key="DownArrowIcon">
                      <DownArrowIcon />
                    </Button>
                  </Dropdown>
                )}
              </div>
            </Tooltip>
            {isIFrameVisible && (
              <Button
                key="cancel"
                className="m-r-16"
                onClick={onIFramePopCloseButtonClick}>
                {t('common.labels.cancel')}
              </Button>
            )}
            {!isIFrameVisible &&
              environmentStatus !== 'PUBLISHED' &&
              selectedContentModalDetails?.isVersionable && (
                <Tooltip
                  placement="left"
                  title={
                    !canPublishRecord &&
                    t('common.messages.error_permission_publish')
                  }>
                  <Button
                    disabled={!canPublishRecord}
                    key="publish"
                    onClick={() => {
                      changeScheduleVersionPublishModalVisibility(true);
                    }}
                    type="primary"
                    // loading={publishVersion.isLoading}
                    className="green-button">
                    {t('common.labels.publish')}
                  </Button>
                </Tooltip>
              )}

            {environmentStatus === 'PUBLISHED' &&
              !isIFrameVisible &&
              selectedContentModalDetails?.isVersionable && (
                <Tooltip
                  placement="bottom"
                  title={
                    !canPublishRecord &&
                    t('common.messages.error_permission_unpublish')
                  }>
                  <Button
                    disabled={!canPublishRecord}
                    key="unPublish"
                    onClick={onScheduleVersionUnPublishClick}
                    type="primary"
                    loading={onScheduleVersionUnPublishLoading}
                    danger>
                    {t('common.labels.un_publish')}
                  </Button>
                </Tooltip>
              )}
          </div>
        </div>
      )}
    </div>
  );
};
export default FieldListHeader;
