import React from 'react';
import {
  Button,
  Checkbox,
  Popover,
  Table,
  Input,
  Form,
  Select,
  Spin,
  Tooltip,
  Divider,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import UseRecordsListTableController from './records-list-table-controller';
import SearchIcon from '../../../../../images/icons/search-icon';
import DeleteModal from '../delete-model';
import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';
import GearIcon from '../../../../../images/icons/gear-icon';
import FilterDropDownIcon from '../../../../../images/icons/filterdropdown-icon';
import { PAGE_SIZE } from '../../../../../utills';

const RecordsListTable: React.FC<{
  onEditRecordButtonClick: (val: boolean) => void;
  selectedContentModalInternalName: string;
  changeRecordEditDetails: (
    isEdit: boolean,
    id: string,
    currentVersionId: string
  ) => void;
}> = ({
  onEditRecordButtonClick,
  selectedContentModalInternalName,
  changeRecordEditDetails,
}) => {
  const {
    userPreference,
    columns,
    columnData,
    content,
    onChange,
    handleOk,
    handleCancel,
    isModalOpen,
    deleteRecord,
    t,
    onInputChange,
    form,
    onPageChange,
    totalRecordCount,
    currentPageNumber,
    userFilteredList,
    loading,
    onUserListChange,
    onStatusChange,
    skipLimit,
    selectedUserLength,
    // onChangeTable,
    // isSortByClick,
    userInputFilterValue,
    onUserFilterInputChange,
    userInputFilterRef,
  } = UseRecordsListTableController(
    onEditRecordButtonClick,
    selectedContentModalInternalName,
    changeRecordEditDetails
  );
  const { Option } = Select;
  return (
    <>
      <div className="search-section environment-search list-user-filter">
        <Form form={form} className="ant-row ant-row-space-between w-100">
          <div className="ant-row ant-space-align-center">
            <Form.Item name="searchText" className="m-0 m-r-16">
              <Input
                autoComplete="off"
                size="middle"
                placeholder={t('common.labels.search')}
                prefix={<SearchIcon />}
                onChange={(e) => {
                  onInputChange(e);
                }}
                onKeyDown={(e) => (e.keyCode === 13 ? e.preventDefault() : '')}
              />
            </Form.Item>
            <span className="search-count">
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
            </span>
          </div>
          <div className="ant-row ant-space-horizontal ant-space-align-center">
            <div className="filters ant-row ant-space-align-center">
              <Form.Item
                name="status"
                colon={false}
                className="m-0 m-r-8 ant-space-align-center select-user-dropdown">
                <span className="filter-custom-dropdown-label">
                  {t('common.labels.status')}
                </span>
                <Select
                  className="borderless-select"
                  popupClassName="dropdown-size-medium"
                  key="recordTableStatusSelect"
                  placeholder={t('common.labels.all')}
                  onChange={onStatusChange}
                  suffixIcon={<FilterDropDownIcon />}
                  placement="bottomRight">
                  <Option value="">{t('common.labels.all')}</Option>
                  <Option value="DRAFT">{t('common.labels.draft')}</Option>
                  <Option value="PUBLISHED">
                    {t('common.labels.Published')}
                  </Option>
                  <Option value="SCHEDULE">
                    {t('common.labels.Scheduled')}
                  </Option>
                </Select>
              </Form.Item>
              <div className="ant-row">
                <Form.Item
                  name="selectUser"
                  className="m-0 m-r-24 m-l-24 select-user-dropdown">
                  <span className="filter-custom-dropdown-label">Users</span>
                  <Select
                    className="borderless-select"
                    popupClassName="dropdown-size-medium dropdown-search"
                    key="recordTableUserSelect"
                    suffixIcon={<FilterDropDownIcon />}
                    showArrow={true}
                    showSearch={false}
                    mode="multiple"
                    placeholder={t('common.labels.all')}
                    optionFilterProp="children"
                    maxTagCount={1}
                    placement={'bottomRight'}
                    maxTagPlaceholder={
                      userFilteredList &&
                      userFilteredList.length > 1 &&
                      `,+ ${selectedUserLength} `
                    }
                    filterOption={(input, userList) =>
                      (userList?.children ?? '')
                        //@ts-ignore
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onChange={onUserListChange}
                    dropdownRender={(menu) => (
                      <>
                        <Input
                          placeholder={t('common.labels.search')}
                          //@ts-ignore
                          ref={userInputFilterRef}
                          value={userInputFilterValue}
                          onChange={(e) => onUserFilterInputChange(e)}
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
                    {userFilteredList &&
                      userFilteredList.map((item) => (
                        <Option value={item.id}>{item.name}</Option>
                      ))}
                  </Select>
                </Form.Item>
                <Tooltip
                  placement="left"
                  title={t('common.labels.edit_columns')}>
                  <Popover
                    placement="bottomRight"
                    content={
                      <Checkbox.Group
                        options={content}
                        defaultValue={userPreference}
                        onChange={onChange}
                      />
                    }
                    trigger="click">
                    <Button
                      key="recordHover"
                      icon={<GearIcon />}
                      size="middle"></Button>
                  </Popover>
                </Tooltip>
              </div>
            </div>
          </div>
        </Form>

        <DeleteModal
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          deleteRecord={deleteRecord}
          handleOk={handleOk}
        />
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
            showSorterTooltip={false}
            // onChange={onChangeTable}
            className="tableCellPadding-11"
            columns={columns}
            // loading={loading}
            // @ts-ignore
            dataSource={columnData}
            pagination={{
              current: currentPageNumber,
              defaultPageSize: skipLimit,
              total: totalRecordCount,
              showSizeChanger: true,
              locale: { items_per_page: ' per page' },
              onChange: onPageChange,
              hideOnSinglePage: totalRecordCount < PAGE_SIZE,
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
      )}
    </>
  );
};

export default RecordsListTable;
