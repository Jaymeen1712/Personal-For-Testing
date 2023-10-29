import React from 'react';
import { Input } from 'antd';

import useFilterController from './filter-controller';
import SearchIcon from '../../images/icons/search-icon';
import { IFilterProps } from '../../types';

const Filter: React.FC<IFilterProps> = ({
  onChange,
  minSearchableLength,
  searchText,
  className,
}) => {
  const { filterText, t, onInputChange } = useFilterController(
    onChange,
    minSearchableLength,
    searchText
  );

  return (
    <Input
      size="middle"
      className={className}
      placeholder={t('common.labels.search')}
      prefix={<SearchIcon />}
      value={filterText}
      onChange={onInputChange}
    />
  );
};

export default Filter;
