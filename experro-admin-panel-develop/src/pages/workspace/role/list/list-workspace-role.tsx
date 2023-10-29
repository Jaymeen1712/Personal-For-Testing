import React from 'react';
import { Spin, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useListWorkspaceRoleController from './list-workspace-role-controller';
import Modal from '../../../../components/modal';
import NoDataFound from '../../../../components/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';
import HeaderListWorkspaceRole from './header-list-workspace-role';

interface IListWorkspaceRole {
  onMainSidebarActiveItem?: (val: string) => void;
}

const ListWorkspaceRole: React.FC<IListWorkspaceRole> = ({
  onMainSidebarActiveItem,
}) => {
  const {
    t,
    onAddRole,
    isWorkspaceRolesListLoading,
    isModalVisible,
    selectedRole,
    onDeleteRole,
    hideDeleteModal,
    columns,
    canCreateRole,
    deleteWorkspaceRole,
    workspaceRole,
    // onChangeTable,
    // isWorkspaceRoleListingFetching,
  } = useListWorkspaceRoleController({ onMainSidebarActiveItem });

  return (
    <>
      <HeaderListWorkspaceRole
        t={t}
        canCreateRole={canCreateRole}
        onAddRole={onAddRole}
      />
      {isWorkspaceRolesListLoading ? (
        <Spin
          data-testid={'loader'}
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      ) : (
        <div className="role-list">
          <div className="table-section">
            <Table
              // @ts-ignore
              columns={columns}
              dataSource={workspaceRole}
              pagination={false}
              // onChange={onChangeTable}
              // showSorterTooltip={false}
              // loading={
              //   isWorkspaceRolesListLoading || isWorkspaceRoleListingFetching
              // }
              locale={{
                emptyText: (
                  <NoDataFound
                    icon={<NoRecordIcon />}
                    title={t('common.labels.no_record_added')}
                    description={t('common.labels.add_workspace_role_above')}
                  />
                ),
              }}
            />
          </div>
        </div>
      )}

      <Modal
        classname="confirm-modal"
        title={t('common.labels.role_delete_title', {
          roleName: selectedRole?.name,
        })}
        isModalVisibility={isModalVisible}
        hideModal={hideDeleteModal}
        onOK={onDeleteRole}
        okText={t('common.labels.delete')}
        confirmLoading={deleteWorkspaceRole.isLoading}>
        <p>{t('common.messages.delete_role_message')}</p>
      </Modal>
    </>
  );
};

export default ListWorkspaceRole;
