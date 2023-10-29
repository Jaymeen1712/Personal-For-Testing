import { Form } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  IAddUpdateStore,
  IListEnvironments,
  // IShopifyStoreResponse,
} from '../../../../../../../types';
import {
  useAddStore,
  // useGetAppById,
  useGetStoreById,
  useShopifyStoreList,
  useUpdateStore,
} from '../../../services';
import useListEnvironments from '../../../../../environments/services/list';
import { openNotificationWithIcon } from '../../../../../../../utills';
import useQuery from '../../../../../../../hooks/queryParameter';

const useStoreFieldController = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { t } = useTranslation();
  const query = useQuery();
  const { workspaceId, id, categoryId } = useParams<{
    workspaceId: string;
    id: string;
    categoryId: string;
  }>();

  const [environmentList, setEnvironmentList] = useState<IListEnvironments[]>(
    []
  );

  const [isStoreUpdate, setIsStoreUpdate] = useState<boolean>(false);

  const [shopifyEnvironmentList, setShopifyEnvironmentList] = useState<
    string[]
  >([]);

  const [isSubmitButtonEnabled, setisSubmitButtonEnabled] =
    useState<boolean>(true);

  const storeId = query.get('storeId') as string;

  // const [appDetails, setAppDetails] = useState<IAppLIst>({} as IAppLIst);

  const getEnvironmentList = useListEnvironments(workspaceId);

  const addStore = useAddStore(workspaceId);

  const updateStore = useUpdateStore(workspaceId);

  // const getAppById = useGetAppById(workspaceId, id);

  const getStoreById = useGetStoreById(workspaceId, storeId);

  const getShopifyStoreList = useShopifyStoreList(workspaceId);

  const onBackButtonClick = () => {
    history.push(
      `/workspaces/${workspaceId}/platforms/shopify/${id}/${categoryId}/installed`
    );
  };

  const onConnectButtonClick = async () => {
    try {
      const result = await form.validateFields();
      if (isStoreUpdate) {
        const tempObj = {} as {
          id: string;
          storefrontAccessToken: string;
          adminAccessToken: string;
          apiKey: string;
          secretKey: string;
        };
        if (!result.adminAccessToken.includes('*')) {
          tempObj.adminAccessToken = result.adminAccessToken;
        }
        if (!result.storefrontAccessToken.includes('*')) {
          tempObj.storefrontAccessToken = result.storefrontAccessToken;
        }
        if (!result.apiKey.includes('*')) {
          tempObj.apiKey = result.apiKey;
        }
        if (!result.secretKey.includes('*')) {
          tempObj.secretKey = result.secretKey;
        }
        if (Object.keys(tempObj).length > 0) {
          tempObj.id = storeId;
          updateStore.mutate(tempObj);
        } else {
          openNotificationWithIcon(
            'error',
            t('common.messages.validation_failed')
          );
        }
      } else {
        addStore.mutate(result);
      }
    } catch (err) {}
  };

  // useEffect(() => {
  //   if (getAppById.isSuccess) {
  //     if (getAppById.data) {
  //       setAppDetails(getAppById.data);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getAppById.isSuccess]);
  //
  // useEffect(() => {
  //   if (getAppById.isError) {
  //     console.log('test', getAppById.error);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getAppById.isError]);

  useEffect(() => {
    if (getStoreById.isSuccess) {
      if (Object.keys(getStoreById.data).length > 0) {
        setIsStoreUpdate(true);
        form.setFieldsValue(getStoreById.data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStoreById.isSuccess]);

  useEffect(() => {
    if (getStoreById.isError) {
      openNotificationWithIcon('error', 'Error in adding store details');
      console.log('test', getStoreById.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStoreById.isError]);

  useEffect(() => {
    if (getEnvironmentList.isSuccess) {
      if (getEnvironmentList.data.length > 0) {
        setEnvironmentList(getEnvironmentList.data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEnvironmentList.isSuccess]);

  useEffect(() => {
    if (getEnvironmentList.isError) {
      console.log('test', getEnvironmentList.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEnvironmentList.isError]);

  useEffect(() => {
    if (addStore.isSuccess) {
      openNotificationWithIcon('success', 'Store added successfully');

      history.push(
        `/workspaces/${workspaceId}/platforms/shopify/${id}/${categoryId}/installed`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addStore.isSuccess]);

  useEffect(() => {
    if (addStore.isError) {
      //@ts-ignore
      openNotificationWithIcon('error', addStore.error.response.Error?.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addStore.isError]);

  useEffect(() => {
    if (updateStore.isSuccess) {
      openNotificationWithIcon('success', 'Store updated successfully.');

      history.push(
        `/workspaces/${workspaceId}/platforms/shopify/${id}/${categoryId}/installed`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateStore.isSuccess]);

  useEffect(() => {
    if (updateStore.isError) {
      openNotificationWithIcon(
        'error',
        //@ts-ignore
        updateStore.error.response.Error?.message
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateStore.isError]);

  useEffect(() => {
    if (getShopifyStoreList.isSuccess) {
      const tempArray: string[] = [];
      if (getShopifyStoreList.data.length > 0) {
        for (let i = 0; i < getShopifyStoreList.data.length; i++) {
          tempArray.push(...getShopifyStoreList.data[i].environmentIds);
        }
      }
      setShopifyEnvironmentList(tempArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getShopifyStoreList.isSuccess]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onValuesChange = (values: any, allValues: IAddUpdateStore) => {
    if (
      !allValues.environmentIds ||
      !allValues.storeName ||
      !allValues.storefrontAccessToken ||
      !allValues.adminAccessToken ||
      !allValues.apiKey ||
      !allValues.secretKey ||
      !allValues.storeDomain
    ) {
      setisSubmitButtonEnabled(true);
    } else {
      setisSubmitButtonEnabled(false);
    }
  };

  return {
    onBackButtonClick,
    t,
    onConnectButtonClick,
    form,
    isSubmitLoading: addStore.isLoading || updateStore.isLoading,
    environmentList,
    // appDetails,
    isStoreUpdate,
    shopifyEnvironmentList,
    storeId,
    isSubmitButtonEnabled,
    onValuesChange,
  };
};
export default useStoreFieldController;
