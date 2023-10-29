import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState, useMemo } from 'react';
import { useGetAppById, useUninstallApp } from '../../../../services';
import {
  useAddStore,
  useDeleteStore,
  useShopifyStoreList,
} from '../../../services';
import { openNotificationWithIcon } from '../../../../../../../utills';
import { Button, Dropdown, Menu } from 'antd';
import EllipsisIcon from '../../../../../../../images/icons/ellipsis-icon';
import { useListAllUser } from '../../../../../media-manager/services/user';
import { useGetEnvironments } from '../../../../../content-library/services';
import usePermissions from '../../../../../../../hooks/permissions/permissions';

const useAppInstalledComponentController = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const {
    canUpdateEcommerceStore,
    canCreateEcommerceStore,
    canReadEcommerceStore,
    canDeleteEcommerceStore,
  } = usePermissions();

  const { workspaceId, id } = useParams<{
    workspaceId: string;
    id: string;
  }>();

  const [storeEnvironments, setStoreEnvironments] = useState<string[]>([]);

  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);

  const [isUninstallPlatformModalVisible, setIsUninstallPlatformModalVisible] =
    useState<boolean>(false);

  const toggleUninstallModal = (val: boolean) =>
    setIsUninstallPlatformModalVisible(val);

  const [deleteStoreId, setDeleteStoreId] = useState<string>('');

  const getAppById = useGetAppById(workspaceId, id);

  const uninstallApp = useUninstallApp(workspaceId);

  const addStore = useAddStore(workspaceId);

  const deleteStore = useDeleteStore(workspaceId);

  const getShopifyStoreList = useShopifyStoreList(workspaceId);

  const listAllUser = useListAllUser();
  const listEnvironment = useGetEnvironments(workspaceId);

  const onAppUninstallButtonClick = () => {
    uninstallApp.mutate(id);
  };

  const onBackButtonClick = () => {
    history.push(`/workspaces/${workspaceId}/platforms`);
  };

  const onAddNewStoreButtonClick = () => {
    history.push('installed/add-store');
  };

  const onRemoveClick = (storeId: string) => {
    setDeleteStoreId(storeId);
    setIsDeleteModalVisible(true);
  };

  const deleteShopifyStore = () => {
    deleteStore.mutate(deleteStoreId);
  };

  const columns = useMemo(() => {
    return [
      {
        title: t('common.labels.name'),
        dataIndex: 'name',
        key: 'storeName',
        width: '25%',
        render: (name: string, { id }: { id: string }) => (
          <div
            className={`ant-row ant-row-middle ant-row-no-wrap ant-row-space-between table-text-button`}>
            <div className="table-text">
              <div
                className={'cursor-pointer text-blue'}
                style={{ color: '#4F46E5' }}
                onClick={() => history.push(`installed/${id}/statistics`)}>
                {name}
              </div>
            </div>
            {canUpdateEcommerceStore() && (
              <Dropdown
                placement="bottomRight"
                trigger={['click']}
                overlay={
                  <div className="table-dropdown">
                    <Menu>
                      {canUpdateEcommerceStore() && (
                        <Menu.Item
                          onClick={() => {
                            history.push(`installed/add-store?storeId=${id}`);
                          }}>
                          {t('common.labels.edit')}
                        </Menu.Item>
                      )}
                      {canDeleteEcommerceStore() && (
                        <Menu.Item>
                          <Button
                            type="text"
                            className="text-red"
                            onClick={() => onRemoveClick(id)}>
                            {t('common.labels.remove')}
                          </Button>
                        </Menu.Item>
                      )}
                    </Menu>
                  </div>
                }>
                <Button
                  key="recordTableEllipsisIcon"
                  size="small"
                  type="text"
                  className="on-hover"
                  icon={<EllipsisIcon />}
                  style={{ float: 'right' }}
                />
              </Dropdown>
            )}
          </div>
        ),
      },
      {
        title: t('common.labels.environment'),
        dataIndex: 'environmentId',
        key: 'environmentId',
        width: '25%',
        render: (storeName: string, storeData: object) => {
          const environmentNames: string[] = [];

          // @ts-ignore
          storeData.environmentIds.forEach((env) => {
            environmentNames.push(
              // @ts-ignore
              listEnvironment.data?.find(
                (environment) => environment.id === env
              ).title
            );
          });
          return <>{environmentNames.join(', ')}</>;
        },
      },
      {
        title: t('common.labels.modified_by'),
        dataIndex: 'modifiedBy',
        key: 'modifiedBy',
        width: '25%',
        render: (modifiedBy: string, storeData: object) => {
          const user = listAllUser.data?.find(
            (users) => users.id === modifiedBy
          );
          return <>{user ? `${user?.firstName} ${user?.lastName}` : '-'}</>;
        },
      },
      {
        title: t('common.labels.id'),
        dataIndex: 'id',
        key: 'id',
        width: '25%',
        render: (storeId: string, storeData: object) => {
          return <div>{storeId}</div>;
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, listAllUser.data, listEnvironment.data, workspaceId, t]);
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
        t('common.messages.platform_uninstalled_successfully')
      );
      history.push(`/workspaces/${workspaceId}/platforms`);
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
    if (addStore.isSuccess) {
      openNotificationWithIcon('success', 'Store added successfully');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addStore.isSuccess]);

  useEffect(() => {
    if (addStore.isError) {
      openNotificationWithIcon('error', 'Error in adding store');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addStore.isError]);

  useEffect(() => {
    if (getShopifyStoreList.isSuccess) {
      getShopifyStoreList.data?.forEach((store) => {
        store.environmentIds.forEach((env) => {
          if (!storeEnvironments?.some((environment) => env === environment)) {
            setStoreEnvironments((previous) => [...previous, env]);
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getShopifyStoreList.isSuccess]);

  useEffect(() => {
    if (getShopifyStoreList.isError) {
      openNotificationWithIcon('error', 'Error in fetching store');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getShopifyStoreList.isError]);

  const onVisitWebsiteButtonClick = () => {
    window.open('https://www.shopify.com/', '_blank');
  };

  useEffect(() => {
    if (deleteStore.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.store_deleted_successfully')
      );
      setStoreEnvironments([]);
      getShopifyStoreList.refetch();
      toggleRemoveStoreModal(false);
    }
    // eslint-disable-next-line
  }, [deleteStore.isSuccess]);

  const toggleRemoveStoreModal = (val: boolean) => setIsDeleteModalVisible(val);

  return {
    onAppUninstallButtonClick,
    onBackButtonClick,
    t,
    isAppUninstallIsLoading: uninstallApp.isLoading,
    getShopifyStoreList,
    columns,
    onAddNewStoreButtonClick,
    isUninstallPlatformModalVisible,
    toggleUninstallModal,
    onVisitWebsiteButtonClick,
    isDeleteModalVisible,
    toggleRemoveStoreModal,
    deleteShopifyStore,
    isDeleteStoreBtnLoading: deleteStore.isLoading,
    listEnvironment,
    storeEnvironments,
    canUpdateEcommerceStore,
    canCreateEcommerceStore,
    canDeleteEcommerceStore,
    canReadEcommerceStore,
  };
};
export default useAppInstalledComponentController;
