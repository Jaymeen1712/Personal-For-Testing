import React from 'react';
import useListAuditLogsController from './list-audit-logs-controller';
import FilterDropDownIcon from '../../../../images/icons/filterdropdown-icon';
import NoDataFound from '../../../../components/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';
import SearchIcon from '../../../../images/icons/search-icon';
import { LoadingOutlined } from '@ant-design/icons';
import { Divider, Form, Input, Select, Spin, Table } from 'antd';
import { MAX_TAG_COUNT_PUBLISH_QUEUE } from '../../../../utills';

interface IListAuditLogsProps {
  startDate: string;
  endDate: string;
}

const ListAuditLogs: React.FC<IListAuditLogsProps> = ({
  startDate,
  endDate,
}) => {
  const {
    t,
    columns,
    columnData,
    userList,
    workspacesList,
    selectedUserIds,
    selectedWorkspaceIds,
    selectedEnvironmentId,
    totalRecordCount,
    loading,
    environmentList,
    workspaceFilterRef,
    workspaceFilterInputRef,
    workspaceFilterValue,
    userFilterRef,
    userFilterInputRef,
    userFilterValue,
    onEnvironmentChange,
    onWorkspaceChange,
    onUserChange,
    onWorkspaceFilterInputChange,
    onUserFilterInputChange,
    pagination,
    onInputChange,
    getAuditLogIsSuccess,
  } = useListAuditLogsController({ startDate, endDate });

  return (
    <>
      <div className="search-section ant-row ant-row-space-between list-user-filter">
        <div className="ant-row ant-space-align-center">
          <Form.Item name="searchText" className="m-0 m-r-16">
            <Input
              autoComplete="off"
              size="middle"
              placeholder={t('common.labels.search')}
              prefix={<SearchIcon />}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => (e.keyCode === 13 ? e.preventDefault() : '')}
            />
          </Form.Item>
          {getAuditLogIsSuccess && (
            <span className="gray-text m-0 search-count">
              {totalRecordCount && totalRecordCount > 1
                ? t('common.labels.total_records', {
                    entity: totalRecordCount,
                  })
                : t('common.labels.total_record', {
                    entity: totalRecordCount,
                  })}
            </span>
          )}
        </div>
        <div className="ant-row ant-space-horizontal ant-space-align-center">
          <div className="filters ant-space ant-space-horizontal ant-space-align-center">
            <div className="ant-row">
              <div className="ant-space-item-main">
                <span className="filter-custom-dropdown-label">
                  {t('common.labels.workspace')}
                </span>
                <Select
                  className="m-0 ant-space-align-center borderless-select"
                  popupClassName="dropdown-size-medium dropdown-search"
                  key="recordTableWorkspaceSelect"
                  onChange={onWorkspaceChange}
                  //@ts-ignore
                  ref={workspaceFilterRef}
                  size="middle"
                  mode="multiple"
                  showArrow={true}
                  maxTagCount={1}
                  showSearch={false}
                  maxTagPlaceholder={
                    selectedWorkspaceIds &&
                    selectedWorkspaceIds.length > MAX_TAG_COUNT_PUBLISH_QUEUE &&
                    `,+ ${
                      selectedWorkspaceIds.length - MAX_TAG_COUNT_PUBLISH_QUEUE
                    } `
                  }
                  suffixIcon={<FilterDropDownIcon />}
                  placement="bottomRight"
                  value={
                    selectedWorkspaceIds.length === 0
                      ? ['All']
                      : selectedWorkspaceIds
                  }
                  dropdownRender={(menu) => (
                    <>
                      <Input
                        placeholder={t('common.labels.search')}
                        //@ts-ignore
                        ref={workspaceFilterInputRef}
                        value={workspaceFilterValue}
                        onChange={(e) =>
                          onWorkspaceFilterInputChange(e.target.value)
                        }
                        prefix={<SearchIcon />}
                        bordered={false}
                        onKeyDown={(event) => {
                          if (
                            event.key === 'Backspace' ||
                            event.key === 'Enter'
                          ) {
                            return event.stopPropagation();
                          }
                        }}
                      />
                      <Divider style={{ margin: '0 4px 8px 4px' }} />
                      {menu}
                    </>
                  )}>
                  {workspacesList &&
                    workspacesList.map((workspace, index) => (
                      <Select.Option value={workspace.id} key={index}>
                        {workspace.name}
                      </Select.Option>
                    ))}
                </Select>
              </div>
              <div className="ant-space-item-main">
                <span className="filter-custom-dropdown-label">
                  {t('common.labels.user')}
                </span>
                <Select
                  className="borderless-select"
                  popupClassName="dropdown-size-medium dropdown-search"
                  key="recordTableUserSelect"
                  //@ts-ignore
                  ref={userFilterRef}
                  suffixIcon={<FilterDropDownIcon />}
                  showArrow={true}
                  showSearch={false}
                  mode="multiple"
                  size="middle"
                  maxTagCount={1}
                  maxTagPlaceholder={
                    selectedUserIds &&
                    selectedUserIds.length > MAX_TAG_COUNT_PUBLISH_QUEUE &&
                    `,+ ${
                      selectedUserIds.length - MAX_TAG_COUNT_PUBLISH_QUEUE
                    } `
                  }
                  onChange={onUserChange}
                  value={
                    selectedUserIds.length === 0 ? ['All'] : selectedUserIds
                  }
                  dropdownRender={(menu) => (
                    <>
                      <Input
                        placeholder={t('common.labels.search')}
                        //@ts-ignore
                        ref={userFilterInputRef}
                        value={userFilterValue}
                        onChange={(e) =>
                          onUserFilterInputChange(e.target.value)
                        }
                        prefix={<SearchIcon />}
                        bordered={false}
                        onKeyDown={(event) => {
                          if (
                            event.key === 'Backspace' ||
                            event.key === 'Enter'
                          ) {
                            return event.stopPropagation();
                          }
                        }}
                      />
                      <Divider style={{ margin: '0 4px 8px 4px' }} />
                      {menu}
                    </>
                  )}>
                  {userList &&
                    userList.map((user, index) => (
                      <Select.Option value={user.id} key={index}>
                        {user.name}
                      </Select.Option>
                    ))}
                </Select>
              </div>
              <div className="ant-space-item-main">
                <span className="filter-custom-dropdown-label">
                  {t('common.labels.environment')}
                </span>
                <Select
                  className="borderless-select"
                  popupClassName="dropdown-size-medium"
                  key="recordTableEnvironmentSelect"
                  onChange={onEnvironmentChange}
                  suffixIcon={<FilterDropDownIcon />}
                  placement="bottomRight"
                  value={selectedEnvironmentId}>
                  <Select.Option value={'All'} key={0}>
                    {'All'}
                  </Select.Option>
                  {environmentList &&
                    environmentList.map((environment, index) => (
                      <Select.Option value={environment.title} key={index + 1}>
                        {environment.title}
                      </Select.Option>
                    ))}
                </Select>
              </div>
            </div>
            {/* <Tooltip placement="left" title={t('common.labels.edit_columns')}>
              <Popover
                placement="bottomRight"
                content={
                  <Checkbox.Group
                    options={userPreferenceContent}
                    defaultValue={userPreference}
                    onChange={onUserPreferenceChange}
                  />
                }
                trigger="click">
                <Button
                  key="recordHover"
                  icon={<GearIcon />}
                  size="middle"></Button>
              </Popover>
            </Tooltip> */}
          </div>
        </div>
      </div>
      {loading ? (
        <Spin
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      ) : (
        <div className="table-section">
          <Table
            className="tableCellPadding-11"
            columns={columns}
            loading={loading}
            dataSource={columnData}
            pagination={pagination}
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
      )}
    </>
  );
};

export default ListAuditLogs;
