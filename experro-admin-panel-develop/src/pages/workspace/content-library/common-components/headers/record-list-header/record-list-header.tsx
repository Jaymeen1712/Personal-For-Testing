import React from 'react';
import { Button, Tooltip } from 'antd';

import HamburgerIcon from '../../../../../../images/icons/hamburger-icon';
import { ContentModelList } from '../../../../../../types';
import useRecordListHeaderController from './record-list-header-controller';
import { onSidebarToggle } from '../../../../../../utills';
import PlusIcon from '../../../../../../images/icons/plus-icon';

const RecordListHeader: React.FC<{
  selectedContentModalDetails: ContentModelList;
  onAddNewRecordButtonClick: (val: boolean) => void;
  selectedContentModalInternalName: string;
  changeRecordEditDetails: (
    isEdit: boolean,
    id: string,
    currentVersionId: string
  ) => void;
}> = ({
  selectedContentModalDetails,
  onAddNewRecordButtonClick,
  selectedContentModalInternalName,
  changeRecordEditDetails,
}) => {
  const { t, canCreateRecord } = useRecordListHeaderController(
    selectedContentModalInternalName
  );
  return (
    <div className="headerinner ant-row ant-row-no-wrap ant-space-align-start ant-row-space-between content-library-header">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {selectedContentModalDetails?.name}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {selectedContentModalDetails?.description}
          </span>
        </div>
      </div>
      <div className="headerright">
        <div className="ant-row ant-row-end ant-space-align-center">
          <Tooltip
            placement="right"
            title={
              !canCreateRecord && t('common.messages.error_create_record')
            }>
            <Button
              disabled={
                !canCreateRecord ||
                selectedContentModalDetails?.internalName?.includes(
                  'ecommerce_'
                )
              }
              key="headerAddRecord"
              type="primary"
              onClick={() => {
                onAddNewRecordButtonClick(true);
                changeRecordEditDetails(false, '', '');
              }}
              icon={<span className="anticon"><PlusIcon /></span>}>
              {t('common.labels.add_record')}
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default RecordListHeader;
