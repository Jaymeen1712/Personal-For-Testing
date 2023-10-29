import React from 'react';
import type { FormInstance } from 'antd/es/form';
import { Checkbox, Form } from 'antd';

import {
  nestedCheckboxSelect,
  singleCheckboxSelect,
} from '../utils/settings-utils';
import useMerchandising from './merchandising-controller';

interface MerchandisingProps {
  form: FormInstance;
}

const Merchandising: React.FC<MerchandisingProps> = ({ form }) => {
  const { t, listMerchandising } = useMerchandising();

  return (
    <>
      {listMerchandising.merchandising.map((ele) => (
        <div key={ele.value}>
          {ele.subrules ? (
            <div className="tab-content-list-with-data">
              <div className="ant-row ant-space-align-center tab-content-list tab-content-no-border">
                <div className="tab-content-left lg-width" key={ele.label}>
                  <h4 className="title-sm">{ele.label}</h4>
                  {ele.description}
                </div>
              </div>
              {ele.subrules.map((ele1) => (
                <div
                  className="ant-row ant-space-align-center tab-content-list tab-content-no-border"
                  key={ele1.value}>
                  <div className="tab-content-left lg-width p-l-32">
                    <h4 className="title-sm">{ele1.label}</h4>
                  </div>
                  <div className="tab-content-right four-checkbox ant-row">
                    <Form.Item
                      name={['merchandising', ele.value, ele1.value, 'read']}
                      valuePropName="checked">
                      <Checkbox
                        onChange={(e) =>
                          nestedCheckboxSelect(
                            e,
                            'merchandising',
                            ele.value,
                            ele1.value,
                            'read',
                            form
                          )
                        }>
                        {t('common.labels.read')}
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      name={['merchandising', ele.value, ele1.value, 'create']}
                      valuePropName="checked">
                      <Checkbox
                        onChange={(e) =>
                          nestedCheckboxSelect(
                            e,
                            'merchandising',
                            ele.value,
                            ele1.value,
                            'create',
                            form
                          )
                        }>
                        {t('common.labels.create')}
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      name={['merchandising', ele.value, ele1.value, 'update']}
                      valuePropName="checked">
                      <Checkbox
                        onChange={(e) =>
                          nestedCheckboxSelect(
                            e,
                            'merchandising',
                            ele.value,
                            ele1.value,
                            'update',
                            form
                          )
                        }>
                        {t('common.labels.update')}
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      name={['merchandising', ele.value, ele1.value, 'delete']}
                      valuePropName="checked">
                      <Checkbox
                        onChange={(e) =>
                          nestedCheckboxSelect(
                            e,
                            'merchandising',
                            ele.value,
                            ele1.value,
                            'delete',
                            form
                          )
                        }>
                        {t('common.labels.delete')}
                      </Checkbox>
                    </Form.Item>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="ant-row ant-space-align-center tab-content-list"
              key={ele.description}>
              <div className="tab-content-left lg-width">
                <h4 className="title-sm">{ele.label}</h4>
                {ele.description}
              </div>
              <div className="tab-content-right four-checkbox ant-row">
                <Form.Item
                  name={['merchandising', ele.value, 'read']}
                  valuePropName="checked">
                  <Checkbox
                    onChange={(e) =>
                      singleCheckboxSelect(
                        e,
                        'merchandising',
                        ele.value,
                        'read',
                        form
                      )
                    }>
                    {t('common.labels.read')}
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name={['merchandising', ele.value, 'create']}
                  valuePropName="checked">
                  <Checkbox
                    onChange={(e) =>
                      singleCheckboxSelect(
                        e,
                        'merchandising',
                        ele.value,
                        'create',
                        form
                      )
                    }>
                    {t('common.labels.create')}
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name={['merchandising', ele.value, 'update']}
                  valuePropName="checked">
                  <Checkbox
                    onChange={(e) =>
                      singleCheckboxSelect(
                        e,
                        'merchandising',
                        ele.value,
                        'update',
                        form
                      )
                    }>
                    {t('common.labels.update')}
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name={['merchandising', ele.value, 'delete']}
                  valuePropName="checked">
                  <Checkbox
                    onChange={(e) =>
                      singleCheckboxSelect(
                        e,
                        'merchandising',
                        ele.value,
                        'delete',
                        form
                      )
                    }>
                    {t('common.labels.delete')}
                  </Checkbox>
                </Form.Item>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default Merchandising;
