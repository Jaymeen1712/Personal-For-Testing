import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useAppInstall } from '../../../../services';
import { openNotificationWithIcon } from '../../../../../../../utills';

const useAboutAppComponentController = () => {
  const { workspaceId, id, categoryId } = useParams<{
    workspaceId: string;
    categoryId: string;
    id: string;
  }>();

  const { t } = useTranslation();
  const history = useHistory();

  const [isAppInstallModalVisible, setIsAppInstallModalVisible] =
    useState<boolean>(false);

  const appInstall = useAppInstall(workspaceId);
  const onAcceptButtonClick = () => {
    appInstall.mutate({
      isActivated: true,
      integrationInternalName: 'contentful',
      masterIntegrationId: id,
      categoryId: categoryId,
    });
  };

  const hideModal = () => {
    setIsAppInstallModalVisible(false);
  };

  const onBackButtonClick = () => {
    history.push(`/workspaces/${workspaceId}/apps`);
  };
  const onGetThisAppButtonClick = () => {
    // history.push(
    //   `/workspaces/${workspaceId}/apps/contentful/${id}/${categoryId}/accept`
    // );
    setIsAppInstallModalVisible(true);
  };

  useEffect(() => {
    if (appInstall.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.app_installed_successfully')
      );
      if (appInstall.data) {
        history.push(
          `/workspaces/${workspaceId}/apps/contentful/${id}/${categoryId}/installed`
        );
      }
      hideModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appInstall.isSuccess]);

  useEffect(() => {
    if (appInstall.isError) {
      openNotificationWithIcon(
        'error',
        //@ts-ignore
        appInstall.error.response.Error?.message
      );
      hideModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appInstall.isError]);

  return {
    t,
    onBackButtonClick,
    onGetThisAppButtonClick,
    isAppInstallModalVisible,
    hideModal,
    onAcceptButtonClick,
    isAppInstallLoading: appInstall.isLoading,
  };
};
export default useAboutAppComponentController;
