import React from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Dropdown,
  Form,
  Menu,
  Modal,
  Popover,
  Row,
  Select,
  Spin,
  Table,
} from 'antd';
import { Trans } from 'react-i18next';
import { LoadingOutlined } from '@ant-design/icons';

import NoDataFound from '../../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../../images/icons/no-records-icon';
import GearIcon from '../../../../../../images/icons/gear-icon';
import useListStopWordsController from './list-auto-complete-controller';
import {
  ENRICH_AUTO_COMPLETE,
  onSidebarToggle,
} from '../../../../../../utills';
import FilterDropDownIcon from '../../../../../../images/icons/filterdropdown-icon';
import HamburgerIcon from '../../../../../../images/icons/hamburger-icon';
import SettingsIcon from '../../../../../../images/icons/settings-icon';
import PlusIcon from '../../../../../../images/icons/plus-icon';
import BigcommerceBannerImage from '../../../../../../images/icons/bigcommerce-banner-image';
import SearchBanner from '../../../../../../images/icons/banner-search';
import CreateUpdateAutoComplete from '../create-update/create-update-auto-complete';
import EllipsisIcon from '../../../../../../images/icons/ellipsis-icon';
import ImportAutoComplete from '../import-auto-complete';
import DownloadIcon from '../../../../../../images/icons/download-icon';

interface IStopWords {
  isEnableAutoComplete: boolean;
  setIsEnableAutoComplete: (isEnableAutoComplete: boolean) => void;
  environment: string;
}

