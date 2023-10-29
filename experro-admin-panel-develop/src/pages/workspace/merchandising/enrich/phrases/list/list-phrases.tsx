import React from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
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
import { onSidebarToggle } from '../../../../../../utills';
import SearchIcon from '../../../../../../images/icons/search-icon';
import useListSynonymsController from './list-phrases-controller';
import CreateUpdatePhrases from '../create-update';
import FilterDropDownIcon from '../../../../../../images/icons/filterdropdown-icon';
import HamburgerIcon from '../../../../../../images/icons/hamburger-icon';
import SettingsIcon from '../../../../../../images/icons/settings-icon';
import PlusIcon from '../../../../../../images/icons/plus-icon';
import SparkleIcon from '../../../../../../images/icons/sparkle-icon';
import BigcommerceBannerImage from '../../../../../../images/icons/bigcommerce-banner-image';
import SearchBanner from '../../../../../../images/icons/banner-search';

interface IListPhrases {
  isEnablePhrases: boolean;
  setIsEnablePhrases: (isEnablePhrases: boolean) => void;
  environment: string;
}

const ListPhrases: React.FC<IListPhrases> = ({
  isEnablePhrases,
  setIsEnablePhrases,
  environment,
}) => {
  const {
    t,
    isStoreFound,
    isButtonVisible,
    form,
    columns,
    selectedSortValue,
    sortingOptions,
    onUserPreferenceChange,
    userPreference,
    columnData,
    pagination,
    isVisibleDeleteModal,
    onCancel,
    phraseId,
    setPhraseId,
    selectedRowKeys,
    onDeletePhrase,
    onSelectDeleteClick,
    onSortByChange,
    onInputChange,
    termName,
    onAddPhrases,
    searchData,
    isModalVisible,
    setIsModalVisible,
    onSettingClick,
    onSmartSuggestionsClick,
    totalRecordCount,
    permission,
    onAddStore,
    isSuccess,
    isLoading,
    onSelectChange,
    isAllSelected,
    onClearAllSelect,
    onSelectAll,
    searchForm,
    content,
    listPhrasesDataLength,
    isDeleteLoading,
  } = useListSynonymsController(environment, setIsEnablePhrases);

  return (
    <>
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onSidebarToggle}>
            <HamburgerIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {t('common.labels.phrases')}
            </span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              {t('common.labels.subtitle_phrases_smart_suggestions')}
            </span>
          </div>
        </div>
        {isStoreFound && (isSuccess || searchData) && (
          <div className="headerright">
            <div className="ant-row ant-row-end">
              <Button
                size="middle"
                icon={<SettingsIcon />}
                key="edit"
                disabled={selectedRowKeys.length > 0}
                onClick={onSettingClick}
              />
              <Button
                id="smart suggestion"
                icon={
                  <span className="anticon">
                    <SparkleIcon />
                  </span>
                }
                disabled={selectedRowKeys.length > 0}
                onClick={onSmartSuggestionsClick}>
                {t('common.labels.smart_suggestions')}
              </Button>
              {isButtonVisible && (
                <Button
                  id="add phrases"
                  type="primary"
                  icon={
                    <span className="anticon">
                      <PlusIcon />
                    </span>
                  }
                  disabled={selectedRowKeys.length > 0}
                  onClick={onAddPhrases}>
                  {t('common.labels.add_phrase')}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {!isEnablePhrases && isButtonVisible && (
        <Alert
          message={
            <Trans
              i18nKey={t('common.messages.search_disable_description', {
                entity: 'setting',
                name: t('common.labels.phrases'),
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
        {((isSuccess && isStoreFound) || searchData) && (
          <div
            className={`${
              (isSuccess && columnData && columnData.length > 0) || searchData
                ? 'search-section'
                : 'display-none'
            } environment-search ant-row ant-space-align-center ant-row-space-between`}>
            <div className="ant-row ant-space-align-center">
              <>
                <Form form={searchForm}>
                  <Form.Item name="searchText" className="m-0 m-r-16 ">
                    <Input
                      autoFocus={!!searchData}
                      size="middle"
                      placeholder={t('common.labels.search')}
                      prefix={<SearchIcon />}
                      onChange={(e) => {
                        onInputChange(e.target.value);
                      }}
                    />
                  </Form.Item>
                </Form>
              </>
              <span
                className={
                  listPhrasesDataLength || searchData ? '' : 'display-none'
                }>
                {selectedRowKeys.length === 0 && (
                  <span className="search-count">
                    {totalRecordCount > 1 ? (
                      <span>
                        {totalRecordCount} {t('common.labels.records')}
                      </span>
                    ) : (
                      <span>
                        {totalRecordCount} {t('common.labels.record')}
                      </span>
                    )}
                  </span>
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
                      label={t('common.labels.sort_by')}
                      className="m-0">
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
                        options={content}
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
              listPhrasesDataLength &&
              listPhrasesDataLength > 0) ||
            searchData ? (
              <div className="table-section">
                <Table
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
                  scroll={{ x: 1280 }}
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
                {isStoreFound ? (
                  <Row className="generate-box ant-row ant-space-align-center p-32">
                    <Col span={12}>
                      <div className="generate-box-content p-l-32">
                        <h1 className="h4 m-b-16 secondary-black">
                          {t('common.labels.phrases_banner_title')}
                        </h1>
                        <p className="m-b-32 gray-text">
                          {t('common.labels.search_banner_description', {
                            name: 'phrase',
                          })}
                        </p>
                        <Button type="primary" onClick={onAddPhrases}>
                          {t('common.labels.add_phrase')}
                        </Button>
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
                              name: 'phrases',
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
        <CreateUpdatePhrases
          isModalVisible={isModalVisible}
          form={form}
          phraseId={phraseId}
          setPhraseId={setPhraseId}
          setIsModalVisible={setIsModalVisible}
        />
      )}

      <Modal
        className="confirm-modal"
        title={
          selectedRowKeys.length <= 1
            ? t('common.messages.search_delete', {
                name: `${termName}`,
              })
            : t('common.labels.delete_selected', {
                name: 'phrases',
              })
        }
        centered
        open={isVisibleDeleteModal}
        onCancel={onCancel}
        footer={[
          <Button key="cancelPhrase" onClick={onCancel}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="deletePhrase"
            type="primary"
            danger
            loading={isDeleteLoading}
            onClick={onDeletePhrase}>
            {t('common.labels.delete')}
          </Button>,
        ]}>
        <p>
          {selectedRowKeys.length < 1
            ? t('common.messages.search_delete_description', {
                name: `phrase`,
              })
            : t('common.messages.search_delete_multiple_description', {
                name: `phrases`,
              })}
        </p>
      </Modal>
    </>
  );
};

export default ListPhrases;
