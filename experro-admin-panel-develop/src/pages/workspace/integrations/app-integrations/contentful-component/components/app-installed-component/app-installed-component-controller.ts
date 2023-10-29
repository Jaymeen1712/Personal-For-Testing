import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import { IAppLIst, IContentfulStore } from '../../../../../../../types';
import { useGetAppById, useUninstallApp } from '../../../../services';
import { openNotificationWithIcon } from '../../../../../../../utills';
import { Form } from 'antd';
import useCreateContentfulStore from '../../../services/contentful/create';
import useError from '../../../../../../../hooks/error/error';
import useListContentfulStore from '../../../services/contentful/list';
import useDeleteContentfulStore from '../../../services/contentful/delete';
import useUpdateContentfulStore from '../../../services/contentful/update/update-contentful-store';

const useAppInstalledComponentController = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { t } = useTranslation();
  const { workspaceId, id } = useParams<{
    workspaceId: string;
    id: string;
  }>();
  const [appDetails, setAppDetails] = useState<IAppLIst>({} as IAppLIst);
  const [isStoreConnected, setIsStoreConnected] = useState<boolean>(false);
  const [isStoreDetailsEditable, setIsStoreDetailsEditable] =
    useState<boolean>(true);
  const [isUninstallAppModalVisible, setisUninstallAppModalVisible] =
    useState<boolean>(false);
  const [isDisconnectAppModalVisible, setIsDisconnectAppModalVisible] =
    useState<boolean>(false);
  const [isConnectingModalVisible, setIsConnectingModalVisible] =
    useState<boolean>(false);

  const getAppById = useGetAppById(workspaceId, id);

  const uninstallApp = useUninstallApp(workspaceId);

  const createContentfulStore = useCreateContentfulStore(workspaceId);
  const listContentfulStore = useListContentfulStore(workspaceId);
  const deleteContentfulStore = useDeleteContentfulStore(workspaceId);
  const updateContentfulStore = useUpdateContentfulStore();

  useError({
    mutation: createContentfulStore,
    entity: t('common.labels.store'),
  });

  const onAppUninstallButtonClick = () => {
    uninstallApp.mutate(appDetails?.id);
  };

  const toggleUninstallAppModal = (val: boolean) =>
    setisUninstallAppModalVisible(val);

  const toggleDisconnectAppModal = (val: boolean) =>
    setIsDisconnectAppModalVisible(val);

  const onBackButtonClick = () => {
    if (isStoreConnected) {
      setIsStoreDetailsEditable(false);
    } else {
      history.push(`/workspaces/${workspaceId}/apps`);
    }
  };

  const onHeaderBackButtonClick = () => {
    history.push(`/workspaces/${workspaceId}/apps`);
  };

  const onEditStoreClick = () => {
    setIsStoreDetailsEditable(true);
  };

  const onFinish = async (data: IContentfulStore) => {
    if (isStoreConnected && listContentfulStore.data) {
      const mutationData = {} as IContentfulStore;
      mutationData['spaceId'] = data.spaceId;
      if (!data.accessToken.includes('*')) {
        mutationData['accessToken'] = data.accessToken;
      } else {
        mutationData['accessToken'] = listContentfulStore.data.accessToken;
      }
      mutationData['integrationEnvironmentId'] = data.integrationEnvironmentId;
      updateContentfulStore.mutate({
        workspaceId: workspaceId,
        storeId: listContentfulStore.data && listContentfulStore.data.id,
        store: mutationData,
      });
    } else {
      createContentfulStore.mutate(data);
      setIsConnectingModalVisible(true);
    }
  };

  const onDisconnectButtonClick = () => {
    deleteContentfulStore.mutate(
      listContentfulStore.data && listContentfulStore.data.id
    );
  };

  useEffect(() => {
    if (listContentfulStore.isSuccess) {
      if (listContentfulStore.data) {
        setIsStoreConnected(true);
        setIsStoreDetailsEditable(false);
        form.setFieldsValue({
          spaceId: listContentfulStore.data.spaceId,
          accessToken: '********',
          integrationEnvironmentId:
            listContentfulStore.data.integrationEnvironmentId,
        });
      }
    }
    //eslint-disable-next-line
  }, [listContentfulStore.isSuccess, listContentfulStore.data]);

  useEffect(() => {
    if (getAppById.isSuccess) {
      if (getAppById.data) {
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
    if (createContentfulStore.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.app_connected_successfully')
      );
      setIsStoreConnected(true);
      setIsStoreDetailsEditable(false);
      listContentfulStore.refetch();
      setIsConnectingModalVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createContentfulStore.isSuccess]);

  useEffect(() => {
    if (deleteContentfulStore.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.app_disconnected_successfully')
      );
      setIsStoreDetailsEditable(true);
      setIsStoreConnected(false);
      form.resetFields();
      listContentfulStore.refetch();
      toggleDisconnectAppModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteContentfulStore.isSuccess]);

  useEffect(() => {
    if (updateContentfulStore.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      setIsStoreDetailsEditable(false);
      listContentfulStore.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateContentfulStore.isSuccess]);

  return {
    t,
    form,
    appDetails,
    onFinish,
    onBackButtonClick,
    onAppUninstallButtonClick,
    isFormSubmitting:
      createContentfulStore.isLoading || updateContentfulStore.isLoading,
    isAppUninstallIsLoading: uninstallApp.isLoading,
    isUninstallAppModalVisible,
    isStoreConnected,
    isStoreDetailsEditable,
    onEditStoreClick,
    onDisconnectButtonClick,
    isAppDisconnectingIsLoading: deleteContentfulStore.isLoading,
    isDetailsLoading: listContentfulStore.isLoading,
    isDisconnectAppModalVisible,
    isConnectingModalVisible,
    toggleDisconnectAppModal,
    toggleUninstallAppModal,
    onHeaderBackButtonClick,
  };
};
export default useAppInstalledComponentController;
