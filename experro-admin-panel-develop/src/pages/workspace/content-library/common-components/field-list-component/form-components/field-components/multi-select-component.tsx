import { Form, Select } from 'antd';
import React from 'react';
import { CommonController, useFieldPermission } from './controllers';
import { InfoCircleOutlined } from '@ant-design/icons';

import { IContentLibraryFieldPops } from '../../../../../../../types';
import { isFieldLocalizationEnabled } from '../../../../utils';
import SearchIcon from "../../../../../../../images/icons/search-icon";

interface FieldProps {
  contentModalInternalName: string;
  data: IContentLibraryFieldPops;
  componentName?: string;
}

const MultiSelectComponent: React.FC<FieldProps> = ({
  contentModalInternalName,
  data,
  componentName,
}) => {
  const { language, t, onMultiSelectBlurAction } = CommonController();
  const { canEditField } = useFieldPermission(
    contentModalInternalName,
    data,
    componentName
  );
  const isFieldLocalizationEnable = isFieldLocalizationEnabled(
    language,
    data.fieldProperties.validation?.includes('enable_localization')
  );

  return (
    <Form.Item
      label={data.title}
      name={data.name}
      tooltip={
        data.fieldProperties.helpText && {
          title: data.fieldProperties.helpText,
          icon: <InfoCircleOutlined />,
        }
      }
      initialValue={
        data.editValue
          ? data.editValue
          : data.fieldProperties.multiSelectDefaultValue
      }
      rules={[
        {
          required: data.isRequired,
          message: t('common.messages.required', { entity: data.title }),
          type: 'array',
        },
      ]}>
      <Select
        onChange={(value) =>
          onMultiSelectBlurAction(value, data.editValue, data.name)
        }
        mode="multiple"
        showArrow
        suffixIcon={<span className="select-search-icon"><SearchIcon /></span>}
        placeholder={data.fieldProperties.placeholder}
        disabled={
          !data.isDataEditable || !canEditField
            ? true
            : !isFieldLocalizationEnable
        }>
        {data.fieldProperties.selectValues &&
          data.fieldProperties.selectValues
            .split('\n')
            .filter((item) => item)
            .map((item) => <Select.Option value={item}>{item}</Select.Option>)}
      </Select>
    </Form.Item>
  );
};

export default MultiSelectComponent;
