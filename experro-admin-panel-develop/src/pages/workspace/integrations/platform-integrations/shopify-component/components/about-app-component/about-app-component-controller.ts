import { useHistory, useParams } from 'react-router-dom';
import { useAppInstall } from '../../../../services';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { openNotificationWithIcon } from '../../../../../../../utills';
import usePermissions from '../../../../../../../hooks/permissions/permissions';
// import { openNotificationWithIcon } from '../../../../../../utills';

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
      integrationInternalName: 'shopify',
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
          `/workspaces/${workspaceId}/platforms/shopify/${id}/${categoryId}/installed`
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
    window.open('https://www.shopify.com/', '_blank');
  };

  return {
    t,
    onBackButtonClick,
    isInstallAppModalVisible,
    onInstallButtonClick,
    isAppInstallLoading: appInstall.isLoading,
    toggleModal,
    onVisitWebsiteButtonClick,
    canUpdateEcommerceStore,
  };
};
export default useAboutAppComponentController;
