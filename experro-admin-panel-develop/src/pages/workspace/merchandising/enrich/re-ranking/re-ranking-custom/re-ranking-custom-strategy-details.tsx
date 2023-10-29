import React from 'react';
import { Button, Form, InputNumber, Select } from 'antd';
import DownArrowIcon from '../../../../../../images/icons/downarrow-icon';
import useReRankingCustomStrategyController from './re-ranking-custom-strategy-controller';
import { IReRankingStrategy } from '../../../../../../types';
import CrossIcon from '../../../../../../images/icons/cross-icon';

export interface ReRankingCustomStrategyDetailsProps {
  newSelectedStrategy: IReRankingStrategy;
  isSavedAction: boolean;
  updateSavedAction: (isSavedAction: boolean) => void;
  updateStrategy: (strategy: IReRankingStrategy) => void;
  updateActionEnabled: (isEnabled: boolean) => void;
}

const ReRankingCustomStrategyDetails: React.FC<
  ReRankingCustomStrategyDetailsProps
> = ({
  newSelectedStrategy,
  isSavedAction,
  updateSavedAction,
  updateStrategy,
  updateActionEnabled,
}) => {
  const {
    t,
    form,
    isFieldsLoading,
    productFields,
    sortLevelFields1,
    sortLevelFields2,
    onSortLevel1Change,
    onSortLevel2Change,
    selectedWeightageFields,
    isAddWeightedFieldEnabled,
    onFieldWeightageChange,
    onFieldSelected,
    onFieldDeselected,
    onFieldWeightageFinish,
    onAddWeightageFields,
    onRemoveWeightageField,
  } = useReRankingCustomStrategyController({
    newSelectedStrategy,
    isSavedAction,
    updateSavedAction,
    updateStrategy,
    updateActionEnabled,
  });

  return (
    <Form
      layout="vertical"
      form={form}
      className="w-480"
      labelCol={{
        span: 24,
      }}
      wrapperCol={{
        span: 24,
      }}
      autoComplete="off"
      onFinish={onFieldWeightageFinish}
      name="custom-stratey-form">
      <div className="custom-strategy-section">
        <h5>{t('common.labels.sorting_order')}</h5>
        <div className="ant-row ant-row-space-between">
          <Form.Item
            name={['sortOrders', 'level1']}
            className="w-50"
            label={t('common.labels.sort_level_one')}>
            <Select
              onChange={onSortLevel1Change}
              showSearch={true}
              loading={isFieldsLoading}
              suffixIcon={<DownArrowIcon />}
              options={sortLevelFields1?.map((option) => {
                return { value: option.id, label: option.title };
              })}
            />
          </Form.Item>
          <Form.Item
            name={['sortOrders', 'level2']}
            className="w-50"
            label={t('common.labels.sort_level_two')}>
            <Select
              data-testid={'sort-order-level2'}
              showSearch={true}
              onChange={onSortLevel2Change}
              loading={isFieldsLoading}
              suffixIcon={<DownArrowIcon />}
              options={sortLevelFields2?.map((option) => {
                return { value: option.id, label: option.title };
              })}
            />
          </Form.Item>
        </div>
      </div>
      <div className="custom-strategy-form-sction">
        <div className="custom-strategy-form-sction-top">
          <Form.Item
            name={'fields'}
            label={t('common.labels.fields')}
            rules={[
              {
                required: true,
                message: t('common.messages.custom_strategy_field_empty_error'),
              },
            ]}>
            <Select
              data-testid={'fields'}
              showArrow={true}
              mode="multiple"
              maxTagPlaceholder={(props) => <p>+{props.length}</p>}
              suffixIcon={<DownArrowIcon />}
              popupClassName="custom-stratey-form-fields-list"
              maxTagCount={3}
              placeholder={t('common.labels.fields_placeholder')}
              onSelect={onFieldSelected}
              onDeselect={onFieldDeselected}>
              {productFields.map((option) => {
                return (
                  <Select.Option value={option.id}>
                    {option.typeIcon}
                    {option.title}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Button
            type="primary"
            onClick={onAddWeightageFields}
            disabled={!isAddWeightedFieldEnabled}
            htmlType="button">
            {t('common.labels.add')}
          </Button>
        </div>

        {selectedWeightageFields.length > 0 ? (
          <div>
            <h5>{t('common.labels.field_percentage')}</h5>
            {selectedWeightageFields.map((field, index) => (
              <div key={index} className="filed-weightage">
                <div className="ant-row ant-space-align-center ant-row-space-between">
                  <div className="ant-row ant-space-align-center">
                    {field.typeIcon}
                    <span className="filed-weightage-title">{field.title}</span>
                  </div>
                  <div className="ant-row ant-space-align-center">
                    <Form.Item
                      className="m-0"
                      name={['fieldsWeightage', index, 'percentage']}>
                      <InputNumber
                        parser={(value) =>
                          !value || !value.length ? 0 : parseInt(value)
                        }
                        data-testid={'field-input'}
                        onChange={onFieldWeightageChange}
                        min={0}
                        max={100}
                      />
                    </Form.Item>
                    <span className="m-r-16">%</span>
                    <Button
                      data-testid={`remove-field-${index}`}
                      icon={<CrossIcon />}
                      onClick={() => onRemoveWeightageField(field)}
                      key="remove"
                      className="onlyIcon"></Button>
                  </div>
                  {/* <div>
                    <Button
                      onClick={() => onRemoveWeightageField(field)}
                      key="remove">
                      <CrossIcon />
                    </Button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Form>
  );
};

export default ReRankingCustomStrategyDetails;
