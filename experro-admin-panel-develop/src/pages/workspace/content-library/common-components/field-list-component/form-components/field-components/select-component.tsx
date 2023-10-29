import { Select, Form } from 'antd';
import { IContentLibraryFieldPops } from '../../../../../../../types';
import React from 'react';
import { CommonController, useFieldPermission } from './controllers';
import { InfoCircleOutlined } from '@ant-design/icons';
import { isFieldLocalizationEnabled } from '../../../../utils';
import DownArrowIcon from "../../../../../../../images/icons/downarrow-icon";

interface FieldProps {
  contentModalInternalName: string;
  data: IContentLibraryFieldPops;
  componentName?: string;
}

const SelectComponent: React.FC<FieldProps> = ({
  contentModalInternalName,
  data,
  componentName,
}) => {
  const { language, t, onSelectBlurAction } = CommonController();
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
          message: t('common.labels.required', { entity: data.title }),
        },
      ]}
      normalize={(value) => value.trimStart()}>
      <Select
        onChange={(value) =>
          onSelectBlurAction(value, data.editValue, data.name)
        }
        suffixIcon={<DownArrowIcon />}
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

export default SelectComponent;
