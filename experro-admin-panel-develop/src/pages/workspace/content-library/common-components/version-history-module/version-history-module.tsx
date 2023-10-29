//@ts-nocheck
import React from 'react';
import {
  Button,
  Select,
  Tag,
  Tooltip,
  Menu,
  Dropdown,
  Table,
  Switch,
  Spin,
} from 'antd';

import VersionHistoryHeader from '../headers/version-history-header';
import { ContentModelList } from '../../../../../types';
import useVersionHistoryModuleController from './version-history-module-controller';
import CloneIcon from '../../../../../images/icons/clone-icon';
import SaveNewVersionModal from '../save-new-version-modal';
import UpdateVersionNameModal from '../update-version-name-modal';
import EditIcon from '../../../../../images/icons/edit-icon';
import FilterDropDownIcon from '../../../../../images/icons/filterdropdown-icon';
import OpenInNewWindowIcon from '../../../../../images/icons/open-in-new-window-icon';
import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';
import { LoadingOutlined } from '@ant-design/icons';

const VersionHistoryModule: React.FC<{
  selectedContentModalDetails: ContentModelList;
}> = ({ selectedContentModalDetails }) => {
  const { Option } = Select;
  const {
    t,
    workspaceLanguageList,
    versionList,
    onLanguageChange,
    firstVersionId,
    secondVersionId,
    onFirstRecordIdChange,
    onSecondRecordIdChange,
    currentVersionId,
    firstVersionDetail,
    secondVersionDetail,
    firstVersionStatus,
    secondVersionStatus,
    recordLanguage,
    onCloneButtonClick,
    changeCloneVersionModalVisibility,
    onSaveCloneModalData,
    isCloneVersionVisible,
    nextVersionNumber,
    recordTitle,
    isUpdateVersionNameModalVisible,
    changeUpdateVersionNameModalVisibility,
    updateVersionDetail,
    onEditVersionDetailButtonClick,
    versionDetailUpdateSuccessfully,
    canEditVersion,
    cloneVersionLoading,
    columns,
    dataSource,
    changeDifferenceOnlyValue,
    openInNewWindowClick,
    isDifferenceOnlyChecked,
    isLoading,
  } = useVersionHistoryModuleController(selectedContentModalDetails);

  return (
    <div className="version-histroy-page">
      <VersionHistoryHeader
        selectedContentModalDetails={selectedContentModalDetails}
        recordTitle={recordTitle}
      />

      <div className="version-main-section">
        <div className="version-title-section ant-row ant-row-space-between">
          <div className="left-section">
            <div className="version-upper-section">
              <div className="ant-row ant-space-align-center">
                <div className="version-select-title">
                  {versionList.length > 0 && (
                    <>
                      <i>#{firstVersionDetail?.versionNo} -&nbsp;</i>
                      <Select
                        defaultValue={firstVersionId}
                        value={firstVersionId}
                        suffixIcon={<FilterDropDownIcon />}
                        onChange={onFirstRecordIdChange}>
                        {versionList.map((item) =>
                          versionList.length > 1 ? (
                            item.id !== secondVersionId && (
                              <Option key={item.id}>{item.versionName}</Option>
                            )
                          ) : (
                            <Option key={item.id}>{item.versionName}</Option>
                          )
                        )}
                      </Select>
                    </>
                  )}
                </div>
                {currentVersionId === firstVersionId && (
                  <div className="current-tag">
                    <span className="ant-tag">
                      {t('common.labels.current')}
                    </span>
                  </div>
                )}
              </div>
              <div className="version-action-icon">
                <Tooltip
                  placement="top"
                  title={
                    canEditVersion
                      ? t('common.labels.edit')
                      : t('common.messages.error_edit_version')
                  }>
                  <Button
                    disabled={!canEditVersion}
                    size="small"
                    type="text"
                    icon={<EditIcon />}
                    onClick={() => {
                      onEditVersionDetailButtonClick(
                        firstVersionId,
                        firstVersionDetail.versionName,
                        firstVersionDetail.versionNo
                      );
                    }}></Button>
                </Tooltip>{' '}
                <Tooltip
                  placement="top"
                  title={
                    canEditVersion
                      ? t('common.labels.open_version')
                      : t('common.messages.error_edit_version')
                  }>
                  <Button
                    disabled={!canEditVersion}
                    size="small"
                    type="text"
                    icon={<OpenInNewWindowIcon />}
                    onClick={() => {
                      openInNewWindowClick(firstVersionId);
                    }}></Button>
                </Tooltip>
                {selectedContentModalDetails?.isVersionable && (
                  <Tooltip
                    placement="top"
                    title={
                      canEditVersion
                        ? t('common.labels.clone_this_version')
                        : t('common.messages.error_clone_permission')
                    }>
                    <Button
                      disabled={!canEditVersion}
                      size="small"
                      type="text"
                      icon={<CloneIcon />}
                      onClick={() => {
                        onCloneButtonClick(
                          firstVersionId,
                          firstVersionDetail.versionName,
                          firstVersionDetail.nextVersionNo
                        );
                      }}></Button>
                  </Tooltip>
                )}
              </div>
            </div>
            <div className="version-lower-section">
              <div>
                <label>{t('common.labels.created_by')}</label>
                <p>
                  {firstVersionDetail?.createdBy}
                  <span>
                    <i>{t('common.labels.on')}</i>{' '}
                    {firstVersionDetail?.createdAt}
                  </span>
                </p>
              </div>
              <div>
                <label>{t('common.labels.modified_by')}</label>
                <p>
                  {firstVersionDetail?.modifiedBy}
                  <span>
                    <i>{t('common.labels.on')}</i>{' '}
                    {firstVersionDetail?.modifiedAt}
                  </span>
                </p>
              </div>
              <div>
                <label>{t('common.labels.status')}</label>
                <div className="ant-row ant-space-align-center">
                  {firstVersionStatus.length > 0 && (
                    <>
                      {firstVersionStatus[0].status === 'PUBLISHED' ? (
                        <div className="ant-row ant-space-align-center ant-row-space-between">
                          <Tag color="success">
                            {firstVersionStatus[0].name} -{' '}
                            {t('common.labels.publish')}
                          </Tag>
                        </div>
                      ) : firstVersionStatus[0].status === 'SCHEDULE' ? (
                        <div className="ant-row ant-space-align-center ant-row-space-between">
                          <Tag color="blue">
                            {firstVersionStatus[0].name} -{' '}
                            {t('common.labels.schedule')}
                          </Tag>
                        </div>
                      ) : (
                        <div className="ant-row ant-space-align-center ant-row-space-between">
                          <Tag color="warning">
                            {firstVersionStatus[0].name} -{' '}
                            {t('common.labels.draft')}
                          </Tag>
                        </div>
                      )}
                    </>
                  )}
                  {firstVersionStatus.length > 1 && (
                    <>
                      <Dropdown
                        trigger={['click']}
                        placement="bottomRight"
                        overlay={
                          <Menu>
                            {firstVersionStatus.map(
                              (item, index) =>
                                index > 0 && (
                                  <Menu.Item>
                                    {item.status === 'PUBLISHED' ? (
                                      <div className="ant-row ant-space-align-center ant-row-space-between">
                                        <Tag color="success">
                                          {item.name} -{' '}
                                          {t('common.labels.publish')}
                                        </Tag>
                                      </div>
                                    ) : item.status === 'SCHEDULE' ? (
                                      <div className="ant-row ant-space-align-center ant-row-space-between">
                                        <Tag color="blue">
                                          {item.name} -{' '}
                                          {t('common.labels.schedule')}
                                        </Tag>
                                      </div>
                                    ) : (
                                      <div className="ant-row ant-space-align-center ant-row-space-between">
                                        <Tag color="warning">
                                          {item.name} -{' '}
                                          {t('common.labels.draft')}
                                        </Tag>
                                      </div>
                                    )}
                                  </Menu.Item>
                                )
                            )}
                          </Menu>
                        }>
                        <Button
                          type="link"
                          className="filter-custom-dropdown facets-custom"
                          onClick={(e) => e.preventDefault()}>
                          +{firstVersionStatus.length - 1}
                        </Button>
                      </Dropdown>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="right-section">
            <div className="version-upper-section">
              <div className="ant-row ant-space-align-center">
                <div className="version-select-title">
                  {versionList.length > 0 && (
                    <>
                      <i>#{secondVersionDetail?.versionNo} -&nbsp;</i>
                      <Select
                        defaultValue={secondVersionId}
                        value={secondVersionId}
                        suffixIcon={<FilterDropDownIcon />}
                        onChange={onSecondRecordIdChange}>
                        {versionList.map((item) =>
                          versionList.length > 1 ? (
                            item.id !== firstVersionId && (
                              <Option key={item.id}>{item.versionName}</Option>
                            )
                          ) : (
                            <Option key={item.id}>{item.versionName}</Option>
                          )
                        )}
                      </Select>
                    </>
                  )}
                </div>
                {currentVersionId === secondVersionId && (
                  <div className="current-tag">
                    <span className="ant-tag">
                      {t('common.labels.current')}
                    </span>
                  </div>
                )}
              </div>
              <div className="version-action-icon">
                <Tooltip
                  placement="top"
                  title={
                    canEditVersion
                      ? t('common.labels.edit')
                      : t('common.messages.error_edit_version')
                  }>
                  <Button
                    disabled={!canEditVersion}
                    className="OnlyIcon"
                    size="small"
                    type="text"
                    icon={<EditIcon />}
                    onClick={() => {
                      onEditVersionDetailButtonClick(
                        secondVersionId,
                        secondVersionDetail.versionName,
                        secondVersionDetail.versionNo
                      );
                    }}></Button>
                </Tooltip>
                <Tooltip
                  placement="top"
                  title={
                    canEditVersion
                      ? t('common.labels.open_version')
                      : t('common.messages.error_edit_version')
                  }>
                  <Button
                    disabled={!canEditVersion}
                    size="small"
                    type="text"
                    icon={<OpenInNewWindowIcon />}
                    onClick={() => {
                      openInNewWindowClick(secondVersionId);
                    }}></Button>
                </Tooltip>
                {selectedContentModalDetails?.isVersionable && (
                  <Tooltip
                    placement="top"
                    title={
                      canEditVersion
                        ? t('common.labels.clone_this_version')
                        : t('common.messages.error_clone_permission')
                    }>
                    <Button
                      disabled={!canEditVersion}
                      size="small"
                      type="text"
                      icon={<CloneIcon />}
                      onClick={() => {
                        onCloneButtonClick(
                          secondVersionId,
                          secondVersionDetail.versionName,
                          secondVersionDetail.nextVersionNo
                        );
                      }}></Button>
                  </Tooltip>
                )}
              </div>
            </div>
            <div className="version-lower-section">
              <div>
                <label>{t('common.labels.created_by')}</label>
                <p>
                  {secondVersionDetail?.createdBy}
                  <span>
                    <i>{t('common.labels.on')}</i>{' '}
                    {secondVersionDetail?.createdAt}
                  </span>
                </p>
              </div>
              <div>
                <label>{t('common.labels.modified_by')}</label>
                <p>
                  {secondVersionDetail?.modifiedBy}
                  <span>
                    <i>{t('common.labels.on')}</i>{' '}
                    {secondVersionDetail?.modifiedAt}
                  </span>
                </p>
              </div>
              <div>
                <label>{t('common.labels.status')}</label>
                <div className="ant-row ant-space-align-center">
                  {secondVersionStatus.length > 0 && (
                    <>
                      {secondVersionStatus[0].status === 'PUBLISHED' ? (
                        <div className="ant-row ant-space-align-center ant-row-space-between">
                          {/* <span>{secondVersionStatus[0].name}</span> */}
                          <Tag color="success">
                            {secondVersionStatus[0].name} -{' '}
                            {t('common.labels.publish')}
                          </Tag>
                        </div>
                      ) : secondVersionStatus[0].status === 'SCHEDULE' ? (
                        <div className="ant-row ant-space-align-center ant-row-space-between">
                          {/* <span>{secondVersionStatus[0].name}</span> */}
                          <Tag color="blue">
                            {secondVersionStatus[0].name} -{' '}
                            {t('common.labels.schedule')}
                          </Tag>
                        </div>
                      ) : (
                        <div className="ant-row ant-space-align-center ant-row-space-between">
                          {/* <span>{secondVersionStatus[0].name}</span> */}
                          <Tag color="warning">
                            {secondVersionStatus[0].name} -{' '}
                            {t('common.labels.draft')}
                          </Tag>
                        </div>
                      )}
                    </>
                  )}
                  {secondVersionStatus.length > 1 && (
                    <>
                      <Dropdown
                        trigger={['click']}
                        placement="bottomRight"
                        overlay={
                          <Menu>
                            {secondVersionStatus.map(
                              (item, index) =>
                                index > 0 && (
                                  <Menu.Item>
                                    {item.status === 'PUBLISHED' ? (
                                      <div className="ant-row ant-space-align-center ant-row-space-between">
                                        <Tag color="success">
                                          <span>{item.name}</span> -{' '}
                                          {t('common.labels.publish')}
                                        </Tag>
                                      </div>
                                    ) : item.status === 'SCHEDULE' ? (
                                      <div className="ant-row ant-space-align-center ant-row-space-between">
                                        <Tag color="blue">
                                          <span>{item.name}</span> -{' '}
                                          {t('common.labels.schedule')}
                                        </Tag>
                                      </div>
                                    ) : (
                                      <div className="ant-row ant-space-align-center ant-row-space-between">
                                        <Tag color="warning">
                                          <span>{item.name}</span> -{' '}
                                          {t('common.labels.draft')}
                                        </Tag>
                                      </div>
                                    )}
                                  </Menu.Item>
                                )
                            )}
                          </Menu>
                        }>
                        <Button
                          type="link"
                          className="filter-custom-dropdown facets-custom"
                          onClick={(e) => e.preventDefault()}>
                          +{firstVersionStatus.length - 1}
                        </Button>
                      </Dropdown>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="version-middel-section">
          {selectedContentModalDetails?.isLocalizationEnabled && (
            <div className="version-list-title ant-row ant-row-space-between">
              <div className="ant-row ant-space-align-center">
                <label className="custom-input-label m-r-16 m-0">
                  {t('common.labels.internationalize_title')}
                </label>
                <Select
                  // showSearch
                  suffixIcon={<FilterDropDownIcon />}
                  placeholder={t('common.labels.search_language')}
                  optionFilterProp="children"
                  filterOption={(input, workspaceLanguageList) =>
                    (workspaceLanguageList?.children ?? '')
                      //@ts-ignore
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  defaultValue={recordLanguage}
                  value={recordLanguage}
                  onChange={onLanguageChange}>
                  {workspaceLanguageList.map((item) => (
                    <Option value={item.locale}>{item.name}</Option>
                  ))}
                </Select>
              </div>
            </div>
          )}
          <div className="ant-row ant-space-align-center">
            <div className="m-r-12">
              <Switch
                valuePropName="checked"
                onChange={changeDifferenceOnlyValue}
              />
            </div>
            <label className="custom-input-label m-0">
              {t('common.labels.difference_only')}
            </label>
          </div>
        </div>
        {isLoading ? (
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        ) : (
          <div className="version-detailed-section">
            <Table
              columns={columns}
              dataSource={dataSource}
              showHeader={true}
              pagination={false}
              locale={{
                emptyText: (
                  <NoDataFound
                    className="no-data"
                    icon={<NoRecordIcon />}
                    title={t('common.labels.no_data_found')}
                  />
                ),
              }}
              rowClassName={(
                { firstFinalData, secondFinalData },
                index,
                indent
              ) => {
                if (
                  !isDifferenceOnlyChecked ||
                  (isDifferenceOnlyChecked && firstFinalData.isFieldChange)
                ) {
                  return '';
                } else {
                  return 'display-none';
                }
              }}
            />
          </div>
        )}
      </div>

      {isCloneVersionVisible && (
        <SaveNewVersionModal
          isModalVisible={isCloneVersionVisible}
          onSave={onSaveCloneModalData}
          nextVersionNo={nextVersionNumber}
          Loading={cloneVersionLoading}
          changeSaveAsNewVersionModalVisibility={
            changeCloneVersionModalVisibility
          }
        />
      )}

      {isUpdateVersionNameModalVisible && (
        <UpdateVersionNameModal
          versionNo={updateVersionDetail?.versionNo}
          versionName={updateVersionDetail?.versionName}
          updateVersionId={updateVersionDetail?.versionId}
          changeUpdateVersionNameModalVisibility={
            changeUpdateVersionNameModalVisibility
          }
          versionDetailUpdateSuccessfully={versionDetailUpdateSuccessfully}
        />
      )}
    </div>
  );
};

export default VersionHistoryModule;
