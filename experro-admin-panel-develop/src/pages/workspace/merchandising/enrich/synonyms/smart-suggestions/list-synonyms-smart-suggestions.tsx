import React from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Popover,
  Radio,
  Select,
  Spin,
  Table,
  Row,
  Col,
} from 'antd';
import NoDataFound from '../../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../../images/icons/no-records-icon';
import GearIcon from '../../../../../../images/icons/gear-icon';
import useListSmartSuggestionsController from './list-synonyms-smart-suggestions-controller';
import FilterDropDownIcon from '../../../../../../images/icons/filterdropdown-icon';
import { WithContext as ReactTags } from 'react-tag-input';
import ArrowLeftIcon from '../../../../../../images/icons/arrow-left-icon';
import { Trans } from 'react-i18next';
import { LoadingOutlined } from '@ant-design/icons';
import BigcommerceBannerImage from '../../../../../../images/icons/bigcommerce-banner-image';
import SearchBanner from '../../../../../../images/icons/banner-search';
import LoadLibraryModal from '../load-library/load-library-modal';
import SampleFileUploadIcon from '../../../../../../images/icons/samplefile-upload-icon';

interface IListSmartSuggestions {
  isEnableSmartSuggestions: boolean;
  setIsEnableSmartSuggestions: (isEnableSmartSuggestions: boolean) => void;
  environment: string;
}

const ListSpellCheckSmartSuggestions: React.FC<IListSmartSuggestions> = ({
  isEnableSmartSuggestions,
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
    isVisibleDeleteModal,
    onCancel,
    selectedRowKeys,
    onDeleteSmartSuggestion,
    onSelectDeleteClick,
    onSelectPublishClick,
    isEditSmartSuggestionModalVisible,
    onSaveAndPublish,
    form,
    radioOption,
    radioType,
    onChangeStatus,
    onChangeType,
    selectedSynonyms,
    onChangeRadioType,
    onAddSynonym,
    onDeleteSynonyms,
    onClickBackToList,
    isLoading,
    type,
    status,
    statusOptions,
    typeOptions,
    isSuccess,
    termName,
    isAllSelected,
    onClearAllSelect,
    onSelectAll,
    onSelectChange,
    pagination,
    addBigcommerceStorePermission,
    onAddStore,
    isButtonVisible,
    isStoreFound,
    content,
    isLoadLibraryModalVisible,
    isDeleteLoading,
    isPublishLoading,
    onLoadLibraryClick,
    hideLoadLibraryModal,
    onSettingClick,
    disableSave,
    onFieldChange,
    onHandleInputChange,
  } = useListSmartSuggestionsController(
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
              {t('common.labels.subtitle_synonyms_smart_suggestions')}
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

      {!isEnableSmartSuggestions && isButtonVisible && (
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

      {(isSuccess || type || status) && (
        <div
          className={`${
            (isSuccess && columnData && columnData.length > 0) || type || status
              ? 'search-section'
              : 'display-none'
          } ant-row ant-space-align-center ant-row-space-between environment-search`}>
          <div>
            {selectedRowKeys.length === 0 ? (
              <>
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
              </>
            ) : (
              <span className="search-count">
                {`${selectedRowKeys.length} ${t(
                  'common.labels.of'
                )} ${totalRecordCount} ${t('common.labels.selected')}`}
              </span>
            )}
          </div>
          <div className="ant-row ant-space-align-center">
            {selectedRowKeys.length === 0 ? (
              <div className="filters ant-space ant-space-horizontal ant-space-align-center">
                <Form.Item
                  colon={false}
                  label={t('common.labels.type')}
                  className="m-0 m-r-24">
                  <Select
                    key="typeFilter"
                    placeholder={t('common.labels.any')}
                    onChange={onChangeType}
                    value={type}
                    options={typeOptions}
                    suffixIcon={<FilterDropDownIcon />}
                    placement="bottomRight"></Select>
                </Form.Item>
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
          {(isSuccess && totalRecordCount && totalRecordCount > 0) ||
          type ||
          status ? (
            <>
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
            </>
          ) : (
            <>
              {!isStoreFound ? (
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
        environment={environment}
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
        ]}
        centered>
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
        centered
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            id="submit"
            type="primary"
            htmlType="submit"
            disabled={disableSave}
            onClick={onSaveAndPublish}>
            Save & Publish
          </Button>,
        ]}>
        <Form
          autoComplete="off"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout="vertical"
          form={form}
          onFieldsChange={onFieldChange}>
          <div>
            <Form.Item
              label="Term"
              name="term"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.term'),
                  }),
                },
              ]}>
              <Input
                className="w-100 m-0"
                placeholder={t('common.labels.enter_term')}
                autoFocus={true}
              />
            </Form.Item>

            <Form.Item className="custom-radio-group" name="type">
              <Radio.Group
                defaultValue="oneway"
                options={radioOption}
                onChange={onChangeRadioType}
                value={radioType}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>

            <div className="custom-label-input m-t-32">
              <label className="custom-input-label">
                {t('common.labels.synonyms')}
              </label>
              <ReactTags
                inputFieldPosition="inline"
                tags={selectedSynonyms}
                handleAddition={onAddSynonym}
                handleDelete={onDeleteSynonyms}
                handleInputChange={onHandleInputChange}
                allowDragDrop={false}
                placeholder={
                  selectedSynonyms?.length > 0
                    ? ''
                    : t('common.labels.synonyms_placeholder')
                }
              />
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ListSpellCheckSmartSuggestions;
