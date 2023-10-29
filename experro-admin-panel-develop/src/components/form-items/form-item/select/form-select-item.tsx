import React, { ReactNode, useCallback, useMemo } from 'react';
import { TreeSelect, Select } from 'antd';

import useFormSelectController from './form-select-controller';
import {
  IFormParams,
  ITreeSelectItem,
  OptionType,
  RowRecord,
} from '../../../../types';
import { MAX_TAG_COUNT } from '../../../../utills';

const { SHOW_PARENT } = TreeSelect;

interface FormSelectItemProps {
  type: 'select' | 'tree-select';
  name: string;
  url?: string;
  placeholder?: string;
  options?: OptionType[];
  value: string | string[];
  onChange?: (value: string | string[]) => void;
  onBlur?: () => void;
  onFilterOption?: (item: string) => void;
  labelKey?: string;
  valueKey?: string;
  getLabel?: (item: RowRecord) => string;
  setTreeData?: (value: ITreeSelectItem[]) => void;
  /* key of the object that has parent element's label */
  parentLabelKey?: string;
  /* key of the object that has parent element's value */
  parentValueKey?: string;
  /* if parent element's label is empty this label will be used */
  parentDefaultLabel?: string;
  /* if parent element's value is empty this label will be used */
  parentDefaultValue?: string;
  mode?: 'multiple' | 'tags' | 'single';
  defaultValue?: string | string[];
  suffixIcon?: ReactNode;
  notFoundContent?: ReactNode;
  params?: IFormParams;
  allowClear?: boolean;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  maxTagCount?: any;
}

const FormSelectItem: React.FC<FormSelectItemProps> = ({
  type,
  url,
  name,
  placeholder,
  value,
  options = [],
  onChange,
  labelKey = 'name',
  valueKey = 'id',
  getLabel,
  setTreeData,
  parentLabelKey = 'parentId',
  parentValueKey = 'parentName',
  parentDefaultLabel,
  parentDefaultValue,
  mode = 'multiple',
  defaultValue,
  suffixIcon,
  notFoundContent,
  params,
  onBlur,
  onFilterOption,
  allowClear,
  disabled,
}) => {
  const formSelectController = useFormSelectController(url, params);

  const onFilterOptions = useCallback(
    (search: string, item?: OptionType) => {
      const result = item?.label.toLowerCase().includes(search.toLowerCase());
      if (onFilterOption && search.length > 0) {
        onFilterOption(search);
      }
      return result || false;
    },
    [onFilterOption]
  );

  const apiOptions = useMemo(() => {
    if (type === 'select') {
      return formSelectController.data?.map((item: RowRecord) => ({
        label: getLabel ? getLabel(item) : item[labelKey || 'label'],
        value: item[valueKey || 'value'],
      }));
    }

    // We will get flat array of items, first we will filter
    // out unique parent elements and then insert child elements
    const parentOptions = formSelectController.data
      ?.filter(
        (item: RowRecord, index: number, self: RowRecord[]) =>
          self.findIndex(
            (selfItem: RowRecord) =>
              selfItem[parentValueKey || 'id'] === item[parentValueKey || 'id']
          ) === index
      )
      .map((item: RowRecord) => ({
        title: item[parentLabelKey || 'name'] || parentDefaultLabel,
        displayTitle: item[parentLabelKey || 'name'] || parentDefaultLabel,
        value: item[parentValueKey || 'id'] || parentDefaultValue,
        children: [],
      }));

    parentOptions?.forEach((parentOption: RowRecord) => {
      parentOption.children = formSelectController.data
        ?.filter(
          (item: RowRecord) =>
            (item[parentValueKey || 'id'] || parentDefaultValue) ===
            parentOption.value
        )
        .map((item: RowRecord) => ({
          label: getLabel ? getLabel(item) : item[labelKey || 'name'],
          displayTitle: `${parentOption.title} - ${
            getLabel ? getLabel(item) : item[labelKey || 'name']
          }`,
          value: item[valueKey || 'id'],
        }));
    });

    setTreeData && setTreeData(parentOptions);

    return parentOptions;
  }, [
    formSelectController.data,
    getLabel,
    labelKey,
    parentDefaultLabel,
    parentDefaultValue,
    parentLabelKey,
    parentValueKey,
    setTreeData,
    type,
    valueKey,
  ]);

  if (type === 'tree-select') {
    return (
      <TreeSelect
        id={name}
        treeDefaultExpandAll
        value={!formSelectController.isFetching ? value : undefined}
        onChange={onChange}
        placeholder={placeholder}
        treeData={
          !formSelectController.isFetching ? apiOptions || options : undefined
        }
        treeCheckable
        filterTreeNode={(search, item: RowRecord) =>
          item.displayTitle?.toLowerCase().indexOf(search.toLowerCase()) >= 0
        }
        treeNodeLabelProp="displayTitle"
        showCheckedStrategy={SHOW_PARENT}
        showArrow={true}
        suffixIcon={suffixIcon}
        notFoundContent={notFoundContent}
        maxTagCount={MAX_TAG_COUNT}
        maxTagPlaceholder={
          value &&
          value.length > MAX_TAG_COUNT &&
          `+ ${value.length - MAX_TAG_COUNT} Selected`
        }
      />
    );
  }

  return (
    <Select
      id={name}
      suffixIcon={suffixIcon}
      placeholder={placeholder}
      onChange={onChange}
      value={!formSelectController.isFetching ? value : undefined}
      showSearch
      notFoundContent={notFoundContent}
      optionFilterProp="children"
      filterOption={onFilterOptions}
      onBlur={onBlur}
      showArrow={true}
      disabled={disabled === true ? true : false}
      options={
        !formSelectController.isFetching
          ? apiOptions?.length > 0
            ? apiOptions
            : options
          : undefined
      }
      mode={mode === 'single' ? undefined : mode}
      defaultValue={defaultValue}
      allowClear={allowClear}
    />
  );
};

export default FormSelectItem;
