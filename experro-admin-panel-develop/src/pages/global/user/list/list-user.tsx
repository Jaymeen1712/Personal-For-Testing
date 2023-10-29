import React from 'react';
import { Button, Divider, Form, Input, Modal, Select, Spin, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useListUserController from './list-user-controller';
import NoDataFound from '../../../../components/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';
import HeaderListUser from './header-list-user';
import FilterDropDownIcon from '../../../../images/icons/filterdropdown-icon';
import { MAX_TAG_COUNT_PUBLISH_QUEUE } from '../../../../utills';
import SearchIcon from '../../../../images/icons/search-icon';

const ListUser: React.FC = () => {
  const {
    t,
    selectedWorkspaces,
    status,
    userStatusOptions,
    columns,
    onAddUserClick,
    isDeleteModalVisible,
    user,
    hideDeleteModal,
    onDeleteModalSubmit,
    isResetPasswordModalVisible,
    isBlockUserModalVisible,
    hideResetPasswordModal,
    hideBlockUserModal,
    onBlockUserClick,
    onResetPasswordSubmit,
    deleteUser,
    resetPassword,
    isBlockUserLoading,
    onWorkspaceChange,
    onStatusChange,
    roles,
    onRoleChange,
    listUserIsSuccess,
    form,
    onInputChange,
    pagination,
    listUserCount,
    filter,
    listWorkspaces,
    onWorkspaceFilterInputChange,
    workspaceFilterValue,
    workspaceFilterInputRef,
    listRoles,
    onRoleFilterInputChange,
    roleFilterValue,
    roleFilterInputRef,
    userList,
  } = useListUserController();

  return (
    <>
      <HeaderListUser t={t} onAddUserClick={onAddUserClick} />

      <div>
        <div
          className={`${
            (listUserIsSuccess && listUserCount && listUserCount > 0) ||
            filter ||
            selectedWorkspaces.length > 0 ||
            status ||
            roles.length > 0
              ? 'search-section'
              : 'display-none'
          } ant-row ant-row-space-between list-user-filter`}>
          <div className="ant-row ant-space-align-center">
            <Form form={form}>
              <Form.Item name="searchText" className="m-0">
                <Input
                  className="m-r-16"
                  size="middle"
                  placeholder={t('common.labels.search')}
                  prefix={<SearchIcon />}
                  onChange={(e) => {
                    onInputChange(e.target.value);
                  }}
                />

                <span className="gray-text m-0 search-count">
                  {listUserIsSuccess && listUserCount && listUserCount > 1
                    ? t('common.labels.total_records', {
                        entity: listUserCount,
                      })
                    : listUserIsSuccess &&
                      t('common.labels.total_record', {
                        entity: listUserCount,
                      })}
                </span>
              </Form.Item>
            </Form>
          </div>
          <div className="filters ant-space ant-space-horizontal ant-space-align-center">
            <div className="ant-space-item-main">
              <span className="filter-custom-dropdown-label">
                {t('common.labels.workspace')}
              </span>
              <Select
                className="m-0 ant-space-align-center borderless-select"
                popupClassName="dropdown-size-medium dropdown-search"
                placement={'bottomRight'}
                onChange={onWorkspaceChange}
                size="middle"
                mode="multiple"
                suffixIcon={<FilterDropDownIcon />}
                showArrow={true}
                maxTagCount={1}
                showSearch={false}
                maxTagPlaceholder={
                  selectedWorkspaces &&
                  selectedWorkspaces.length > MAX_TAG_COUNT_PUBLISH_QUEUE &&
                  `,+ ${
                    selectedWorkspaces.length - MAX_TAG_COUNT_PUBLISH_QUEUE
                  } `
                }
                value={
                  selectedWorkspaces.length === 0 ? ['All'] : selectedWorkspaces
                }
                dropdownRender={(menu) => (
                  <>
                    <Input
                      placeholder={t('common.labels.search')}
                      //@ts-ignore
                      ref={workspaceFilterInputRef}
                      value={workspaceFilterValue}
                      onChange={(e) => onWorkspaceFilterInputChange(e)}
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
                {listWorkspaces &&
                  listWorkspaces.map((workspace) => (
                    <Select.Option value={workspace.id}>
                      {workspace.name}
                    </Select.Option>
                  ))}
              </Select>
            </div>

            <div className="ant-space-item-main">
              <span className="filter-custom-dropdown-label">
                {t('common.labels.status')}
              </span>
              <Select
                className="m-0 ant-space-align-center borderless-select"
                popupClassName="dropdown-size-medium "
                placement={'bottomRight'}
                onChange={onStatusChange}
                size="middle"
                suffixIcon={<FilterDropDownIcon />}
                showArrow={true}
                showSearch={false}
                value={status}>
                {userStatusOptions &&
                  userStatusOptions.map((workspace) => (
                    <Select.Option value={workspace.key}>
                      {workspace.label}
                    </Select.Option>
                  ))}
              </Select>
            </div>

            <div className="ant-space-item-main">
              <span className="filter-custom-dropdown-label">
                {t('common.labels.role')}
              </span>
              <Select
                className="m-0 ant-space-align-center borderless-select"
                popupClassName="dropdown-size-medium dropdown-search"
                placement={'bottomRight'}
                onChange={onRoleChange}
                size="middle"
                mode="multiple"
                suffixIcon={<FilterDropDownIcon />}
                showArrow={true}
                maxTagCount={1}
                showSearch={false}
                maxTagPlaceholder={
                  roles &&
                  roles.length > MAX_TAG_COUNT_PUBLISH_QUEUE &&
                  `,+ ${roles.length - MAX_TAG_COUNT_PUBLISH_QUEUE} `
                }
                value={roles.length === 0 ? ['All'] : roles}
                dropdownRender={(menu) => (
                  <>
                    <Input
                      placeholder={t('common.labels.search')}
                      //@ts-ignore
                      ref={roleFilterInputRef}
                      value={roleFilterValue}
                      onChange={(e) => onRoleFilterInputChange(e)}
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
                {listRoles &&
                  listRoles.map((role) => (
                    <Select.Option
                      value={
                        role.id
                      }>{`${role.workspaceName}-${role.name}`}</Select.Option>
                  ))}
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="table-section">
        {listUserIsSuccess ? (
          <Table
            columns={columns}
            className="tableCellPadding-11"
            dataSource={userList}
            pagination={pagination}
            locale={{
              emptyText: (
                <NoDataFound
                  icon={<NoRecordIcon />}
                  title={t('common.labels.no_record_added')}
                  description={t('common.labels.add_user_above')}
                />
              ),
            }}
          />
        ) : (
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        )}
      </div>

      <Modal
        title={t('common.messages.delete_entity', {
          entity: `${user?.firstName} ${user?.lastName ? user.lastName : ''}`,
        })}
        open={isDeleteModalVisible}
        onCancel={hideDeleteModal}
        onOk={onDeleteModalSubmit}
        centered
        okButtonProps={{
          danger: true,
        }}
        okText={t('common.labels.delete')}
        confirmLoading={deleteUser.isLoading}
        className="confirm-modal">
        <div className="user-delete-modal">
          <p className="m-0 m-b-16 gray-text">
            {t('common.messages.delete_user_pop_up_body_text')}
          </p>
          <p className="m-0 dark-text">
            {t('common.messages.delete_specific_entity_message', {
              entity: t('common.labels.userDelete'),
            })}
          </p>
        </div>
      </Modal>

      <Modal
        title={t('common.labels.reset_password')}
        open={isResetPasswordModalVisible}
        onCancel={hideResetPasswordModal}
        centered
        footer={[
          <Button key="back" onClick={hideResetPasswordModal}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={onResetPasswordSubmit}
            loading={resetPassword.isLoading}>
            {t('common.labels.reset_password')}
          </Button>,
        ]}
        className="confirm-modal">
        <div className="user-delete-modal">
          <p className="m-0 gray-text">
            {t('common.messages.reset_password_message')}
          </p>
        </div>
      </Modal>

      <Modal
        title={t('common.messages.title_block_user', {
          name: `${user?.firstName} ${user?.lastName ? user?.lastName : ''}`,
        })}
        open={isBlockUserModalVisible}
        onCancel={hideBlockUserModal}
        centered
        footer={[
          <Button key="back" onClick={hideBlockUserModal}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={onBlockUserClick}
            loading={isBlockUserLoading}>
            Block
          </Button>,
        ]}
        className="confirm-modal">
        <div className="user-delete-modal">
          <p className="m-0 gray-text">
            {t('common.messages.block_user_description')}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default ListUser;
