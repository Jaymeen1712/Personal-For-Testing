import { useEffect, useMemo, useState } from 'react';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { IWorkspaceParams } from '../../../../../../types';
import useEnums from '../../../../content-model/enums';
import { ReRankingCustomStrategyDetailsProps } from './re-ranking-custom-strategy-details';
import { openNotificationWithIcon } from '../../../../../../utills';
import { useListProductField } from '../../../services';

export interface ProductField {
  id: string;
  title: string;
  type: string;
  typeIcon: JSX.Element;
}

let addedWeightageFields: Array<ProductField> = [];
let selectedSortLevel1: string;
let selectedSortLevel2: string;

const useReRankingCustomStrategyController = ({
  isSavedAction,
  updateSavedAction,
  updateStrategy,
  newSelectedStrategy,
  updateActionEnabled,
}: ReRankingCustomStrategyDetailsProps) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const { CONTENT_FIELD_TYPES } = useEnums();
  const environment =
    localStorage.getItem(`${workspaceId}/environmentId`) || '';
  const SCORE_FIELD_ID = 'score';
  const defaultSortLevel1 = 'Price';
  const defaultSortLevel2 = 'Name';

  const listProductField = useListProductField(
    workspaceId,
    're-ranking',
    environment
  );

  const [sortLevelFields1, setSortLevelFields1] = useState<Array<ProductField>>(
    []
  );
  const [sortLevelFields2, setSortLevelFields2] = useState<Array<ProductField>>(
    []
  );

  const [selectedWeightageFields, setSelectedWeightageFields] = useState<
    Array<ProductField>
  >([]);
  const [isAddWeightedFieldEnabled, setAddWeightedFieldEnabled] =
    useState(false);

  // @ts-ignore
  const productFields: Array<ProductField> = useMemo(() => {
    const score = {
      id: SCORE_FIELD_ID,
      fieldName: SCORE_FIELD_ID,
      title: 'Score',
      type: 'text',
    };
    let productFieldData = listProductField?.data || [];
    if (
      productFieldData.length &&
      !productFieldData.some((field) => field.fieldName === SCORE_FIELD_ID)
    ) {
      productFieldData = [...productFieldData, score];
    }
    return productFieldData.map((data) => {
      const type = data.type.replace('string', 'text');
      return {
        id: data.fieldName,
        title: data.title,
        type: type,
        typeIcon: CONTENT_FIELD_TYPES.find((item) => item.key === type)?.icon,
      };
    });
  }, [listProductField, CONTENT_FIELD_TYPES]);

  const onSortLevel1Change = (selectedFieldId: string) => {
    selectedSortLevel1 = selectedFieldId;
    updateSortLevelFields();
    updateActionEnabled(
      newSelectedStrategy.properties?.sortOrders?.level1 !== selectedFieldId
    );
  };

  const onSortLevel2Change = (selectedFieldId: string) => {
    selectedSortLevel2 = selectedFieldId;
    updateSortLevelFields();
    updateActionEnabled(
      newSelectedStrategy.properties?.sortOrders?.level2 !== selectedFieldId
    );
  };

  useEffect(() => {
    if (isSavedAction) {
      form.submit();
      updateSavedAction(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSavedAction]);

  useEffect(() => {
    addedWeightageFields = [];
    setAddWeightedFieldEnabled(false);
    const addWeightageFields: Array<ProductField> = [];
    if (productFields.length) {
      let fieldsWeightages:
        | Array<{ title: string; percentage: number }>
        | undefined = [];
      const fields: Array<string> = [];
      if (newSelectedStrategy.properties) {
        selectedSortLevel1 = newSelectedStrategy.properties.sortOrders.level1;
        selectedSortLevel2 = newSelectedStrategy.properties.sortOrders.level2;
        fieldsWeightages = newSelectedStrategy.properties.fieldsWeightage;
        newSelectedStrategy.properties.fieldsWeightage?.forEach(
          (fieldsWeightage) => {
            // @ts-ignore
            const productField: ProductField = productFields.find(
              (productField) => productField.id === fieldsWeightage.title
            );
            addWeightageFields.push(productField);
            fields.push(fieldsWeightage.title);
          }
        );
      } else {
        selectedSortLevel1 = (
          productFields.find((field) => field.title === defaultSortLevel1) ||
          productFields[0]
        ).id;
        selectedSortLevel2 = (
          productFields.find((field) => field.title === defaultSortLevel2) ||
          productFields[1]
        ).id;
      }
      const customStrategy = {
        sortOrders: {
          level1: selectedSortLevel1,
          level2: selectedSortLevel2,
        },
        fieldsWeightage: fieldsWeightages,
        fields: fields,
      };
      setSelectedWeightageFields(addWeightageFields);
      updateSortLevelFields();

      form.setFieldsValue(customStrategy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productFields?.length, newSelectedStrategy]);

  const updateSortLevelFields = () => {
    setSortLevelFields1(
      productFields.filter((field) => field.id !== selectedSortLevel2)
    );
    setSortLevelFields2(
      productFields.filter((field) => field.id !== selectedSortLevel1)
    );
  };

  const onFieldSelected = (newFieldId: string) => {
    const isAddedAlready = !!selectedWeightageFields.find(
      (field) => field.id === newFieldId
    );
    if (!isAddedAlready) {
      const newProductField = productFields.find(
        (field) => field.id === newFieldId
      );
      if (newProductField) {
        addedWeightageFields.push(newProductField);
        setAddWeightedFieldEnabled(true);
      }
    }
  };

  const onFieldDeselected = (removedFieldId: string) => {
    addedWeightageFields = addedWeightageFields.filter(
      (field) => field.id !== removedFieldId
    );
    const productField = productFields.find(
      (field) => field.id === removedFieldId
    );
    if (productField) {
      onRemoveWeightageField(productField);
    }
  };

  const onAddWeightageFields = () => {
    const fieldValue = form.getFieldsValue();
    if (!fieldValue.fieldsWeightage) {
      fieldValue.fieldsWeightage = [];
    }
    addedWeightageFields.forEach(() => {
      fieldValue.fieldsWeightage.push({ percentage: 0 });
    });
    setSelectedWeightageFields([
      ...selectedWeightageFields,
      ...addedWeightageFields,
    ]);
    addedWeightageFields = [];
    setAddWeightedFieldEnabled(false);
    updateActionEnabled(true);
    form.setFieldsValue(fieldValue);
  };

  const onRemoveWeightageField = (field: ProductField) => {
    const index = selectedWeightageFields.findIndex(
      (value) => value.id === field.id
    );
    const fieldValue = form.getFieldsValue();
    if (fieldValue.fieldsWeightage && index > -1) {
      fieldValue.fields = fieldValue.fields.filter(
        (value: string) => value !== field.id
      );
      selectedWeightageFields.splice(index, 1);
      fieldValue.fieldsWeightage.splice(index, 1);

      form.setFieldsValue(fieldValue);
      setSelectedWeightageFields([...selectedWeightageFields]);
      updateActionEnabled(true);
    }
    let hasNewField = false;
    for (const value of fieldValue.fields) {
      hasNewField = selectedWeightageFields.find(
        (field) => field.id === value
      ) === undefined;
      if (hasNewField) {
        break;
      }
    }
    setAddWeightedFieldEnabled(hasNewField);
  };

  const onFieldWeightageChange = () => {
    updateActionEnabled(true);
  };

  const validateFieldsWeightage = (values: {
    sortOrders: {
      level1: string;
      level2: string;
    };
    fields: Array<string>;
    fieldsWeightage: Array<{ percentage: string }>;
  }) => {
    if (!values.fieldsWeightage) {
      openNotificationWithIcon(
        'error',
        t('common.messages.custom_strategy_fields_not_added_error')
      );
      return false;
    }
    if (values.fieldsWeightage.find((field) => !field.percentage)) {
      openNotificationWithIcon(
        'error',
        t('common.messages.custom_strategy_field_percentage_zero_error')
      );
      return false;
    }
    const totalFieldPercentage = values.fieldsWeightage
      .map((field) => parseFloat(field.percentage))
      .reduce((total, field) => total + field);
    if (totalFieldPercentage > 100) {
      openNotificationWithIcon(
        'error',
        t('common.messages.custom_strategy_field_percentage_error')
      );
      return false;
    }
    return true;
  };

  const onFieldWeightageFinish = async () => {
    const values: {
      sortOrders: {
        level1: string;
        level2: string;
      };
      fields: Array<string>;
      fieldsWeightage: Array<{ percentage: string }>;
    } = await form.validateFields();
    if (validateFieldsWeightage(values)) {
      const fieldsWeightage = values.fieldsWeightage.map((field, index) => ({
        title: values.fields[index],
        percentage: parseFloat(field.percentage),
      }));
      updateStrategy({
        strategy: newSelectedStrategy.strategy,
        properties: { sortOrders: values.sortOrders, fieldsWeightage },
      });
    }
  };

  return {
    t,
    form,
    isFieldsLoading: listProductField.isFetching,
    productFields,
    sortLevelFields1,
    sortLevelFields2,
    selectedSortLevel1,
    selectedSortLevel2,
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
  };
};

export default useReRankingCustomStrategyController;
