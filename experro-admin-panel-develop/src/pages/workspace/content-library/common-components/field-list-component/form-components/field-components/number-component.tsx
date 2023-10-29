import { InputNumber, Form } from 'antd';
import React from 'react';
import { CommonController, useFieldPermission } from './controllers';
import { InfoCircleOutlined } from '@ant-design/icons';

import { IContentLibraryFieldPops } from '../../../../../../../types';

interface FieldProps {
  contentModalInternalName: string;
  data: IContentLibraryFieldPops;
  componentName?: string;
}

const NumberComponent: React.FC<FieldProps> = ({
  contentModalInternalName,
  data,
  componentName,
}) => {
  const { t, onNumberBlurAction } = CommonController();
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
        //@ts-ignore
        data.editValue || data.editValue === 0
          ? data.editValue
          : data.fieldProperties.defaultValue
          ? parseFloat(data.fieldProperties.defaultValue)
          : null
      }
      rules={[
        {
          required: data.isRequired,
          message: t('common.messages.required', { entity: data.title }),
        },
        {
          validator(rule, value) {
            if (data.fieldProperties.minimumLengthValue) {
              if (value >= data.fieldProperties.minimumLengthValue || !value) {
                return Promise.resolve('');
              } else {
                return Promise.reject(
                  t(
                    'common.messages.content_library_number_minimum_validation',
                    {
                      entity: data.title,
                      characters: data.fieldProperties.minimumLengthValue,
                    }
                  )
                );
              }
            } else {
              return Promise.resolve('');
            }
          },
        },
        {
          validator(rule, value) {
            if (data.fieldProperties.maximumLengthValue) {
              if (value <= data.fieldProperties.maximumLengthValue || !value) {
                return Promise.resolve('');
              } else {
                return Promise.reject(
                  t(
                    'common.messages.content_library_number_maximum_validation',
                    {
                      entity: data.title,
                      characters: data.fieldProperties.maximumLengthValue,
                    }
                  )
                );
              }
            } else {
              return Promise.resolve('');
            }
          },
        },
      ]}>
      <InputNumber
        className='w-100'
        onBlur={(e) => onNumberBlurAction(e, data.editValue)}
        min={0}
        placeholder={data.fieldProperties.placeholder}
        disabled={!data.isDataEditable || !canEditField}
      />
    </Form.Item>
  );
};

export default NumberComponent;
