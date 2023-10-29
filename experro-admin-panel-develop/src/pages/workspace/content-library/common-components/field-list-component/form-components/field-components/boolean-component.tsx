import { Form, Radio } from 'antd';
import React from 'react';
import { CommonController, useFieldPermission } from './controllers';
import { InfoCircleOutlined } from '@ant-design/icons';

import { IContentLibraryFieldPops } from '../../../../../../../types';

interface FieldProps {
  contentModalInternalName: string;
  data: IContentLibraryFieldPops;
  componentName?: string;
}

const BooleanComponent: React.FC<FieldProps> = ({
  contentModalInternalName,
  data,
  componentName,
}) => {
  const { t, onBooleanBlurAction } = CommonController();
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
        data.editValue === undefined
          ? data.fieldProperties.selectDefaultValue
          : data.editValue?.toString()
      }
      rules={[
        {
          required: data.isRequired,
          message: t('common.messages.required', { entity: data.title }),
        },
      ]}>
      <Radio.Group
        onChange={(e) => onBooleanBlurAction(e, data.editValue)}
        disabled={!data.isDataEditable || !canEditField}>
        <Radio value="true">
          {t('common.labels.form_field_boolean_true_option')}
        </Radio>
        <Radio value="false">
          {t('common.labels.form_field_boolean_false_option')}
        </Radio>
      </Radio.Group>
    </Form.Item>
  );
};

export default BooleanComponent;
