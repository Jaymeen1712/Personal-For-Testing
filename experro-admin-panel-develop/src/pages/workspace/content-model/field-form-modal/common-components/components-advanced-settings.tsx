import React from 'react';
import { Checkbox, Form } from 'antd';

import { FormFileProps } from '../../../../../types';
import useMinimumMaximumController from './relation-value-controller';

const ComponentsAdvancedSettings: React.FC<FormFileProps> = ({
  minimumInputVisible,
  maximumInputVisible,
}) => {
  const { t } = useMinimumMaximumController();
  return (
    <>
      <Form.Item name="validation" className="checkboxgroup" key="mainKey">
        <Checkbox.Group>
          <Checkbox value="required_field">
            {t('common.labels.form_field_required_field')}
            <p>{t('common.labels.form_field_required_subtitle')}</p>
          </Checkbox>
        </Checkbox.Group>
      </Form.Item>
    </>
  );
};
export default ComponentsAdvancedSettings;
