import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { ContentModelList } from '../../../../../types';

const useMinimumMaximumController = (
  modelList?: ContentModelList[],
  destinationContentModalId?: string
) => {
  const { t } = useTranslation();

  const [selectedContentModalName, setSelectedContentModalName] = useState('');
  const changeRelationValue = (val: string) => {
    const result = modelList?.find((item) => item.id === val);
    if (result) {
      setSelectedContentModalName(result.name);
    }
  };

  useEffect(() => {
    if (destinationContentModalId) {
      const result = modelList?.find(
        (item) => item.id === destinationContentModalId
      );
      if (result) {
        setSelectedContentModalName(result.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationContentModalId]);

  return {
    t,
    selectedContentModalName,
    changeRelationValue,
  };
};
export default useMinimumMaximumController;
