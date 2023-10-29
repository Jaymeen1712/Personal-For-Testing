import { Checkbox, DatePicker, Form, Input } from 'antd';
import React, { ReactNode } from 'react';
import { Rule } from 'rc-field-form/lib/interface';
import { Moment } from 'moment';
import { FormItemProps as FP } from 'antd/es/form';

import FormSelectItem from './select';
import {
  IFormParams,
  ITreeSelectItem,
  OptionType,
  RowRecord,
} from '../../../types';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

const { TextArea } = Input;

export interface FormItemProps extends FP {
  label: string;
  promptText?: string;
  placeholder?: string;
  withCustomLabel?: boolean;
  rules?: Rule[];
  url?: string;
  options?: OptionType[];
  type:
    | 'input'
    | 'select'
    | 'tree-select'
    | 'textarea'
    | 'date'
    | 'password'
    | 'checkbox';
  labelKey?: string;
  valueKey?: string;
  parentLabelKey?: string;
  parentValueKey?: string;
  parentDefaultLabel?: string;
  parentDefaultValue?: string;
  getLabel?: (item: RowRecord) => string;
  setTreeData?: (value: ITreeSelectItem[]) => void;
  classname?: string;
  mode?: 'multiple' | 'tags' | 'single';
  defaultValue?: string | string[];
  format?: string;
  disabledDate?: (date: Moment) => boolean;
  maxLength?: number;
  size?: SizeType;
  required?: boolean;
  suffixIcon?: ReactNode;
  disabled?: boolean;
  defaultChecked?: boolean;
  valuePropName?: string;
  initialValue?: string | null;
  validateStatus?: '' | 'error' | 'success' | 'warning' | 'validating';
  error?: string;
  notFoundContent?: ReactNode;
  params?: IFormParams;
  onBlur?: () => void;
  onFilterOption?: (item: string) => void;
  allowClear?: boolean;
  autoFocus?: boolean;
  href?: string;
  target?: string;
  linkLabel?: string;
  onChange?: (value: string | string[]) => void;
  isShowToday?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  maxTagCount?: any;
}

const FormItem: React.FC<FormItemProps> = ({
  label,
  name,
  placeholder,
  rules,
  type,
  url,
  labelKey,
  valueKey,
  parentLabelKey,
  parentValueKey,
  parentDefaultLabel,
  parentDefaultValue,
  getLabel,
  maxLength,
  setTreeData,
  classname = 'w-480',
  mode,
  defaultValue,
  format,
  disabledDate,
  options,
  size,
  suffixIcon,
  disabled,
  defaultChecked,
  valuePropName,
  initialValue,
  validateStatus,
  error,
  notFoundContent,
  params,
  onBlur,
  onFilterOption,
  allowClear,
  href,
  target,
  linkLabel,
  autoFocus,
  onChange,
  isShowToday,
}) => {
  if (type === 'select' || type === 'tree-select') {
    return (
      <Form.Item
        label={label}
        name={name}
        rules={rules}
        className={classname}
        validateStatus={validateStatus}
        help={error}
        initialValue={initialValue}>
        {/* @ts-ignore */}
        <FormSelectItem
          name={name?.toString() || ''}
          placeholder={placeholder}
          type={type}
          url={url}
          labelKey={labelKey}
          valueKey={valueKey}
          parentLabelKey={parentLabelKey}
          parentValueKey={parentValueKey}
          parentDefaultLabel={parentDefaultLabel}
          parentDefaultValue={parentDefaultValue}
          getLabel={getLabel}
          setTreeData={setTreeData}
          mode={mode}
          defaultValue={defaultValue}
          options={options}
          suffixIcon={suffixIcon}
          notFoundContent={notFoundContent}
          params={params}
          onBlur={onBlur}
          onFilterOption={onFilterOption}
          allowClear={allowClear}
          onChange={onChange}
          disabled={disabled}
        />
      </Form.Item>
    );
  }

  if (type === 'textarea') {
    return (
      <Form.Item
        label={label}
        name={name}
        rules={rules}
        className={classname}
        validateStatus={validateStatus}
        help={error}>
        <TextArea
          rows={2}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
        />
      </Form.Item>
    );
  }

  if (type === 'checkbox') {
    return (
      <Form.Item
        name={name}
        valuePropName={valuePropName}
        className={classname}>
        <Checkbox checked={true}>{label}</Checkbox>
      </Form.Item>
    );
  }
  if (type === 'date') {
    return (
      <Form.Item
        label={label}
        name={name}
        rules={rules}
        validateStatus={validateStatus}
        help={error}>
        <DatePicker
          showToday={isShowToday ? true : false}
          placeholder={placeholder}
          format={format}
          disabledDate={disabledDate}
        />
      </Form.Item>
    );
  }

  return (
    <>
      <Form.Item
        label={label}
        name={name}
        rules={rules}
        className={classname}
        validateStatus={validateStatus}
        help={error}>
        <Input
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          size={size}
          onBlur={onBlur}
          autoFocus={autoFocus}
        />
      </Form.Item>
      {href && (
        <a href={href} target={target} className="link-label">
          {linkLabel}
        </a>
      )}
    </>
  );
};

export default FormItem;
