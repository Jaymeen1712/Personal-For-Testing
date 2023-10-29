import { useHistory, useParams } from 'react-router-dom';
import usePermissions from '../../../../../../../hooks/permissions/permissions';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppInstall } from '../../../../services';
import { openNotificationWithIcon } from '../../../../../../../utills';

const useAboutAppComponentController = () => {
  const { t } = useTranslation();
  const { workspaceId, id, categoryId } = useParams<{
    workspaceId: string;
    categoryId: string;
    id: string;
  }>();
  const { canUpdateEcommerceStore } = usePermissions();
  const history = useHistory();
  const onBackButtonClick = () => {
    history.push(`/workspaces/${workspaceId}/platforms`);
  };
  const [isInstallAppModalVisible, setInstallAppModalVisible] = useState(false);
  const appInstall = useAppInstall(workspaceId);
  const onInstallButtonClick = () => {
    appInstall.mutate({
      isActivated: true,
      integrationInternalName: 'bigcommerce',
      masterIntegrationId: id,
      categoryId,
    });
  };
  const toggleModal = (val: boolean) => setInstallAppModalVisible(val);

  useEffect(() => {
    if (appInstall.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.platform_installed_successfully')
      );
      if (appInstall.data) {
        history.push(
          `/workspaces/${workspaceId}/platforms/bigcommerce/${id}/${categoryId}/installed`
        );
      }
      setInstallAppModalVisible(false);
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
      setInstallAppModalVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appInstall.isError]);

  const onVisitWebsiteButtonClick = () => {
    window.open('https://www.bigcommerce.com/', '_blank');
  };

  return {
    t,
    onBackButtonClick,
    canUpdateEcommerceStore,
    isInstallAppModalVisible,
    toggleModal,
    onInstallButtonClick,
    isAppInstallLoading: appInstall.isLoading,
    onVisitWebsiteButtonClick,
  };
};
export default useAboutAppComponentController;
