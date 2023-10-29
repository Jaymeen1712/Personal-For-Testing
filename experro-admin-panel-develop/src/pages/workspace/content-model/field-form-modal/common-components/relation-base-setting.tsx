import React from 'react';
import { Form, Input, Select } from 'antd';

import useMinimumMaximumController from './relation-value-controller';
import useEnums from '../../enums';
import { ContentModelList } from '../../../../../types';
import DownArrowIcon from "../../../../../images/icons/downarrow-icon";

interface RelationProps {
  relationValue: string;
  setRelationValue: (id: string) => void;
  selectedContentDetails:
    | { key: string; label: string; description?: string }
    | undefined;
  internalFieldName?: string;
  onBlur?: () => void;
  editContentFieldStatus?: boolean;
  internalFieldNameChange?: (e: string) => void;
  editInternalFieldName?: string;
  extensionName?: string;
  duplicateFieldOnBlur: () => void;
  modelList: ContentModelList[];

  destinationContentModalId?: string;
}

const RelationBaseSettingTabPane: React.FC<RelationProps> = ({
  relationValue,
  setRelationValue,
  selectedContentDetails,
  internalFieldName,
  onBlur,
  editContentFieldStatus,
  editInternalFieldName,
  internalFieldNameChange,
  extensionName,
  duplicateFieldOnBlur,
  modelList,
  destinationContentModalId,
}) => {
  const { t, changeRelationValue, selectedContentModalName } =
    useMinimumMaximumController(modelList, destinationContentModalId);
  const { RELATIONS } = useEnums();
  return (
    <>
      <div className="relationinputwrap">
        <div className="formitems">
          <Form.Item className="m-0">
            <Input placeholder={selectedContentDetails?.label} disabled />
          </Form.Item>
        </div>
        <div className="formitems custom-label-input-use">
          <Form.Item
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
              maxLength={255}
              onBlur={onBlur}
            />
          </Form.Item>
        </div>
        {!editContentFieldStatus ? (
          <div className="formitems">
            <Form.Item
              name="internalFieldName"
              label={t('common.labels.form_field_internal_field_name')}
              className="m-0"
              rules={[
                {
                  required: true,
                  message: t(
                    'common.messages.please_enter_internal_field_name'
                  ),
                },
              ]}
              normalize={(value) => value.trimStart()}>
              <Input
                name="internalFieldName"
                onChange={(e) => {
                  internalFieldNameChange &&
                    internalFieldNameChange(e.target.value);
                }}
                placeholder={t(
                  'common.labels.add_internal_field_name_placeholder'
                )}
                value={internalFieldName}
                addonAfter={extensionName}
              />
            </Form.Item>
          </div>
        ) : (
          <div className="formitems">
            <label className="custom-input-label">
              {t('common.labels.form_field_internal_field_name')}
            </label>
            <Input
              disabled
              value={editInternalFieldName}
              placeholder={t('common.labels.form_field_name_placeholder')}
            />
          </div>
        )}
      </div>
      <div className="flowchart">
        <>
          {RELATIONS.map((item) => (
            <div
              className={`flowcharticon ${
                relationValue === item.key ? 'active' : ''
              } ${editContentFieldStatus && 'table-section table-disable'}`}
              onClick={() => {
                if (!editContentFieldStatus) setRelationValue(item.key);
              }}
              data-testid="relationIcon">
              {item.icon}
            </div>
          ))}
        </>

        <div className="info">
          {selectedContentDetails?.label}
          <span data-testid="relationSpan">
            {relationValue === 'oneToOne'
              ? ' has one and belongs to one '
              : relationValue === 'oneToMany'
              ? ' belongs to many '
              : relationValue === 'manyToOne'
              ? ' can be many for '
              : ' has and belongs to many '}
          </span>
          {selectedContentModalName ? selectedContentModalName : 'Review'}
        </div>
      </div>
      <div className="relationinputwrap">
        <div className="formitems">
          <Form.Item
            name="relationSelect"
            className="m-0"
            rules={[
              {
                required: true,
                message: t('common.messages.please_select_content'),
              },
            ]}>
            <Select
              onChange={changeRelationValue}
              suffixIcon={<DownArrowIcon />}
              placeholder={t(
                'common.labels.form_field_relation_select_placeholder'
              )}>
              {modelList.map(
                (item) => (
                  // selectedContentDetails?.label !== item.label && (
                  <Select.Option value={item.id}>{item.name}</Select.Option>
                )
                // )
              )}
            </Select>
          </Form.Item>
        </div>
        <div className="formitems">
          <Form.Item
            label={t('common.labels.form_field_name')}
            name="destinationFieldName"
            className="m-0"
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
              maxLength={255}
              onBlur={duplicateFieldOnBlur}
            />
          </Form.Item>
        </div>
      </div>
    </>
  );
};
export default RelationBaseSettingTabPane;
