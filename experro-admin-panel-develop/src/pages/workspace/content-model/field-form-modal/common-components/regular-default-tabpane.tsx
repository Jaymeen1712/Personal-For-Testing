import React from 'react';
import { Checkbox, Form, Input, Radio, Select, TreeSelect } from 'antd';

import { FormFileProps } from '../../../../../types';
import useMinimumMaximumController from './relation-value-controller';
import DownArrowIcon from '../../../../../images/icons/downarrow-icon';
import useRegularDefaultController from './regular-default-controller';

const RegularDefaultTabPane: React.FC<FormFileProps> = ({
  selectedField,
  internalFieldName,
  onBlur,
  editContentFieldStatus,
  internalFieldNameChange,
  editInternalFieldName,
  extensionName,
  initialSelectedModals,
}) => {
  const { t } = useMinimumMaximumController();
  const { TextArea } = Input;
  const { SHOW_PARENT } = TreeSelect;

  const { modelList, selectedModalLength, onModalSelectChange } =
    useRegularDefaultController(selectedField?.key);
  return (
    <>
      {selectedField?.fields.default?.includes('field_name') && (
        <div className="custom-label-input">
          <Form.Item
            wrapperCol={{ span: 24 }}
            label={t('common.labels.form_field_name')}
            name="fieldName"
            rules={[
              {
                required: true,
                message: t('common.labels.form_field_name_error'),
              },
              {
                pattern: new RegExp(/^[ A-Za-z0-9]*$/i),
                message: t('common.messages.format', {
                  entity: t('common.labels.form_field_name'),
                }),
              },
            ]}
            normalize={(value) => value.trimStart()}>
            <Input
              placeholder={t('common.labels.form_field_name_placeholder')}
              onBlur={onBlur}
              maxLength={255}
            />
          </Form.Item>
        </div>
      )}
      {selectedField?.key === 'text' && (
        <div className="custom-label-input">
          <Form.Item
            name="textRadioButton"
            rules={[
              {
                required: true,
                message: t('common.labels.form_field_select_text_error'),
              },
            ]}>
            <Radio.Group className="radiogroup">
              {selectedField?.fields.default?.includes('short_text') && (
                <div>
                  <Radio value="shortText">
                    {t('common.labels.form_field_short_text')}
                  </Radio>
                  <p>{t('common.labels.form_field_short_text_subtitle')}</p>
                </div>
              )}
              {selectedField?.fields.default?.includes('long_text') && (
                <div>
                  <Radio value="longText">
                    {t('common.labels.form_field_long_text')}
                  </Radio>
                  <p>{t('common.labels.form_field_long_text_subtitle')}</p>
                </div>
              )}
            </Radio.Group>
          </Form.Item>
        </div>
      )}{' '}
      {selectedField?.fields.default?.includes('values') && (
        <div className="custom-label-input">
          <Form.Item
            label={t('common.labels.form_field_select_value')}
            name="selectValues"
            rules={[
              {
                required: true,
                message: t('common.labels.form_field_enter_value_error'),
              },
            ]}
            normalize={(value) => value.trimStart()}>
            <TextArea
              placeholder={t(
                'common.labels.form_field_enter_value_placeholder'
              )}
            />
          </Form.Item>
        </div>
      )}
      {selectedField?.fields.default?.includes('number_format') && (
        <div className="custom-label-input">
          <Form.Item
            label={t('common.labels.form_field_attached_placeholder')}
            name="numberFormatSelect"
            rules={[
              {
                required: true,
                message: t('common.labels.form_field_select_format_error'),
              },
            ]}>
            <Select
              placeholder={t('common.labels.form_field_select_format')}
              suffixIcon={<DownArrowIcon />}>
              <Select.Option value="integer">
                {t('common.labels.form_field_integer_select_option')}
              </Select.Option>
              <Select.Option value="double">
                {t('common.labels.form_field_double_select_option')}
              </Select.Option>
              <Select.Option value="long">
                {t('common.labels.form_field_long_select_option')}
              </Select.Option>
              <Select.Option value="float">
                {t('common.labels.form_field_float_select_option')}
              </Select.Option>
            </Select>
          </Form.Item>
        </div>
      )}
      {selectedField?.fields.default?.includes('type') && (
        <div className="custom-label-input">
          <Form.Item
            label={t('common.labels.form_field_date_type')}
            name="dateTypeSelect"
            rules={[
              {
                required: true,
                message: t('common.labels.form_field_select_date_type_error'),
              },
            ]}>
            <Select
              placeholder={t('common.labels.form_field_select_date_type')}
              suffixIcon={<DownArrowIcon />}
              disabled={editContentFieldStatus}>
              <Select.Option value="date">
                {t('common.labels.form_field_date_select_option')}
              </Select.Option>
              <Select.Option value="time">
                {t('common.labels.time')}
              </Select.Option>
              <Select.Option value="datetime">
                {t('common.labels.form_field_datetime_select_option')}
              </Select.Option>
            </Select>
          </Form.Item>
        </div>
      )}{' '}
      {selectedField?.fields.default?.includes('content_model_list') && (
        <div className="custom-label-input">
          <Form.Item
            label={t('common.labels.select_models')}
            name="selectModels"
            rules={[
              {
                required: true,
                message: t('common.messages.form_field_model_select_error'),
              },
            ]}>
            <TreeSelect
              onChange={onModalSelectChange}
              placeholder={t('common.labels.select_modal_placeholder')}
              showCheckedStrategy={SHOW_PARENT}
              treeCheckable={true}
              maxTagCount={4}
              filterTreeNode={(search, item) => {
                return (
                  //@ts-ignore
                  item?.label?.toLowerCase().indexOf(search.toLowerCase()) >= 0
                );
              }}
              maxTagPlaceholder={
                Object.keys(modelList).length > 4 &&
                `+ ${
                  selectedModalLength ||
                  (initialSelectedModals && initialSelectedModals.length - 4)
                } `
              }
              treeData={
                modelList &&
                modelList.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))
              }
            />
          </Form.Item>
        </div>
      )}
      <div className="custom-label-input">
        {!editContentFieldStatus ? (
          <Form.Item
            name="internalFieldName"
            label={t('common.labels.form_field_internal_field_name')}
            rules={[
              {
                required: true,
                message: t('common.messages.please_enter_internal_field_name'),
              },
            ]}
            initialValue={internalFieldName}>
            <Input
              name="internalFieldName"
              onChange={(e) => {
                internalFieldNameChange &&
                  internalFieldNameChange(e.target.value);
              }}
              value={internalFieldName}
              placeholder={t(
                'common.labels.add_internal_field_name_placeholder'
              )}
              addonAfter={extensionName}
            />
          </Form.Item>
        ) : (
          <>
            <label className="custom-input-label">
              {t('common.labels.form_field_internal_field_name')}
            </label>
            <Input
              disabled
              value={editInternalFieldName}
              placeholder={t('common.labels.form_field_name_placeholder')}
            />
          </>
        )}
        {selectedField?.key?.includes('currency') && (
          <span className="input-label-text">
            Note: By default currency field stores value in USD.
          </span>
        )}
      </div>
      {selectedField?.key === 'rich-text' &&
        selectedField?.fields.default?.includes('rich_text_inline') && (
          <div className="custom-label-input">
            <Form.Item
              name="richTextEditorType"
              rules={[
                {
                  required: true,
                  message: t('common.labels.form_field_select_text_error'),
                },
              ]}>
              <Radio.Group className="radiogroup">
                <div>
                  <Radio value="defaultEditor">
                    {t('common.labels.default_editor')}
                  </Radio>
                  <p>{t('common.labels.default_editor_sub_text')}</p>
                </div>
                <div>
                  <Radio value="inlineEditor">
                    {t('common.labels.inline_editor')}
                  </Radio>
                  <p>{t('common.labels.inline_editor_sub_text')}</p>
                </div>
              </Radio.Group>
            </Form.Item>
          </div>
        )}
      {selectedField?.fields.default?.includes('is_searchable') && (
        <div className="custom-label-input">
          <Form.Item
            name="isSearchable"
            valuePropName="checked"
            className="m-0">
            <Checkbox disabled={editContentFieldStatus}>
              {t('common.labels.form_field_is_searchable')}
            </Checkbox>
          </Form.Item>
        </div>
      )}
      {selectedField?.key === 'media' && (
        <div className="custom-label-input">
          <Form.Item
            name="mediaRadioButton"
            rules={[
              {
                required: true,
                message: t('common.labels.form_field_media_type_error'),
              },
            ]}>
            <Radio.Group>
              {selectedField?.fields.default?.includes('single_media') && (
                <Radio value="singleMedia">
                  {t('common.labels.form_field_single_media')}
                </Radio>
              )}

              {selectedField?.fields.default?.includes('multiple_media') && (
                <Radio value="multipleMedia">
                  {t('common.labels.form_field_multiple_media')}
                </Radio>
              )}
            </Radio.Group>
          </Form.Item>
        </div>
      )}
      {/*{selectedField?.fields.default?.includes('script_position') && (*/}
      {/*  <div className="custom-label-input">*/}
      {/*    <Form.Item*/}
      {/*      label={t('common.labels.select_script_position')}*/}
      {/*      name={*/}
      {/*        editContentFieldStatus*/}
      {/*          ? `${*/}
      {/*              editInternalFieldName?.split('_script_etl')[0]*/}
      {/*            }_script_position_es`*/}
      {/*          : `${internalFieldName}_script_position_es`*/}
      {/*      }*/}
      {/*      initialValue="head"*/}
      {/*      rules={[*/}
      {/*        {*/}
      {/*          required: true,*/}
      {/*          message: t(*/}
      {/*            'common.messages.form_field_select_script_position_error'*/}
      {/*          ),*/}
      {/*        },*/}
      {/*      ]}>*/}
      {/*      <Select*/}
      {/*        placeholder={t('common.labels.select_script_position')}*/}
      {/*        defaultValue="head">*/}
      {/*        <Select.Option value="head">*/}
      {/*          {t('common.labels.head')}*/}
      {/*        </Select.Option>*/}
      {/*        <Select.Option value="body">*/}
      {/*          {t('common.labels.body')}*/}
      {/*        </Select.Option>*/}
      {/*      </Select>*/}
      {/*    </Form.Item>*/}
      {/*  </div>*/}
      {/*)}*/}
      {/*{selectedField?.fields.default?.includes('enable_ssr') && (*/}
      {/*  <div className="custom-label-input">*/}
      {/*    <Form.Item*/}
      {/*      name={*/}
      {/*        editContentFieldStatus*/}
      {/*          ? `${*/}
      {/*              editInternalFieldName?.split('_script_etl')[0]*/}
      {/*            }_script_ssr_es`*/}
      {/*          : `${internalFieldName}_script_ssr_es`*/}
      {/*      }*/}
      {/*      initialValue={true}*/}
      {/*      valuePropName="checked"*/}
      {/*      className="m-0">*/}
      {/*      <Checkbox>*/}
      {/*        {t('common.labels.enable_server_side_rendering')}*/}
      {/*      </Checkbox>*/}
      {/*    </Form.Item>*/}
      {/*  </div>*/}
      {/*)}*/}
    </>
  );
};
export default RegularDefaultTabPane;
