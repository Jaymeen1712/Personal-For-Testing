import React from 'react';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Popover,
  Select,
  Table,
  Dropdown,
  Slider,
  Alert,
  Spin,
  Row,
  Col,
  Menu,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Trans } from 'react-i18next';

import NoDataFound from '../../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../../images/icons/no-records-icon';
import GearIcon from '../../../../../../images/icons/gear-icon';
import FilterDropDownIcon from '../../../../../../images/icons/filterdropdown-icon';
import useListPhrasesSmartSuggestionsController from './list-phrases-smart-suggestions-controller';
import ArrowLeftIcon from '../../../../../../images/icons/arrow-left-icon';
import BigcommerceBannerImage from '../../../../../../images/icons/bigcommerce-banner-image';
import SearchBanner from '../../../../../../images/icons/banner-search';
import DownArrowIcon from '../../../../../../images/icons/downarrow-icon';
import ScoreIcon from '../../../../../../images/icons/score-icon';
import LoadLibraryModal from '../load-library/load-library-modal';
import SampleFileUploadIcon from '../../../../../../images/icons/samplefile-upload-icon';

interface IListPhrasesSmartSuggestions {
  isEnablePhrasesSmartSuggestions: boolean;
  setIsEnableSmartSuggestions: (
    isEnablePhrasesSmartSuggestions: boolean
  ) => void;
  environment: string;
}

