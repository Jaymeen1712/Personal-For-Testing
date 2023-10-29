import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  useDeleteStore,
  useGetStoreById,
  useStoreStatistics,
  useReSyncStore,
  useShopifyStoreSyncLog,
} from '../../../services';
import { useEffect, useRef, useState } from 'react';
import { openNotificationWithIcon } from '../../../../../../../utills';
import { useListAllUser } from '../../../../../media-manager/services/user';
import { IBigcommerceStoreSyncLog } from '../../../../../../../types';
import usePermissions from '../../../../../../../hooks/permissions/permissions';

const useStatisticsComponentController = () => {
  const history = useHistory();
  const listAllUser = useListAllUser();
  const { t } = useTranslation();
  const { workspaceId, id, categoryId, storeId } = useParams<{
    workspaceId: string;
    id: string;
    categoryId: string;
    storeId: string;
  }>();

  const { canUpdateEcommerceStore, canDeleteEcommerceStore } = usePermissions();

  const [userName, setUserName] = useState<string>();

  const [isSyncButtonDisabled, setIsSyncButtonDisabled] =
    useState<boolean>(false);

  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);

  const [isSyncModalVisible, setIsSyncModalVisible] = useState<boolean>(false);

  const [lastSyncAt, setLastSyncAt] = useState<string>('');

  const [allLogs, setAllLogs] = useState<IBigcommerceStoreSyncLog[]>();

  let apiCallInterval: ReturnType<typeof setInterval>;

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>();

  const deleteStore = useDeleteStore(workspaceId);

  const getStoreDetail = useGetStoreById(workspaceId, storeId);

  const getStoreStatistics = useStoreStatistics(workspaceId, storeId);

  const reSyncStore = useReSyncStore(workspaceId);

  const storeSyncLogs = useShopifyStoreSyncLog(workspaceId, storeId);

  const onDeleteStoreButtonClick = () => {
    setIsDeleteModalVisible(true);
  };

  const onConfirmDeleteStoreButtonClick = () => {
    deleteStore.mutate(storeId);
  };

  const hideDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  const refetchStatistics = () => {
    getStoreStatistics.refetch();
  };

  const onReSyncStore = () => {
    clearInterval(intervalIdRef.current);

    setIsSyncButtonDisabled(true);
    setIsSyncModalVisible(false);
    reSyncStore.mutate(storeId);

    apiCallInterval = setInterval(refetchStatistics, 30000);

    intervalIdRef.current = apiCallInterval;

    setTimeout(() => {
      getStoreStatistics.refetch();
    }, 2000);
  };

  const refreshStoreSyncLog = () => {
    const logs: IBigcommerceStoreSyncLog[] = [];
    storeSyncLogs.refetch().then((latestLogs) => {
      latestLogs.data?.forEach((log) => {
        logs.push({
          timestamp: log.timestamp,
          type: log.logType,
          // syncId: log.syncId,
          message: log.message,
        });
      });
      setAllLogs(logs);
    });
  };

  const onBackButtonClick = () => {
    history.push(
      `/workspaces/${workspaceId}/platforms/shopify/${id}/${categoryId}/installed`
    );
  };

  const duration = (date: string) => {
    const sec = Math.floor(
      Math.abs(new Date().valueOf() - new Date(date).valueOf()) / 1000
    );

    if (!date) {
      return;
    }

    if (sec <= 60) {
      return `${sec} ${t('common.labels.sec')}`;
    }

    const minutes = Math.floor(sec / 60);
    if (minutes <= 60) {
      return `${minutes} ${
        minutes === 1 ? t('common.labels.minute') : t('common.labels.minutes')
      }`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours <= 60) {
      return `${hours} ${
        hours === 1 ? t('common.labels.hour') : t('common.labels.hours')
      }`;
    }

    const days = Math.floor(hours / 24);
    return `${days} ${
      hours === 1 ? t('common.labels.day') : t('common.labels.days')
    }`;
  };

  const toggleSyncModal = (val: boolean) => setIsSyncModalVisible(val);

  useEffect(() => {
    if (getStoreStatistics.isSuccess) {
      // @ts-ignore
      setLastSyncAt(duration(getStoreStatistics.data?.lastSyncedAt));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStoreStatistics.isSuccess]);

  useEffect(() => {
    if (deleteStore.isSuccess) {
      openNotificationWithIcon('success', 'Store remove successfully.');
      history.push(
        `/workspaces/${workspaceId}/platforms/shopify/${id}/${categoryId}/installed`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteStore.isSuccess]);

  useEffect(() => {
    if (deleteStore.isError) {
      openNotificationWithIcon('error', 'Error in store remove.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteStore.isError]);

  useEffect(() => {
    if (getStoreDetail.isSuccess) {
      setUserName(
        `${
          listAllUser.data?.filter(
            (user) => user.id === getStoreDetail.data?.modifiedBy
          )[0].firstName
        } ${
          listAllUser.data?.filter(
            (user) => user.id === getStoreDetail.data?.modifiedBy
          )[0].lastName
        }`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStoreDetail.isSuccess]);

  useEffect(() => {
    if (reSyncStore.isSuccess || reSyncStore.isError) {
      setIsSyncButtonDisabled(false);
    }
  }, [reSyncStore.isSuccess, reSyncStore.isError]);

  useEffect(() => {
    // eslint-disable-next-line
    apiCallInterval = setInterval(refetchStatistics, 30000);

    intervalIdRef.current = apiCallInterval;

    return () => {
      clearInterval(intervalIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (storeSyncLogs.isSuccess) {
      const logs: IBigcommerceStoreSyncLog[] = [];
      storeSyncLogs.data.forEach((log) => {
        logs.push({
          timestamp: log.timestamp,
          type: log.logType,
          // syncId: log.syncId,
          message: log.message,
        });
      });
      setAllLogs(logs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeSyncLogs.isSuccess]);

  return {
    onBackButtonClick,
    t,
    onDeleteStoreButtonClick,
    getStoreDetail,
    getStoreStatistics,
    userName,
    onReSyncStore,
    isSyncButtonDisabled,
    isDeleteModalVisible,
    isDeleteStoreIsLoading: deleteStore.isLoading,
    onConfirmDeleteStoreButtonClick,
    hideDeleteModal,
    lastSyncAt,
    isSyncModalVisible,
    toggleSyncModal,
    storeSyncLogs,
    refreshStoreSyncLog,
    allLogs,
    canUpdateEcommerceStore,
    canDeleteEcommerceStore,
  };
};
export default useStatisticsComponentController;
