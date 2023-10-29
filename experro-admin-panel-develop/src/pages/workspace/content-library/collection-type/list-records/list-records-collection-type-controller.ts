import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const UseListRecordsCollectionTypeController = () => {
  const location = useLocation();
  const [isAddNewRecordModalVisible, setIsAddNewRecordModalVisible] =
    useState(false);
  const [recordEditDetails, setRecordEditDetails] = useState({
    isEdit: false,
    contentModalDataId: '',
    versionId: '',
  });

  const onAddNewRecordButtonClick = (val: boolean) => {
    setIsAddNewRecordModalVisible(val);
  };

  const changeRecordEditDetails = (
    isEdit: boolean,
    id: string,
    currentVersionId: string
  ) => {
    setRecordEditDetails({
      isEdit: isEdit,
      contentModalDataId: id,
      versionId: currentVersionId,
    });
  };

  useEffect(() => {
    if (isAddNewRecordModalVisible) {
      setIsAddNewRecordModalVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return {
    isAddNewRecordModalVisible,
    onAddNewRecordButtonClick,
    recordEditDetails,
    changeRecordEditDetails,
  };
};

export default UseListRecordsCollectionTypeController;
