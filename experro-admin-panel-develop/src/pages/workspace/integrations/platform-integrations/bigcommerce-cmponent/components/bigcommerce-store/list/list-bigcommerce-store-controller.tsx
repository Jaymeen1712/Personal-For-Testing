import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';

import { IBigcommerceStore } from '../../../../../../../../types';
import usePermissions from '../../../../../../../../hooks/permissions/permissions';
import {
  useDeleteBigcommerceStore,
  useListBigcommerceStore,
} from '../../../../services/bigcommerce-store';
import { useListAllUser } from '../../../../../../media-manager/services/user';
import { useGetEnvironments } from '../../../../../../content-library/services';
import { Button, Dropdown, Menu } from 'antd';
import EllipsisIcon from '../../../../../../../../images/icons/ellipsis-icon';
import useError from '../../../../../../../../hooks/error/error';
import { openNotificationWithIcon } from '../../../../../../../../utills';

const useListBigcommerceStoreController = () => {
  const { t } = useTranslation();
  const { workspaceId, id, categoryId } = useParams<{
    workspaceId: string;
    id: string;
    categoryId: string;
  }>();
  const history = useHistory();

  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [deleteStoreId, setDeleteStoreId] = useState<string>('');

  const {
    canUpdateEcommerceStore,
    canCreateEcommerceStore,
    canReadEcommerceStore,
    canDeleteEcommerceStore,
  } = usePermissions();
  const listStore = useListBigcommerceStore(workspaceId);
  const listAllUser = useListAllUser();
  const listEnvironment = useGetEnvironments(workspaceId);
  const [addedEnvironmentsOfStores, setAddedEnvironmentsOfStores] = useState<
    string[]
  >([]);

  const onAddStore = () => {
    history.push('installed/add-store');
  };

  const onEditClick = useCallback(
    (storeId: string) => {
      history.push(`installed/add-store?storeId=${storeId}`);
    },
    [history]
  );

  const onRemoveClick = (storeId: string) => {
    setDeleteStoreId(storeId);
    setIsDeleteModalVisible(true);
  };

  const toggleRemoveStoreModal = (val: boolean) => setIsDeleteModalVisible(val);

  const deleteBigcommerceStore = useDeleteBigcommerceStore();

  const removeBigcommerceStore = () => {
    deleteBigcommerceStore.mutate({ workspaceId, storeId: deleteStoreId });
    setIsDeleteModalVisible(false);
  };

  useError({
    mutation: deleteBigcommerceStore,
    entity: t('common.labels.delete_store_title'),
  });

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.name'),
        dataIndex: 'storeName',
        key: 'storeName',
        width: '25%',
        render: (storeName: string, storeData: IBigcommerceStore) => {
          return (
            <>
              <div className="ant-row ant-space-align-center ant-row-space-between w-100 table-text-button">
                <div className="table-text">
                  <div className="text-truncate with-pixel text-blue">
                    {/* @ts-ignore */}
                    <Link
                      to={`/workspaces/${workspaceId}/platforms/bigcommerce/${id}/${categoryId}/installed/${storeData.id}/statistics`}>
                      {storeName}
                    </Link>
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
                            // @ts-ignore
                            <Menu.Item
                              onClick={() => onEditClick(storeData.id)}>
                              {t('common.labels.edit')}
                            </Menu.Item>
                          )}
                          {canDeleteEcommerceStore() && (
                            <Menu.Item>
                              <Button
                                type="text"
                                className="text-red"
                                onClick={() => onRemoveClick(storeData.id)}>
                                {t('common.labels.remove')}
                              </Button>
                            </Menu.Item>
                          )}
                        </Menu>
                      </div>
                    }>
                    <Button
                      type="text"
                      size="small"
                      className="on-hover"
                      icon={<EllipsisIcon />}
                      style={{ float: 'right' }}
                    />
                  </Dropdown>
                )}
              </div>
            </>
          );
        },
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
    ],
    [
      canDeleteEcommerceStore,
      canUpdateEcommerceStore,
      categoryId,
      id,
      listAllUser.data,
      listEnvironment.data,
      onEditClick,
      workspaceId,
      t,
    ]
  );

  useEffect(() => {
    if (deleteBigcommerceStore.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.store_deleted_successfully')
      );
      setAddedEnvironmentsOfStores([]);
      listStore.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteBigcommerceStore.isSuccess]);

  useEffect(() => {
    if (listStore.isSuccess) {
      listStore.data?.forEach((store) => {
        store.environmentIds.forEach((env) => {
          if (
            !addedEnvironmentsOfStores?.some(
              (environment) => env === environment
            )
          ) {
            setAddedEnvironmentsOfStores((previous) => [...previous, env]);
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listStore.isSuccess]);

  return {
    t,
    onAddStore,
    columns,
    workspaceId,
    canCreateEcommerceStore,
    listStore,
    listEnvironment,
    addedEnvironmentsOfStores,
    canReadEcommerceStore,
    isDeleteModalVisible,
    toggleRemoveStoreModal,
    removeBigcommerceStore,
    deleteBigcommerceStore,
  };
};

export default useListBigcommerceStoreController;
