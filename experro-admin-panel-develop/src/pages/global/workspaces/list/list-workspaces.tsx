import React from 'react';

import Workspace from '../workspace/workspace';
import CreateUpdateWorkspace from '../create-update';
import useListWorkspace from './list-workspace-controller';
import DeleteWorkspaceModal from '../delete-workspace-modal';
import HeaderListWorkspaces from './header-list-workspaces';
import { Col, Layout, Row } from 'antd';

interface IListWorkspaces {
  onMainSidebarActiveItem?: (val: string) => void;
}

const ListWorkspaces: React.FC<IListWorkspaces> = ({
  onMainSidebarActiveItem,
}) => {
  const {
    workspace,
    listWorkspaces,
    t,
    isModalVisible,
    hideModal,
    onCreateWorkspace,
    onEditWorkspace,
    onDeleteWorkspace,
    isDeleteModalVisible,
    onDeleteModalCancelClick,
    storeLink,
    setStoreLink,
    canManageGlobalWorkspace,
  } = useListWorkspace({ onMainSidebarActiveItem });

  return (
    <Layout className="page-wrapper-full workspace-page-wrapper">
      <Layout.Content>
        <HeaderListWorkspaces t={t} onCreateWorkspace={onCreateWorkspace} canManageGlobalWorkspace={canManageGlobalWorkspace} />

        <>
          <Row gutter={16} className="workspace-grid">
            {listWorkspaces?.data?.map((workspace) => (
              <Col className="gutter-row m-b-16" xs={24} md={12} lg={8} xl={6}>
                <Workspace
                  key={workspace.id}
                  workspace={workspace}
                  onEditWorkspace={onEditWorkspace}
                  onDeleteWorkspace={onDeleteWorkspace}
                  canManageGlobalWorkspace={canManageGlobalWorkspace}
                  isModalVisible={isModalVisible}
                  isDeleteModalVisible={isDeleteModalVisible}
                />
              </Col>
            ))}
          </Row>
        </>

        {isModalVisible && (
          <CreateUpdateWorkspace
            isModalVisible={isModalVisible}
            hideModal={hideModal}
            storeLink={storeLink}
            setStoreLink={setStoreLink}
            initialValue={{
              ...workspace,
              timezone: workspace && workspace.timezone,
              currency: workspace && workspace.currency,
            }}
          />
        )}

        {isDeleteModalVisible && (
          <DeleteWorkspaceModal
            isDeleteModalVisible={isDeleteModalVisible}
            hideDeleteModal={onDeleteModalCancelClick}
            workspaceId={workspace?.id}
            workspace={workspace}
          />
        )}
      </Layout.Content>
    </Layout>
  );
};

export default ListWorkspaces;
