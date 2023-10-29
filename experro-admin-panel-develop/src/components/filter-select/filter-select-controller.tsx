/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';
import { useMemo } from 'react';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

import apiClient from '../../apis/api-client';
import { IAxiosResponse } from '../../types';
import { FilterSelectProps } from './filter-select';
import { useTranslation } from 'react-i18next';

const getOptions = async (url?: string) => {
  if (url === undefined) {
    return [];
  }

  const result = await apiClient.get<null, IAxiosResponse<any>>(url);
  return result.response.Data.items;
};

const useGetOptions = (url?: string) =>
  useQuery(['filter-select', url], () => getOptions(url));

const useFilterSelectController = ({
  url,
  type,
  labelKey = 'name',
  valueKey = 'id',
  parentLabelKey = 'parentName',
  parentValueKey = 'parentId',
  parentDefaultLabel,
  parentDefaultValue,
  value,
  options,
  onChange,
}: FilterSelectProps) => {
  const { t } = useTranslation();
  const getOptions = useGetOptions(url);

  // @ts-ignore
  const apiOptions: ItemType[] = useMemo(() => {
    const options = [{ label: t('common.labels.all'), key: 'all' }];
    if (!getOptions.data) return options;

    if (type === 'select') {
      options.push(
        ...getOptions.data.map((item: any) => ({
          label: item[labelKey],
          key: item[valueKey],
        }))
      );

      return options;
    }

    // We will get flat array of items, first we will filter
    // out unique parent elements and then insert child elements
    const parentOptions = getOptions.data
      .filter(
        (item: any, index: number, self: any) =>
          self.findIndex(
            (selfItem: any) => selfItem[parentValueKey] === item[parentValueKey]
          ) === index
      )
      .map((item: any) => ({
        label: item[parentLabelKey] || parentDefaultLabel,
        key: item[parentValueKey] || parentDefaultValue,
        type: 'group',
        children: [],
      }));

    parentOptions?.forEach((parentOption: any) => {
      parentOption.children = getOptions.data
        .filter(
          (item: any) =>
            (item[parentValueKey] || parentDefaultValue) === parentOption.key
        )
        .map((item: any) => ({
          label: item[labelKey],
          key: item[valueKey],
        }));
    });

    options.push(...parentOptions);
    return options;
  }, [
    getOptions.data,
    labelKey,
    parentDefaultLabel,
    parentDefaultValue,
    parentLabelKey,
    parentValueKey,
    t,
    type,
    valueKey,
  ]);

  const label = useMemo(() => {
    if (options) {
      return options.find((option) => option.key === value)?.label;
    }
    // @ts-ignore
    return apiOptions.find((option) => option && option.key === value)?.label;
  }, [apiOptions, options, value]);

  const onOptionChange = ({ key }: { key: string }) => {
    onChange(key);
  };

  return {
    label,
    apiOptions,
    onOptionChange,
  };
};

export default useFilterSelectController;
