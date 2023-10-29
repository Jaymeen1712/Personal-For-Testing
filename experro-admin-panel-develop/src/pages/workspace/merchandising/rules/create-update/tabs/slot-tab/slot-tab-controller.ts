import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { TFunction } from 'react-i18next';

import {
  IRuleCondition,
  IRuleTypeData,
  RuleType,
  SlotCondition,
  SlotEj,
} from '../../../../../../../types';
import {
  BOOLEAN_FIELD_OPERATIONS,
  NUMBER_FIELD_OPERATIONS,
  STRING_FIELD_OPERATIONS,
  TEXT_GENERAL_FIELD_OPERATIONS,
  TEXT_REGEX_PATTERN,
} from '../../../../../../../utills';
import {
  useListProductField,
  useProductFieldsMultipleValues,
  useProductValues,
} from '../../../../services';

const useSlotTabController = ({
  workspaceId,
  setIsDeleteSubRule,
  deleteRule,
  addRule,
  editRule,
  environmentId,
  t,
  setAddIsButtonVisibleSlot,
}: {
  workspaceId: string;
  setIsDeleteSubRule: (isDeleteSubRule: boolean) => void;
  deleteRule?: (ruleType: RuleType, id?: string) => void;
  addRule?: (data: SlotEj, ruleType: RuleType) => void;
  editRule?: (data: SlotEj, ruleType: RuleType) => void;
  environmentId?: string;
  t: TFunction<'translation', undefined>;
  setAddIsButtonVisibleSlot: (isAddButtonVisibleSlot: boolean) => void;
}) => {
  const [form] = Form.useForm();

  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState<SlotEj>();
  const [deleteSlot, setDeleteSlot] = useState<string>();
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [initialConditions, setInitialConditions] = useState<IRuleCondition[]>(
    []
  );
  const [selectedTypeActions, setSelectedTypeActions] = useState<
    IRuleTypeData[]
  >([{ data: STRING_FIELD_OPERATIONS }]);
  const [isSearchable, setIsSearchable] = useState<boolean[]>([false]);
  const [productName, setProductName] = useState<string>();
  const [addSlotItem, setAddSlotItem] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProductValues, setSelectedProductValues] = useState<any>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>();
  const [selectedFieldsEditDuplicate, setSelectedFieldsEditDuplicate] =
    useState<string[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string[]>([]);

  const listProduct = useListProductField(workspaceId, 'slot', environmentId);
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

  const onDeleteSlot = (slot: SlotEj) => {
    setDeleteSlot(slot.id);
    setIsDeleteSubRule(true);
  };

  const onDeleteSlotSubRule = () => {
    deleteRule && deleteRule('slot', deleteSlot);
  };

  const onFinish = (slot: SlotEj) => {
    if (slot) {
      if (slot.start && slot.end && slot.start > slot.end) {
        form.setFields([
          {
            name: 'end',
            errors: [
              t('common.labels.end_greater_than_start', { entity: slot.start }),
            ],
          },
        ]);
      } else if (slot.start && slot.end && slot.start === slot.end) {
        form.setFields([
          {
            name: 'end',
            errors: [t('common.labels.start_end_no_be_same')],
          },
        ]);
      } else if (slot.name?.trim().length === 0) {
        form.setFields([
          {
            name: 'name',
            errors: [t('common.messages.please_provide')],
          },
        ]);
      } else if (slot.name && slot.name?.trim().length < 3) {
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
      } else if (slot.name && slot.name.length > 255) {
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
        slot.name &&
        slot.name.trim().length > 0 &&
        !TEXT_REGEX_PATTERN.test(slot.name)
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
        slot.conditions?.map((condition) => {
          if (listProduct.data) {
            const filteredProducts = listProduct.data.filter(function (
              product
            ) {
              return product.fieldName === condition.fieldInternalName;
            });
            condition.fieldName = filteredProducts[0].title;
            condition.fieldType = filteredProducts[0].type;
          }
          return slot;
        });

        if (isDuplicate) {
          addRule && addRule(slot, 'slot');
          setIsDuplicate(false);
        } else if (initialData?.id === undefined) {
          addRule && addRule(slot, 'slot');
        } else {
          slot.id = initialData.id;
          editRule && editRule(slot, 'slot');
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

        setIsEditing(false);
      }
    }
  };

  const onDuplicateSlot = (slot: SlotEj) => {
    form.resetFields();

    const clonedSlot = JSON.parse(JSON.stringify(slot));

    setIsEditing(true);
    setAddSlotItem(false);
    setIsDuplicate(true);
    setInitialData(clonedSlot);
    setSelectedTypeActions([]);
    setIsSearchable([]);
    setInitialConditions([]);
    setSelectedProductType([]);

    const tempInitialConditions: SlotCondition[] = [...initialConditions];
    const tempSelectedTypeAction: IRuleTypeData[] = [...selectedTypeActions];
    const tempIsSearchable: boolean[] = [...isSearchable];
    const tempSelectedFieldsEditDuplicate = [...selectedFieldsEditDuplicate];
    const tempSelectedProductType = [...selectedProductType];

    slot.conditions?.map((slot, index) => {
      setSelectedProductIndex(index);
      tempInitialConditions.push({
        fieldInternalName: slot.fieldInternalName,
        action: slot.action,
        value: slot.value,
      });

      if (listProduct.data) {
        const filteredProducts = listProduct.data.filter(function (product) {
          return product.fieldName === slot.fieldInternalName;
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
            data: STRING_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          // data: STRING_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'number') {
          tempSelectedTypeAction.splice(index, 1, {
            data: NUMBER_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          // data: NUMBER_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'boolean') {
          tempSelectedTypeAction.splice(index, 1, {
            data: BOOLEAN_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          // data: BOOLEAN_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'text') {
          tempSelectedTypeAction.splice(index, 1, {
            data: TEXT_GENERAL_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          // data: TEXT_GENERAL_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'rich-text') {
          tempSelectedTypeAction.splice(index, 1, {
            data: TEXT_GENERAL_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          // data: TEXT_GENERAL_FIELD_OPERATIONS,
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

  const onEditSlot = async (slot: SlotEj) => {
    form.resetFields();

    const editedSlot = JSON.parse(JSON.stringify(slot));

    setAddSlotItem(false);
    setIsEditing(true);
    setInitialData(editedSlot);
    setSelectedTypeActions([]);
    setIsSearchable([]);
    setInitialConditions([]);
    setSelectedProductType([]);

    const tempInitialConditions: SlotCondition[] = [...initialConditions];
    const tempSelectedTypeAction: IRuleTypeData[] = [...selectedTypeActions];
    const tempIsSearchable: boolean[] = [...isSearchable];
    const tempSelectedFieldsEditDuplicate = [...selectedFieldsEditDuplicate];
    const tempSelectedProductType = [...selectedProductType];

    slot.conditions?.map((slot, index) => {
      setSelectedProductIndex(index);
      tempInitialConditions.push({
        fieldInternalName: slot.fieldInternalName,
        action: slot.action,
        value: slot.value,
      });

      if (listProduct.data) {
        const filteredProducts = listProduct.data.filter(function (product) {
          return product.fieldName === slot.fieldInternalName;
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
            data: STRING_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: STRING_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'number') {
          tempSelectedTypeAction.splice(index, 1, {
            data: NUMBER_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: NUMBER_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'boolean') {
          tempSelectedTypeAction.splice(index, 1, {
            data: BOOLEAN_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: BOOLEAN_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'text') {
          tempSelectedTypeAction.splice(index, 1, {
            data: TEXT_GENERAL_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: TEXT_GENERAL_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'rich-text') {
          tempSelectedTypeAction.splice(index, 1, {
            data: TEXT_GENERAL_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: TEXT_GENERAL_FIELD_OPERATIONS,
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
    setSelectedProductValues([]);
    setSelectedFieldsEditDuplicate([]);
    setProductName('');
    setSelectedProductType([]);
    setSelectedTypeActions([]);
    setIsSearchable([]);

    setIsEditing(false);
    setAddIsButtonVisibleSlot(false);
  };

  useEffect(() => {
    if (isEditing && addSlotItem) {
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
        { fieldInternalName: undefined, action: undefined, value: undefined },
      ]);
      setSelectedTypeActions([
        ...selectedTypeActions,
        { data: STRING_FIELD_OPERATIONS },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, addSlotItem]);

  const onAddRule = () => {
    setAddIsButtonVisibleSlot(true);
    setIsEditing(true);
    setAddSlotItem(true);
    form.resetFields();
  };

  useEffect(() => {
    form.setFields([{ name: 'conditions', value: initialConditions }]);
  }, [form, initialConditions]);

  const onAddClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.currentTarget.blur();
    setAddIsButtonVisibleSlot(true);
    setSelectedTypeActions([
      ...selectedTypeActions,
      { data: STRING_FIELD_OPERATIONS },
    ]);
    setInitialConditions([
      ...initialConditions,
      { fieldInternalName: undefined, action: undefined, value: undefined },
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
      const tempSelectedTypeAction = [...selectedTypeActions];
      const tempSelectedProductValues = [...selectedProductValues];

      if (filteredProducts) {
        if (
          filteredProducts[0].fieldName.endsWith('_esi') ||
          filteredProducts[0].fieldName.endsWith('_esai') ||
          filteredProducts[0].fieldName.endsWith('_esli') ||
          filteredProducts[0].fieldName.endsWith('_eslai')
        ) {
          tempSelectedTypeAction.splice(index, 1, {
            data: STRING_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: STRING_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'number') {
          tempSelectedTypeAction.splice(index, 1, {
            data: NUMBER_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: NUMBER_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'boolean') {
          tempSelectedTypeAction.splice(index, 1, {
            data: BOOLEAN_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: BOOLEAN_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'text') {
          tempSelectedTypeAction.splice(index, 1, {
            data: TEXT_GENERAL_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: TEXT_GENERAL_FIELD_OPERATIONS,
          // });
        } else if (filteredProducts[0].type === 'rich-text') {
          tempSelectedTypeAction.splice(index, 1, {
            data: TEXT_GENERAL_FIELD_OPERATIONS,
          });
          // tempSelectedTypeAction.splice(index, 0, {
          //   data: TEXT_GENERAL_FIELD_OPERATIONS,
          // });
        }

        if (filteredProducts[0].isSearchable) {
          isSearchable.splice(index, 1, true);
          // isSearchable.splice(index, 0, true);
          setProductName(filteredProducts[0].fieldName);
        } else {
          isSearchable.splice(index, 1, false);
          // isSearchable.splice(index, 0, false);
          tempSelectedProductValues.splice(index, 1, []);
          // tempSelectedProductValues.splice(index, 0, []);
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
            product.value === undefined ||
            product.action === '' ||
            product.action === undefined ||
            product.fieldInternalName === '' ||
            product.fieldInternalName === undefined
          ) {
            flag = 1;
          }
          return undefined;
        });

        if (flag === 1) {
          setAddIsButtonVisibleSlot(true);
        } else {
          setAddIsButtonVisibleSlot(false);
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
          product.value === undefined ||
          product.action === '' ||
          product.action === undefined ||
          product.fieldInternalName === '' ||
          product.fieldInternalName === undefined
        ) {
          flag = 1;
        }
        return undefined;
      });

      if (flag === 1) {
        setAddIsButtonVisibleSlot(true);
      } else {
        setAddIsButtonVisibleSlot(false);
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
          product.value === undefined ||
          product.action === '' ||
          product.action === undefined ||
          product.fieldInternalName === '' ||
          product.fieldInternalName === undefined
        ) {
          flag = 1;
        }
        return undefined;
      });

      if (flag === 1) {
        setAddIsButtonVisibleSlot(true);
      } else {
        setAddIsButtonVisibleSlot(false);
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
          product.value === undefined ||
          product.action === '' ||
          product.action === undefined ||
          product.fieldInternalName === '' ||
          product.fieldInternalName === undefined
        ) {
          flag = 1;
        }
        return undefined;
      });

      if (flag === 1) {
        setAddIsButtonVisibleSlot(true);
      } else {
        setAddIsButtonVisibleSlot(false);
      }
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
      !addSlotItem &&
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
      if (
        initialConditions[initialConditions.length - 1].action === undefined &&
        initialConditions[initialConditions.length - 1].value === undefined &&
        initialConditions[initialConditions.length - 1].fieldInternalName ===
          undefined
      ) {
        setAddIsButtonVisibleSlot(true);
      } else {
        setAddIsButtonVisibleSlot(false);
      }
    } else {
      setAddIsButtonVisibleSlot(true);
    }
  };

  return {
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
    productValues,
    onProductValueSelectInput,
    onAddClick,
    onCancel,
    onEditSlot,
    onDuplicateSlot,
    onDeleteSlot,
    onAddRule,
    onDeleteSlotSubRule,
    onRemove,
    selectedProductValues,
    selectedProductType,
  };
};

export default useSlotTabController;
