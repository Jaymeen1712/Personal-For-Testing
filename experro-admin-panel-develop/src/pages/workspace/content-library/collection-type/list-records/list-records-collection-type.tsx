import React from 'react';

import RecordsListTable from '../../common-components/records-list-table';
import AddNewModal from '../../common-components/add-new-record-modal';
import UseListRecordsCollectionTypeController from './list-records-collection-type-controller';
import RecordListHeader from '../../common-components/headers/record-list-header';
import { ContentModelList } from '../../../../../types';

const ListRecordsCollectionType: React.FC<{
  selectedContentModalDetails: ContentModelList;
}> = ({ selectedContentModalDetails }) => {
  const {
    isAddNewRecordModalVisible,
    onAddNewRecordButtonClick,
    recordEditDetails,
    changeRecordEditDetails,
  } = UseListRecordsCollectionTypeController();
  return (
    <>
      <RecordListHeader
        selectedContentModalDetails={selectedContentModalDetails}
        onAddNewRecordButtonClick={onAddNewRecordButtonClick}
        selectedContentModalInternalName={
          selectedContentModalDetails.internalName
        }
        changeRecordEditDetails={changeRecordEditDetails}
      />

      <div className="content-library-table">
        <RecordsListTable
          onEditRecordButtonClick={onAddNewRecordButtonClick}
          selectedContentModalInternalName={
            selectedContentModalDetails.internalName
          }
          changeRecordEditDetails={changeRecordEditDetails}
        />
        {isAddNewRecordModalVisible && (
          <AddNewModal
            onAddNewRecordButtonClick={onAddNewRecordButtonClick}
            recordEditDetails={recordEditDetails}
          />
        )}
      </div>
    </>
  );
};

export default ListRecordsCollectionType;
