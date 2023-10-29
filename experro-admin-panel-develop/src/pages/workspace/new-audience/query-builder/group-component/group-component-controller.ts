//@ts-nocheck
import { useTranslation } from 'react-i18next';

import useEnums from '../../utils/enums';
import { domPurify } from '../../../../../utills';

const useGroupComponentController = (
  query,
  changeQuery,
  reFetchSegmentDetailsBYQuery
) => {
  const { t } = useTranslation();
  const { queryBuilderFieldValues } = useEnums();
  const deleteCondition = (index: number) => {
    query.rules.splice(index, 1);
    changeQuery();
  };

  const addGroup = () => {
    query.rules.push({
      group: {
        operator: 'AND',
        rules: [],
      },
    });
    changeQuery();
  };

  const addCondition = () => {
    query.rules.push({
      condition: '',
      data: '',
      field: {
        fieldName: '',
        displayName: '',
        type: '',
      },
    });
    changeQuery();
  };

  const changeFieldValue = (index, value) => {
    const result = queryBuilderFieldValues.find((item) => item.value === value);
    if (result) {
      query.rules[index].field = {
        fieldName: result.value,
        displayName: result.label,
        type: result.type,
      };
      query.rules[index].condition = '';
      query.rules[index].data = '';
    }

    changeQuery();
  };

  const changeConditionValue = (index, value) => {
    query.rules[index].condition = value;
    changeQuery();
  };

  const changeDataValue = (index, value) => {
    query.rules[index].data = value;
    changeQuery();
  };

  const changeOperator = (value) => {
    query.operator = value;
    changeQuery();
  };

  const onBlur = (index, val: string) => {
    const purifyData = domPurify(val);
    query.rules[index].data = purifyData;
      reFetchSegmentDetailsBYQuery();
    if (val) {
    }
  };
  return {
    deleteCondition,
    addGroup,
    addCondition,
    changeFieldValue,
    changeConditionValue,
    changeDataValue,
    changeOperator,
    t,
    onBlur,
  };
};
export default useGroupComponentController;
