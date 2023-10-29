import {
  Button,
  Input,
  Modal,
  Tooltip,
  Spin,
  Table,
  Menu,
  Dropdown,
} from 'antd';
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

import useQueryBuilderController from './query-builder-controller';
import GroupComponent from './group-component';
import NoDataFound from '../../../../components/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';
import HamburgerIcon from '../../../../images/icons/hamburger-icon';
import { onSidebarToggle } from '../../../../utills';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';
import SearchIcon from '../../../../images/icons/search-icon';

const QueryBuilder: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  segmentDetail: any;
  onCreteSegmentModalVisibleChange: (val: boolean) => void;
}> = ({ segmentDetail, onCreteSegmentModalVisibleChange }) => {
  const {
    query,
    changeQuery,
    t,
    segmentDetailsByQuery,
    editSegment,
    onDeleteSegmentButtonClick,
    isDeleteSegmentIsLoading,
    onUpdateSegmentButtonClick,
    isUpdateSegmentIsLoading,
    isLoading,
    reFetchSegmentDetailsBYQuery,
    isDeleteSegmentIsVisible,
    onConfirmDeleteButtonClick,
    onCancelDeleteSegmentButtonClick,
    newSegment,
    canDeleteAudience,
    canUpdateAudience,
    columns,
    skipLimit,
    totalRecordCount,
    currentPageNumber,
    onPageChange,
    isQuerySectionVisible,
    onSearchDataChange,
    onQuerySectionVisibleChange,
    isCloneLoading,
    onCloneButtonClick,
    inputRef,
  } = useQueryBuilderController(segmentDetail);
  return (
    <>
      <div className="headerinner ant-row ant-space-align-center ant-row-space-between">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onSidebarToggle}>
            <HamburgerIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {segmentDetail?.name
                ? segmentDetail.name
                : t('common.messages.new_segment')}
            </span>
            <span className="ant-page-header-heading-sub-title">
              {segmentDetail?.description
                ? segmentDetail.description
                : newSegment
                ? t('common.messages.segment_subtitle')
                : ''}
            </span>
          </div>
        </div>
        <div className="headerright">
          <div className="ant-row ant-row-end ant-space-align-center">
            {editSegment && (
              <Dropdown
                placement="bottomRight"
                trigger={['click']}
                overlay={
                  <div className="table-dropdown">
                    <Menu>
                      <Menu.Item
                        disabled={!canUpdateAudience()}
                        key={'rename'}
                        onClick={() => onCreteSegmentModalVisibleChange(true)}>
                        <Tooltip
                          placement="bottom"
                          title={
                            !canUpdateAudience() &&
                            t('common.messages.error_update_segments')
                          }>
                          {t('common.labels.rename')}
                        </Tooltip>
                      </Menu.Item>
                      <Menu.Item
                        key={'clone'}
                        onClick={onCloneButtonClick}
                        disabled={!canUpdateAudience() || isCloneLoading}>
                        <Tooltip
                          placement="bottom"
                          title={
                            !canUpdateAudience() &&
                            t('common.messages.error_update_segments')
                          }>
                          {t('common.labels.clone')}
                        </Tooltip>
                      </Menu.Item>
                      <Menu.Item
                        disabled={!canDeleteAudience()}
                        key={'delete'}
                        danger
                        onClick={onDeleteSegmentButtonClick}>
                        <Tooltip
                          placement="bottom"
                          title={
                            !canDeleteAudience() &&
                            t('common.messages.error_delete_segments')
                          }>
                          {t('common.labels.delete')}
                        </Tooltip>
                      </Menu.Item>
                    </Menu>
                  </div>
                }>
                <Button
                  key="recordTableEllipsisIcon"
                  className="on-hover"
                  icon={<EllipsisIcon />}
                />
              </Dropdown>
            )}
            {isQuerySectionVisible && (
              <>
                <Button
                  key="cancel"
                  onClick={() => onQuerySectionVisibleChange(false)}>
                  {t('common.labels.cancel')}
                </Button>

                <Tooltip
                  placement="left"
                  title={
                    !canUpdateAudience() &&
                    t('common.messages.error_update_segments')
                  }>
                  <Button
                    loading={isUpdateSegmentIsLoading}
                    disabled={!canUpdateAudience()}
                    key="save"
                    type="primary"
                    onClick={onUpdateSegmentButtonClick}>
                    {t('common.labels.save')}
                  </Button>
                </Tooltip>
              </>
            )}

            {/*)}*/}
          </div>
        </div>
      </div>
      <>
        {isQuerySectionVisible && (
          <div className="queryBuilderWrap">
            <p className="title-sm m-b-16">
              {t('common.labels.define_filters')}
            </p>
            <GroupComponent
              query={query.group}
              changeQuery={changeQuery}
              showRemoveButton={false}
              isGroupIsEvent={false}
              reFetchSegmentDetailsBYQuery={reFetchSegmentDetailsBYQuery}
            />
          </div>
        )}
        <div className="search-section ant-row ant-space-align-center ant-row-space-between">
          <div className="ant-row ant-space-align-center">
            <div className={'m-0 m-r-16 ant-space-align-center'}>
              <Input
                ref={inputRef}
                autoComplete="off"
                size="middle"
                placeholder={t('common.labels.search')}
                prefix={<SearchIcon />}
                onChange={(e) => {
                  onSearchDataChange(e);
                }}
                onKeyDown={(e) => (e.keyCode === 13 ? e.preventDefault() : '')}
              />
            </div>
            <span className="search-count">
              {totalRecordCount} {t('common.labels.records')}
            </span>
          </div>
          {canUpdateAudience() && (
            <div className="filters ant-space ant-space-horizontal ant-space-align-center">
              <Button
                type="primary"
                onClick={() => {
                  if (isQuerySectionVisible) {
                    onQuerySectionVisibleChange(false);
                  } else {
                    onQuerySectionVisibleChange(true);
                  }
                }}>
                {isQuerySectionVisible
                  ? t('common.labels.hide_filters')
                  : t('common.labels.edit_filters')}
              </Button>
            </div>
          )}
        </div>
        <div>
          {isLoading ? (
            <Spin
              className="HV-center table-center"
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
              size="large"
            />
          ) : (
            <>
              <div className="table-section">
                <Table
                  showSorterTooltip={false}
                  className="audienceTable"
                  columns={columns}
                  dataSource={segmentDetailsByQuery}
                  pagination={{
                    current: currentPageNumber,
                    defaultPageSize: skipLimit,
                    total: totalRecordCount,
                    showSizeChanger: true,
                    locale: { items_per_page: ' per page' },
                    onChange: onPageChange,
                    hideOnSinglePage: totalRecordCount
                      ? totalRecordCount < skipLimit
                      : false,
                  }}
                  locale={{
                    emptyText: (
                      <NoDataFound
                        icon={<NoRecordIcon />}
                        title={t(
                          'common.labels.audience_define_filter_message'
                        )}
                      />
                    ),
                  }}
                />
              </div>
            </>
          )}
        </div>
      </>
      <Modal
        visible={isDeleteSegmentIsVisible}
        title={t('common.labels.delete_segment')}
        centered
        onCancel={onCancelDeleteSegmentButtonClick}
        footer={[
          <Button key="cancel" onClick={onCancelDeleteSegmentButtonClick}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            loading={isDeleteSegmentIsLoading}
            key="delete-segment"
            type="primary"
            onClick={onConfirmDeleteButtonClick}
            danger>
            {t('common.labels.delete')}
          </Button>,
        ]}
        className=" CustomModal-small confirm-modal">
        {t('common.messages.delete_segment_message')}
      </Modal>
    </>
  );
};
export default QueryBuilder;
