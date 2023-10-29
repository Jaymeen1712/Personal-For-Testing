import { Form, Input } from 'antd';
import React from 'react';
import { CommonController, useFieldPermission } from './controllers';
import { InfoCircleOutlined } from '@ant-design/icons';

import { IContentLibraryFieldPops } from '../../../../../../../types';

interface FieldProps {
  contentModalInternalName: string;
  data: IContentLibraryFieldPops;
  componentName?: string;
}

const CurrencyComponent: React.FC<FieldProps> = ({
  contentModalInternalName,
  data,
  componentName,
}) => {
  const { t, onBlurAction } = CommonController();
  const { canEditField } = useFieldPermission(
    contentModalInternalName,
    data,
    componentName
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
        data.editValue ? data.editValue : data.fieldProperties.defaultValue
      }
      rules={[
        {
          required: data.isRequired,
          message: t('common.messages.required', { entity: data.title }),
        },
      ]}
      normalize={(value) => value.trimStart()}>
      <Input
        onBlur={(e) => onBlurAction(e, data.editValue)}
        placeholder={data.fieldProperties.placeholder}
        disabled={!data.isDataEditable || !canEditField}
      />
    </Form.Item>
  );
};

export default CurrencyComponent;
