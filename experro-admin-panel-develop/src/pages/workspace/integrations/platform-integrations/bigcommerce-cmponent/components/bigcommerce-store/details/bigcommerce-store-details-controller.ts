import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import {
  useDeleteBigcommerceStore,
  useDetailsBigcommerceStore,
  useDetailsBigcommerceStoreStatistics,
  useListBigcommerceStoreSyncLog,
  useReSyncBigcommerceStore,
} from '../../../../services/bigcommerce-store';
import usePermissions from '../../../../../../../../hooks/permissions/permissions';
import { IBigcommerceStoreSyncLog } from '../../../../../../../../types';
import useUser from '../../../../../../../../hooks/user';
import { useListAllUser } from '../../../../../../media-manager/services/user';
import useError from '../../../../../../../../hooks/error';
import {
  openNotificationWithIcon,
  convertAndFormatDate,
} from '../../../../../../../../utills';

const useBigcommerceStoreDetailsController = () => {
  const { t } = useTranslation();
  const { workspaceId, id, categoryId, storeId } = useParams<{
    workspaceId: string;
    id: string;
    categoryId: string;
    storeId: string;
  }>();
  const { canDeleteEcommerceStore, canUpdateEcommerceStore } = usePermissions();
  const history = useHistory();

  const [storeName, setStoreName] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [lastSynced, setLastSynced] = useState<string>('');
  // const [activeTabKey, setActiveTabKey] = useState<string>('1');
  const [allLogs, setAllLogs] = useState<IBigcommerceStoreSyncLog[]>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [isSyncModalVisible, setIsSyncModalVisible] = useState<boolean>(false);
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

  const toggleDeleteModal = (val: boolean) => setIsDeleteModalVisible(val);

  const toggleSyncModal = (val: boolean) => setIsSyncModalVisible(val);

  // const changeTab = (activeTabKey: string) => {
  //   setActiveTabKey(activeTabKey);
  // };

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
    setIsSyncModalVisible(false);
    reSyncStore.mutate({ workspaceId, storeId });

    apiCallInterval = setInterval(refetchStatistics, 30000);

    intervalIdRef.current = apiCallInterval;

    setTimeout(() => {
      getStoreStatistics.refetch();
    }, 2000);
  };

  const goToStoreListPage = () => {
    history.push(
      `/workspaces/${workspaceId}/platforms/bigcommerce/${id}/${categoryId}/installed`
    );
  };

  useEffect(() => {
    if (storeDetails.isSuccess) {
      setStoreName(storeDetails.data?.storeName);
      setUserName(
        `${
          listAllUser.data?.filter(
            (user) => user.id === storeDetails.data?.modifiedBy
          )[0].firstName
        } ${
          listAllUser.data?.filter(
            (user) => user.id === storeDetails.data?.modifiedBy
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
        t('common.messages.store_deleted_successfully')
      );
      history.push(
        `/workspaces/${workspaceId}/platforms/bigcommerce/${id}/${categoryId}/installed`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteBigcommerceStore.isSuccess, history, t]);

  useEffect(() => {
    if (getStoreStatistics.isSuccess) {
      // @ts-ignore
      setLastSynced(
        convertAndFormatDate(
          getStoreStatistics.data?.lastSyncedAt,

          user?.user?.timezone,

          'DD MMM YYYY, hh:mm A'
        )
      );
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

  return {
    t,
    storeName,
    user,
    storeDetails,
    userName,
    lastSynced,
    isSyncFailed: reSyncStore.isError,
    removeBigcommerceStore,
    deleteBigcommerceStore,
    getStoreStatistics,
    onReSyncStore,
    // changeTab,
    // activeTabKey,
    storeSyncLogs,
    refreshStoreSyncLog,
    allLogs,
    isDeleteModalVisible,
    goToStoreListPage,
    canDeleteEcommerceStore,
    canUpdateEcommerceStore,
    isSyncButtonDisabled,
    isSyncModalVisible,
    toggleDeleteModal,
    toggleSyncModal,
  };
};

export default useBigcommerceStoreDetailsController;
