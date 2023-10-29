import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { TFunction } from 'react-i18next';

import { ISortCondition, RuleType, SortEj } from '../../../../../../../types';
import { TEXT_REGEX_PATTERN } from '../../../../../../../utills';
import { useListProductField } from '../../../../services';

const useSortTabController = ({
  workspaceId,
  setIsDeleteSubRule,
  deleteRule,
  addRule,
  editRule,
  t,
  environmentId,
}: {
  workspaceId: string;
  setIsDeleteSubRule: (isDeleteSubRule: boolean) => void;
  deleteRule?: (ruleType: RuleType, id?: string) => void;
  addRule?: (data: SortEj, ruleType: RuleType) => void;
  editRule?: (data: SortEj, ruleType: RuleType) => void;
  t: TFunction<'translation', undefined>;
  environmentId?: string;
}) => {
  const [form] = Form.useForm();

  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState<SortEj>();
  const [deleteSort, setDeleteSort] = useState<string>();
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [initialConditions, setInitialConditions] = useState<ISortCondition[]>(
    []
  );
  const [addRuleItem, setAddRuleItem] = useState(false);
  const [isAddButtonVisible, setAddIsButtonVisible] = useState<boolean>(false);

  const listProduct = useListProductField(workspaceId, 'sort', environmentId);

  const onDeleteSort = (sort: SortEj) => {
    setDeleteSort(sort.id);
    setIsDeleteSubRule(true);
  };

  const onDeleteSortSubRule = () => {
    deleteRule && deleteRule('sort', deleteSort);
  };

  const onFinish = (sort: SortEj) => {
    if (sort.name?.trim().length === 0) {
      form.setFields([
        {
          name: 'name',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (sort.name && sort.name?.trim().length < 3) {
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
    } else if (sort.name && sort.name.length > 255) {
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
      sort.name &&
      sort.name.trim().length > 0 &&
      !TEXT_REGEX_PATTERN.test(sort.name)
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
      if (sort.conditions && sort.conditions.length > 0) {
        sort.conditions?.map((condition) => {
          if (listProduct.data) {
            const filteredProducts = listProduct.data.filter(function (
              product
            ) {
              return product.fieldName === condition.fieldInternalName;
            });
            condition.fieldType = filteredProducts[0].type;
          }
          return sort;
        });
      }

      if (isDuplicate) {
        addRule && addRule(sort, 'sort');
        setIsDuplicate(false);
      } else if (initialData?.id === undefined) {
        addRule && addRule(sort, 'sort');
      } else {
        sort.id = initialData.id;
        editRule && editRule(sort, 'sort');
      }
      form.resetFields();
      setInitialConditions([]);
      setInitialData({});

      setIsEditing(false);
    }
  };

  const onDuplicateSort = async (sort: SortEj) => {
    form.resetFields();

    const cloneSort = JSON.parse(JSON.stringify(sort));

    setIsDuplicate(true);
    setIsEditing(true);
    setAddRuleItem(false);
    setInitialData(cloneSort);
    setInitialConditions([]);

    const tempInitialConditions: ISortCondition[] = [...initialConditions];

    sort.conditions?.map((sort) =>
      tempInitialConditions.push({
        fieldInternalName: sort.fieldInternalName,
        order: sort.order,
      })
    );

    setInitialConditions(tempInitialConditions);
  };

  const onEditSort = async (sort: SortEj) => {
    form.resetFields();

    const editedSort = JSON.parse(JSON.stringify(sort));

    setAddRuleItem(false);
    setIsEditing(true);
    setInitialData(editedSort);
    setInitialConditions([]);

    const tempInitialConditions: ISortCondition[] = [...initialConditions];

    sort.conditions?.map((sort) =>
      tempInitialConditions.push({
        fieldInternalName: sort.fieldInternalName,
        order: sort.order,
      })
    );

    setInitialConditions(tempInitialConditions);
  };

  const onCancel = async () => {
    setInitialConditions([]);
    await setInitialData({});

    setIsEditing(false);
    setAddIsButtonVisible(false);
  };

  useEffect(() => {
    if (isEditing && addRuleItem) {
      setInitialData({
        conditions: [{ fieldInternalName: '', fieldType: '', order: '' }],
      });
      setInitialConditions([
        ...initialConditions,
        { fieldInternalName: '', order: '' },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, addRuleItem]);

  const onAddRule = () => {
    setIsEditing(true);
    setAddRuleItem(true);
    setAddIsButtonVisible(true);
    form.resetFields();
  };

  useEffect(() => {
    form.setFields([{ name: 'conditions', value: initialConditions }]);
  }, [form, initialConditions]);

  const onAddClick = () => {
    setAddIsButtonVisible(true);
    setInitialConditions([
      ...initialConditions,
      { fieldInternalName: '', order: '' },
    ]);
  };

  const onProductSelect = (productName: string, index: number) => {
    if (listProduct.data) {
      const filteredProducts = listProduct.data.filter(function (product) {
        return product.fieldName === productName;
      });

      initialConditions[index]['fieldInternalName'] =
        filteredProducts && filteredProducts[0].fieldName;

      let flag = 0;

      if (initialConditions.length > 0) {
        initialConditions.map((product) => {
          if (product.fieldInternalName === '' || product.order === '') {
            flag = 1;
          }
          return undefined;
        });

        if (flag === 1) {
          setAddIsButtonVisible(true);
        } else {
          setAddIsButtonVisible(false);
        }
      }
    }
  };

  const onProductOrderSelect = (order: string, index: number) => {
    initialConditions[index]['order'] = order;

    let flag = 0;

    if (initialConditions.length > 0) {
      initialConditions.map((product) => {
        if (product.fieldInternalName === '' || product.order === '') {
          flag = 1;
        }
        return undefined;
      });

      if (flag === 1) {
        setAddIsButtonVisible(true);
      } else {
        setAddIsButtonVisible(false);
      }
    }
  };

  const onRemove = (index: number) => {
    initialConditions.splice(index, 1);

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
    form.setFieldsValue({ conditions: initialConditions });

    if (
      initialConditions[initialConditions.length - 1].fieldInternalName !==
        '' &&
      initialConditions[initialConditions.length - 1].order !== ''
    ) {
      setAddIsButtonVisible(false);
    } else {
      setAddIsButtonVisible(true);
    }
  };

  return {
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
    isAddButtonVisible,
  };
};

export default useSortTabController;
