import React from 'react';
import { Form, Input } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import { IContentLibraryFieldPops } from '../../../../../../../types';
import { CommonController, useFieldPermission } from './controllers';
import { isFieldLocalizationEnabled } from '../../../../utils';

interface FieldProps {
  data: IContentLibraryFieldPops;
  componentName?: string;
  contentModalInternalName: string;
}

const TextComponent: React.FC<FieldProps> = ({
  data,
  componentName,
  contentModalInternalName,
}) => {
  const { language, t, onBlurAction } = CommonController();
  const { canEditField } = useFieldPermission(contentModalInternalName,data, componentName);

  const isFieldLocalizationEnable = isFieldLocalizationEnabled(
    language,
    data.fieldProperties.validation?.includes('enable_localization')
  );

  const { TextArea } = Input;
  return (
    <Form.Item
      // className={!data.isDataEditable ? 'display-none' : ''}
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
          message: t('common.labels.text_component_RXJS_pattern', {
            entity: data.title,
            pattern: data.fieldProperties.regExPatten,
          }),
        },
      ]}
      normalize={(value) => value.trimStart()}>
      {data.fieldProperties.textRadioButton === 'shortText' ? (
        <Input
          // className={!data.isDataEditable ? 'display-none' : ''}
          onBlur={(e) => onBlurAction(e, data.editValue)}
          placeholder={data.fieldProperties.placeholder}
          disabled={
            !data.isDataEditable || !canEditField
              ? true
              : !isFieldLocalizationEnable
          }
        />
      ) : (
        <TextArea
          onBlur={(e) => onBlurAction(e, data.editValue)}
          rows={4}
          placeholder={data.fieldProperties.placeholder}
          disabled={
            !data.isDataEditable || !canEditField
              ? true
              : !isFieldLocalizationEnable
          }
        />
      )}
    </Form.Item>
  );
};

export default TextComponent;
