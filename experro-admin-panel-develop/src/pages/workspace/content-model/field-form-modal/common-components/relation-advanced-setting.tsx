import React from 'react';
import { Checkbox, Form } from 'antd';

import { FormFileProps } from '../../../../../types';
import useMinimumMaximumController from './relation-value-controller';

const RelationAdvancedSettingTabPane: React.FC<FormFileProps> = ({
  selectedField,
}) => {
  const { t } = useMinimumMaximumController();

  return (
    <Form.Item name="validation" className="checkboxgroup">
      <Checkbox.Group>
        {selectedField?.fields.advanced_setting?.includes('unique_field') && (
          <Checkbox value="unique_field">
            {t('common.labels.form_field_unique_field')}
            <p>{t('common.labels.form_field_unique_field')}</p>
          </Checkbox>
        )}
        {selectedField?.fields.advanced_setting?.includes('private_field') && (
          <Checkbox value="private_field">
            {t('common.labels.form_field_private_field')}
            <p>{t('common.labels.form_field_private_field_subtitle')}</p>
          </Checkbox>
        )}
      </Checkbox.Group>
    </Form.Item>
  );
};
export default RelationAdvancedSettingTabPane;
