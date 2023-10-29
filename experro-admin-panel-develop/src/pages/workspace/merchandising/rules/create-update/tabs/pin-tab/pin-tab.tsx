import React from 'react';
import { TFunction } from 'react-i18next';
import {
  Alert,
  Avatar,
  Button,
  Collapse,
  Form,
  Input,
  InputNumber,
  Select,
  AutoComplete,
} from 'antd';

import { IRuleList, PinEj, RuleType } from '../../../../../../../types';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';
import GridMenu from '../../../../../../../components/grid-menu';
import { APIS_ROUTES } from '../../../../../../../utills';
import Modal from '../../../../../../../components/modal';
import usePinTabController from './pin-tab-controller';
import RoundCloseIcon from '../../../../../../../images/icons/round-close-icon';
import PlusIcon from '../../../../../../../images/icons/plus-icon';
import ArrowLeftIcon from '../../../../../../../images/icons/arrow-left-icon';
import PinIcon from '../../../../../../../images/icons/pin-icon';
import SearchIcon from '../../../../../../../images/icons/search-icon';
import ArrowRightIcon from '../../../../../../../images/icons/arrow-right-icon';

const PinTab: React.FC<{
  rulesList?: IRuleList;
  addRule?: (data: PinEj, ruleType: RuleType) => void;
  editRule?: (data: PinEj, ruleType: RuleType) => void;
  deleteRule?: (ruleType: RuleType, id?: string) => void;
  onHideSubRuleDelete?: () => void;
  isDeleteSubRule?: boolean;
  setIsDeleteSubRule: (isDeleteSubRule: boolean) => void;
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environmentId?: string;
  setAddIsButtonVisiblePin: (isAddButtonVisiblePin: boolean) => void;
  isAddButtonVisiblePin: boolean;
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
  setAddIsButtonVisiblePin,
  isAddButtonVisiblePin,
}) => {
  const {
    isEditing,
    form,
    onFinish,
    initialData,
    onSelectedProduct,
    filteredProduct,
    selectedProducts,
    onInputNumberChange,
    onCancel,
    onEditSubPin,
    onDeleteSubPin,
    onAddRule,
    onDeleteSubRulePins,
    onRemove,
    onSelectProductSearch,
    onInputNumberFocus,
    search,
    onDuplicateSubPin,
  } = usePinTabController({
    workspaceId,
    addRule,
    editRule,
    setIsDeleteSubRule,
    deleteRule,
    environmentId,
    t,
    setAddIsButtonVisiblePin,
  });

  return (
    <>
      {isEditing ? (
        <Form
          form={form}
          layout={'vertical'}
          onFinish={onFinish}
          initialValues={initialData}
          autoComplete="off">
          <div className="sidebar-top-section">
            <Form.Item
              label={t('common.labels.rule_name')}
              className="w-100"
              name="name"
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

            <Form.Item
              label={t('common.labels.search_product')}
              name="productName"
              className="w-100">
              <AutoComplete
                showSearch={true}
                placeholder={
                  <div className="ant-row ant-space-align-middle">
                    <div className="ant-row ant-space-align-center m-r-8">
                      <SearchIcon />
                    </div>
                    <span>
                      {t('common.labels.pin_rule_select_placeholder')}
                    </span>
                  </div>
                }
                onSearch={onSelectProductSearch}
                onSelect={onSelectedProduct}
                defaultOpen={search ? true : false}
                notFoundContent={t('common.labels.no_products_found')}>
                {filteredProduct?.map((product) => (
                  <Select.Option
                    key={product.skuEsi}
                    value={product.nameEti}
                    className="product-list product-list-pin">
                    <Avatar
                      shape="square"
                      size={40}
                      alt={product.nameEti}
                      src={
                        product.imagesEj && product.imagesEj?.length > 0
                          ? product.imagesEj
                          : ''
                      }
                    />
                    <div className="product-list-right">
                      <h5>{product.nameEti}</h5>
                      <h6>
                        {t('common.labels.sku')}
                        {product.skuEsi}
                      </h6>
                    </div>
                  </Select.Option>
                ))}
              </AutoComplete>
            </Form.Item>

            {selectedProducts.map((product, index) => (
              <>
                <div className="product-list product-list-three-col with-icon">
                  <div className="ant-select-item-option-content">
                    <Avatar
                      shape="square"
                      size={40}
                      src={`${process.env.REACT_APP_API_URL}${
                        APIS_ROUTES.PROFILE_IMAGE_THUMBNAIL
                      }/image-thumbnail?width=80&height=80&&content_type=url&random=${new Date().getTime()}&url=${
                        product.imagesEj
                      }`}
                    />
                    <div className="product-list-right">
                      <h5>{product.nameEti}</h5>
                      <h6>
                        {t('common.labels.sku')}
                        {product.skuEsi}
                      </h6>
                    </div>
                    <InputNumber
                      value={product.position}
                      size="small"
                      type="number"
                      min={1}
                      max={50}
                      keyboard={false}
                      onBlur={(e) => onInputNumberFocus(e, index)}
                      onChange={(e) =>
                        onInputNumberChange(e, index)
                      }></InputNumber>
                  </div>
                  <Button
                    type="link"
                    className="round-close-icon"
                    onClick={() => onRemove(product.id)}
                    icon={<RoundCloseIcon />}></Button>
                </div>
              </>
            ))}
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
                  disabled={isAddButtonVisiblePin}
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
          {rulesList?.contentModelFieldData.sortEj &&
            rulesList.contentModelFieldData.sortEj?.length > 0 && (
              <>
                <Alert
                  message={t('common.labels.not_add_rule_message')}
                  type="warning"
                />
              </>
            )}
          <h4 className="m-b-16 gray-text title-sm font-normal">
            {t('common.labels.add_pin_instruction')}
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
            {rulesList?.contentModelFieldData.pinEj?.map(
              (rule: PinEj, index) => {
                return (
                  <CollapsePanel
                    className="pin-collapsePanel"
                    header={rule?.name || ''}
                    key={index}
                    extra={
                      <GridMenu
                        menuList={[
                          {
                            key: 'Edit Button',
                            label: t('common.labels.edit'),
                            onClick: () => onEditSubPin(rule),
                            disable:
                              rulesList?.contentModelFieldData.sortEj &&
                              rulesList.contentModelFieldData.sortEj?.length >
                                0,
                          },
                          {
                            key: 'Duplicate Button',
                            label: t('common.labels.duplicate'),
                            onClick: () => onDuplicateSubPin(rule),
                            disable:
                              rulesList?.contentModelFieldData.sortEj &&
                              rulesList.contentModelFieldData.sortEj?.length >
                                0,
                          },
                          {
                            key: 'Delete Button',
                            className: 'text-red',
                            label: t('common.labels.delete'),
                            onClick: () => onDeleteSubPin(rule),
                            disable:
                              rulesList?.contentModelFieldData.sortEj &&
                              rulesList.contentModelFieldData.sortEj?.length >
                                0,
                          },
                        ]}
                        id={''}
                      />
                    }>
                    <div className="product-condition-labels">
                      <h5>{t('common.labels.products')}</h5>
                      {rule.conditions?.map((rule) => (
                        <div className="product-list product-list-three-col whithout-bg">
                          <div className="ant-select-item-option-content">
                            <Avatar
                              shape={'square'}
                              size={40}
                              src={`${process.env.REACT_APP_API_URL}${
                                APIS_ROUTES.PROFILE_IMAGE_THUMBNAIL
                              }/image-thumbnail?width=80&height=80&&content_type=url&random=${new Date().getTime()}&url=${
                                rule.image
                              }`}
                            />
                            <div className="product-list-right">
                              <h5>{rule.name}</h5>
                              <h6>{rule.sku}</h6>
                            </div>
                            <div className="pin-tab">
                              <span>
                                {rule.position}
                                <span className="anticon">{<PinIcon />}</span>
                              </span>
                            </div>
                          </div>
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
                rulesList?.contentModelFieldData.sortEj &&
                rulesList.contentModelFieldData.sortEj?.length > 0
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
        isModalVisibility={isDeleteSubRule}
        onOK={onDeleteSubRulePins}
        okText={t('common.labels.delete')}>
        {t('common.labels.delete_rule_message')}
      </Modal>
    </>
  );
};

export default PinTab;
