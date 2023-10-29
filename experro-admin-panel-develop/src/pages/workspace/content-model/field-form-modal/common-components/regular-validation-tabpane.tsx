import React from 'react';
import { Checkbox, Form, Input, Select, InputNumber } from 'antd';

import { FormFileProps } from '../../../../../types';
import useMinimumMaximumController from './relation-value-controller';
import DownArrowIcon from '../../../../../images/icons/downarrow-icon';

const RegularValidationTabPane: React.FC<FormFileProps> = ({
  selectedField,
  minimumInputVisible,
  maximumInputVisible,
  defaultSelectValue,
  maximumInputValue,
  minimumInputValue,
}) => {
  const { t } = useMinimumMaximumController();

  return (
    <>
      {selectedField?.fields.validation?.includes('default_value') && (
        <Form.Item
          label={t('common.labels.form_field_default_value')}
          name="multiSelectDefaultValue"
          rules={[
            {
              message: t(
                'common.labels.form_field_boolean_default_value_error'
              ),
              // @ts-ignore
              type: selectedField?.key === 'select' ? 'single' : 'array',
            },
          ]}>
          <Select
            // @ts-ignore
            mode={selectedField?.key === 'select' ? 'single' : 'multiple'}
            suffixIcon={<DownArrowIcon />}
            placeholder={t(
              'common.labels.form_field_boolean_default_value_placeholder'
            )}>
            {defaultSelectValue?.map((item) => (
              <Select.Option value={item}>{item}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {selectedField?.fields.validation?.includes('select_default_value') && (
        <Form.Item
          label={t('common.labels.form_field_default_value')}
          name="selectDefaultValue"
          rules={[
            {
              message: t(
                'common.labels.form_field_boolean_default_value_error'
              ),
            },
          ]}>
          <Select
            suffixIcon={<DownArrowIcon />}
            placeholder={t(
              'common.labels.form_field_boolean_default_value_placeholder'
            )}>
            <Select.Option value="true">
              {t('common.labels.form_field_boolean_true_option')}
            </Select.Option>
            <Select.Option value="false">
              {t('common.labels.form_field_boolean_false_option')}
            </Select.Option>
          </Select>
        </Form.Item>
      )}

      {selectedField?.fields.validation?.includes('attached_field') && (
        <Form.Item
          label={t('common.labels.form_field_attached')}
          name="attachedField"
          rules={[
            {
              message: t('common.labels.form_field_attached_error'),
            },
          ]}>
          <Select placeholder={t('common.labels.form_field_select_format')}>
            <Select.Option value="all">{t('common.labels.all')}</Select.Option>{' '}
            <Select.Option value="image">
              {t('common.labels.form_field_attached_file_image_option')}
            </Select.Option>
            <Select.Option value="file">
              {t('common.labels.form_field_attached_file_file_option')}
            </Select.Option>
          </Select>
        </Form.Item>
      )}
      {selectedField?.fields.validation?.includes('regexp_pattern') && (
        <Form.Item
          label={t('common.labels.form_field_regexp_pattern')}
          name="regExPatten"
          rules={[
            {
              type: 'regexp',
              message: t('common.labels.form_field_regexp_pattern_value_error'),
            },
          ]}
          extra={t('common.labels.form_field_regexp_pattern_help_text')}
          normalize={(value) => value.trimStart()}>
          <Input
            placeholder={t(
              'common.labels.form_field_regexp_pattern_value_placeholder'
            )}
          />
        </Form.Item>
      )}
      <Form.Item name="validation" className="checkboxgroup">
        <Checkbox.Group>
          {selectedField?.fields.validation?.includes('required_field') && (
            <Checkbox value="required_field">
              {t('common.labels.form_field_required_field')}
              <p>{t('common.labels.form_field_required_subtitle')}</p>
            </Checkbox>
          )}
          {selectedField?.fields.validation?.includes(
            'enable_localization'
          ) && (
            <Checkbox value="enable_localization">
              {t('common.labels.form_field_enable_localization')}
              <p>
                {t('common.labels.form_field_enable_localization_subtitle')}
              </p>
            </Checkbox>
          )}
          {selectedField?.fields.validation?.includes('unique_field') && (
            <Checkbox value="unique_field">
              {t('common.labels.form_field_unique_field')}
              <p>{t('common.labels.form_field_unique_field_subtitle')}</p>
            </Checkbox>
          )}
          {selectedField?.fields.validation?.includes('private_field') && (
            <Checkbox value="private_field">
              {t('common.labels.form_field_private_field')}
              <p>{t('common.labels.form_field_private_field_subtitle')}</p>
            </Checkbox>
          )}
          {selectedField?.fields.validation?.includes(
            'multiple_records_select'
          ) && (
            <Checkbox value="multiple_records_select">
              {t('common.labels.content_modal_multi_records')}
              <p>{t('common.labels.content_modal_multi_records_subtitle')}</p>
            </Checkbox>
          )}
          {selectedField?.fields.validation?.includes('minimum_length') && (
            <>
              <div className="checkbox-with-input">
                <Checkbox value="minimum_length">
                  {selectedField.key === 'number'
                    ? t('common.labels.minimum_number')
                    : t('common.labels.form_field_minimum_length')}
                  <p>{t('common.labels.form_field_minimum_length_subtitle')}</p>
                </Checkbox>
                {minimumInputVisible && (
                  <Form.Item
                    name="minimumLengthValue"
                    rules={[
                      {
                        required: true,
                        message: t(
                          'common.labels.form_field_minimum_length_error'
                        ),
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            getFieldValue('maximumLengthValue') > value ||
                            !getFieldValue('maximumLengthValue') ||
                            !value
                          ) {
                            return Promise.resolve(true);
                          }
                          return Promise.reject(
                            new Error(
                              t(
                                'common.labels.content_modal_minimum_value_validation'
                              )
                            )
                          );
                        },
                      }),
                    ]}
                    key="1">
                    <InputNumber
                      min={0}
                      placeholder={t(
                        'common.labels.form_field_enter_minimum_value_placeholder'
                      )}
                    />
                  </Form.Item>
                )}
              </div>
            </>
          )}
          {selectedField?.fields.validation?.includes('maximum_length') && (
            <>
              <div className="checkbox-with-input">
                <Checkbox value="maximum_length">
                  {selectedField.key === 'number'
                    ? t('common.labels.maximum_number')
                    : t('common.labels.form_field_maximum_length')}
                  <p>{t('common.labels.form_field_maximum_length_subtitle')}</p>
                </Checkbox>
                {maximumInputVisible && (
                  <Form.Item
                    name="maximumLengthValue"
                    rules={[
                      {
                        required: true,
                        message: t(
                          'common.labels.form_field_maximum_length_error'
                        ),
                      },

                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            getFieldValue('minimumLengthValue') < value ||
                            !value
                          ) {
                            return Promise.resolve(true);
                          }
                          return Promise.reject(
                            new Error(
                              t(
                                'common.labels.content_modal_maximum_value_validation'
                              )
                            )
                          );
                        },
                      }),
                    ]}
                    key="2">
                    <InputNumber
                      min={0}
                      placeholder={t(
                        'common.labels.form_field_enter_maximum_value_placeholder'
                      )}
                    />
                  </Form.Item>
                )}
              </div>
            </>
          )}
        </Checkbox.Group>
      </Form.Item>
    </>
  );
};
export default RegularValidationTabPane;
