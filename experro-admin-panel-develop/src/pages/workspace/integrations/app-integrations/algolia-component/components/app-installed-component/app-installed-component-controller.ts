import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import { IAppLIst } from '../../../../../../../types';
import { useGetAppById, useUninstallApp } from '../../../../services';
import { openNotificationWithIcon } from '../../../../../../../utills';
import useUpdateAppConfiguration from '../../../../services/update-app-configuration';
import { Form } from 'antd';

const useAppInstalledComponentController = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { t } = useTranslation();
  const { workspaceId, id } = useParams<{
    workspaceId: string;
    id: string;
  }>();
  const [appDetails, setAppDetails] = useState<IAppLIst>({} as IAppLIst);

  const getAppById = useGetAppById(workspaceId, id);

  const uninstallApp = useUninstallApp(workspaceId);

  const updateAppConfiguration = useUpdateAppConfiguration(workspaceId);

  const onAppUninstallButtonClick = () => {
    uninstallApp.mutate(appDetails?.id);
  };

  const onBackButtonClick = () => {
    history.push(`/workspaces/${workspaceId}/apps`);
  };

  const onConnectButtonClick = async () => {
    try {
      const result = await form.validateFields();
      result['id'] = id;
      result['integrationName'] = 'algolia';
      result['isEnabled'] = true;
      updateAppConfiguration.mutate(result);
    } catch (err) {}
    console.log('test');
  };

  useEffect(() => {
    if (getAppById.isSuccess) {
      if (getAppById.data) {
        form.setFieldsValue({
          spaceId: getAppById.data.spaceId,
          accessToken: getAppById.data.accessToken,
          integrationEnvironmentId: getAppById.data.integrationEnvironmentId,
        });
        setAppDetails(getAppById.data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAppById.isSuccess]);

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
        t('common.messages.app_uninstall_successfully')
      );
      history.push(`/workspaces/${workspaceId}/apps`);
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
    if (updateAppConfiguration.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.app_connected_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateAppConfiguration.isSuccess]);

  useEffect(() => {
    if (updateAppConfiguration.isError) {
      console.log('test', updateAppConfiguration.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateAppConfiguration.isError]);

  return {
    onAppUninstallButtonClick,
    onBackButtonClick,
    t,
    onConnectButtonClick,
    form,
    appDetails,
    isUpdateAppConfigurationLoading: updateAppConfiguration.isLoading,
    isAppUninstallIsLoading: uninstallApp.isLoading,
  };
};
export default useAppInstalledComponentController;
