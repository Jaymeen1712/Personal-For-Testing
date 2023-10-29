import { Dropdown, Menu, Space } from 'antd';
import React from 'react';

import FilterDropDownIcon from '../../images/icons/filterdropdown-icon';
import useFilterSelectController from './filter-select-controller';

export interface FilterSelectProps {
  type: 'select' | 'tree-select';
  /* API url to get options */
  url?: string;
  /* key of the object that has label value */
  labelKey?: string;
  /* key of the object that has value */
  valueKey?: string;
  /* key of the object that has parent entity's label */
  parentLabelKey?: string;
  /* key of the object that has parent entity's value */
  parentValueKey?: string;
  /* if parent entity's label is empty this label will be used */
  parentDefaultLabel?: string;
  /* if parent entity's value is empty this label will be used */
  parentDefaultValue?: string;
  options?: { key: string; label: string }[];
  value: string;
  onChange: (info: string) => void;
  overlayClassName?:string;
  className?:string
}

const FilterSelect: React.FC<FilterSelectProps> = (props) => {
  const { apiOptions, label, onOptionChange } =
    useFilterSelectController(props);

  return (
    <Dropdown
      overlay={
        <Menu items={props.options || apiOptions} onClick={onOptionChange} />
      }
      overlayClassName={props.overlayClassName}
      className={props.className}
      trigger={['click']}
      placement="bottomRight">
      <div>
        <Space>{label}</Space>
        <span className="filterdropdownarrow">
          <FilterDropDownIcon />
        </span>
      </div>
    </Dropdown>
  );
};

export default FilterSelect;
