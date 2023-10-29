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

const EmailComponent: React.FC<FieldProps> = ({
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
      required={data.isRequired}
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
        {
          min: parseFloat(
            data.fieldProperties.minimumLengthValue
              ? data.fieldProperties.minimumLengthValue
              : '0'
          ),
          message: t('common.messages.content_library_minimum_validation', {
            entity: data.title,
            characters: data.fieldProperties.minimumLengthValue
              ? data.fieldProperties.minimumLengthValue
              : '',
          }),
        },
        {
          max: parseFloat(
            data.fieldProperties.maximumLengthValue
              ? data.fieldProperties.maximumLengthValue
              : '100000000000000000000000000000000000000000000000000000000'
          ),
          message: t('common.messages.content_library_maximum_validation', {
            entity: data.title,
            characters: data.fieldProperties.maximumLengthValue
              ? data.fieldProperties.maximumLengthValue
              : '',
          }),
        },
        {
          pattern: new RegExp(
            data.fieldProperties.regExPatten
              ? data.fieldProperties.regExPatten
              : ''
          ),
          message: t('common.labels.content_library_email_rxjs', {
            entity: data.fieldProperties.regExPatten,
          }),
        },
        {
          type: 'email',
          message: t('common.labels.content_library_email_valid'),
        },
      ]}
      normalize={(value) => value.trimStart()}>
      <Input
        onBlur={(e) => {
          onBlurAction(e, data.editValue);
        }}
        placeholder={data.fieldProperties.placeholder}
        disabled={!data.isDataEditable || !canEditField}
      />
    </Form.Item>
  );
};

export default EmailComponent;
