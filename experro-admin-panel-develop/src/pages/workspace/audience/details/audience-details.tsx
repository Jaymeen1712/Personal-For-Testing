import React from 'react';
import { Tabs } from 'antd';

import Events from '../components/events';
import Overview from '../components/overview';
import useAudienceDetailsController from './audience-details-controller';
import HeaderAudienceDetails from './header-audience-details';

interface IAudienceDetails {
  environmentId: string;
}

const AudienceDetails: React.FC<IAudienceDetails> = ({ environmentId }) => {
  const {
    t,
    goToAudienceListPage,
    detailsAudience,
    user,
    startDate,
    endDate,
    workspaceId,
    onStartDateEndDateChange,
  } = useAudienceDetailsController({ environmentId });

  return (
    <>
      <HeaderAudienceDetails
        goToAudienceListPage={goToAudienceListPage}
        detailsAudience={detailsAudience}
        t={t}
        startDate={startDate}
        endDate={endDate}
        onStartDateEndDateChange={onStartDateEndDateChange}
      />
      {detailsAudience.isSuccess && (
        <Tabs defaultActiveKey="1" className="audiencePanel">
          <Tabs.TabPane tab={t('common.labels.overview')} key="1">
            <Overview
              detailsAudience={detailsAudience.data}
              user={user}
              startDate={startDate}
              endDate={endDate}
              workspaceId={workspaceId}
              environmentId={environmentId}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={t('common.labels.events')} key="2">
            <Events
              detailsAudience={detailsAudience.data}
              user={user}
              startDate={startDate}
              endDate={endDate}
              workspaceId={workspaceId}
              environmentId={environmentId}
            />
          </Tabs.TabPane>
        </Tabs>
      )}
    </>
  );
};

export default AudienceDetails;
