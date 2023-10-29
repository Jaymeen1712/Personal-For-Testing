import React from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Popover,
  Select,
  Spin,
  Table,
  Row,
  Col,
} from 'antd';
import { Trans } from 'react-i18next';
import { LoadingOutlined } from '@ant-design/icons';

import NoDataFound from '../../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../../images/icons/no-records-icon';
import GearIcon from '../../../../../../images/icons/gear-icon';
import useListSmartSuggestionsController from './list-smart-suggestions-controller';
import FilterDropDownIcon from '../../../../../../images/icons/filterdropdown-icon';
import ArrowLeftIcon from '../../../../../../images/icons/arrow-left-icon';
import BigcommerceBannerImage from '../../../../../../images/icons/bigcommerce-banner-image';
import SearchBanner from '../../../../../../images/icons/banner-search';

interface IListSmartSpellCheck {
  isEnableSmartSuggestion: boolean;
  setIsEnableSmartSuggestions: (isEnableSmartSuggestion: boolean) => void;
  environment: string;
}

const ListSpellCheckSmartSuggestions: React.FC<IListSmartSpellCheck> = ({
  isEnableSmartSuggestion,
  setIsEnableSmartSuggestions,
  environment,
}) => {
  const {
    t,
    columns,
    onUserPreferenceChange,
    userPreference,
    columnData,
    setStatus,
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
    searchData,
    onClickBackToList,
    isSuccess,
    termName,
    pagination,
    storeIssueFound,
    listSmartSpellcheckDataLength,
    onAddStore,
    addBigcommerceStorePermission,
    isLoading,
    handleFieldChange,
    disableSave,
    onSelectAll,
    onClearAllSelect,
    onSelectChange,
    isAllSelected,
    status,
    content,
    onSettingClick,
    isPublishLoading,
    isDeleteLoading,
  } = useListSmartSuggestionsController(
    environment,
    setIsEnableSmartSuggestions
  );

  const { Option } = Select;

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
              {t('common.labels.subtitle_spellcheck_smart_suggestions')}
            </span>
          </div>
        </div>
      </div>
      {!isEnableSmartSuggestion && isSuccess && (
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
      <>
        {(isSuccess || status) && (
          <div
            className={`${
              (isSuccess && columnData && columnData.length > 0) || status
                ? 'search-section'
                : 'display-none'
            } ant-row ant-space-align-center ant-row-space-between environment-search`}>
            {selectedRowKeys.length ? (
              <span className="search-count">
                {`${selectedRowKeys.length} ${t(
                  'common.labels.of'
                )} ${totalRecordCount} ${t('common.labels.selected')}`}
              </span>
            ) : (
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
            )}

            <div className="ant-row ant-space-align-center">
              {selectedRowKeys.length === 0 ? (
                <Form
                  form={form}
                  className="filters ant-space ant-space-horizontal ant-space-align-center">
                  <Form.Item
                    colon={false}
                    name="status"
                    label={t('common.labels.status')}
                    className="m-0 m-r-24">
                    <Select
                      key="smartSpellCheckStatus"
                      placeholder={t('common.labels.all')}
                      onChange={setStatus}
                      suffixIcon={<FilterDropDownIcon />}
                      placement="bottomRight">
                      <Option value="">{t('common.labels.all')}</Option>
                      <Option value="PENDING">
                        {t('common.labels.pending')}
                      </Option>
                      <Option value="REJECTED">
                        {t('common.labels.rejected')}
                      </Option>
                    </Select>
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
                </Form>
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
      </>

      {isLoading ? (
        <>
          <Spin
            data-testid={'loader'}
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        </>
      ) : (
        <>
          {(isSuccess &&
            listSmartSpellcheckDataLength &&
            listSmartSpellcheckDataLength > 0) ||
          searchData ||
          status ? (
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
              {storeIssueFound ? (
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
              ) : (
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
              )}
            </>
          )}
        </>
      )}

      <Modal
        title={
          selectedRowKeys.length <= 1
            ? t('common.messages.search_delete', {
                name: `${termName}`,
              })
            : t('common.labels.delete_selected', {
                name: 'spell checks',
              })
        }
        centered
        className="confirm-modal"
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
        <p>{t('common.labels.delete_stop_words_description')}</p>
      </Modal>

      <Modal
        title={t('common.labels.edit_smart_suggestions')}
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
            disabled={disableSave}
            onClick={onSaveAndPublish}>
            Save & Publish
          </Button>,
        ]}
        centered>
        <Form
          form={form}
          onFieldsChange={handleFieldChange}
          name="edit-smart-suggestion"
          autoComplete="off"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout="vertical">
          <div>
            <Form.Item
              label={t('common.labels.misspell')}
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
            <Form.Item
              label={t('common.labels.suggested_correction')}
              name="suggested_correction"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.suggested_correction'),
                  }),
                },
              ]}>
              <Input
                className="w-100 m-0"
                placeholder={t('common.labels.enter_suggested_correction')}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ListSpellCheckSmartSuggestions;