const ListPhrasesSmartSuggestions: React.FC<IListPhrasesSmartSuggestions> = ({
  isEnablePhrasesSmartSuggestions,
  setIsEnableSmartSuggestions,
  environment,
}) => {
  const {
    t,
    columns,
    onUserPreferenceChange,
    userPreference,
    columnData,
    totalRecordCount,
    isLoadLibraryModalVisible,
    isVisibleDeleteModal,
    onCancel,
    selectedRowKeys,
    onDeleteSmartSuggestion,
    onSelectDeleteClick,
    onSelectPublishClick,
    isEditSmartSuggestionModalVisible,
    onSaveAndPublish,
    form,
    isLoading,
    startConfidence,
    endConfidence,
    hideLoadLibraryModal,
    onSliderChange,
    onLoadLibraryClick,
    onResetConfidenceValue,
    onClickBackToList,
    status,
    statusOptions,
    isSuccess,
    termName,
    isStoreFound,
    isButtonVisible,
    onAddStore,
    pagination,
    onSelectChange,
    isAllSelected,
    onClearAllSelect,
    onSelectAll,
    addBigcommerceStorePermission,
    listSmartPhrasesDataLength,
    content,
    onSettingClick,
    isSaveAndPublishLoading,
    isPublishLoading,
    isDeleteLoading,
    disableSave,
    handleFieldChange,
    onChangeStatus,
  } = useListPhrasesSmartSuggestionsController(
    environment,
    setIsEnableSmartSuggestions
  );
  return (
    <>
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onClickBackToList}>
            <ArrowLeftIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {t('common.labels.smart_suggestions')}
            </span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              {t('common.labels.subtitle_phrases_smart_suggestions')}
            </span>
          </div>
        </div>
        <div className="headerright">
          {!isStoreFound && (
            <div className="ant-row ant-row-end">
              <Button
                icon={
                  <span className="anticon">
                    <SampleFileUploadIcon />
                  </span>
                }
                disabled={selectedRowKeys.length > 0}
                onClick={onLoadLibraryClick}>
                {t('common.labels.load_library')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {((!isEnablePhrasesSmartSuggestions && totalRecordCount === 0) ||
        (!isEnablePhrasesSmartSuggestions &&
          isButtonVisible &&
          totalRecordCount > 0)) && (
        <Alert
          message={
            <Trans
              i18nKey={t('common.messages.smart_suggestion_disable', {
                entity: 'setting',
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

      {(isSuccess ||
        status ||
        startConfidence === 0 ||
        (startConfidence && startConfidence > 0) ||
        endConfidence === 0 ||
        (endConfidence && endConfidence > 0)) && (
        <div
          className={`${
            (isSuccess && columnData && columnData.length > 0) ||
            status ||
            startConfidence === 0 ||
            (startConfidence && startConfidence > 0) ||
            endConfidence === 0 ||
            (endConfidence && endConfidence > 0)
              ? 'search-section'
              : 'display-none'
          } ant-row ant-space-align-center ant-row-space-between environment-search`}>
          {selectedRowKeys.length === 0 ? (
            <span className="search-count">
              {totalRecordCount === 1 ? (
                <span>
                  {totalRecordCount} {t('common.labels.record')}
                </span>
              ) : (
                <span>
                  {totalRecordCount} {t('common.labels.records')}
                </span>
              )}
            </span>
          ) : (
            <span className="search-count">
              {`${selectedRowKeys.length} ${t(
                'common.labels.of'
              )} ${totalRecordCount} ${t('common.labels.selected')}`}
            </span>
          )}
          <div className="ant-row ant-space-align-center">
            {selectedRowKeys.length === 0 ? (
              <div className="filters ant-space ant-space-horizontal ant-space-align-center">
                <Form.Item
                  colon={false}
                  label={t('common.labels.status')}
                  className="m-0 m-r-24">
                  <Select
                    key="statusFilter"
                    placeholder={t('common.labels.all')}
                    onChange={onChangeStatus}
                    value={status}
                    options={statusOptions}
                    suffixIcon={<FilterDropDownIcon />}
                    placement="bottomRight"></Select>
                </Form.Item>

                <Form.Item
                  colon={false}
                  label={t('common.labels.confidence')}
                  className="m-0 m-r-24">
                  <Dropdown
                    overlayClassName="score-dropdown"
                    placement="bottomRight"
                    overlay={
                      <div className="table-dropdown1">
                        <Menu>
                          <Menu.Item>
                            <div className="ant-row ant-row-space-between ant-space-align-center m-b-12">
                              <span className="title-sm gray-text">
                                {t('common.labels.score')}
                              </span>
                              <Button
                                size="small"
                                icon={
                                  <span className="anticon">
                                    <ScoreIcon />
                                  </span>
                                }
                                onClick={onResetConfidenceValue}></Button>
                            </div>
                            <div className="ant-row ant-row-space-between ant-space-align-center ant-row-no-wrap">
                              <span className="m-r-8 slider-digit">
                                {startConfidence ? startConfidence : 0}
                              </span>
                              <Slider
                                className="w-100"
                                range
                                step={1}
                                value={[
                                  startConfidence ? startConfidence : 0,
                                  endConfidence ? endConfidence : 100,
                                ]}
                                onChange={onSliderChange}
                              />
                              <span className="m-l-8 slider-digit">
                                {endConfidence ? endConfidence : 100}
                              </span>
                            </div>
                          </Menu.Item>
                        </Menu>
                      </div>
                    }>
                    <Button
                      onClick={(event) => event.stopPropagation()}
                      type="text"
                      className="font-normal">
                      {startConfidence ? startConfidence : 0} -
                      {endConfidence ? endConfidence : 100} <DownArrowIcon />
                    </Button>
                  </Dropdown>
                </Form.Item>

                <Popover
                  placement="bottomRight"
                  content={
                    <Checkbox.Group
                      options={content}
                      defaultValue={userPreference}
                      onChange={onUserPreferenceChange}
                    />
                  }
                  trigger="click">
                  <Button icon={<GearIcon />}></Button>
                </Popover>
              </div>
            ) : (
              <>
                <Button
                  id={t('common.labels.delete')}
                  onClick={onSelectDeleteClick}
                  danger
                  type="text">
                  {t('common.labels.delete')}
                </Button>
                <Button
                  id={t('common.labels.publish')}
                  type="primary"
                  loading={isPublishLoading}
                  onClick={onSelectPublishClick}>
                  {t('common.labels.publish')}
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
          {(isSuccess &&
            listSmartPhrasesDataLength &&
            listSmartPhrasesDataLength > 0) ||
          status ||
          startConfidence === 0 ||
          (startConfidence && startConfidence > 0) ||
          endConfidence === 0 ||
          (endConfidence && endConfidence > 0) ? (
            <div className="table-section">
              <Table
                className="tableCellPadding-9"
                rowSelection={{
                  type: 'checkbox',
                  selectedRowKeys: selectedRowKeys.map((item) => item),
                  onSelect: onSelectChange,
                  onSelectAll: isAllSelected ? onClearAllSelect : onSelectAll,
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
              {!isStoreFound && !startConfidence && !endConfidence ? (
                <Row className="generate-box ant-row ant-space-align-center p-32">
                  <Col span={12}>
                    <div className="generate-box-content p-l-32">
                      <h1 className="h4 m-b-16 secondary-black">
                        {t('common.labels.smart_suggestion_banner_title')}
                      </h1>
                      <p className="m-b-32 gray-text">
                        {t('common.labels.smart_suggestion_banner_description')}
                      </p>
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
                      <p className="m-b-32 gray-text">
                        {t('common.labels.store_not_found_description')}
                      </p>
                      {addBigcommerceStorePermission && (
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

      <LoadLibraryModal
        isVisible={isLoadLibraryModalVisible}
        hideModal={hideLoadLibraryModal}
      />

      <Modal
        className="confirm-modal"
        title={
          selectedRowKeys.length <= 1
            ? t('common.messages.search_delete', {
                name: `${termName}`,
              })
            : t('common.labels.delete_selected', {
                name: 'suggestions',
              })
        }
        centered
        open={isVisibleDeleteModal}
        onCancel={onCancel}
        footer={[
          <Button key="deleteRecordCancel" onClick={onCancel}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="deleteRecordDelete"
            type="primary"
            danger
            loading={isDeleteLoading}
            onClick={onDeleteSmartSuggestion}>
            {t('common.labels.delete')}
          </Button>,
        ]}>
        <p>
          {selectedRowKeys.length > 1
            ? t('common.labels.delete_multiple_smart_suggestion_description')
            : t('common.labels.delete_single_smart_suggestion_description')}
        </p>
      </Modal>

      <Modal
        title="Edit Smart Suggestion "
        className="CustomModal CustomModal-small"
        open={isEditSmartSuggestionModalVisible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            id="submit"
            type="primary"
            htmlType="submit"
            loading={isSaveAndPublishLoading}
            disabled={disableSave}
            onClick={onSaveAndPublish}>
            Save & Publish
          </Button>,
        ]}
        centered>
        <Form
          form={form}
          name="edit-smart-suggestion"
          autoComplete="off"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout="vertical"
          onFieldsChange={handleFieldChange}>
          <div>
            <Form.Item
              label={t('common.labels.phrase')}
              name="phrase"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.phrase'),
                  }),
                },
              ]}>
              <Input
                className="w-100 m-0"
                placeholder={t('common.labels.phrase')}
                autoFocus={true}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ListPhrasesSmartSuggestions;
