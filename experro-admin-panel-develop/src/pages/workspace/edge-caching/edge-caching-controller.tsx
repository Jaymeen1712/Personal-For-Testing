import { useTranslation } from 'react-i18next';
import { useEffect, useState, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, message, Tooltip } from 'antd';

import { IWorkspaceParams } from '../../../types';
import {
  // useUpdateCache,
  // useContentModelUpdateCache,
  useDeleteCache,
  useDeleteAllCache,
  // useGetCachingDetails,
  useGetModelList,
} from './services';
import usePermissions from '../../../hooks/permissions';
import useEnvironmentSelectorController from '../../../components/environment-select/environment-selector-controller';
import { SIDEBAR_KEYS } from '../../../utills';

interface IUseEdgeCachingController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useEdgeCachingController = ({
  onMainSidebarActiveItem,
}: IUseEdgeCachingController) => {
  let productionEnvironmentId;
  const { t } = useTranslation();
  const permissions = usePermissions();
  const history = useHistory();
  const { environmentList } = useEnvironmentSelectorController();
  if (environmentList.length > 0) {
    productionEnvironmentId = environmentList.find(
      (item) => item.id?.split('-')[0] === 'PRODUCTION'
    );
  }

  const { workspaceId } = useParams<IWorkspaceParams>();
  const [dataSource, setDataSource] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isPurgeAllCacheModalVisible, setIsPurgeAllCacheModalVisible] =
    useState(false);

  const getContentModalList = useGetModelList(
    workspaceId,
    productionEnvironmentId?.id
  );

  // const updateCache = useUpdateCache(workspaceId);

  // const contentModelUpdateCache = useContentModelUpdateCache(workspaceId);

  const contentModelDeleteCache = useDeleteCache(workspaceId);

  const deleteAllCache = useDeleteAllCache(workspaceId);

  // const getCacheDetails = useGetCachingDetails(workspaceId);

  const columns: {
    title: string;
    key: string;
    dataIndex: string;
    width: string;
  }[] = useMemo(
    () => [
      {
        title: '',
        key: 'name',
        width: 'auto',
        dataIndex: 'name',
        //@ts-ignore
        render: (id, data) => (
          <>
            <p className="m-0 cache-title">
              <i>{data.name}</i>
            </p>
          </>
        ),
      },
      {
        title: t('common.labels.action'),
        key: 'action',
        width: '8%',
        dataIndex: 'action',
        //@ts-ignore
        render: (id, data) => (
          <Tooltip
            placement="bottom"
            title={
              !permissions.canDeleteCache() &&
              t('common.messages.you_dont_have_access')
            }>
            <Button
              disabled={!permissions.canDeleteCache()}
              onClick={() => {
                contentModelDeleteCache.mutate({
                  contentModelId: data.id,
                  cacheIsLocal: data.isLocalCache,
                  contentModalName: data.name,
                });
              }}
              type="text"
              size="small"
              danger>
              {t('common.labels.purge')}
            </Button>
          </Tooltip>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataSource]
  );

  const onAllCacheDeleteClick = () => {
    deleteAllCache.mutate();
  };

  const onPurgeAllCacheClick = () => {
    setIsPurgeAllCacheModalVisible(true);
  };

  const onPurgeAllCacheCancel = () => {
    setIsPurgeAllCacheModalVisible(false);
  };

  useEffect(() => {
    if (getContentModalList.isSuccess) {
      if (getContentModalList.data.length > 0) {
        const allContentModalArray = [];
        for (let i = 0; i <= getContentModalList.data.length; i++) {
          if (getContentModalList.data[i]?.actAsWebPage) {
            if (
              getContentModalList.data[i]?.internalName.includes('ecommerce_')
            ) {
              allContentModalArray.push({
                id: getContentModalList.data[i]?.id,
                name: getContentModalList.data[i]?.name,
                isLocalCache: false,
              });
            } else {
              allContentModalArray.push({
                id: getContentModalList.data[i]?.id,
                name: getContentModalList.data[i]?.name,
                isLocalCache: true,
              });
            }
          }
        }
        setDataSource([...allContentModalArray]);
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getContentModalList.isSuccess]);

  useEffect(() => {
    if (getContentModalList.isError) {
      setIsLoading(false);
      message.error(t('common.messages.unknown_error'));
      console.log(getContentModalList.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getContentModalList.isError]);

  useEffect(() => {
    if (contentModelDeleteCache.isSuccess) {
      message.success(t('common.messages.cache_removed_successfully'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentModelDeleteCache.isSuccess]);

  useEffect(() => {
    if (contentModelDeleteCache.isError) {
      message.error(t('common.messages.unknown_error'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentModelDeleteCache.isError]);

  useEffect(() => {
    if (deleteAllCache.isSuccess) {
      message.success(t('common.messages.all_cache_remove_successfully'));
      setIsPurgeAllCacheModalVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteAllCache.isSuccess]);

  useEffect(() => {
    if (deleteAllCache.isError) {
      message.error(t('common.messages.unknown_error'));
      setIsPurgeAllCacheModalVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteAllCache.isError]);

  // useEffect(() => {
  //   if (updateCache.isSuccess) {
  //     // getCacheDetails.refetch();
  //     message.success(t('common.messages.cache_configured_successfully'));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [updateCache.isSuccess]);
  //
  // useEffect(() => {
  //   if (updateCache.isError) {
  //     message.error(t('common.messages.unknown_error'));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [updateCache.isError]);

  // useEffect(() => {
  //   if (contentModelUpdateCache.isSuccess) {
  //     message.success(t('common.messages.cache_update_successfully'));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [contentModelUpdateCache.isSuccess]);
  //
  // useEffect(() => {
  //   if (contentModelUpdateCache.isError) {
  //     message.error(t('common.messages.unknown_error'));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [contentModelUpdateCache.isError]);

  //
  // useEffect(() => {
  //   if (getCacheDetails.isSuccess) {
  //     if (getCacheDetails.data.edgeCaching) {
  //     } else {
  //       setIsLoading(false);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getCacheDetails.isSuccess, getCacheDetails.data]);
  //
  // useEffect(() => {
  //   if (getCacheDetails.isError) {
  //     message.error(t('common.messages.unknown_error'));
  //     console.log('test', getCacheDetails.error);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getCacheDetails.isError]);

  useEffect(() => {
    if (!permissions.canReadCache()) {
      history.push(`/workspaces/${workspaceId}/dashboard/traffic`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    t,
    dataSource,
    columns,
    onAllCacheDeleteClick,
    isLoading,
    canDeleteCache: permissions.canDeleteCache(),
    onPurgeAllCacheClick,
    onPurgeAllCacheCancel,
    isPurgeAllCacheModalVisible,
  };
};
export default useEdgeCachingController;