const ListAutoComplete: React.FC<IStopWords> = ({
  isEnableAutoComplete,
  setIsEnableAutoComplete,
  environment,
}) => {
  const {
    t,
    termName,
    columns,
    isStoreFound,
    isButtonVisible,
    isModalVisible,
    isVisibleDeleteModal,
    isImportModalVisible,
    isImportButtonDisable,
    isDragDropVisible,
    isOverRideModalVisible,
    importFile,
    autoCompleteId,
    sortingOptions,
    selectedRowKeys,
    selectedSortValue,
    totalRecordCount,
    userPreference,
    columnData,
    onSelectChange,
    permission,
    pagination,
    importFileForm,
    onExportFileClick,
    onTemplateClick,
    uploadClass,
    onUserPreferenceChange,
    onSortByChange,
    onCancel,
    setIsModalVisible,
    setAutoCompleteId,
    onDeleteAutoComplete,
    onSelectDeleteClick,
    onAddAutoComplete,
    onSettingClick,
    onAddStore,
    onSelectAll,
    onClearAllSelect,
    onImportFileFormSubmit,
    onOverRideData,
    getRootProps,
    getInputProps,
    onDeleteImportedFile,
    hideImportModal,
    onHideOverRideModal,
    onImportFileClick,
    importButtonLoading,
    isAllSelected,
    isLoading,
    isSuccess,
    listAutoCompleteLength,
    isDeleteLoading,
    typeOption,
    onSelectType,
    selectedType,
  } = useListStopWordsController(environment, setIsEnableAutoComplete);

  return (
    <>
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onSidebarToggle}>
            <HamburgerIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {t('common.labels.header_auto_complete')}
            </span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              {t('common.labels.subtitle_auto_complete')}
            </span>
          </div>
        </div>

        {isStoreFound && isSuccess && (
          <div className="headerright">
            <div className="ant-row ant-row-end">
              <>
                {(isButtonVisible || listAutoCompleteLength > 0) && (
                  <Dropdown
                    disabled={selectedRowKeys?.length > 0}
                    placement="bottomRight"
                    trigger={['click']}
                    overlay={
                      <div className="table-dropdown file-action-dropdown">
                        <Menu>
                          <Menu.Item key="import">
                            <Button
                              type="text"
                              key="import-file"
                              onClick={onImportFileClick}>
                              {t('common.labels.import_file')}
                            </Button>
                          </Menu.Item>
                          <Menu.Item key="export">
                            <Button
                              type="text"
                              key="export-file"
                              onClick={onExportFileClick}>
                              {t('common.labels.export_file')}
                            </Button>
                          </Menu.Item>
                        </Menu>
                      </div>
                    }>
                    <Button
                      type="default"
                      size="middle"
                      className="btn-hover-gray"
                      icon={<EllipsisIcon />}
                    />
                  </Dropdown>
                )}
              </>

              <Button
                size="middle"
                icon={<SettingsIcon />}
                key="edit"
                disabled={selectedRowKeys?.length > 0}
                onClick={onSettingClick}
              />
              {isButtonVisible && (
                <Button
                  id="add-auto-complete"
                  type="primary"
                  icon={
                    <span className="anticon">
                      <PlusIcon />
                    </span>
                  }
                  disabled={selectedRowKeys?.length > 0}
                  onClick={onAddAutoComplete}>
                  {t('common.labels.add_search_term')}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {!isEnableAutoComplete && isButtonVisible && (
        <Alert
          message={
            <Trans
              i18nKey={t('common.messages.search_disable_description', {
                entity: 'setting',
                name: t('common.labels.auto_complete'),
              })}
              components={{
                setting: (
                  <span
                    className="primary-color cursor-pointer"
                    onClick={onSettingClick}></span>
                ),
              }}
            />
          }
          type="error"
        />
      )}

      <>
        <>
          {((isSuccess && isStoreFound) || selectedType) && (
            <div
              className={`${
                (isSuccess && columnData && columnData.length > 0) ||
                selectedType
                  ? 'search-section'
                  : 'display-none'
              } environment-search ant-row ant-space-align-center ant-row-space-between`}>
              <div className="ant-row ant-space-align-center">
                <span
                  className={
                    listAutoCompleteLength ? 'search-count' : 'display-none'
                  }>
                  {selectedRowKeys.length === 0 && (
                    <>
                      {totalRecordCount > 1 ? (
                        <span>
                          {totalRecordCount} {t('common.labels.records')}
                        </span>
                      ) : (
                        <span>
                          {totalRecordCount} {t('common.labels.record')}
                        </span>
                      )}
                    </>
                  )}
                </span>

                {selectedRowKeys?.length > 0 && (
                  <>
                    <span className="search-count">
                      {`${selectedRowKeys.length} ${t(
                        'common.labels.of'
                      )} ${totalRecordCount} ${t('common.labels.selected')}`}
                    </span>
                  </>
                )}
              </div>
              <div className="ant-row ant-space-align-center">
                {selectedRowKeys.length === 0 ? (
                  <>
                    <div className="filters ant-space ant-space-horizontal ant-space-align-center m-r-24">
                      <Form.Item
                        colon={false}
                        label={t('common.labels.type')}
                        className="m-0 ant-space-item-main">
                        <Select
                          className="m-0 ant-space-align-center borderless-select"
                          popupClassName="dropdown-size-medium"
                          key="typeFilter"
                          placeholder={t('common.labels.all')}
                          options={typeOption}
                          value={selectedType}
                          onChange={onSelectType}
                          suffixIcon={<FilterDropDownIcon />}
                          placement="bottomRight"
                        />
                      </Form.Item>
                      <Form.Item
                        colon={false}
                        label={t('common.labels.sort_by')}
                        className="m-0 ant-space-item-main">
                        <Select
                          className="m-0 ant-space-align-center borderless-select"
                          popupClassName="dropdown-size-medium"
                          key="sortingFilter"
                          placeholder={t('common.labels.recently_updated')}
                          options={sortingOptions}
                          value={selectedSortValue}
                          onChange={onSortByChange}
                          suffixIcon={<FilterDropDownIcon />}
                          placement="bottomRight"
                        />
                      </Form.Item>
                    </div>
                    <Popover
                      placement="bottomRight"
                      content={
                        <Checkbox.Group
                          options={ENRICH_AUTO_COMPLETE}
                          defaultValue={userPreference}
                          onChange={onUserPreferenceChange}
                        />
                      }
                      trigger="click">
                      <Button icon={<GearIcon />} size="middle"></Button>
                    </Popover>
                  </>
                ) : (
                  <>
                    <Button
                      id={t('common.labels.delete')}
                      onClick={onSelectDeleteClick}
                      danger
                      type="primary">
                      {t('common.labels.delete')}
                    </Button>

                    <Button
                      onClick={onExportFileClick}
                      key="export-file"
                      type="default">
                      {t('common.labels.export_file')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
          {isLoading ? (
            <Spin
              data-testid={'loader'}
              className="HV-center table-center"
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
              size="large"
            />
          ) : (
            <>
              {isSuccess && (totalRecordCount > 0 || selectedType) ? (
                <div className="table-section">
                  <Table
                    rowSelection={{
                      type: 'checkbox',
                      selectedRowKeys: selectedRowKeys.map((item) => {
                        console.log(item);
                        return item;
                      }),
                      onSelect: onSelectChange,
                      onSelectAll: isAllSelected
                        ? onClearAllSelect
                        : onSelectAll,
                    }}
                    columns={columns}
                    // @ts-ignore
                    dataSource={columnData}
                    pagination={pagination}
                    scroll={{ x: 1050 }}
                    locale={{
                      emptyText: (
                        <NoDataFound
                          icon={<NoRecordIcon />}
                          title={t('common.labels.no_record_found')}
                        />
                      ),
                    }}
                  />
                </div>
              ) : (
                <>
                  {isStoreFound && isSuccess ? (
                    <Row className="generate-box ant-row ant-space-align-center p-32">
                      <Col span={12}>
                        <div className="generate-box-content p-l-32">
                          <h1 className="h4 m-b-16 secondary-black">
                            {t('common.labels.auto_complete_banner_title')}
                          </h1>
                          <p className="m-b-32 gray-text">
                            {t('common.labels.search_banner_description', {
                              name: t('common.labels.search_term'),
                            })}
                          </p>
                          <div className="ant-row">
                            <Button type="primary" onClick={onAddAutoComplete}>
                              {t('common.labels.add_search_term')}
                            </Button>
                            <Button
                              type="default"
                              icon={
                                <span className="anticon">
                                  <DownloadIcon />
                                </span>
                              }
                              key="import-file"
                              onClick={onImportFileClick}>
                              {t('common.labels.import_csv')}
                            </Button>
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="generate-box-img ant-row ant-row-end">
                          <SearchBanner />
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <Row className="generate-box ant-row ant-space-align-center p-32">
                      <Col span={12}>
                        <div className="generate-box-content p-l-32">
                          <h1 className="h4 m-b-16 secondary-black">
                            {t('common.labels.no_store_found')}
                          </h1>
                          <p className="m-b-32">
                            {t(
                              'common.messages.store_not_found_description_module',
                              {
                                name: 'search terms',
                              }
                            )}
                          </p>
                          {permission.canReadEcommerceStore() &&
                            permission.canCreateEcommerceStore() && (
                              <Button type="primary" onClick={onAddStore}>
                                {t('common.labels.add_store')}
                              </Button>
                            )}
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="generate-box-img ant-row ant-row-end">
                          <BigcommerceBannerImage />
                        </div>
                      </Col>
                    </Row>
                  )}
                </>
              )}
            </>
          )}
        </>

        {isModalVisible && (
          <CreateUpdateAutoComplete
            isModalVisible={isModalVisible}
            autoCompleteId={autoCompleteId}
            setAutoCompleteId={setAutoCompleteId}
            setIsModalVisible={setIsModalVisible}
          />
        )}

        <Modal
          className="confirm-modal"
          title={
            selectedRowKeys.length < 1
              ? t('common.messages.search_delete', {
                  name: `${termName}`,
                })
              : t('common.labels.delete_selected', {
                  name: 'search terms',
                })
          }
          centered
          open={isVisibleDeleteModal}
          onCancel={onCancel}
          footer={[
            <Button key="cancelStopWord" onClick={onCancel}>
              {t('common.labels.cancel')}
            </Button>,
            <Button
              key="delete"
              type="primary"
              danger
              loading={isDeleteLoading}
              onClick={onDeleteAutoComplete}>
              {t('common.labels.delete')}
            </Button>,
          ]}>
          <p>
            {selectedRowKeys.length < 1
              ? t('common.messages.search_delete_description', {
                  name: `search term`,
                })
              : t('common.messages.search_delete_multiple_description', {
                  name: `search terms`,
                })}
          </p>
        </Modal>

        <ImportAutoComplete
          t={t}
          isImportModalVisible={isImportModalVisible}
          hideImportModal={hideImportModal}
          importFileForm={importFileForm}
          importLoading={importButtonLoading}
          isImportButtonDisable={isImportButtonDisable}
          onImportFileFormSubmit={onImportFileFormSubmit}
          isDragDropVisible={isDragDropVisible}
          onTemplateClick={onTemplateClick}
          uploadClass={uploadClass}
          isOverRideModalVisible={isOverRideModalVisible}
          onHideOverRideModal={onHideOverRideModal}
          onOverRideData={onOverRideData}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          importFile={importFile}
          onDeleteImportedFile={onDeleteImportedFile}
        />
      </>
    </>
  );
};

export default ListAutoComplete;
