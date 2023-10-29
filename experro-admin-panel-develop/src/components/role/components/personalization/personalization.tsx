import React from 'react';
import type { FormInstance } from 'antd/es/form';
import { useTranslation } from 'react-i18next';
import { Checkbox, Form } from 'antd';

import { singleCheckboxSelect } from '../utils/settings-utils';

interface PersonalizationProps {
  form: FormInstance;
}

const Personalization: React.FC<PersonalizationProps> = ({ form }) => {
  const { t } = useTranslation();

  return (
    <div className="ant-row ant-space-align-center tab-content-list">
      <div className="tab-content-left lg-width">
        <h4 className="title-sm">{t('common.labels.widgets')}</h4>
        {t('common.labels.widgets-description')}
      </div>
      <div className="tab-content-right four-checkbox ant-row">
        <Form.Item
          name={['personalization', 'widget', 'read']}
          valuePropName="checked">
          <Checkbox
            onChange={(e) =>
              singleCheckboxSelect(e, 'personalization', 'widget', 'read', form)
            }>
            {t('common.labels.read')}
          </Checkbox>
        </Form.Item>
        <Form.Item
          name={['personalization', 'widget', 'create']}
          valuePropName="checked">
          <Checkbox
            onChange={(e) =>
              singleCheckboxSelect(
                e,
                'personalization',
                'widget',
                'create',
                form
              )
            }>
            {t('common.labels.create')}
          </Checkbox>
        </Form.Item>
        <Form.Item
          name={['personalization', 'widget', 'update']}
          valuePropName="checked">
          <Checkbox
            onChange={(e) =>
              singleCheckboxSelect(
                e,
                'personalization',
                'widget',
                'update',
                form
              )
            }>
            {t('common.labels.update')}
          </Checkbox>
        </Form.Item>
        <Form.Item
          name={['personalization', 'widget', 'delete']}
          valuePropName="checked">
          <Checkbox
            onChange={(e) =>
              singleCheckboxSelect(
                e,
                'personalization',
                'widget',
                'delete',
                form
              )
            }>
            {t('common.labels.delete')}
          </Checkbox>
        </Form.Item>
      </div>
    </div>
  );
};

export default Personalization;
