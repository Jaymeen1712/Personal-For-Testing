import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const UseAddNewRecordBannerController = () => {
  const { t } = useTranslation();

  const [isAddNewRecordModalVisible, setIsAddNewRecordModalVisible] =
    useState(false);

  const onAddNewRecordButtonClick = (val: boolean) => {
    setIsAddNewRecordModalVisible(val);
  };

  return {
    isAddNewRecordModalVisible,
    t,
    onAddNewRecordButtonClick,
  };
};
export default UseAddNewRecordBannerController;
