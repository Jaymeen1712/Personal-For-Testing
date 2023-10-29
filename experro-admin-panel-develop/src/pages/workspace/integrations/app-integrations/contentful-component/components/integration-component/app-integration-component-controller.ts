import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import { useAppInstall } from '../../../../services';
import { useEffect } from 'react';
import { openNotificationWithIcon } from '../../../../../../../utills';

const useIntegrationComponentController = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { workspaceId, id, categoryId } = useParams<{
    workspaceId: string;
    id: string;
    categoryId: string;
  }>();

  const appInstall = useAppInstall(workspaceId);
  const onAcceptButtonClick = () => {
    appInstall.mutate({
      isActivated: true,
      integrationInternalName: 'contentful',
      masterIntegrationId: id,
      categoryId: categoryId,
    });
  };
  const onCancelButtonClick = () => {
    history.push(
      `/workspaces/${workspaceId}/apps/contentful/${id}/${categoryId}`
    );
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appInstall.isError]);
  return { t, onAcceptButtonClick, onCancelButtonClick };
};
export default useIntegrationComponentController;
