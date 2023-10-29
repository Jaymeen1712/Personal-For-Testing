import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import { useGetAppById, useUninstallApp } from '../../../../services';

import { openNotificationWithIcon } from '../../../../../../../utills';
import { useAddStore } from '../../../services';
import usePermissions from '../../../../../../../hooks/permissions/permissions';
const useAppInstalledComponentController = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { canUpdateEcommerceStore } = usePermissions();
  const { workspaceId, id } = useParams<{
    workspaceId: string;
    id: string;
  }>();

  const [isUninstallPlatformModalVisible, setIsUninstallPlatformModalVisible] =
    useState<boolean>(false);

  const getAppById = useGetAppById(workspaceId, id);

  const uninstallApp = useUninstallApp(workspaceId);

  const addStore = useAddStore(workspaceId);

  const onAppUninstallButtonClick = () => {
    uninstallApp.mutate(id);
  };

  const onBackButtonClick = () => {
    history.push(`/workspaces/${workspaceId}/platforms`);
  };

  const toggleUninstallModal = (val: boolean) =>
    setIsUninstallPlatformModalVisible(val);

  const onVisitWebsiteButtonClick = () => {
    window.open('https://www.bigcommerce.com/', '_blank');
  };

  useEffect(() => {
    if (getAppById.isError) {
      console.log('test', getAppById.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAppById.isError]);

  useEffect(() => {
    if (uninstallApp.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.platform_uninstalled_successfully')
      );
      history.push(`/workspaces/${workspaceId}/platforms`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uninstallApp.isSuccess]);

  useEffect(() => {
    if (uninstallApp.isError) {
      openNotificationWithIcon(
        'error',
        t('common.messages.error_in_uninstall_app')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uninstallApp.isError]);

  useEffect(() => {
    if (addStore.isSuccess) {
      openNotificationWithIcon('success', 'Store added successfully');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addStore.isSuccess]);

  useEffect(() => {
    if (addStore.isError) {
      openNotificationWithIcon('error', 'Error in adding store');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addStore.isError]);

  return {
    t,
    onAppUninstallButtonClick,
    onBackButtonClick,
    isAppUninstallIsLoading: uninstallApp.isLoading,
    canUpdateEcommerceStore,
    isUninstallPlatformModalVisible,
    toggleUninstallModal,
    onVisitWebsiteButtonClick,
  };
};
export default useAppInstalledComponentController;
