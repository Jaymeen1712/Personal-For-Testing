import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { TFunction } from 'react-i18next';

import {
  IListProductResponse,
  IPinSubmit,
  PinEj,
  RuleType,
} from '../../../../../../../types';
import {
  openNotificationWithIcon,
  TEXT_REGEX_PATTERN,
} from '../../../../../../../utills';
import { useListProduct } from '../../../../services';

const usePinTabController = ({
  workspaceId,
  addRule,
  editRule,
  setIsDeleteSubRule,
  deleteRule,
  environmentId,
  t,
  setAddIsButtonVisiblePin,
}: {
  workspaceId: string;
  setIsDeleteSubRule: (isDeleteSubRule: boolean) => void;
  deleteRule?: (ruleType: RuleType, id?: string) => void;
  addRule?: (data: PinEj, ruleType: RuleType) => void;
  editRule?: (data: PinEj, ruleType: RuleType) => void;
  environmentId?: string;
  t: TFunction<'translation', undefined>;
  setAddIsButtonVisiblePin: (isAddButtonVisiblePin: boolean) => void;
}) => {
  const [form] = Form.useForm();

  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState<PinEj>();
  const [deleteSubRule, setDeleteSubRule] = useState<string>();
  const [selectedProducts, setSelectedProducts] = useState<
    IListProductResponse[]
  >([]);

  const [isDuplicate, setIsDuplicate] = useState(false);
  const [search, setSearch] = useState<string>('');

  const listProduct = useListProduct(workspaceId, search, environmentId);

  const [filteredProduct, setFilteredProduct] = useState<
    IListProductResponse[] | undefined
  >([]);

  const onFinish = (values: IPinSubmit) => {
    if (values.name?.trim().length === 0) {
      form.setFields([
        {
          name: 'name',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.name && values.name?.trim().length < 3) {
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
    } else if (values.name && values.name.length > 255) {
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
      values.name &&
      values.name.trim().length > 0 &&
      !TEXT_REGEX_PATTERN.test(values.name)
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
      const pin: PinEj = {
        name: values.name,
        conditions: selectedProducts.map((product) => {
          return {
            id: product.id,
            name: product.nameEti,
            image: product.imagesEj,
            sku: product.skuEsi,
            position: product.position,
          };
        }),
      };

      if (isDuplicate) {
        addRule && addRule(pin, 'pin');
        setIsDuplicate(false);
      } else if (initialData?.id === undefined) {
        addRule && addRule(pin, 'pin');
      } else {
        pin.id = initialData.id;
        editRule && editRule(pin, 'pin');
      }

      form.resetFields();
      setInitialData({});
      setSelectedProducts([]);
      setIsEditing(false);
      setSearch('');
    }
  };

  const onAddRule = () => {
    setIsEditing(true);
    setSearch('');
    form.resetFields();
    setAddIsButtonVisiblePin(true);
  };

  const onSelectedProduct = (value: string) => {
    if (selectedProducts.length >= 50) {
      openNotificationWithIcon(
        'error',
        t('common.messages.reached_maximum_limit_of_pin')
      );
      form.setFieldsValue({ productName: '' });
    } else {
      setSearch('');
      form.setFields([
        {
          name: 'productName',
          value: search,
        },
      ]);
      if (listProduct.data) {
        const selectedProduct = listProduct.data.filter(
          (product) => product.nameEti === value
        );
        selectedProduct[0].position = selectedProducts.length + 1;
        selectedProducts.push(selectedProduct[0]);
        setSelectedProducts([...selectedProducts]);
        form.setFieldsValue({ productName: '' });
      }

      if (selectedProducts.length > 0) {
        setAddIsButtonVisiblePin(false);
      } else {
        setAddIsButtonVisiblePin(true);
      }
    }
  };

  const onInputNumberChange = (
    value: number | null | string,
    index: number
  ) => {
    selectedProducts[index].position = value;
    setSelectedProducts([...selectedProducts]);
  };

  const onInputNumberFocus = (
    e: React.FocusEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.value === '') {
      selectedProducts[index].position = selectedProducts.length;
      setSelectedProducts([...selectedProducts]);
    }
  };

  const onDuplicateSubPin = (rule: PinEj) => {
    form.resetFields();

    const clonedPin = JSON.parse(JSON.stringify(rule));

    setIsEditing(true);
    setInitialData(clonedPin);
    setIsDuplicate(true);

    const tempSelectedProducts: IListProductResponse[] = [...selectedProducts];

    rule.conditions?.map((rule) => {
      tempSelectedProducts.push({
        id: rule.id,
        imagesEj: rule.image,
        skuEsi: rule.sku,
        nameEti: rule.name,
        position: rule.position,
      });
      return true;
    });

    setSelectedProducts(tempSelectedProducts);
  };

  const onEditSubPin = async (rule: PinEj) => {
    form.resetFields();
    setSearch('');

    const editedPin = JSON.parse(JSON.stringify(rule));

    setIsEditing(true);
    setInitialData(editedPin);

    const tempSelectedProducts: IListProductResponse[] = [...selectedProducts];

    rule.conditions?.map((rule) => {
      tempSelectedProducts.push({
        id: rule.id,
        imagesEj: rule.image,
        skuEsi: rule.sku,
        nameEti: rule.name,
        position: rule.position,
      });
      return true;
    });

    setSelectedProducts(tempSelectedProducts);
  };

  const onCancel = async () => {
    await setInitialData({});
    setSearch('');
    setSelectedProducts([]);
    setIsEditing(false);
    setAddIsButtonVisiblePin(false);
  };

  const onDeleteSubPin = (rule: PinEj) => {
    setDeleteSubRule(rule.id);
    setIsDeleteSubRule(true);
  };

  const onDeleteSubRulePins = () => {
    deleteRule && deleteRule('pin', deleteSubRule);
  };

  const onRemove = (productId?: string) => {
    selectedProducts.splice(
      selectedProducts.findIndex((product) => product.id === productId),
      1
    );
    setSelectedProducts([...selectedProducts]);

    if (selectedProducts.length > 0) {
      setAddIsButtonVisiblePin(false);
    } else {
      setAddIsButtonVisiblePin(true);
    }

    form.setFieldsValue({ productName: undefined });
  };

  const onSelectProductSearch = (value: string) => {
    setSearch(value);
    form.setFields([
      {
        name: 'productName',
        value: '',
      },
    ]);
    form.setFields([
      {
        name: 'productName',
        value: value,
      },
    ]);
  };

  useEffect(() => {
    if (
      listProduct.data &&
      listProduct.data?.length > 0 &&
      listProduct.isSuccess
    ) {
      const products = listProduct.data?.filter(
        (product) =>
          !selectedProducts.some(
            (selectedProduct) => selectedProduct.skuEsi === product.skuEsi
          )
      );
      setFilteredProduct(products);
      form.setFields([
        {
          name: 'productName',
          value: search,
        },
      ]);
    } else {
      setFilteredProduct([]);
      form.setFields([
        {
          name: 'productName',
          value: search,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    listProduct.data,
    selectedProducts,
    isDuplicate,
    isEditing,
    listProduct.isSuccess,
  ]);

  return {
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
    onDuplicateSubPin,
    onDeleteSubPin,
    onAddRule,
    onDeleteSubRulePins,
    onRemove,
    onSelectProductSearch,
    onInputNumberFocus,
    search,
  };
};

export default usePinTabController;
