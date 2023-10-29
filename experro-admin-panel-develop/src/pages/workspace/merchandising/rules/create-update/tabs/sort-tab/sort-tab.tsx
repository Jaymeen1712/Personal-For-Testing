import React from 'react';
import { TFunction } from 'react-i18next';
import { Alert, Button, Collapse, Form, Input, Select } from 'antd';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';

import GridMenu from '../../../../../../../components/grid-menu';
import { IRuleList, RuleType, SortEj } from '../../../../../../../types';
import Modal from '../../../../../../../components/modal';
import useSortTabController from './sort-tab-controller';
import RoundCloseIcon from '../../../../../../../images/icons/round-close-icon';
import { SORT_ORDER } from '../../../../../../../utills';
import PlusIcon from '../../../../../../../images/icons/plus-icon';
import DownArrowIcon from '../../../../../../../images/icons/downarrow-icon';
import PlusBlackIcon from '../../../../../../../images/icons/plus-black-icon';
import ArrowLeftIcon from '../../../../../../../images/icons/arrow-left-icon';
import ArrowRightIcon from '../../../../../../../images/icons/arrow-right-icon';

const SortTab: React.FC<{
  rulesList?: IRuleList;
  addRule?: (data: SortEj, ruleType: RuleType) => void;
  editRule?: (data: SortEj, ruleType: RuleType) => void;
  deleteRule?: (ruleType: RuleType, id?: string) => void;
  onHideSubRuleDelete?: () => void;
  isDeleteSubRule?: boolean;
  setIsDeleteSubRule: (isDeleteSubRule: boolean) => void;
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environmentId?: string;
  setAddIsButtonVisibleSort: (isAddButtonVisibleSort: boolean) => void;
  isAddButtonVisibleSort: boolean;
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
  setAddIsButtonVisibleSort,
  isAddButtonVisibleSort,
}) => {
  const {
    isEditing,
    form,
    initialData,
    onFinish,
    onProductSelect,
    listProduct,
    onProductOrderSelect,
    onAddClick,
    onCancel,
    onEditSort,
    onDuplicateSort,
    onDeleteSort,
    onAddRule,
    onDeleteSortSubRule,
    onRemove,
  } = useSortTabController({
    workspaceId,
    setIsDeleteSubRule,
    deleteRule,
    addRule,
    editRule,
    t,
    environmentId,
    setAddIsButtonVisibleSort,
  });

  return (
    <>
      {isEditing ? (
        <Form
          form={form}
          layout={'vertical'}
          name="rule_form"
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
            <Form.List name="conditions">
              {(fields) => {
                return (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item key={field.key} className="m-0 sort-condition">
                        <div className="rule-condition only-two-col">
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
                            name={[field.name, 'order']}
                            label={t('common.labels.order')}>
                            <Select
                              placeholder={t('common.labels.select')}
                              suffixIcon={<DownArrowIcon />}
                              onChange={(e) => onProductOrderSelect(e, index)}>
                              {SORT_ORDER.map((order) => (
                                <Select.Option
                                  key={order.value}
                                  value={order.value}>
                                  {order.label}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          {fields.length > 1 && (
                            <Button
                              type="link"
                              className="round-close-icon"
                              onClick={() => onRemove(field.name)}
                              icon={<RoundCloseIcon />}></Button>
                          )}
                        </div>
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
                  disabled={isAddButtonVisibleSort}
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
          {rulesList?.contentModelFieldData &&
            ((rulesList?.contentModelFieldData.pinEj &&
              rulesList?.contentModelFieldData.pinEj?.length > 0) ||
              (rulesList?.contentModelFieldData.rulesEj &&
                rulesList?.contentModelFieldData.rulesEj?.filter(function (
                  element
                ) {
                  return (
                    element.operation === 'boost' ||
                    element.operation === 'bury'
                  );
                }).length > 0) ||
              (rulesList?.contentModelFieldData.slotEj &&
                rulesList?.contentModelFieldData.slotEj?.length > 0)) && (
              <>
                <Alert
                  message={t('common.labels.sort_not_add_rule_message')}
                  type="warning"
                />
              </>
            )}
          <h4 className="m-b-16 gray-text title-sm font-normal">
            {t('common.labels.add_sort_instruction')}
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
            {rulesList?.contentModelFieldData.sortEj?.map(
              (sort: SortEj, index) => {
                return (
                  <CollapsePanel
                    header={sort?.name || ''}
                    key={index}
                    extra={
                      <GridMenu
                        menuList={[
                          {
                            key: 'Edit Button',
                            label: t('common.labels.edit'),
                            onClick: () => onEditSort(sort),
                            disable:
                              rulesList?.contentModelFieldData &&
                              ((rulesList?.contentModelFieldData.pinEj &&
                                rulesList?.contentModelFieldData.pinEj?.length >
                                  0) ||
                                (rulesList?.contentModelFieldData.rulesEj &&
                                  rulesList?.contentModelFieldData.rulesEj?.filter(
                                    function (element) {
                                      return (
                                        element.operation === 'boost' ||
                                        element.operation === 'bury'
                                      );
                                    }
                                  ).length > 0) ||
                                (rulesList?.contentModelFieldData.slotEj &&
                                  rulesList?.contentModelFieldData.slotEj
                                    ?.length > 0)),
                          },
                          {
                            key: 'Duplicate Button',
                            label: t('common.labels.duplicate'),
                            onClick: () => onDuplicateSort(sort),
                            disable:
                              rulesList?.contentModelFieldData &&
                              ((rulesList?.contentModelFieldData.pinEj &&
                                rulesList?.contentModelFieldData.pinEj?.length >
                                  0) ||
                                (rulesList?.contentModelFieldData.rulesEj &&
                                  rulesList?.contentModelFieldData.rulesEj?.filter(
                                    function (element) {
                                      return (
                                        element.operation === 'boost' ||
                                        element.operation === 'bury'
                                      );
                                    }
                                  ).length > 0) ||
                                (rulesList?.contentModelFieldData.slotEj &&
                                  rulesList?.contentModelFieldData.slotEj
                                    ?.length > 0)),
                          },
                          {
                            key: 'Delete Button',
                            className: 'text-red',
                            label: t('common.labels.delete'),
                            onClick: () => onDeleteSort(sort),
                            disable:
                              rulesList?.contentModelFieldData &&
                              ((rulesList?.contentModelFieldData.pinEj &&
                                rulesList?.contentModelFieldData.pinEj?.length >
                                  0) ||
                                (rulesList?.contentModelFieldData.rulesEj &&
                                  rulesList?.contentModelFieldData.rulesEj?.filter(
                                    function (element) {
                                      return (
                                        element.operation === 'boost' ||
                                        element.operation === 'bury'
                                      );
                                    }
                                  ).length > 0) ||
                                (rulesList?.contentModelFieldData.slotEj &&
                                  rulesList?.contentModelFieldData.slotEj
                                    ?.length > 0)),
                          },
                        ]}
                        id={''}
                      />
                    }>
                    <div>
                      {sort.conditions?.map((sort, index) => (
                        <div className="media-content-details product-condition-labels">
                          <>
                            <h5>
                              {t('common.labels.condition')}
                              {index + 1}
                            </h5>
                            <div className="ant-row ant-row-space-between">
                              <span>{t('common.labels.field')} :</span>
                              <p>
                                {sort.fieldInternalName
                                  ?.replaceAll('_', ' ')
                                  .substring(
                                    0,
                                    sort.fieldInternalName?.lastIndexOf('_')
                                  )
                                  .replace('cust', '')}
                              </p>
                            </div>
                            <div className="ant-row ant-row-space-between">
                              <span>{t('common.labels.order')} :</span>
                              {sort.order === 'asc' ? (
                                <p>{t('common.labels.ascending')}</p>
                              ) : (
                                <p>{t('common.labels.descending')}</p>
                              )}
                            </div>
                          </>
                        </div>
                      ))}
                    </div>
                  </CollapsePanel>
                );
              }
            )}
          </Collapse>
          <Form.Item>
            <Button
              className="primary-color"
              disabled={
                rulesList?.contentModelFieldData &&
                ((rulesList?.contentModelFieldData.pinEj &&
                  rulesList?.contentModelFieldData.pinEj?.length > 0) ||
                  (rulesList?.contentModelFieldData.rulesEj &&
                    rulesList?.contentModelFieldData.rulesEj?.filter(function (
                      element
                    ) {
                      return (
                        element.operation === 'boost' ||
                        element.operation === 'bury'
                      );
                    }).length > 0) ||
                  (rulesList?.contentModelFieldData.slotEj &&
                    rulesList?.contentModelFieldData.slotEj?.length > 0))
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
        onOK={onDeleteSortSubRule}
        okText={t('common.labels.delete')}
        isModalVisibility={isDeleteSubRule}>
        {t('common.labels.delete_rule_message')}
      </Modal>
    </>
  );
};

export default SortTab;
