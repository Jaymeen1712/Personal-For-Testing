import React from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Popover,
  Select,
  Spin,
  Table,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import SearchIcon from '../../../../images/icons/search-icon';
import FilterDropDownIcon from '../../../../images/icons/filterdropdown-icon';
import {
  MAX_TAG_COUNT_PUBLISH_QUEUE,
  PAGE_SIZE,
  PUBLISH_QUEUE_FIELDS,
  PUBLISH_QUEUE_STATUS,
} from '../../../../utills';
import GearIcon from '../../../../images/icons/gear-icon';
import NoDataFound from '../../../../components/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';
import { IContentPublishQueue } from '../../../../types';
import useContentPublishQueueController from './content-publishQueue-controller';

const ContentPublishQueue: React.FC<IContentPublishQueue> = ({
  userPreference,
  onPreferenceChange,
  listPublishQueue,
  columns,
  currentPageNumber,
  skipLimit,
  selectedUserIds,
  selectedModelIds,
  selectedStatus,
  setSearchData,
  setCurrentPageNumber,
  setSkip,
  setSkipLimit,
  setSelectedUserIds,
  setSelectedModelIds,
  setSelectedStatus,
  isSuccess,
}) => {
  const {
    t,
    form,
    onInputChange,
    onPageChange,
    onWorkspaceUser,
    onContentModalChange,
    onStatus,
    contentModalFilterInputRef,
    onContentModalFilterInputChange,
    contentModalFilterValue,
    contentModalList,
    userFilterInputRef,
    userList,
    userFilterValue,
    onUserFilterInputChange,
    getModelList,
  } = useContentPublishQueueController({
    setSearchData,
    setCurrentPageNumber,
    setSkip,
    setSkipLimit,
    currentPageNumber,
    selectedUserIds,
    setSelectedUserIds,
    selectedModelIds,
    setSelectedModelIds,
    selectedStatus,
    setSelectedStatus,
  });

  // @ts-ignore
  return (
    <div className="navigation-page-content-inner">
      <div className="search-section environment-search app-search ant-row ant-space-align-center ant-row-space-between">
        <div className="ant-row ant-space-align-center">
          <Form form={form}>
            <Form.Item name="searchText" className={'m-0 m-r-16'}>
              <Input
                size="middle"
                placeholder={t('common.labels.search')}
                prefix={<SearchIcon />}
                onChange={(e) => {
                  onInputChange(e.target.value);
                }}
              />
            </Form.Item>
          </Form>
          {isSuccess && (
            <p className="gray-text m-0 search-count">
              {listPublishQueue.data.totalCount &&
              listPublishQueue.data.totalCount > 1
                ? t('common.labels.total_records', {
                    entity: listPublishQueue.data.totalCount,
                  })
                : t('common.labels.total_record', {
                    entity: listPublishQueue.data.totalCount,
                  })}
            </p>
          )}
        </div>

        <div className="filters ant-row m-0">
          <div className="ant-space-item-main">
            <span className="filter-custom-dropdown-label">
              {t('common.labels.models')}
            </span>
            <Select
              className="m-0 ant-space-align-center borderless-select"
              popupClassName="dropdown-size-medium dropdown-search"
              placement={'bottomRight'}
              onChange={onContentModalChange}
              size="middle"
              mode="multiple"
              suffixIcon={<FilterDropDownIcon />}
              showArrow={true}
              maxTagCount={1}
              showSearch={false}
              maxTagPlaceholder={
                selectedModelIds &&
                selectedModelIds.length > MAX_TAG_COUNT_PUBLISH_QUEUE &&
                `,+ ${selectedModelIds.length - MAX_TAG_COUNT_PUBLISH_QUEUE} `
              }
              value={selectedModelIds.length === 0 ? ['All'] : selectedModelIds}
              dropdownRender={(menu) => (
                <>
                  <Input
                    placeholder={t('common.labels.search')}
                    //@ts-ignore
                    ref={contentModalFilterInputRef}
                    value={contentModalFilterValue}
                    onChange={(e) => onContentModalFilterInputChange(e)}
                    prefix={<SearchIcon />}
                    bordered={false}
                    onKeyDown={(event) => {
                      if (event.key === 'Backspace' || event.key === 'Enter') {
                        return event.stopPropagation();
                      }
                    }}
                  />
                  <Divider style={{ margin: '0 4px 8px 4px' }} />
                  {menu}
                </>
              )}>
              {contentModalList &&
                contentModalList.map((model) => (
                  <Select.Option value={model.id}>{model.name}</Select.Option>
                ))}
            </Select>
          </div>

          <div className="ant-space-item-main">
            <span className="filter-custom-dropdown-label">
              {t('common.labels.users')}
            </span>
            <Select
              className="m-0 ant-space-align-center borderless-select"
              popupClassName="dropdown-size-medium dropdown-search"
              placement={'bottomRight'}
              onChange={onWorkspaceUser}
              size={'middle'}
              mode="multiple"
              suffixIcon={<FilterDropDownIcon />}
              showArrow={true}
              maxTagCount={1}
              showSearch={false}
              maxTagPlaceholder={
                selectedUserIds &&
                selectedUserIds.length > MAX_TAG_COUNT_PUBLISH_QUEUE &&
                `,+ ${selectedUserIds.length - MAX_TAG_COUNT_PUBLISH_QUEUE} `
              }
              value={selectedUserIds.length === 0 ? ['All'] : selectedUserIds}
              dropdownRender={(menu) => (
                <>
                  <Input
                    placeholder={t('common.labels.search')}
                    //@ts-ignore
                    ref={userFilterInputRef}
                    value={userFilterValue}
                    onChange={(e) => onUserFilterInputChange(e)}
                    prefix={<SearchIcon />}
                    bordered={false}
                    onKeyDown={(event) => {
                      if (event.key === 'Backspace' || event.key === 'Enter') {
                        return event.stopPropagation();
                      }
                    }}
                  />
                  <Divider style={{ margin: '0 4px 8px 4px' }} />
                  {menu}
                </>
              )}>
              {userList &&
                userList.map((item) => (
                  <Select.Option value={item.id}>
                    {`${item.firstName} ${item.lastName}`}
                  </Select.Option>
                ))}
            </Select>
          </div>

          <div className="ant-space-item-main m-r-24">
            <span className="filter-custom-dropdown-label">
              {t('common.labels.status')}
            </span>
            <Select
              className="m-0 ant-space-align-center borderless-select"
              popupClassName="dropdown-size-medium"
              placement={'bottomRight'}
              onChange={onStatus}
              size={'middle'}
              mode="multiple"
              suffixIcon={<FilterDropDownIcon />}
              showArrow={true}
              maxTagCount={1}
              showSearch={false}
              maxTagPlaceholder={
                selectedStatus &&
                selectedStatus.length > MAX_TAG_COUNT_PUBLISH_QUEUE &&
                `,+ ${selectedStatus.length - MAX_TAG_COUNT_PUBLISH_QUEUE} `
              }
              value={selectedStatus.length === 0 ? ['All'] : selectedStatus}>
              {PUBLISH_QUEUE_STATUS.map((status) => (
                <Select.Option value={status.value}>
                  {status.label}
                </Select.Option>
              ))}
            </Select>
          </div>

          <Popover
            placement="bottomRight"
            content={
              <Checkbox.Group
                options={PUBLISH_QUEUE_FIELDS}
                defaultValue={userPreference}
                onChange={onPreferenceChange}
              />
            }
            trigger="click">
            <Button icon={<GearIcon />} size="middle"></Button>
          </Popover>
        </div>
      </div>
      {listPublishQueue.isLoading || listPublishQueue.isFetching ? (
        <Spin
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      ) : (
        getModelList.data &&
        getModelList.isSuccess &&
        listPublishQueue.isSuccess &&
        listPublishQueue.data && (
          <div className="table-section">
            <Table
              className="tableCellPadding-11"
              columns={columns}
              dataSource={listPublishQueue.data.response}
              pagination={{
                locale: { items_per_page: ' per page' },
                current: currentPageNumber,
                pageSize: skipLimit,
                total: listPublishQueue.data.totalCount,
                onChange: onPageChange,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50, 100],
                hideOnSinglePage: listPublishQueue.data.totalCount
                  ? listPublishQueue.data.totalCount < PAGE_SIZE
                  : false,
              }}
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
        )
      )}
    </div>
  );
};

export default ContentPublishQueue;
