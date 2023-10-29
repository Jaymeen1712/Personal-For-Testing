import React from 'react';

import usePublishQueueController from './publishQueue-controller';
import HeaderPublishQueue from './header';
import ContentPublishQueue from './content';
import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../utills';
import SubSideBar from '../../../components/sub-sidebar';

interface IPublishQueue {
  onMainSidebarActiveItem?: (val: string) => void;
}

const PublishQueue: React.FC<IPublishQueue> = ({ onMainSidebarActiveItem }) => {
  const {
    listPublishQueue,
    columns,
    isSuccess,
    currentPageNumber,
    skipLimit,
    userPreference,
    onPreferenceChange,
    selectedUserIds,
    selectedModelIds,
    selectedStatus,
    setCurrentPageNumber,
    setSkip,
    setSearchData,
    setSkipLimit,
    setSelectedUserIds,
    setSelectedModelIds,
    setSelectedStatus,
    onEnvironmentChange,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  } = usePublishQueueController({ onMainSidebarActiveItem });

  return (
    <div className="page-wrapper">
      <SubSideBar
        isGlobalPage={false}
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.PUBLISH_QUEUE
        }
        isEnvironmentSelectorVisible={true}
        onEnvironmentSelectValueChange={onEnvironmentChange}>
        <div className="navigation-page-content publish-queue-content">
          <HeaderPublishQueue
            setCurrentPageNumber={setCurrentPageNumber}
            setSkip={setSkip}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            startDate={startDate}
            endDate={endDate}
          />

          <ContentPublishQueue
            userPreference={userPreference}
            onPreferenceChange={onPreferenceChange}
            listPublishQueue={listPublishQueue}
            columns={columns}
            isSuccess={isSuccess}
            currentPageNumber={currentPageNumber}
            skipLimit={skipLimit}
            selectedUserIds={selectedUserIds}
            selectedModelIds={selectedModelIds}
            selectedStatus={selectedStatus}
            setSearchData={setSearchData}
            setCurrentPageNumber={setCurrentPageNumber}
            setSkip={setSkip}
            setSkipLimit={setSkipLimit}
            setSelectedUserIds={setSelectedUserIds}
            setSelectedModelIds={setSelectedModelIds}
            setSelectedStatus={setSelectedStatus}
          />
        </div>
      </SubSideBar>
    </div>
  );
};

export default PublishQueue;
