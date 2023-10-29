//@ts-nocheck
import { Button, Input, Select } from 'antd';
import useEnums from '../../utils/enums';
import DeleteIcon from '../../../../../images/icons/delete-icon';
import FilterDropDownIcon from '../../../../../images/icons/filterdropdown-icon';

const ConditionComponent = ({
  rule,
  deleteCondition,
  index,
  changeFieldValue,
  changeConditionValue,
  changeDataValue,
  t,
  onBlur,
}) => {
  const { queryBuilderFieldValues, queryBuilderConditionValues } = useEnums();
  return (
    <div
      className={`condition ${
        rule.field === 'hasError' ||
        rule.condition === 'hasError' ||
        rule.data === 'hasError'
          ? 'condition-border-position'
          : ''
      } `}>
      <div className="ant-row ant-row-middle">
        <div
          className={`ant-row item-filed-border ${
            rule.field === 'hasError' ||
            rule.condition === 'hasError' ||
            rule.data === 'hasError'
              ? 'error-message-border'
              : ''
          } `}>
          <Select
            suffixIcon={<FilterDropDownIcon />}
            value={
              rule.field.displayName === '' || rule.field === 'hasError'
                ? undefined
                : rule.field.displayName
            }
            onChange={(val) => {
              changeFieldValue(index, val);
            }}
            placeholder={t('common.labels.select_field')}
            options={queryBuilderFieldValues}
          />
          <Select
            className="middle-dropdown"
            value={
              rule.condition === '' || rule.condition === 'hasError'
                ? t('common.labels.select_condition')
                : rule.condition
            }
            suffixIcon={<FilterDropDownIcon />}
            onChange={(val) => {
              changeConditionValue(index, val);
            }}
            placeholder={t('common.labels.select_condition')}
            options={
              rule.field.type
                ? queryBuilderConditionValues[rule.field.type]
                : []
            }
          />
          <Input
            onBlur={(e) => onBlur(index, e.target.value)}
            value={rule.data !== 'hasError' ? rule.data : ''}
            placeholder={t('common.labels.enter_value')}
            onChange={(e) => {
              changeDataValue(index, e.target.value);
            }}></Input>
        </div>
        <div className="last-delete-icon">
          <Button type="link" onClick={deleteCondition}>
            <DeleteIcon />
          </Button>
        </div>
      </div>
      {rule.field === 'hasError' ||
      rule.condition === 'hasError' ||
      rule.data === 'hasError' ? (
        <p className="m-0 text-red m-t-4">
          <small>
            {rule.field === 'hasError'
              ? 'Please select field'
              : rule.condition === 'hasError'
              ? 'Please select condition'
              : 'Please enter value'}
          </small>
        </p>
      ) : (
        ''
      )}
    </div>
  );
};
export default ConditionComponent;
