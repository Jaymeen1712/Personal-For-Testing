import React from 'react';
import { TFunction } from 'react-i18next';
import { Button, Collapse, Form, Input, Select, Slider } from 'antd';

import {
  ACTION_OPERATIONS,
  ACTION_OPERATIONS_ON_SORT_CONDITION,
  NUMBER_REGEX_PATTERN,
  TEXT_REGEX_PATTERN,
} from '../../../../../../../utills';
import Modal from '../../../../../../../components/modal';
import useRuleTabController from './rule-tab-controller';
import GridMenu from '../../../../../../../components/grid-menu';
import { IRuleList, RulesEj, RuleType } from '../../../../../../../types';
import FormItem from '../../../../../../../components/form-items/form-item';
import RoundCloseIcon from '../../../../../../../images/icons/round-close-icon';
import PlusIcon from '../../../../../../../images/icons/plus-icon';
import DownArrowIcon from '../../../../../../../images/icons/downarrow-icon';
import PlusBlackIcon from '../../../../../../../images/icons/plus-black-icon';
import ArrowLeftIcon from '../../../../../../../images/icons/arrow-left-icon';
import ArrowRightIcon from '../../../../../../../images/icons/arrow-right-icon';

const { Panel } = Collapse;

const RuleTab: React.FC<{
  rulesList?: IRuleList;
  addRule?: (data: RulesEj, ruleType: RuleType) => void;
  editRule?: (data: RulesEj, ruleType: RuleType) => void;
  deleteRule?: (ruleType: RuleType, id?: string) => void;
  onHideSubRuleDelete?: () => void;
  isDeleteSubRule?: boolean;
  setIsDeleteSubRule: (isDeleteSubRule: boolean) => void;
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environmentId?: string;
  setIsAddButtonVisibleRule: (isAddButtonVisibleRule: boolean) => void;
  isAddButtonVisibleRule: boolean;
}> = ({
  rulesList,
  addRule,
  editRule,
  deleteRule,
  isDeleteSubRule,
  onHideSubRuleDelete,
  setIsDeleteSubRule,
  t,
  workspaceId,
  environmentId,
  setIsAddButtonVisibleRule,
  isAddButtonVisibleRule,
}) => {
  const {
    isEditing,
    form,
    initialData,
    onFinish,
    onOperationChanges,
    isSliderVisible,
    onProductSelect,
    listProduct,
    onProductTypeSelect,
    selectedTypeActions,
    isSearchable,
    onProductValueSelect,
    onProductValueSelectInput,
    onAddClick,
    onCancel,
    onEditSubRule,
    onDuplicateSubRule,
    onDeleteSubRule,
    onAddRule,
    onDeleteSubRuleRules,
    onRemove,
    selectedProductValues,
    selectedProductType,
  } = useRuleTabController({
    workspaceId,
    setIsDeleteSubRule,
    deleteRule,
    addRule,
    editRule,
    environmentId,
    t,
    setIsAddButtonVisibleRule,
  });

  return (
    <>
      {isEditing ? (
        <Form
          form={form}
          layout={'vertical'}
          initialValues={initialData}
          onFinish={onFinish}
          autoComplete="off">
          <div className="sidebar-top-section">
            <Form.Item
              label={t('common.labels.rule_name')}
              name="name"
              className="w-100"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.rule_name'),
                  }),
                },
              ]}>
              <Input placeholder={t('common.labels.enter_name')} />
            </Form.Item>
            <FormItem
              type="select"
              label={t('common.labels.operation')}
              name="operation"
              placeholder={t('common.labels.choose_operation_placeholder')}
              suffixIcon={<DownArrowIcon />}
              classname="w-100"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.operation'),
                  }),
                },
              ]}
              options={
                rulesList?.contentModelFieldData.sortEj &&
                rulesList.contentModelFieldData.sortEj?.length > 0
                  ? ACTION_OPERATIONS_ON_SORT_CONDITION
                  : ACTION_OPERATIONS
              }
              onChange={onOperationChanges}
              mode={'single'}
            />
            {isSliderVisible && (
              <Form.Item
                initialValue={0}
                name="strength"
                className="w-100 p-4 boost-burry-slider"
                rules={[
                  {
                    required: true,
                    pattern: /[^0]+/,
                    message: t('common.messages.required', {
                      entity: t('common.labels.strength'),
                    }),
                  },
                ]}>
                <Slider
                  included={false}
                  min={-100}
                  max={100}
                  marks={{
                    '-100': '-100%',
                    0: '0%',
                    100: '100%',
                  }}
                  tipFormatter={(value) => `${value}%`}
                />
              </Form.Item>
            )}
            <Form.List name="conditions">
              {(fields) => {
                return (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item key={field.key} className="rule-condition">
                        <Form.Item
                          name={[field.name, 'fieldInternalName']}
                          label={t('common.labels.field')}>
                          <Select
                            placeholder={t('common.labels.select')}
                            showSearch={true}
                            suffixIcon={<DownArrowIcon />}
                            onChange={(e) => onProductSelect(e, index)}>
                            {listProduct.data?.map((product) => (
                              <Select.Option
                                key={product.id}
                                value={product.fieldName}>
                                {product.title}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          name={[field.name, 'action']}
                          label={t('common.labels.condition')}>
                          <Select
                            placeholder={t('common.labels.select')}
                            suffixIcon={<DownArrowIcon />}
                            onChange={(e) => onProductTypeSelect(e, index)}>
                            {selectedTypeActions[index].data.map((type) => (
                              <Select.Option
                                key={type.value}
                                value={type.value}>
                                {type.label}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

                        {isSearchable[index] ? (
                          <Form.Item
                            name={[field.name, 'value']}
                            label={t('common.labels.value')}>
                            <Select
                              placeholder={t('common.labels.set_value')}
                              showSearch={true}
                              suffixIcon={<DownArrowIcon />}
                              onChange={(e) => onProductValueSelect(e, index)}>
                              {selectedProductValues[index] &&
                                selectedProductValues[index] !== undefined &&
                                selectedProductValues[index].length > 0 &&
                                selectedProductValues[index].map(
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  (productValue: any) => (
                                    <Select.Option
                                      key={productValue}
                                      value={productValue}>
                                      {productValue}
                                    </Select.Option>
                                  )
                                )}
                            </Select>
                          </Form.Item>
                        ) : (
                          <Form.Item
                            name={[field.name, 'value']}
                            label={t('common.labels.value')}
                            rules={[
                              {
                                whitespace: true,
                                message: t('common.messages.please_provide'),
                              },
                              {
                                max: 255,
                                message: t(
                                  'common.messages.reached_maximum_length'
                                ),
                              },
                              {
                                pattern:
                                  selectedProductType[index] === 'number'
                                    ? NUMBER_REGEX_PATTERN
                                    : TEXT_REGEX_PATTERN,
                                message: t('common.messages.format', {
                                  entity: t('common.labels.value'),
                                }),
                              },
                            ]}>
                            <Input
                              onChange={(e) =>
                                onProductValueSelectInput(e, index)
                              }
                              placeholder={t('common.labels.set_value')}
                            />
                          </Form.Item>
                        )}
                        {fields.length > 1 && (
                          <Button
                            type="link"
                            className="round-close-icon"
                            onClick={() => onRemove(field.name)}
                            icon={<RoundCloseIcon />}></Button>
                        )}
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        type="link"
                        className="dark-black"
                        onClick={(e) => onAddClick(e)}
                        icon={
                          <span className="anticon">
                            <PlusBlackIcon />
                          </span>
                        }>
                        {t('common.labels.add_condition')}
                      </Button>
                    </Form.Item>
                  </>
                );
              }}
            </Form.List>
          </div>
          <div className="sidebar-bottom-section ant-row ant-space-align-center ant-row-space-between">
            <Form.Item className="m-0">
              <Button type="link" onClick={onCancel} size="large">
                <ArrowLeftIcon />
              </Button>
            </Form.Item>
            <div className="ant-row">
              <Form.Item className="m-0 m-r-16">
                <Button onClick={onCancel}>{t('common.labels.cancel')}</Button>
              </Form.Item>
              <Form.Item className="m-0">
                <Button
                  disabled={isAddButtonVisibleRule}
                  type="primary"
                  htmlType="submit">
                  {t('common.labels.add')}
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      ) : (
        <div className="sidebar-top-section collapse-sidebar-section">
          <h4 className="m-b-16 gray-text title-sm font-normal">
            {t('common.labels.add_rule_instruction')}
          </h4>
          <Collapse
            collapsible="header"
            expandIcon={({ isActive }) =>
              isActive ? (
                <span className="anticon">
                  <ArrowRightIcon />
                </span>
              ) : (
                <span className="anticon">
                  <ArrowRightIcon />
                </span>
              )
            }>
            {rulesList?.contentModelFieldData.rulesEj?.map(
              (rule: RulesEj, index) => {
                return (
                  <Panel
                    header={rule?.name || ''}
                    key={index}
                    extra={
                      <GridMenu
                        menuList={[
                          {
                            key: 'Edit Button',
                            label: t('common.labels.edit'),
                            onClick: () => onEditSubRule(rule),
                          },
                          {
                            key: 'Duplicate Button',
                            label: t('common.labels.duplicate'),
                            onClick: () => onDuplicateSubRule(rule),
                          },
                          {
                            key: 'Delete Button',
                            className: 'text-red',
                            label: t('common.labels.delete'),
                            onClick: () => onDeleteSubRule(rule),
                          },
                        ]}
                        id={''}
                      />
                    }>
                    <div className="product-condition-labels">
                      <h5>{t('common.labels.operation')}</h5>
                      <div className="ant-row media-content-details operation-text">
                        <span>
                          <b>{rule.operation}</b>
                        </span>
                        {(rule.operation === 'boost' ||
                          rule.operation === 'bury') && (
                          <p
                            className={
                              rule.operation === 'boost'
                                ? 'text-green'
                                : 'text-red'
                            }>
                            {rule.operation === 'bury'
                              ? '- ' + rule.strength
                              : rule.strength}
                          </p>
                        )}
                      </div>
                    </div>
                    {rule.conditions?.map((rule, index) => (
                      <div className="media-content-details product-condition-labels">
                        <>
                          <h5>
                            {t('common.labels.condition')}
                            {index + 1}
                          </h5>
                          <div className="ant-row ant-row-space-between">
                            <span>{t('common.labels.field')} :</span>
                            <p>{rule.fieldName}</p>
                          </div>
                          <div className="ant-row ant-row-space-between">
                            <span>{t('common.labels.condition')} :</span>
                            <p>{rule.action?.replaceAll('_', ' ')}</p>
                          </div>
                          <div className="ant-row ant-row-space-between">
                            <span>{t('common.labels.value')} :</span>
                            <p>{rule.value}</p>
                          </div>
                        </>
                      </div>
                    ))}
                  </Panel>
                );
              }
            )}
          </Collapse>
          <Form.Item>
            <Button
              className="primary-color"
              onClick={onAddRule}
              block
              icon={
                <span className="anticon">
                  <PlusIcon />{' '}
                </span>
              }>
              {t('common.labels.add_rule')}
            </Button>
          </Form.Item>
        </div>
      )}
      <Modal
        classname="confirm-modal"
        title={t('common.labels.please_confirm')}
        hideModal={onHideSubRuleDelete}
        onOK={onDeleteSubRuleRules}
        okText={t('common.labels.delete')}
        isModalVisibility={isDeleteSubRule}>
        {t('common.labels.delete_rule_message')}
      </Modal>
    </>
  );
};

export default RuleTab;
