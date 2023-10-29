import React from 'react';
import { Form, Input, Radio, Select } from 'antd';

import useMinimumMaximumController from './relation-value-controller';
import { ContentModelList } from '../../../../../types';
import DownArrowIcon from '../../../../../images/icons/downarrow-icon';

interface ComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentsList: any;
  internalFieldName: string;
  onBlur?: () => void;
  editContentFieldStatus?: boolean;
  internalFieldNameChange?: (e: string) => void;
  editInternalFieldName?: string;
  extensionName?: string;
}

const ComponentsBaseSettings: React.FC<ComponentProps> = ({
  componentsList,
  internalFieldName,
  onBlur,
  editContentFieldStatus,
  internalFieldNameChange,
  editInternalFieldName,
  extensionName,
}) => {
  const { t } = useMinimumMaximumController();
  return (
    <>
      <div className="custom-label-input m-b-28">
        <Form.Item
          wrapperCol={{ span: 24 }}
          label={t('common.labels.form_field_name')}
          name="fieldName"
          rules={[
            {
              required: true,
              message: t('common.labels.form_field_name_error'),
            },
            {
              pattern: new RegExp(/^[ A-Za-z0-9]*$/i),
              message: t('common.messages.format', {
                entity: t('common.labels.form_field_name'),
              }),
            },
          ]}
          normalize={(value) => value.trimStart()}>
          <Input
            placeholder={t('common.labels.form_field_name_placeholder')}
            onBlur={onBlur}
            maxLength={255}
          />
        </Form.Item>
      </div>

      {!editContentFieldStatus ? (
        <Form.Item
          name="internalFieldName"
          label={t('common.labels.form_field_internal_field_name')}
          rules={[
            {
              required: true,
              message: t('common.messages.please_enter_internal_field_name'),
            },
          ]}
          normalize={(value) => value.trimStart()}>
          <Input
            name="internalFieldName"
            onChange={(e) => {
              internalFieldNameChange &&
                internalFieldNameChange(e.target.value);
            }}
            placeholder={t('common.labels.add_internal_field_name_placeholder')}
            value={internalFieldName}
            addonAfter={extensionName}
          />
        </Form.Item>
      ) : (
        <>
          <Form.Item>
            <label className="custom-input-label">
              {t('common.labels.form_field_internal_field_name')}
            </label>
            <Input
              disabled
              value={editInternalFieldName}
              placeholder={t('common.labels.form_field_name_placeholder')}
            />
          </Form.Item>
        </>
      )}
      <Form.Item
        label={t('common.labels.form_field_select_component')}
        name="selectComponents"
        rules={[{ required: true, message: 'Please select a component!' }]}
        normalize={(value) => value.trimStart()}>
        <Select
          suffixIcon={<DownArrowIcon />}
          optionFilterProp="children"
          placeholder={t('common.labels.select_component')}
          filterOption={(input, componentsList) =>
            (componentsList?.children ?? '')
              //@ts-ignore
              .toLowerCase()
              .includes(input.toLowerCase())
          }>
          {componentsList.map((data: ContentModelList) => (
            <Select.Option value={data.id}>{data.name}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="singleAndRepeatableComponents">
        <Radio.Group defaultValue="singleComponents">
          <Radio value="singleComponents">
            {t('common.labels.form_field_single_component')}
          </Radio>

          <Radio value="repeatableComponents">
            {t('common.labels.form_field_repeatable_component')}
          </Radio>
        </Radio.Group>
      </Form.Item>
    </>
  );
};
export default ComponentsBaseSettings;
