import React from 'react';
import { Button, Dropdown, Input, Space, Spin, Table } from 'antd';

import useListUserController from './list-workspace-user-controller';
import Modal from '../../../../components/modal';
import NoDataFound from '../../../../components/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';
import HeaderListWorkspaceUser from './header-list-workspace-user';
import { LoadingOutlined } from '@ant-design/icons';
import SearchIcon from '../../../../images/icons/search-icon';
import FilterDropDownIcon from '../../../../images/icons/filterdropdown-icon';

interface IListWorkspaceUser {
  onMainSidebarActiveItem?: (val: string) => void;
}

const ListWorkspaceUser: React.FC<IListWorkspaceUser> = ({
  onMainSidebarActiveItem,
}) => {
  const {
    t,
    status,
    statusLabel,
    selectedFilterRoleLabel,
    userStatusOptions,
    userRolesOptions,
    columns,
    onAddUserClick,
    isDeleteModalVisible,
    user,
    hideDeleteModal,
    onDeleteModalSubmit,
    isResetPasswordModalVisible,
    hideResetPasswordModal,
    onResetPasswordSubmit,
    canCreateUser,
    deleteUser,
    resetPassword,
    pagination,
    listWorkspaceUsersData,
    isLoading,
    onSearchFilterChange,
    onStatusFilterChange,
    onRoleFilterChange,
  } = useListUserController({ onMainSidebarActiveItem });
  return (
    <>
      <HeaderListWorkspaceUser
        t={t}
        canCreateUser={canCreateUser}
        onAddUserClick={onAddUserClick}
      />
      <div>
        <div className="search-section ant-row ant-row-space-between">
          <Input
            size="middle"
            placeholder={t('common.labels.search')}
            prefix={<SearchIcon />}
            onChange={onSearchFilterChange}
          />
          <div className="filters ant-space ant-space-horizontal ant-space-align-center">
            <div className="ant-space-item-main">
              <span className="filter-custom-dropdown-label">
                {t('common.labels.status')}
              </span>
              <Dropdown
                menu={{
                  items: userStatusOptions,
                  onClick: (e) => onStatusFilterChange(e.key),
                }}
                overlayClassName="dropdown-size-medium"
                className="filter-custom-dropdown borderless-select"
                trigger={['click']}
                placement="bottomRight">
                <div>
                  <Space>{statusLabel}</Space>
                  <span className="filterdropdownarrow">
                    <FilterDropDownIcon />
                  </span>
                </div>
              </Dropdown>
            </div>
            <div className="ant-space-item-main">
              <span className="filter-custom-dropdown-label">
                {t('common.labels.roles')}
              </span>
              <Dropdown
                menu={{
                  items: userRolesOptions,
                  onClick: (e) => onRoleFilterChange(e.key),
                }}
                className="filter-custom-dropdown borderless-select"
                overlayClassName="dropdown-size-medium"
                trigger={['click']}
                placement="bottomRight">
                <div>
                  <Space>{selectedFilterRoleLabel}</Space>
                  <span className="filterdropdownarrow">
                    <FilterDropDownIcon />
                  </span>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <>
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
            size="large"
          />
        </>
      ) : (
        <>
          {(status ||
            userRolesOptions.length > 0 ||
            (listWorkspaceUsersData && listWorkspaceUsersData?.length > 0)) && (
            <div className="table-section">
              <Table
                className="tableCellPadding-11"
                columns={columns}
                loading={isLoading}
                //@ts-ignore
                dataSource={listWorkspaceUsersData}
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
            </div>
          )}
        </>
      )}

      <Modal
        classname="confirm-modal"
        title={t('common.messages.remove_entity', {
          entity: `${user?.firstName}`,
        })}
        isModalVisibility={isDeleteModalVisible}
        hideModal={hideDeleteModal}
        onOK={onDeleteModalSubmit}
        confirmLoading={!!deleteUser?.isLoading}
        okText={t('common.labels.remove')}>
        <p>{t('common.messages.remove_user_description')}</p>
      </Modal>

      <Modal
        classname="confirm-modal"
        title={t('common.labels.reset_password')}
        isModalVisibility={isResetPasswordModalVisible}
        hideModal={hideResetPasswordModal}
        footer={[
          <Button key="back" onClick={hideResetPasswordModal}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={onResetPasswordSubmit}
            loading={!!resetPassword?.isLoading}>
            {t('common.labels.reset_password')}
          </Button>,
        ]}>
        <p>{t('common.messages.reset_password_message')}</p>
      </Modal>
    </>
  );
};

export default ListWorkspaceUser;
