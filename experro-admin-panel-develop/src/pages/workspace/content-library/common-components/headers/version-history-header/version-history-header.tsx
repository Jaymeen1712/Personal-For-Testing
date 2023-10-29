import React from 'react';

import ArrowLeftIcon from '../../../../../../images/icons/arrow-left-icon';
import useVersionHistoryHeaderController from './version-history-header-controller';
import { ContentModelList } from '../../../../../../types';

const VersionHistoryHeader: React.FC<{
  selectedContentModalDetails: ContentModelList;
  recordTitle: string;
}> = ({ selectedContentModalDetails, recordTitle }) => {
  const { t, onBackButtonClick } = useVersionHistoryHeaderController(
    selectedContentModalDetails
  );
  return (
    <>
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
        <div className="headerleft w-100 ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onBackButtonClick}>
            <ArrowLeftIcon />
          </div>
          <div className='ant-page-header'>
            <span className='ant-page-header-heading-title'>{t('common.labels.back_to')} {recordTitle}</span>
            </div>
        </div>
      </div>
    </>
  );
};

export default VersionHistoryHeader;
