import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { TFunction } from 'react-i18next';

import {
  IRuleCondition,
  IRuleTypeData,
  RulesEj,
  RuleType,
} from '../../../../../../../types';
import {
  RULE_BOOLEAN_FIELD_OPERATIONS,
  RULE_NUMBER_FIELD_OPERATIONS,
  RULE_STRING_FIELD_OPERATIONS,
  RULE_TEXT_GENERAL_FIELD_OPERATIONS,
  TEXT_REGEX_PATTERN,
} from '../../../../../../../utills';
import {
  useListProductField,
  useProductFieldsMultipleValues,
  useProductValues,
} from '../../../../services';

const useRuleTabController = ({
  workspaceId,
  setIsDeleteSubRule,
  deleteRule,
  addRule,
  editRule,
  environmentId,
  t,
}: {
  workspaceId: string;
  setIsDeleteSubRule: (isDeleteSubRule: boolean) => void;
  deleteRule?: (ruleType: RuleType, id?: string) => void;
  addRule?: (data: RulesEj, ruleType: RuleType) => void;
  editRule?: (data: RulesEj, ruleType: RuleType) => void;
  environmentId?: string;
  t: TFunction<'translation', undefined>;
}) => {
  const [form] = Form.useForm();

  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState<RulesEj>();
  const [deleteSubRule, setDeleteSubRule] = useState<string>();
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [initialConditions, setInitialConditions] = useState<IRuleCondition[]>(
    []
  );
  const [selectedTypeActions, setSelectedTypeActions] = useState<
    IRuleTypeData[]
  >([{ data: RULE_STRING_FIELD_OPERATIONS }]);
  const [addRuleItem, setAddRuleItem] = useState(false);
  const [isSearchable, setIsSearchable] = useState<boolean[]>([false]);
  const [productName, setProductName] = useState<string>();
  const [isSliderVisible, setIsSliderVisible] = useState<boolean>(false);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProductValues, setSelectedProductValues] = useState<any>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>();
  const [selectedFieldsEditDuplicate, setSelectedFieldsEditDuplicate] =
    useState<string[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string[]>([]);

  const listProduct = useListProductField(workspaceId, 'rule', environmentId);
  const productValues = useProductValues(
    workspaceId,
    productName,
    environmentId
  );
  const multipleProductFieldValues = useProductFieldsMultipleValues(
    workspaceId,
    selectedFieldsEditDuplicate,
    environmentId
  );

  const onDeleteSubRule = (rule: RulesEj) => {
    setDeleteSubRule(rule.id);
    setIsDeleteSubRule(true);
  };

  const onDeleteSubRuleRules = () => {
    deleteRule && deleteRule('rules', deleteSubRule);
  };

  const onFinish = async () => {
    const rule: RulesEj = await form.getFieldsValue();
    if (rule.name?.trim().length === 0) {
      form.setFields([
        {
          name: 'name',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (rule.name && rule.name?.trim().length < 3) {
      form.setFields([
        {
          name: 'name',
          errors: [
            t('common.messages.min_length', {
              entity: t('common.labels.rule_name'),
            }),
          ],
        },
      ]);
    } else if (rule.name && rule.name.length > 255) {
      form.setFields([
        {
          name: 'name',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.rule_name'),
            }),
          ],
        },
      ]);
    } else if (
      rule.name &&
      rule.name.trim().length > 0 &&
      !TEXT_REGEX_PATTERN.test(rule.name)
    ) {
      form.setFields([
        {
          name: 'name',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.rule_name'),
            }),
          ],
        },
      ]);
    } else {
      if (rule.conditions && rule.conditions.length > 0) {
        rule.conditions?.map((condition) => {
          if (listProduct.data) {
            const filteredProducts = listProduct.data.filter(function (
              product
            ) {
              return product.fieldName === condition.fieldInternalName;
            });
            condition.fieldType = filteredProducts[0].type;
            condition.fieldName = filteredProducts[0].title;
          }
          return rule;
        });
      }
      if (isDuplicate) {
        addRule && addRule(rule, 'rules');
        setIsDuplicate(false);
      } else if (initialData?.id === undefined) {
        addRule && addRule(rule, 'rules');
      } else {
        rule.id = initialData.id;
        editRule && editRule(rule, 'rules');
      }

      form.resetFields();
      setInitialConditions([]);
      setInitialData({});
      setSelectedTypeActions([]);
      setIsSearchable([]);
      setProductName('');
      setSelectedProductType([]);
      setSelectedProductValues([]);
      setSelectedFieldsEditDuplicate([]);

      setIsSliderVisible(false);
      setIsEditing(false);
    }
  };

  const onDuplicateSubRule = (rule: RulesEj) => {
    form.resetFields();

    const clonedRule = JSON.parse(JSON.stringify(rule));

    setIsEditing(true);
    setIsDuplicate(true);
    setAddRuleItem(false);
    setInitialData(clonedRule);
    setSelectedTypeActions([]);
    setIsSearchable([]);
    setSelectedProductType([]);
    setInitialConditions([]);

    if (rule.operation === 'include' || rule.operation === 'exclude') {
      setIsSliderVisible(false);
    } else {
      setIsSliderVisible(true);
    }

    const tempInitialConditions: IRuleCondition[] = [...initialConditions];
    const tempSelectedTypeAction: IRuleTypeData[] = [...selectedTypeActions];
    const tempIsSearchable: boolean[] = [...isSearchable];
    const tempSelectedFieldsEditDuplicate = [...selectedFieldsEditDuplicate];
    const tempSelectedProductType = [...selectedProductType];

    rule.conditions?.map((rule, index) => {
      setSelectedProductIndex(index);
      tempInitialConditions.push({
        fieldInternalName: rule.fieldInternalName,
        action: rule.action,
        value: rule.value,
      });

      if (listProduct.data) {
        const filteredProducts = listProduct.data.filter(function (product) {
          return product.fieldName === rule.fieldInternalName;
        });

        tempSelectedProductType.splice(index, 1, filteredProducts[0].type);
        // tempSelectedProductType.splice(index, 0, filteredProducts[0].type);

        if (
          filteredProducts[0].fieldName.endsWith('_esi') ||
          filteredProducts[0].fieldName.endsWith('_esai') ||
          filteredProducts[0].fieldName.endsWith('_esli') ||
          filteredProducts[0].fieldName.endsWith('_eslai')
        ) {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_STRING_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_STRING_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'number') {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_NUMBER_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_NUMBER_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'boolean') {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_BOOLEAN_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_BOOLEAN_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'text') {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_TEXT_GENERAL_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_TEXT_GENERAL_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'rich-text') {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_TEXT_GENERAL_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_TEXT_GENERAL_FIELD_OPERATIONS,
          // });
        }

        if (filteredProducts[0].isSearchable) {
          tempIsSearchable.splice(index, 1, true);
          // tempIsSearchable.splice(index, 0, true);
          tempSelectedFieldsEditDuplicate.push(filteredProducts[0].fieldName);
        } else {
          tempIsSearchable.splice(index, 1, false);
          // tempIsSearchable.splice(index, 0, false);
          tempSelectedFieldsEditDuplicate.push('');
        }
      }

      return true;
    });

    setInitialConditions(tempInitialConditions);
    setSelectedTypeActions(tempSelectedTypeAction);
    setIsSearchable(tempIsSearchable);
    setSelectedFieldsEditDuplicate(tempSelectedFieldsEditDuplicate);
    setSelectedProductType(tempSelectedProductType);
  };

  const onEditSubRule = async (rule: RulesEj) => {
    form.resetFields();

    const editedRule = JSON.parse(JSON.stringify(rule));

    setAddRuleItem(false);
    setIsEditing(true);
    setInitialData(editedRule);
    setSelectedTypeActions([]);
    setIsSearchable([]);
    setInitialConditions([]);
    setSelectedProductType([]);

    if (rule.operation === 'include' || rule.operation === 'exclude') {
      setIsSliderVisible(false);
    } else {
      setIsSliderVisible(true);
    }

    const tempInitialConditions: IRuleCondition[] = [...initialConditions];
    const tempSelectedTypeAction: IRuleTypeData[] = [...selectedTypeActions];
    const tempIsSearchable: boolean[] = [...isSearchable];
    const tempSelectedFieldsEditDuplicate = [...selectedFieldsEditDuplicate];
    const tempSelectedProductType = [...selectedProductType];

    rule.conditions?.map((rule, index) => {
      setSelectedProductIndex(index);
      tempInitialConditions.push({
        fieldInternalName: rule.fieldInternalName,
        action: rule.action,
        value: rule.value,
      });

      if (listProduct.data) {
        const filteredProducts = listProduct.data.filter(function (product) {
          return product.fieldName === rule.fieldInternalName;
        });

        tempSelectedProductType.splice(index, 1, filteredProducts[0].type);
        // tempSelectedProductType.splice(index, 0, filteredProducts[0].type);

        if (
          filteredProducts[0].fieldName.endsWith('_esi') ||
          filteredProducts[0].fieldName.endsWith('_esai') ||
          filteredProducts[0].fieldName.endsWith('_esli') ||
          filteredProducts[0].fieldName.endsWith('_eslai')
        ) {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_STRING_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_STRING_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'number') {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_NUMBER_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_NUMBER_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'boolean') {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_BOOLEAN_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_BOOLEAN_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'text') {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_TEXT_GENERAL_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_TEXT_GENERAL_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'rich-text') {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_TEXT_GENERAL_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_TEXT_GENERAL_FIELD_OPERATIONS,
          // });
        }

        if (filteredProducts[0].isSearchable) {
          tempIsSearchable.splice(index, 1, true);
          // tempIsSearchable.splice(index, 0, true);
          tempSelectedFieldsEditDuplicate.push(filteredProducts[0].fieldName);
        } else {
          tempIsSearchable.splice(index, 1, false);
          // tempIsSearchable.splice(index, 0, false);
          tempSelectedFieldsEditDuplicate.push('');
        }
      }
      return true;
    });

    setInitialConditions(tempInitialConditions);
    setSelectedTypeActions(tempSelectedTypeAction);
    setIsSearchable(tempIsSearchable);
    setSelectedFieldsEditDuplicate(tempSelectedFieldsEditDuplicate);
    setSelectedProductType(tempSelectedProductType);
  };

  const onCancel = async () => {
    setInitialConditions([]);
    await setInitialData({});
    setProductName('');
    setSelectedProductType([]);
    setSelectedTypeActions([]);
    setIsSearchable([]);
    setSelectedProductValues([]);
    setSelectedFieldsEditDuplicate([]);

    setIsSliderVisible(false);
    setIsEditing(false);
    setIsAddButtonVisible(false);
  };

  useEffect(() => {
    if (isEditing && addRuleItem) {
      setInitialData({
        conditions: [
          {
            value: '',
            action: '',
            fieldInternalName: '',
            fieldName: '',
            fieldType: '',
          },
        ],
      });
      setInitialConditions([
        ...initialConditions,
        { fieldInternalName: '', action: '', value: '' },
      ]);
      setSelectedTypeActions([
        ...selectedTypeActions,
        { data: RULE_STRING_FIELD_OPERATIONS },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, addRuleItem]);

  const onAddRule = () => {
    setIsEditing(true);
    setAddRuleItem(true);
    setIsAddButtonVisible(true);
    form.resetFields();
  };

  useEffect(() => {
    form.setFields([{ name: 'conditions', value: initialConditions }]);
  }, [form, initialConditions]);

  const onAddClick = () => {
    setIsAddButtonVisible(true);
    setSelectedTypeActions([
      ...selectedTypeActions,
      { data: RULE_STRING_FIELD_OPERATIONS },
    ]);
    setInitialConditions([
      ...initialConditions,
      { fieldInternalName: '', action: '', value: '' },
    ]);
  };

  const onProductSelect = (productName: string, index: number) => {
    const tempSelectedProductType = [...selectedProductType];

    if (listProduct.data) {
      const filteredProducts = listProduct.data.filter(function (product) {
        return product.fieldName === productName;
      });

      tempSelectedProductType.splice(index, 1, filteredProducts[0].type);
      // tempSelectedProductType.splice(index, 0, filteredProducts[0].type);

      setSelectedProductIndex(index);
      const tempSelectedProductValues = [...selectedProductValues];
      const tempSelectedTypeAction = [...selectedTypeActions];

      if (filteredProducts) {
        if (
          filteredProducts[0].fieldName.endsWith('_esi') ||
          filteredProducts[0].fieldName.endsWith('_esai') ||
          filteredProducts[0].fieldName.endsWith('_esli') ||
          filteredProducts[0].fieldName.endsWith('_eslai')
        ) {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_STRING_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_STRING_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'number') {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_NUMBER_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_NUMBER_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'boolean') {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_BOOLEAN_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_BOOLEAN_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'text') {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_TEXT_GENERAL_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_TEXT_GENERAL_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'rich-text') {
          tempSelectedTypeAction.splice(index, 1, {
            data: RULE_TEXT_GENERAL_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: RULE_TEXT_GENERAL_FIELD_OPERATIONS,
          // });
        }

        if (filteredProducts[0].isSearchable) {
          isSearchable.splice(index, 1, true);
          // isSearchable.splice(index, 0, true);
          setProductName(filteredProducts[0].fieldName);
        } else {
          isSearchable.splice(index, 1, false);
          // isSearchable.splice(index, 0, false);
          tempSelectedProductValues.splice(index, 1);
          tempSelectedProductValues.splice(index, 0, []);
        }
        setSelectedProductValues(tempSelectedProductValues);
        setSelectedTypeActions(tempSelectedTypeAction);
        setIsSearchable([...isSearchable]);
        setSelectedProductType(tempSelectedProductType);

        initialConditions[index]['fieldInternalName'] =
          filteredProducts && filteredProducts[0].fieldName;

        const fields = form.getFieldsValue();
        const { conditions } = fields;
        conditions[index].action = undefined;
        initialConditions[index].action = '';
        conditions[index].value = undefined;
        initialConditions[index].value = '';
        form.setFieldsValue({ conditions });
      }

      let flag = 0;

      if (initialConditions.length > 0) {
        initialConditions.map((product) => {
          if (
            product.value === '' ||
            product.action === '' ||
            product.fieldInternalName === ''
          ) {
            flag = 1;
          }
          return undefined;
        });

        if (flag === 1) {
          setIsAddButtonVisible(true);
        } else {
          setIsAddButtonVisible(false);
        }
      }
    }
  };

  useEffect(() => {
    if (productValues.isSuccess && selectedProductIndex !== undefined) {
      const tempSelectedProductValues = [...selectedProductValues];
      tempSelectedProductValues.splice(
        selectedProductIndex,
        1,
        productValues.data
      );
      // tempSelectedProductValues.splice(
      //   selectedProductIndex,
      //   0,
      //   productValues.data
      // );
      setSelectedProductValues(tempSelectedProductValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    productValues.isSuccess,
    productValues.data,
    productName,
    selectedProductIndex,
  ]);

  useEffect(() => {
    if (
      multipleProductFieldValues.isSuccess &&
      selectedFieldsEditDuplicate !== undefined
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tempSelectedProductValues: any = [];
      multipleProductFieldValues.data?.map((productValue) =>
        tempSelectedProductValues.push(productValue.items)
      );
      setSelectedProductValues(tempSelectedProductValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedFieldsEditDuplicate,
    multipleProductFieldValues.isSuccess,
    multipleProductFieldValues.data,
  ]);

  const onProductTypeSelect = (type: string, index: number) => {
    initialConditions[index]['action'] = type;

    let flag = 0;

    if (initialConditions.length > 0) {
      initialConditions.map((product) => {
        if (
          product.value === '' ||
          product.action === '' ||
          product.fieldInternalName === ''
        ) {
          flag = 1;
        }
        return undefined;
      });

      if (flag === 1) {
        setIsAddButtonVisible(true);
      } else {
        setIsAddButtonVisible(false);
      }
    }
  };

  const onProductValueSelect = (value: string, index: number) => {
    initialConditions[index]['value'] = value;

    let flag = 0;

    if (initialConditions.length > 0) {
      initialConditions.map((product) => {
        if (
          product.value === '' ||
          product.action === '' ||
          product.fieldInternalName === ''
        ) {
          flag = 1;
        }
        return undefined;
      });

      if (flag === 1) {
        setIsAddButtonVisible(true);
      } else {
        setIsAddButtonVisible(false);
      }
    }
  };

  const onProductValueSelectInput = (
    value: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    initialConditions[index]['value'] = value.target.value;

    let flag = 0;

    if (initialConditions.length > 0) {
      initialConditions.map((product) => {
        if (
          product.value === '' ||
          product.action === '' ||
          product.fieldInternalName === ''
        ) {
          flag = 1;
        }
        return undefined;
      });

      if (flag === 1) {
        setIsAddButtonVisible(true);
      } else {
        setIsAddButtonVisible(false);
      }
    }
  };

  const onOperationChanges = (value: string | string[]) => {
    if (value === 'include' || value === 'exclude') {
      setIsSliderVisible(false);
    } else {
      setIsSliderVisible(true);
    }
  };

  const onRemove = (index: number) => {
    initialConditions.splice(index, 1);
    selectedTypeActions.splice(index, 1);
    isSearchable.splice(index, 1);
    selectedProductValues.splice(index, 1);
    selectedProductType.splice(index, 1);

    if (
      isEditing &&
      !addRuleItem &&
      initialData?.conditions &&
      initialData.conditions.length > initialConditions.length
    ) {
      initialData?.conditions?.splice(index, 1);
    }

    setInitialData(initialData);
    setInitialConditions([...initialConditions]);
    setSelectedTypeActions([...selectedTypeActions]);
    setIsSearchable([...isSearchable]);
    setSelectedProductValues([...selectedProductValues]);
    setSelectedProductType([...selectedProductType]);
    form.setFieldsValue({ conditions: initialConditions });

    if (
      initialConditions[initialConditions.length - 1].action !== '' &&
      initialConditions[initialConditions.length - 1].value !== '' &&
      initialConditions[initialConditions.length - 1].fieldInternalName !== ''
    ) {
      setIsAddButtonVisible(false);
    } else {
      setIsAddButtonVisible(true);
    }
  };

  return {
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
    isAddButtonVisible,
    selectedProductValues,
    selectedProductType,
  };
};

export default useRuleTabController;
