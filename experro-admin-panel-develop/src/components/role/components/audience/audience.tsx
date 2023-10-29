import React from 'react';
import type { FormInstance } from 'antd/es/form';
import { useTranslation } from 'react-i18next';
import { Checkbox, Form } from 'antd';

import { singleCheckboxSelect } from '../utils/settings-utils';

interface AudienceProps {
  form: FormInstance;
}

const Audience: React.FC<AudienceProps> = ({ form }) => {
  const { t } = useTranslation();

  return (
    <div className="ant-row ant-space-align-center tab-content-list">
      <div className="tab-content-left lg-width">
        <h4 className="title-sm">{t('common.labels.segments')}</h4>
        {t('common.labels.segments_description')}
      </div>
      <div className="tab-content-right four-checkbox ant-row">
        <Form.Item
          name={['audience', 'segments', 'read']}
          valuePropName="checked">
          <Checkbox
            onChange={(e) =>
              singleCheckboxSelect(e, 'audience', 'segments', 'read', form)
            }>
            {t('common.labels.read')}
          </Checkbox>
        </Form.Item>
        <Form.Item
          name={['audience', 'segments', 'create']}
          valuePropName="checked">
          <Checkbox
            onChange={(e) =>
              singleCheckboxSelect(e, 'audience', 'segments', 'create', form)
            }>
            {t('common.labels.create')}
          </Checkbox>
        </Form.Item>
        <Form.Item
          name={['audience', 'segments', 'update']}
          valuePropName="checked">
          <Checkbox
            onChange={(e) =>
              singleCheckboxSelect(e, 'audience', 'segments', 'update', form)
            }>
            {t('common.labels.update')}
          </Checkbox>
        </Form.Item>
        <Form.Item
          name={['audience', 'segments', 'delete']}
          valuePropName="checked">
          <Checkbox
            onChange={(e) =>
              singleCheckboxSelect(e, 'audience', 'segments', 'delete', form)
            }>
            {t('common.labels.delete')}
          </Checkbox>
        </Form.Item>
      </div>
    </div>
  );
};

export default Audience;
