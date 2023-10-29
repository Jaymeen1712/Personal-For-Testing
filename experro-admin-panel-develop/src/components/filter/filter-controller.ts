import { ChangeEvent, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

import { DebouncedFunc } from '../../types';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

let changeFn: DebouncedFunc<() => void> | null = null;

const useFilterController = (
  onChange: (filter: string) => void,
  minSearchableLength?: number,
  filterTextProp?: string
) => {
  const { t } = useTranslation();
  const [filterText, setFilterText] = useState(filterTextProp || '');
  const location = useLocation();

  useEffect(() => {
    if (filterText?.length > 0) {
      setFilterText('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    setFilterText(filterTextProp || '');
  }, [filterTextProp]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setFilterText(value);

    if (changeFn !== null) {
      changeFn.cancel();
    }

    if (value.length >= (minSearchableLength || 3) || value.length === 0) {
      changeFn = debounce(() => onChange(value), 500);
      changeFn();
    }
  };

  return {
    t,
    filterText,
    onInputChange,
    setFilterText,
  };
};

export default useFilterController;
