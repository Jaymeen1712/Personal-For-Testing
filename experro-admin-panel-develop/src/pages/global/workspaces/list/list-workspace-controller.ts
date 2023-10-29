import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IWorkspace } from '../../../../types';
import { SIDEBAR_KEYS } from '../../../../utills';
import { useListWorkspaces } from '../services';
import usePermissions from '../../../../hooks/permissions';

interface IUseListWorkspace {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useListWorkspace = ({ onMainSidebarActiveItem }: IUseListWorkspace) => {
  const { t } = useTranslation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [workspace, setWorkspace] = useState<IWorkspace>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [storeLink, setStoreLink] = useState('');

  const listWorkspaces = useListWorkspaces();
  const permissions = usePermissions();

  const onCreateWorkspace = () => {
    setIsModalVisible(true);
  };

  const onEditWorkspace = (workspace: IWorkspace) => {
    setStoreLink(
      `https://${window.location.host}` +
        `/workspaces/${workspace.id}/dashboard/traffic`
    );
    setWorkspace(workspace);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setStoreLink('');
    setWorkspace(undefined);
    setIsModalVisible(false);
  };

  const onDeleteWorkspace = (workspace: IWorkspace) => {
    setWorkspace(workspace);
    setIsDeleteModalVisible(true);
  };

  const onDeleteModalCancelClick = () => {
    setWorkspace(undefined);
    setIsDeleteModalVisible(false);
  };

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.GLOBAL.WORKSPACE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
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
    canManageGlobalWorkspace: permissions.canManageGlobalWorkspace(),
  };
};

export default useListWorkspace;
