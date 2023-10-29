import React, { useEffect, useState } from 'react';
import { TFunction } from 'react-i18next';
import {
  Alert,
  Button,
  Collapse,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd';
import { LeftOutlined } from '@ant-design/icons';

import GridMenu from '../../../../../../../components/grid-menu';
import { IWidgetRuleList, RuleType, SlotEj } from '../../../../../../../types';
import Modal from '../../../../../../../components/modal';
import useSlotTabController from './slot-tab-controller';
import RoundCloseIcon from '../../../../../../../images/icons/round-close-icon';
import {
  NUMBER_REGEX_PATTERN,
  TEXT_REGEX_PATTERN,
} from '../../../../../../../utills';
import PlusCircleIcon from '../../../../../../../images/icons/pluscircle-icon';
import PlusIcon from '../../../../../../../images/icons/plus-icon';
import ArrowRightIcon from "../../../../../../../images/icons/arrow-right-icon";

const { Panel } = Collapse;

const SlotTab: React.FC<{
  rulesList?: IWidgetRuleList;
  addRule?: (data: SlotEj, ruleType: RuleType) => void;
  editRule?: (data: SlotEj, ruleType: RuleType) => void;
  deleteRule?: (ruleType: RuleType, id?: string) => void;
  onHideSubRuleDelete?: () => void;
  enableMerchandising?: boolean;
  isCustomRule?: boolean;
  isDeleteSubRule?: boolean;
  setIsDeleteSubRule: (isDeleteSubRule: boolean) => void;
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environmentId?: string;
}> = ({
  rulesList,
  addRule,
  editRule,
  deleteRule,
  isDeleteSubRule,
  onHideSubRuleDelete,
  enableMerchandising,
  setIsDeleteSubRule,
  t,
  workspaceId,
  environmentId,
  isCustomRule,
}) => {
  const {
    isEditing,
    form,
    onFinish,
    initialData,
    onProductSelect,
    listProduct,
    onProductTypeSelect,
    selectedTypeActions,
    isSearchable,
    onProductValueSelect,
    onProductValueSelectInput,
    onAddClick,
    onCancel,
    onEditSlot,
    onDeleteSlot,
    onAddRule,
    onDeleteSlotSubRule,
    onRemove,
    isAddButtonVisible,
    selectedProductValues,
    selectedProductType,
  } = useSlotTabController({
    workspaceId,
    setIsDeleteSubRule,
    deleteRule,
    addRule,
    editRule,
    environmentId,
    t,
  });

  // eslint-disable-next-line
  const [primarySecondaryList, setPrimarySecondaryList] = useState<any>([]);

  useEffect(() => {
    // if (enableMerchandising) {
    setPrimarySecondaryList(
      rulesList?.contentModelFieldData.primaryAlgorithmEj
    );
    // }
  }, [
    rulesList?.contentModelFieldData.primaryAlgorithmEj,
    enableMerchandising,
  ]);

  return (
    <>
      {isEditing ? (
        <Form
          form={form}
          layout={'vertical'}
          name="rule_form"
          onFinish={onFinish}
          initialValues={initialData}
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
              <Input placeholder={t('common.labels.rule_name')} />
            </Form.Item>
            <div className="ant-row ant-space-align-end ant-row-space-between">
              <Form.Item
                label={t('common.labels.slot_range')}
                name="start"
                className="w-50"
                rules={[
                  {
                    required: true,
                    message: t('common.messages.required', {
                      entity: t('common.labels.range'),
                    }),
                  },
                ]}>
                <InputNumber
                  className="w-100"
                  placeholder={t('common.labels.start')}
                  type="number"
                  min={1}
                  max={50}
                />
              </Form.Item>
              <Form.Item
                name="end"
                className="w-50"
                rules={[
                  {
                    required: true,
                    message: t('common.messages.required', {
                      entity: t('common.labels.range'),
                    }),
                  },
                ]}>
                <InputNumber
                  className="w-100"
                  placeholder={t('common.labels.end')}
                  min={1}
                  type="number"
                  max={50}
                />
              </Form.Item>
            </div>
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
                            showSearch={true}
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
                            showSearch={true}
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
                              showSearch={true}
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
                              placeholder={t('common.labels.value_placeholder')}
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
                    <Form.Item className='m-0'>
                      <Button
                        type="link"
                        className="gray-text"
                        onClick={onAddClick}
                        icon={<PlusCircleIcon />}>
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
              <Button type="link" onClick={onCancel}>
                <LeftOutlined />
              </Button>
            </Form.Item>
            <div className="ant-row">
              <Form.Item className="m-0 m-r-16">
                <Button onClick={onCancel}>{t('common.labels.cancel')}</Button>
              </Form.Item>
              <Form.Item className="m-0">
                <Button
                  disabled={isAddButtonVisible}
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
          {primarySecondaryList?.sortEj &&
            primarySecondaryList?.sortEj?.length > 0 && (
              <>
                <Alert
                  message={t('common.labels.not_add_rule_message')}
                  type="warning"
                />
              </>
            )}
          <h4 className="m-b-16 gray-text title-sm font-normal">
            {t('common.labels.add_slot_instruction')}
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
            {primarySecondaryList?.slotEj?.map(
              (slot: SlotEj, index: string | number) => {
                return (
                  <Panel
                    header={slot?.name || ''}
                    key={index}
                    extra={
                      <GridMenu
                        menuList={[
                          {
                            key: 'Edit Button',
                            label: t('common.labels.edit'),
                            onClick: () => onEditSlot(slot),
                            disable:
                              primarySecondaryList?.sortEj &&
                              primarySecondaryList?.sortEj?.length > 0,
                          },
                          {
                            key: 'Delete Button',
                            className: 'text-red',
                            label: t('common.labels.delete'),
                            onClick: () => onDeleteSlot(slot),
                            disable:
                              primarySecondaryList?.sortEj &&
                              primarySecondaryList?.sortEj?.length > 0,
                          },
                        ]}
                        id={''}
                      />
                    }>
                    <div>
                      <span>{t('common.labels.slot_range')}</span>
                      <p>
                        <b>
                          {slot.start}-{slot.end}
                        </b>
                      </p>
                      {slot.conditions?.map((slot, index) => (
                        <div className="media-content-details product-condition-labels">
                          <>
                            <h5>
                              {t('common.labels.condition')}
                              {index + 1}
                            </h5>
                            <div className="ant-row ant-row-space-between">
                              <span>{t('common.labels.field')} :</span>
                              <p>{slot.fieldName}</p>
                            </div>
                            <div className="ant-row ant-row-space-between">
                              <span>{t('common.labels.condition')} :</span>
                              <p>{slot.action?.replaceAll('_', ' ')}</p>
                            </div>
                            <div className="ant-row ant-row-space-between">
                              <span>{t('common.labels.value')} :</span>
                              <p>{slot.value}</p>
                            </div>
                          </>
                        </div>
                      ))}
                    </div>
                  </Panel>
                );
              }
            )}
          </Collapse>
          <Form.Item className='m-0'>
            <Button
              className="primary-color"
              disabled={
                primarySecondaryList?.sortEj &&
                primarySecondaryList?.sortEj?.length > 0
              }
              onClick={onAddRule}
              block
              icon={
                <span className="anticon">
                  <PlusIcon />
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
        onOK={onDeleteSlotSubRule}
        okText={t('common.labels.delete')}
        isModalVisibility={isDeleteSubRule}>
        {t('common.labels.delete_rule_message')}
      </Modal>
    </>
  );
};

export default SlotTab;
