import { useEffect, useState } from 'react';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import { IBigcommerceStore } from '../../../../../../../../types';
import {
  useCreateBigcommerceStore,
  useDetailsBigcommerceStore,
  useListBigcommerceStore,
  useUpdateBigcommerceStore,
} from '../../../../services/bigcommerce-store';
import useError from '../../../../../../../../hooks/error';
import { useGetEnvironments } from '../../../../../../content-library/services';
import { openNotificationWithIcon } from '../../../../../../../../utills';
import useQuery from '../../../../../../../../hooks/queryParameter';

interface IFIeldFlags {
  accessToken?: boolean;
  clientId?: boolean;
  clientSecret?: boolean;
  environmentIds?: boolean;
  storeHash?: boolean;
  storeName?: boolean;
}

const useCreateUpdateBigcommerceStore = () => {
  const { t } = useTranslation();
  const { workspaceId, id, categoryId } = useParams<{
    workspaceId: string;
    id: string;
    categoryId: string;
  }>();
  const [form] = Form.useForm();
  const history = useHistory();
  const query = useQuery();

  const storeId = query.get('storeId') as string;

  const createBigcommerceStore = useCreateBigcommerceStore(workspaceId);
  const updateBigcommerceStore = useUpdateBigcommerceStore();
  const getBigcommerceStore = useDetailsBigcommerceStore(storeId, workspaceId);
  const listStore = useListBigcommerceStore(workspaceId);
  const listEnvironment = useGetEnvironments(workspaceId);
  const [isConnectingModalVisible, setIsConnectingModalVisible] =
    useState(false);

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
    const valueObj = {} as IBigcommerceStore;
    if (storeId) {
      if (!values.accessToken.includes('*')) {
        valueObj.accessToken = values.accessToken;
      }
      if (!values.clientId.includes('*')) {
        valueObj.clientId = values.clientId;
      }
      if (!values.clientSecret.includes('*')) {
        valueObj.clientSecret = values.clientSecret;
      }

      updateBigcommerceStore.mutate({
        store: {
          // @ts-ignore
          storeDetails: { ...valueObj },
          ecommerceProvider: 'BIGCOMMERCE',
        },
        workspaceId: workspaceId,
        storeId: storeId,
      });
    } else {
      createBigcommerceStore.mutate({
        storeDetails: { ...values },
        ecommerceProvider: 'BIGCOMMERCE',
      });
      setIsConnectingModalVisible(true);
    }
  };

  useEffect(() => {
    if (createBigcommerceStore.isSuccess) {
      form.resetFields();
      openNotificationWithIcon(
        'success',
        t('common.messages.store_added_successfully')
      );
      listStore.refetch();
      history.push(
        `/workspaces/${workspaceId}/platforms/bigcommerce/${id}/${categoryId}/installed`
      );
      setIsConnectingModalVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createBigcommerceStore.isSuccess]);

  useEffect(() => {
    if (createBigcommerceStore.isError) {
      setIsConnectingModalVisible(false);
    }
  }, [createBigcommerceStore.isError]);

  useEffect(() => {
    if (updateBigcommerceStore.isSuccess) {
      form.resetFields();
      openNotificationWithIcon(
        'success',
        t('common.messages.store_updated_successfully')
      );
      history.push(
        `/workspaces/${workspaceId}/platforms/bigcommerce/${id}/${categoryId}/installed`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateBigcommerceStore.isSuccess]);

  useEffect(() => {
    if (listStore.isSuccess) {
      console.log(listStore.data);
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

  const onCancel = () => {
    history.push(
      `/workspaces/${workspaceId}/platforms/bigcommerce/${id}/${categoryId}/installed`
    );
  };

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
    isConnectingModalVisible,
  };
};

export default useCreateUpdateBigcommerceStore;
