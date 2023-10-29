import { useCallback, useEffect, useState } from 'react';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import useWorkspaceRoute from '../../../../hooks/workspace-route';
import { IBigcommerceStore, IWorkspaceParams } from '../../../../types';
import {
  useCreateBigcommerceStore,
  useDetailsBigcommerceStore,
  useListBigcommerceStore,
  useUpdateBigcommerceStore,
} from '../../../../apis/bigcommerce-store';
import useError from '../../../../hooks/error';
import { useGetEnvironments } from '../../../../apis/content-library';
import { openNotificationWithIcon, SIDEBAR_KEYS } from '../../../../utills';
// import { generateInternalFieldName } from '../../../../utills';

interface IParams {
  storeId?: string;
}

interface IFIeldFlags {
  accessToken?: boolean;
  clientId?: boolean;
  clientSecret?: boolean;
  environmentIds?: boolean;
  storeHash?: boolean;
  storeName?: boolean;
}

interface IUseCreateUpdateBigcommerceStore {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useCreateUpdateBigcommerceStore = ({
  onMainSidebarActiveItem,
}: IUseCreateUpdateBigcommerceStore) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [form] = Form.useForm();
  const { push } = useWorkspaceRoute();
  const { storeId } = useParams<IParams>();

  const createBigcommerceStore = useCreateBigcommerceStore(workspaceId);
  const updateBigcommerceStore = useUpdateBigcommerceStore();
  const getBigcommerceStore = useDetailsBigcommerceStore(storeId, workspaceId);
  const listStore = useListBigcommerceStore(workspaceId);
  const listEnvironment = useGetEnvironments(workspaceId);

  const [isSaveButtonVisible, setIsSaveButtonVisible] =
    useState<boolean>(false);

  const [addedEnvironmentsOfStores, setAddedEnvironmentsOfStores] = useState<
    string[]
  >([]);

  useError({
    mutation: createBigcommerceStore,
    entity: t('common.labels.store'),
  });

  useError({
    mutation: updateBigcommerceStore,
    entity: t('common.labels.store'),
  });

  // @ts-ignore
  const onValuesChange = (values: IFIeldFlags, allValues: IFIeldFlags) => {
    if (
      !allValues.storeHash ||
      !allValues.storeName ||
      !allValues.clientId ||
      !allValues.clientSecret ||
      !allValues.accessToken ||
      !allValues.environmentIds
    ) {
      setIsSaveButtonVisible(true);
    } else {
      setIsSaveButtonVisible(false);
    }
  };

  const onFinish = async (values: IBigcommerceStore) => {
    if (storeId) {
      updateBigcommerceStore.mutate({ ...values, storeId, workspaceId });
    } else {
      createBigcommerceStore.mutate(values);
    }
  };

  useEffect(() => {
    if (createBigcommerceStore.isSuccess) {
      form.resetFields();
      openNotificationWithIcon(
        'success',
        t('common.messages.added_successfully')
      );
      listStore.refetch();
      push('/bigcommerce-store');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createBigcommerceStore.isSuccess]);

  useEffect(() => {
    if (updateBigcommerceStore.isSuccess) {
      form.resetFields();
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      push('/bigcommerce-store');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateBigcommerceStore.isSuccess]);

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
    if (getBigcommerceStore.isSuccess) {
      if (JSON.stringify(getBigcommerceStore.data) !== '0') {
        setIsSaveButtonVisible(true);
      } else {
        setIsSaveButtonVisible(false);
      }
    }
  }, [getBigcommerceStore.isSuccess, getBigcommerceStore.data]);

  const onCancel = useCallback(() => {
    push('/bigcommerce-store');
  }, [push]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    t,
    onCancel,
    form,
    onFinish,
    getBigcommerceStore,
    storeId,
    createBigcommerceStore,
    updateBigcommerceStore,
    listEnvironment,
    addedEnvironmentsOfStores,
    onValuesChange,
    isSaveButtonVisible,
  };
};

export default useCreateUpdateBigcommerceStore;
