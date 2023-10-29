import React from 'react';
import { Col, Form, Input, InputNumber, Row } from 'antd';

import { FormFileProps } from '../../../../../types';
import useMinimumMaximumController from './relation-value-controller';

const RegularMoreTabPane: React.FC<FormFileProps> = ({ selectedField }) => {
  const { t } = useMinimumMaximumController();
  return (
    <>
      {selectedField?.fields.more?.includes('default_Value') && (
        <div className="custom-label-input ">
          <Form.Item
            label={t('common.labels.form_field_default_value')}
            name="defaultValue"
            extra={t('common.labels.content_modal_default_prompt_text')}
            normalize={(value) => value.trimStart()}>
            <Input
              placeholder={t(
                'common.labels.form_field_default_value_placeholder'
              )}
            />
          </Form.Item>
        </div>
      )}
      {selectedField?.fields.more?.includes('help_text') && (
        <div className="custom-label-input">
          <Form.Item
            label={t('common.labels.form_field_help_text')}
            extra={t('common.labels.content_modal_help_prompt_text')}
            name="helpText"
            normalize={(value) => value.trimStart()}>
            <Input
              placeholder={t(
                'common.labels.form_field_help_text_value_placeholder'
              )}
            />
          </Form.Item>
        </div>
      )}
      {selectedField?.fields.more?.includes('placeholder') && (
        <div className="custom-label-input">
          <Form.Item
            label={t('common.labels.form_field_placeholder')}
            extra={t('common.messages.form_field_place_holder_sub_text')}
            name="placeholder"
            normalize={(value) => value.trimStart()}>
            <Input
              placeholder={t('common.labels.form_field_placeholder_text')}
            />
          </Form.Item>
        </div>
      )}
      <Row gutter={24} className="m-t-32 seprator-fields ant-row-bottom">
        {selectedField?.fields.more?.includes('min_height') && (
          <Col span={12}>
            <div className="custom-label-input">
              <Form.Item
                label={t('common.labels.height')}
                //extra={t('common.labels.min_height_subtitle')}
                name="minHeight">
                <InputNumber
                  addonBefore={'Min'}
                  className="w-100"
                  min={0}
                  placeholder={t('common.labels.enter_height')}
                />
              </Form.Item>
            </div>
          </Col>
        )}
        {selectedField?.fields.more?.includes('max_width') && (
          <>
            <Col span={12}>
              <div className="custom-label-input">
                <Form.Item
                  label={''}
                  //extra={t('common.labels.max_height_subtitle')}
                  name="maxHeight">
                  <InputNumber
                    addonBefore={'Max'}
                    className="w-100"
                    min={0}
                    placeholder={t('common.labels.enter_height')}
                  />
                </Form.Item>
              </div>
            </Col>

            <Col span={24}>
              <p className="gray-text font-sm m-t-8">
                {t('common.labels.rich_text_sub_text')}
              </p>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};
export default RegularMoreTabPane;
