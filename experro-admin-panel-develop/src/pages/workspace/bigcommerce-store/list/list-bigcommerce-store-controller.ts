import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import useWorkspaceRoute from '../../../../hooks/workspace-route';
import { IWorkspaceParams, RowRecord } from '../../../../types';
import { GRID_RENDERER_TYPE, SIDEBAR_KEYS } from '../../../../utills';
import usePermissions from '../../../../hooks/permissions/permissions';
import { useListBigcommerceStore } from '../../../../apis/bigcommerce-store';
import { useListAllUser } from '../../../../apis/user';
import { useGetEnvironments } from '../../../../apis/content-library';

interface IUseListBigcommerceStoreController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useListBigcommerceStoreController = ({
  onMainSidebarActiveItem,
}: IUseListBigcommerceStoreController) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const { push } = useWorkspaceRoute();

  const permissions = usePermissions();
  const listStore = useListBigcommerceStore(workspaceId);
  const listAllUser = useListAllUser();
  const listEnvironment = useGetEnvironments(workspaceId);
  const [addedEnvironmentsOfStores, setAddedEnvironmentsOfStores] = useState<
    string[]
  >([]);

  const onAddStore = useCallback(() => {
    push('/bigcommerce-store/create');
  }, [push]);

  const onEditClick = useCallback(
    (storeId: string) => {
      push(`/bigcommerce-store/${storeId}`);
    },
    [push]
  );

  const menuList = useMemo(() => {
    const menuItems = [];

    if (permissions.canUpdateEcommerceStore()) {
      menuItems.push({
        key: 'Edit Button',
        onClick: onEditClick,
        label: t('common.labels.edit'),
      });
    }

    return menuItems;
  }, [onEditClick, t, permissions]);

  const storeNameOptions = useMemo(
    () => ({
      getText: (record: RowRecord): string => {
        return `${record.storeName}`;
      },
      getLink: (record: RowRecord) =>
        `/workspaces/${workspaceId}/bigcommerce-store/${record.id}/details`,
      className: 'text-blue',
      menuList,
      key: 'id',
    }),
    [menuList, workspaceId]
  );

  const storeIdOptions = useMemo(
    () => ({
      getText: (record: RowRecord): string => {
        return `${record.id}`;
      },
      key: 'id',
    }),
    []
  );

  const storeEnvironmentOptions = useMemo(
    () => ({
      getText: (record: RowRecord): string => {
        const environmentNames: string[] = [];

        // @ts-ignore
        record.environmentIds.forEach((env) => {
          environmentNames.push(
            // @ts-ignore
            listEnvironment.data?.filter(
              (environment) => environment.id === env
            )[0].title
          );
        });
        return environmentNames.join(', ');
      },
      key: 'id',
    }),
    [listEnvironment.data]
  );

  const modifiedByOptions = useMemo(
    () => ({
      getText: (record: RowRecord): string => {
        const user = listAllUser.data?.filter(
          (users) => users.id === record.modifiedBy
        );
        if (user?.length) {
          return `${user?.[0].firstName} ${user?.[0].lastName}`;
        } else {
          return '-';
        }
      },
      className: 'text-blue',
      key: 'id',
    }),
    [listAllUser.data]
  );

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.name'),
        dataIndex: 'storeName',
        key: 'storeName',
        width: '25%',
        rendererType: GRID_RENDERER_TYPE.MENU,
        rendererProps: storeNameOptions,
      },
      {
        title: t('common.labels.environment'),
        dataIndex: 'environmentId',
        key: 'environmentId',
        width: '25%',
        rendererType: GRID_RENDERER_TYPE.CUSTOM,
        rendererProps: storeEnvironmentOptions,
      },
      {
        title: t('common.labels.modified_by'),
        dataIndex: 'modifiedBy',
        key: 'modifiedBy',
        width: '25%',
        rendererType: GRID_RENDERER_TYPE.CUSTOM,
        rendererProps: modifiedByOptions,
      },
      {
        title: t('common.labels.id'),
        dataIndex: 'storeId',
        key: 'storeId',
        width: '25%',
        rendererType: GRID_RENDERER_TYPE.CUSTOM,
        rendererProps: storeIdOptions,
      },
    ],
    [
      storeIdOptions,
      storeNameOptions,
      modifiedByOptions,
      storeEnvironmentOptions,
      t,
    ]
  );

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

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    t,
    onAddStore,
    columns,
    workspaceId,
    // canCreateStore: permissions.canCreateBigcommerceStore(),
    permissions,
    listStore,
    listEnvironment,
    addedEnvironmentsOfStores,
  };
};

export default useListBigcommerceStoreController;
