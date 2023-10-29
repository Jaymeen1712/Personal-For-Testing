import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useGetAppList, useGetAppCategories } from '../../services';
import { IAppLIst } from '../../../../../types';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../../utills';
import { debounce } from 'lodash';
import queryClient from '../../../../../query-client';
import { Form } from 'antd';

const useAppListController = () => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const history = useHistory();

  const [appList, setAppList] = useState<IAppLIst[]>();

  const [categories, setCategories] = useState<IAppLIst[]>([]);

  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [searchValue, setSearchValue] = useState<string>('');

  const getAppList = useGetAppList(
    workspaceId,
    selectedCategory,
    isAppInstalled,
    searchValue
  );

  const [form] = Form.useForm();

  const getAppCategoriesList = useGetAppCategories(workspaceId);

  const filterList: { key: boolean; label: string }[] = [
    {
      key: false,
      label: 'All',
    },
    {
      key: true,
      label: 'Installed',
    },
  ];

  const appItemClick = (
    id: string,
    val: string,
    categoryId: string,
    isActive?: boolean
  ) => {
    history.push(
      `/workspaces/${workspaceId}/apps/${val}/${id}/${categoryId}${
        isActive ? '/installed' : ''
      }`
    );
  };

  const onBigCommerceClick = () => {
    history.push(`/workspaces/${workspaceId}/bigcommerce-store`);
  };

  const onCategoryChange = (category: string) => {
    setSelectedCategory(category);
    getAppList.remove();
  };

  const onFilterChange = (filter: boolean) => {
    setIsAppInstalled(filter);
    getAppList.remove();
  };

  const onSearchValueChange = debounce((val: string) => {
    setSearchValue(val.trim());
    queryClient.removeQueries([API_QUERY_KEY.APP_LIST]);
  }, 500);

  const onEmptySearchField = () => {
    form.resetFields();
    setSearchValue('');
    queryClient.removeQueries([API_QUERY_KEY.APP_LIST]);
  };

  useEffect(() => {
    if (getAppList.isSuccess && getAppCategoriesList.isSuccess) {
      if (getAppList.data.length > 0 && getAppCategoriesList.data.length > 0) {
        const tempAppList: IAppLIst[] = [];

        for (let i = 0; i < getAppList.data.length; i++) {
          const result = getAppCategoriesList.data.find(
            (item) => item.id === getAppList.data[i].categoryId
          );
          if (result && result.categoryName !== 'Ecommerce') {
            tempAppList.push({
              ...getAppList.data[i],
              categoryName: result.categoryName,
            });
          }
        }
        setAppList(
          tempAppList.sort((a, b) =>
            a.active && b.active
              ? a.sortOrder - b.sortOrder
              : a.active
              ? -1
              : b.active
              ? 1
              : a.sortOrder - b.sortOrder
          )
        );
      } else {
        setAppList([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAppList.isSuccess, getAppCategoriesList.data]);

  useEffect(() => {
    if (getAppList.isError) {
      openNotificationWithIcon('error', 'Error in fetching app list');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAppList.isError]);

  useEffect(() => {
    if (getAppCategoriesList.isSuccess) {
      const appCategoriesList = [...getAppCategoriesList.data];
      appCategoriesList.unshift({
        categoryInternalName: 'all',
        categoryName: 'All',
        description: '',
        id: '',
        integrationName: '',
        integrationInternalName: '',
        spaceId: '',
        accessToken: '',
        isEnabled: false,
        configuration: '',
        isInstalled: false,
        integrationEnvironmentId: '',
        categoryId: '',
        sortOrder: 0,
      });
      appCategoriesList.splice(
        appCategoriesList.findIndex(
          (item) => item.categoryName === 'Ecommerce'
        ),
        1
      );
      setCategories([...appCategoriesList]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAppCategoriesList.isSuccess]);

  useEffect(() => {
    if (getAppCategoriesList.isError) {
      openNotificationWithIcon('error', 'Error in fetching category list');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAppCategoriesList.isError]);

  return {
    t,
    categories,
    filterList,
    appList,
    appItemClick,
    onBigCommerceClick,
    onCategoryChange,
    onFilterChange,
    onSearchValueChange,
    form,
    onEmptySearchField,
  };
};
export default useAppListController;
