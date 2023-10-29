import React from 'react';
import { Collapse, Modal, Table } from 'antd';

import useListRoleController from './list-role-controller';
import { IRoleListType } from '../../../../types';
import HeaderListRole from './header-list-role';
import ArrowRightIcon from "../../../../images/icons/arrow-right-icon";

interface IListRole {
  onMainSidebarActiveItem?: (val: string) => void;
}

const ListRole: React.FC<IListRole> = ({ onMainSidebarActiveItem }) => {
  const {
    t,
    onAddRole,
    isModalVisible,
    selectedRole,
    onDeleteRole,
    hideDeleteModal,
    columns,
    listRole,
    activePanelKeys,
    activePanelChange,
    deleteWorkspaceRole,
    deleteGlobalRole,
  } = useListRoleController({ onMainSidebarActiveItem });

  return (
    <>
      <HeaderListRole t={t} onAddRole={onAddRole} />

      <div className="role-list">
        {listRole.isSuccess &&
          listRole.data.map((ele: IRoleListType, i: number) => {
            if (ele.workspaceId) {
              return (
                <Collapse
                  key={ele.workspaceId}
                  onChange={activePanelChange}
                  expandIcon={({ isActive }) =>
                    isActive ? (
                      <span className="anticon">
                        <ArrowRightIcon />
                      </span>
                    ) : (
                      <span className="anticon">
                        <ArrowRightIcon />
                      </span>
                    )
                  }
                  activeKey={activePanelKeys}>
                  <Collapse.Panel
                    header={`${ele.workspaceName} (${ele.roles.length})`}
                    key={i}>
                    <div className="table-section">
                      <Table
                        // @ts-ignore
                        columns={columns}
                        // @ts-ignore
                        dataSource={ele.roles}
                        showHeader={false}
                        pagination={false}
                      />
                    </div>
                  </Collapse.Panel>
                </Collapse>
              );
            } else {
              return (
                <Collapse
                  key={ele.workspaceId}
                  onChange={activePanelChange}
                  expandIcon={({ isActive }) =>
                    isActive ? (
                      <span className="anticon">
                        <ArrowRightIcon />
                      </span>
                    ) : (
                      <span className="anticon">
                        <ArrowRightIcon />
                      </span>
                    )
                  }
                  activeKey={activePanelKeys}>
                  <Collapse.Panel
                    header={`${t('common.labels.global')} (${
                      ele.roles.length
                    })`}
                    key={i}>
                    <div className="table-section">
                      <Table
                        // @ts-ignore
                        columns={columns}
                        // @ts-ignore
                        dataSource={ele.roles}
                        showHeader={false}
                        pagination={false}
                      />
                    </div>
                  </Collapse.Panel>
                </Collapse>
              );
            }
          })}
      </div>

      <Modal
        className="confirm-modal"
        title={t('common.labels.role_delete_title', {
          roleName: selectedRole?.name,
        })}
        open={isModalVisible}
        onCancel={hideDeleteModal}
        onOk={onDeleteRole}
        confirmLoading={
          deleteGlobalRole.isLoading || deleteWorkspaceRole.isLoading
        }
        okText={t('common.labels.delete')}
        centered
        okButtonProps={{ danger: true }}>
        <p>{t('common.messages.delete_role_message')}</p>
      </Modal>
    </>
  );
};

export default ListRole;
