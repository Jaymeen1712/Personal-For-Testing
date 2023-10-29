/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Col, Form, Input, Modal, Row, Spin, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../../utills';
import useList301RedirectsController from './list-301-redirects-controller';
import RedirectBannerImage from '../../../../images/icons/301-redirect-banner-images';
import NoDataFound from '../../../../components/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';
import ImportFile from '../import-file';
import AddRedirection from '../add-redirection';
import SubSideBar from '../../../../components/sub-sidebar';
import List301RedirectsHeader from './list-301-redirects-header';
import SearchIcon from '../../../../images/icons/search-icon';
import PlusCircleIcon from '../../../../images/icons/pluscircle-icon';
import DownloadIcon from '../../../../images/icons/download-icon';

interface IList301Redirects {
  onMainSidebarActiveItem?: (val: string) => void;
}

const List301Redirects: React.FC<IList301Redirects> = ({
  onMainSidebarActiveItem,
}) => {
  const {
    t,
    list301Redirects,
    columns,
    isModalVisible,
    onAddRedirect,
    isDeleteModalVisible,
    hideDeleteModal,
    onDeleteRedirect,
    isEdit,
    isImportModalVisible,
    hideImportModal,
    setIsImportModalVisible,
    importFileForm,
    onImportFileFormSubmit,
    isImportButtonDisable,
    exportRedirects,
    isDragDropVisible,
    onDeleteMultipleData,
    addRedirectButtonLoading,
    importRedirectButtonLoading,
    deleteRedirectIds,
    onRedirectSelectChange,
    pagination,
    filter,
    onSelectAllRedirection,
    onClearAllRedirection,
    isAllRedirectionSelected,
    onTemplateClick,
    uploadClass,
    loading,
    onFilterChange,
    editRedirectData,
    redirectId,
    setIsEdit,
    setIsModalVisible,
    canCreate301Redirect,
    canRead301Redirect,
    canDelete301Redirect,
    isOverRideModalVisible,
    onHideOverRideModal,
    onOverRideData,
    getInputProps,
    getRootProps,
    importFile,
    onDeleteImportedFile,
    // onChangeTable,
    deleteSingleRedirect,
    scrollTopRef,
  } = useList301RedirectsController({ onMainSidebarActiveItem });

  return (
    <>
      <SubSideBar
        isGlobalPage={false}
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.REDIRECTS
        }
        isEnvironmentSelectorVisible={true}
        isEnvironmentSelectorDisable={true}
        environmentSelectDefaultValue={'All'}
        disableEnvironmentToolTipMessage={t(
          'common.messages.environment_is_not_applicable'
        )}>
        <List301RedirectsHeader
          scrollTopRef={scrollTopRef}
          t={t}
          list301Redirects={list301Redirects}
          deleteRedirectIds={deleteRedirectIds}
          setIsImportModalVisible={setIsImportModalVisible}
          exportRedirects={exportRedirects}
          onAddRedirect={onAddRedirect}
          canCreate301Redirect={canCreate301Redirect}
          canRead301Redirect={canRead301Redirect}
        />

        <div
          className={`${
            list301Redirects.data?.items.length === 0 && !filter
              ? 'display-none'
              : 'search-section ant-row ant-space-align-center ant-row-space-between'
          }`}>
          <div className="ant-row ant-space-align-center">
            <Form>
              <Form.Item
                name="filter"
                className="m-0 m-r-16"
                hidden={list301Redirects.isLoading && !filter}>
                <Input
                  size="middle"
                  // className="m-r-16"
                  placeholder={t('common.labels.search')}
                  prefix={<SearchIcon />}
                  value={filter}
                  onChange={onFilterChange}
                />
              </Form.Item>
            </Form>

            {list301Redirects.isSuccess &&
              (list301Redirects.data || deleteRedirectIds) && (
                <span className="search-count">
                  {deleteRedirectIds && deleteRedirectIds.length > 0
                    ? `${deleteRedirectIds.length} ${t(
                        'common.labels.selected'
                      )}`
                    : list301Redirects.data.totalCount > 1
                    ? `${t('common.labels.total_records', {
                        entity:
                          list301Redirects.data &&
                          list301Redirects.data.totalCount &&
                          list301Redirects.data.totalCount,
                      })}`
                    : `${t('common.labels.total_record', {
                        entity:
                          list301Redirects.data &&
                          list301Redirects.data.totalCount &&
                          list301Redirects.data.totalCount,
                      })}`}
                </span>
              )}
          </div>

          {deleteRedirectIds && deleteRedirectIds.length > 0 && (
            <div className="ant-row">
              {canDelete301Redirect() && (
                <Button onClick={onDeleteMultipleData} type="text" danger>
                  {t('common.labels.delete')}
                </Button>
              )}

              <Button
                onClick={exportRedirects}
                key="export-file"
                type="default">
                {t('common.labels.export_csv')}
              </Button>
            </div>
          )}
        </div>

        {list301Redirects.isSuccess &&
        list301Redirects?.data &&
        (list301Redirects?.data.items.length || filter.length > 0) ? (
          <>
            <div className="table-section">
              <Table
                // onChange={onChangeTable}
                // showSorterTooltip={false}
                columns={columns}
                // loading={
                //   list301Redirects.isLoading || list301Redirects.isFetching
                // }
                //@ts-ignore
                dataSource={list301Redirects.data.items}
                pagination={pagination}
                locale={{
                  emptyText: (
                    <NoDataFound
                      icon={<NoRecordIcon />}
                      title={t('common.labels.no_record_added')}
                      description={t('common.labels.add_redirection_above')}
                    />
                  ),
                }}
                rowSelection={{
                  type: 'checkbox',
                  selectedRowKeys: deleteRedirectIds.map((item: any) => item),
                  onChange: onRedirectSelectChange,
                  onSelectAll: isAllRedirectionSelected
                    ? onClearAllRedirection
                    : onSelectAllRedirection,
                }}
                rowKey="id"
              />
            </div>
          </>
        ) : (
          <>
            {list301Redirects.isLoading || list301Redirects.isFetching ? (
              <Spin
                className="HV-center table-center"
                indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
                size="large"
              />
            ) : (
              !list301Redirects.isFetching &&
              !list301Redirects.isLoading && (
                <Row
                  className={`generate-box ant-space-align-center image-large p-32`}>
                  <Col span={12}>
                    <div className="generate-box-content p-l-32">
                      <h1 className="h4 m-b-16 secondary-black">
                        {t('common.labels.301_redirects_banner_header')}
                      </h1>
                      <p className="m-b-32 gray-text">
                        {t('common.labels.301_redirects_banner_description')}
                      </p>
                      {canCreate301Redirect() && (
                        <>
                          <Button
                            type="primary"
                            icon={
                              <span className="anticon">
                                <PlusCircleIcon />
                              </span>
                            }
                            onClick={onAddRedirect}>
                            {t('common.labels.add_redirect')}
                          </Button>
                          <Button
                            type="default"
                            icon={
                              <span className="anticon">
                                <DownloadIcon />
                              </span>
                            }
                            key="import-file"
                            onClick={() => setIsImportModalVisible(true)}>
                            {t('common.labels.import_csv')}
                          </Button>
                        </>
                      )}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="generate-box-img ant-row ant-row-end">
                      <RedirectBannerImage />
                    </div>
                  </Col>
                </Row>
              )
            )}
          </>
        )}
      </SubSideBar>

      <Modal
        title={
          deleteRedirectIds.length > 1
            ? t('common.labels.delete_redirects')
            : t('common.labels.delete_redirection', {
                entity: deleteSingleRedirect
                  ? // @ts-ignore
                    list301Redirects.data?.items.find(
                      (redirection) => redirection.id === deleteSingleRedirect
                    ).oldUrl
                  : list301Redirects.data && deleteRedirectIds[0]
                  ? // @ts-ignore
                    list301Redirects.data?.items.find(
                      (redirection) => redirection.id === deleteRedirectIds[0]
                    ).oldUrl
                  : '',
              })
        }
        okButtonProps={{ danger: true }}
        open={isDeleteModalVisible}
        onCancel={hideDeleteModal}
        onOk={onDeleteRedirect}
        okText={t('common.labels.delete')}
        confirmLoading={loading}
        className="confirm-modal"
        centered>
        <p>
          {deleteRedirectIds.length === 1
            ? t('common.messages.delete_redirect_message')
            : t('common.messages.delete_redirects_message')}
        </p>
      </Modal>

      <AddRedirection
        isEdit={isEdit}
        t={t}
        isModalVisible={isModalVisible}
        // form={form}
        // onCancel={onCancel}
        addRedirectButtonLoading={addRedirectButtonLoading}
        // onCreateRedirect={onCreateRedirect}
        editRedirectData={editRedirectData}
        redirectId={redirectId}
        setIsEdit={setIsEdit}
        list301Redirects={list301Redirects}
        setIsModalVisible={setIsModalVisible}
      />

      <ImportFile
        t={t}
        isImportModalVisible={isImportModalVisible}
        hideImportModal={hideImportModal}
        importFileForm={importFileForm}
        importRedirectButtonLoading={importRedirectButtonLoading}
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
  );
};

export default List301Redirects;
