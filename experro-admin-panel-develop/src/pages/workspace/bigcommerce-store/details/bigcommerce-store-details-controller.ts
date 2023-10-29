import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import {
  useDeleteBigcommerceStore,
  useDetailsBigcommerceStore,
  useDetailsBigcommerceStoreStatistics,
  useListBigcommerceStoreSyncLog,
  useReSyncBigcommerceStore,
} from '../../../../apis/bigcommerce-store';
import usePermissions from '../../../../hooks/permissions/permissions';
import { IBigcommerceStoreSyncLog } from '../../../../types';
import useUser from '../../../../hooks/user';
import { useListAllUser } from '../../../../apis/user';
import useWorkspaceRoute from '../../../../hooks/workspace-route';
import useError from '../../../../hooks/error';
import { openNotificationWithIcon, SIDEBAR_KEYS } from '../../../../utills';

interface IParams {
  workspaceId: string;
  storeId: string;
}

interface IUseBigcommerceStoreDetailsController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useBigcommerceStoreDetailsController = ({
  onMainSidebarActiveItem,
}: IUseBigcommerceStoreDetailsController) => {
  const { t } = useTranslation();
  const { workspaceId, storeId } = useParams<IParams>();
  const { push } = useWorkspaceRoute();
  const permissions = usePermissions();

  const [storeName, setStoreName] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [lastSynced, setLastSynced] = useState<string>('');
  const [activeTabKey, setActiveTabKey] = useState<string>('1');
  const [allLogs, setAllLogs] = useState<IBigcommerceStoreSyncLog[]>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [isSyncButtonDisabled, setIsSyncButtonDisabled] =
    useState<boolean>(false);

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>();

  const listAllUser = useListAllUser();
  const user = useUser();
  const storeDetails = useDetailsBigcommerceStore(storeId, workspaceId);
  const getStoreStatistics = useDetailsBigcommerceStoreStatistics(
    workspaceId,
    storeId
  );
  const reSyncStore = useReSyncBigcommerceStore();
  const storeSyncLogs = useListBigcommerceStoreSyncLog(workspaceId, storeId);
  const deleteBigcommerceStore = useDeleteBigcommerceStore();
  let apiCallInterval: ReturnType<typeof setInterval>;

  useError({
    mutation: deleteBigcommerceStore,
    entity: t('common.labels.delete_store_title'),
  });

  useError({
    mutation: reSyncStore,
    entity: t('common.labels.delete_store_title'),
  });

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

  const showModal = () => {
    setIsDeleteModalVisible(true);
  };

  const hideDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  const changeTab = (activeTabKey: string) => {
    setActiveTabKey(activeTabKey);
  };

  const refreshStoreSyncLog = () => {
    const logs: IBigcommerceStoreSyncLog[] = [];
    storeSyncLogs.refetch().then((latestLogs) => {
      latestLogs.data?.forEach((log) => {
        logs.push({
          timestamp: log.timestamp,
          type: log.type,
          // syncId: log.syncId,
          message: log.message,
        });
      });
      setAllLogs(logs);
    });
  };

  const removeBigcommerceStore = () => {
    deleteBigcommerceStore.mutate({ workspaceId, storeId });
  };

  const refetchStatistics = () => {
    getStoreStatistics.refetch();
  };

  const onReSyncStore = () => {
    clearInterval(intervalIdRef.current);

    setIsSyncButtonDisabled(true);

    reSyncStore.mutate({ workspaceId, storeId });

    apiCallInterval = setInterval(refetchStatistics, 30000);

    intervalIdRef.current = apiCallInterval;

    setTimeout(() => {
      getStoreStatistics.refetch();
    }, 2000);
  };

  const goToStoreListPage = () => {
    push('/bigcommerce-store');
  };

  useEffect(() => {
    if (storeDetails.isSuccess) {
      setStoreName(storeDetails.data?.storeName);
      setUserName(
        `${
          listAllUser.data?.filter(
            (user) => user.id === storeDetails.data?.createdBy
          )[0].firstName
        } ${
          listAllUser.data?.filter(
            (user) => user.id === storeDetails.data?.createdBy
          )[0].lastName
        }`
      );
      // @ts-ignore
      // setLastSynced(duration(storeDetails.data?.lastSyncedAt));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDetails.isSuccess]);

  useEffect(() => {
    if (deleteBigcommerceStore.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      push('/bigcommerce-store');
    }
  }, [deleteBigcommerceStore.isSuccess, push, t]);

  useEffect(() => {
    if (getStoreStatistics.isSuccess) {
      // @ts-ignore
      setLastSynced(duration(getStoreStatistics.data?.lastSyncedAt));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStoreStatistics.isSuccess]);

  useEffect(() => {
    // eslint-disable-next-line
    apiCallInterval = setInterval(refetchStatistics, 30000);

    intervalIdRef.current = apiCallInterval;

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (storeSyncLogs.isSuccess) {
      const logs: IBigcommerceStoreSyncLog[] = [];
      storeSyncLogs.data.forEach((log) => {
        logs.push({
          timestamp: log.timestamp,
          type: log.type,
          // syncId: log.syncId,
          message: log.message,
        });
      });
      setAllLogs(logs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeSyncLogs.isSuccess]);

  useEffect(() => {
    if (reSyncStore.isSuccess || reSyncStore.isError) {
      setIsSyncButtonDisabled(false);
    }
  }, [reSyncStore.isSuccess, reSyncStore.isError]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    t,
    storeName,
    user,
    storeDetails,
    userName,
    lastSynced,
    removeBigcommerceStore,
    deleteBigcommerceStore,
    getStoreStatistics,
    onReSyncStore,
    changeTab,
    activeTabKey,
    storeSyncLogs,
    refreshStoreSyncLog,
    allLogs,
    isDeleteModalVisible,
    hideDeleteModal,
    showModal,
    goToStoreListPage,
    permissions,
    isSyncButtonDisabled,
  };
};

export default useBigcommerceStoreDetailsController;
