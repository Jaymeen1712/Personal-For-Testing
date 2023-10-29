import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { message } from 'antd';

import {
  useBigCommerceSync,
  useGetVersionPublishQueue,
  useDeleteCache,
  useListThemeTemplate,
} from '../../services';
import usePermissionCheckForRecords from '../../utils/prermission-check-for-records';
import { ContentModelList, IListEnvironments } from '../../../../../types';
import { ContentLibraryContext } from '../../context';
import useUser from '../../../../../hooks/user';
import {
  API_QUERY_KEY,
  onSubSidebarCollapse,
  openNotificationWithIcon,
} from '../../../../../utills';
import queryClient from '../../../../../query-client';
import usePermissions from '../../../../../hooks/permissions';
import { useDeleteAllCache } from '../../services/';

const useFieldListRightSideBarController = (
  changerRightSideMenuClose: (val: string) => void,
  selectedContentModalDetails: ContentModelList,
  currentVersionId: string,
  providerIdEsi?: string,
  providerEsi?: string,
  storeHash?: string
) => {
  const { t } = useTranslation();
  const userDetails = useUser();
  const contentLibraryContext = useContext(ContentLibraryContext);
  const permissions = usePermissions();
  const history = useHistory();

  const {
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId,
    languageName,
  } = useParams<{
    workspaceId: string;
    contentModalId: string;
    contentModalDataId: string;
    versionId: string;
    languageName: string;
  }>();

  const { recordPermissionCheck } = usePermissionCheckForRecords(
    selectedContentModalDetails?.internalName
  );

  const [rightSideTabValue, setRightSideTabValue] = useState('config');

  const [publishVersionQueueContentModalId, setPublishVersionQueueId] =
    useState('');

  const [isUpdateVersionNameModalVisible, setIsUpdateVersionNameModal] =
    useState(false);

  const [VersionPublishQueue, setVersionPublishQueue] = useState<
    IListEnvironments[]
  >([]);

  const [pageTemplateList, setPageTemplateList] = useState<
    {
      template: string;
      id: string;
    }[]
  >();

  const [isSyncButtonClick, setIsSyncButtonClick] = useState(false);

  const [isPurgeAllCacheModalVisible, setIsPurgeAllCacheModalVisible] =
    useState(false);

  const [
    isSeeMoreVersionDetailsButtonVisible,
    setIsSeeMoreVersionDetailsButtonVisible,
  ] = useState({});

  const getVersionPublishQueue = useGetVersionPublishQueue(
    workspaceId,
    contentModalId,
    publishVersionQueueContentModalId
  );

  const getPageTemplateList = useListThemeTemplate(
    workspaceId,
    selectedContentModalDetails?.type
  );

  const bigCommerceSync = useBigCommerceSync(workspaceId);

  const deleteCache = useDeleteCache(workspaceId);

  const deleteAllCache = useDeleteAllCache(workspaceId);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onRightSideCollapseChange = (val: any) => {
    if (val === 'publishStatus') {
      if (!publishVersionQueueContentModalId) {
        setPublishVersionQueueId(contentModalDataId);
        getVersionPublishQueue.remove();
      }
    }
  };
  const onRightSideTabChange = (val: string) => {
    if (rightSideTabValue === val) {
      changerRightSideMenuClose('menu-close');
      setRightSideTabValue('');
    } else {
      if (val === 'publishStatus') {
        if (!publishVersionQueueContentModalId) {
          setPublishVersionQueueId(contentModalDataId);
          getVersionPublishQueue.remove();
        }
      }
      changerRightSideMenuClose('');
      setRightSideTabValue(val);
    }
  };

  const onRightMenuCloseClick = () => {
    changerRightSideMenuClose('menu-close');
    setRightSideTabValue('');
  };

  const changeUpdateVersionNameModalVisibility = (val: boolean) => {
    setIsUpdateVersionNameModal(val);
  };

  const onTemplateChange = (value: string) => {
    contentLibraryContext?.changeNewRecordFieldDetails(
      contentLibraryContext?.newRecordFieldDetails?.contentModalId,
      contentLibraryContext?.newRecordFieldDetails?.contentModalDataId,
      contentLibraryContext?.newRecordFieldDetails?.contentModalDataFieldId,
      contentLibraryContext?.newRecordFieldDetails?.versionId,
      value,
      contentLibraryContext?.newRecordFieldDetails?.language
    );
  };
  const onEditInBigCommerceButtonClick = () => {
    if (providerIdEsi) {
      if (providerEsi === 'BIGCOMMERCE') {
        if (
          selectedContentModalDetails?.internalName.split('_')[1] === 'product'
        ) {
          window.open(
            `http://login.bigcommerce.com/deep-links/products/edit/${providerIdEsi}`
          );
        } else if (
          selectedContentModalDetails?.internalName.split('_')[1] === 'brand'
        ) {
          window.open(
            `http://login.bigcommerce.com/deep-links/products/brands/${providerIdEsi}/edit`
          );
        } else if (
          selectedContentModalDetails?.internalName.split('_')[1] === 'category'
        ) {
          window.open(
            `http://login.bigcommerce.com/deep-links/products/categories/1/edit/${providerIdEsi}`
          );
        }
      } else {
        if (
          selectedContentModalDetails?.internalName.split('_')[1] === 'product'
        ) {
          window.open(
            `https://admin.shopify.com/store/${storeHash}/products/${providerIdEsi}`
          );
        } else if (
          selectedContentModalDetails?.internalName.split('_')[1] === 'category'
        ) {
          window.open(
            `https://admin.shopify.com/store/${storeHash}/collections/${providerIdEsi}`
          );
        }
      }
    }
  };

  const onSyncButtonClick = (title: string, pageSlug: string) => {
    bigCommerceSync.mutate({
      store_details: {
        id: contentModalDataId,
      },
      ecommerce_provider: providerEsi,
    });
    if (
      localStorage.getItem(`${workspaceId}/environmentId`)?.split('-')[0] ===
      'PRODUCTION'
    ) {
      setIsSyncButtonClick(true);
      deleteCache.mutate({
        pageSlug,
        contentModalId,
        contentModalDataId,
        title,
        contentModalName: selectedContentModalDetails?.name,
      });
    }
  };

  const onPurgeCacheClick = (title: string, pageSlug: string) => {
    deleteCache.mutate({
      pageSlug,
      contentModalId,
      contentModalDataId,
      title,
      contentModalName: selectedContentModalDetails?.name,
    });
  };

  const onVersionHistoryButtonClick = () => {
    contentLibraryContext?.ChangeIsFieldDirty({});
    onSubSidebarCollapse(true);
    history.push(
      `/workspaces/${workspaceId}/content-library/${selectedContentModalDetails?.type}-type/${contentModalId}/field/${contentModalDataId}/version/${versionId}/language/${languageName}/version-history/${currentVersionId}`
    );
  };

  const onPurgeAllCacheClick = () => {
    setIsPurgeAllCacheModalVisible(true);
  };

  const onPurgeAllCacheConfirm = () => {
    deleteAllCache.mutate();
  };

  const onPurgeAllCacheCancel = () => {
    setIsPurgeAllCacheModalVisible(false);
  };

  const onSeeMoreVersionDetailsButtonClick = (name?: string) => {
    if (name) {
      const tempVariable = { ...isSeeMoreVersionDetailsButtonVisible };
      //@ts-ignore
      tempVariable[name] = false;
      setIsSeeMoreVersionDetailsButtonVisible(tempVariable);
    }
  };

  useEffect(() => {
    if (getVersionPublishQueue.isSuccess) {
      if (getVersionPublishQueue.data) {
        const tempArray: IListEnvironments[] = [];
        const tempObject: { [key: string]: boolean } = {};
        contentLibraryContext?.environmentList.map((item) => {
          const secondData: IListEnvironments[] = [];
          getVersionPublishQueue.data.map((data) => {
            if (data.environmentTitle === item.title) {
              // @ts-ignore
              secondData.push(data);
            }
            return '';
          });
          tempArray.push({
            name: item.title,
            // @ts-ignore
            value: secondData,
          });
          if (secondData.length > 2) {
            tempObject[item.title] = true;
          } else {
            tempObject[item.title] = false;
          }
          return '';
        });
        setIsSeeMoreVersionDetailsButtonVisible(tempObject);
        setVersionPublishQueue([...tempArray]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getVersionPublishQueue.isSuccess]);

  useEffect(() => {
    if (getVersionPublishQueue.isError) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getVersionPublishQueue.isError]);

  useEffect(() => {
    if (getPageTemplateList.isSuccess) {
      setPageTemplateList(getPageTemplateList.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPageTemplateList.isSuccess]);

  useEffect(() => {
    if (bigCommerceSync.isSuccess) {
      if (bigCommerceSync.data) {
        openNotificationWithIcon('success', t('common.messages.sync_success'));
        queryClient.refetchQueries([
          API_QUERY_KEY.GET_RECORD_LIST,
          contentModalId,
          contentModalDataId,
          languageName,
          versionId,
        ]);
      } else {
        history.push(
          `/workspaces/${workspaceId}/content-library/collection-type/${contentModalId}/list-records`
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bigCommerceSync.isSuccess, t]);

  useEffect(() => {
    if (bigCommerceSync.isError) {
      openNotificationWithIcon('error', t('common.messages.sync_error'));
    }
  }, [bigCommerceSync.isError, t]);

  useEffect(() => {
    if (deleteCache.isSuccess) {
      if (!isSyncButtonClick) {
        message.success(t('common.messages.cache_removed_successfully'));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteCache.isSuccess]);

  useEffect(() => {
    if (deleteCache.isError) {
      message.error('Error in purge cache.');
    }
  }, [deleteCache.isError]);

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

  return {
    t,
    onRightSideCollapseChange,
    onRightSideTabChange,
    onRightMenuCloseClick,
    isUpdateVersionNameModalVisible,
    changeUpdateVersionNameModalVisibility,
    canEditVersion: recordPermissionCheck('update'),
    VersionPublishQueue,
    userList: userDetails?.listAllUser,
    languagesList: userDetails?.languagesList,
    newRecordFieldDetails: contentLibraryContext?.newRecordFieldDetails,
    pageTemplateList,
    onTemplateChange,
    onEditInBigCommerceButtonClick,
    onSyncButtonClick,
    loadingBigCommerce: bigCommerceSync.isLoading,
    onPurgeCacheClick,
    environmentId: localStorage
      .getItem(`${workspaceId}/environmentId`)
      ?.split('-')[0],
    canDeleteCache: permissions.canDeleteCache(),
    canReadCache: permissions.canReadCache(),
    onVersionHistoryButtonClick,
    isModalIsEcommerceBrand:
      selectedContentModalDetails?.internalName.includes('ecommerce_'),
    isPurgeAllCacheModalVisible,
    onPurgeAllCacheClick,
    onPurgeAllCacheCancel,
    onPurgeAllCacheConfirm,
    isSeeMoreVersionDetailsButtonVisible,
    onSeeMoreVersionDetailsButtonClick,
  };
};
export default useFieldListRightSideBarController;
