import React from 'react';
import { Collapse, Spin, Timeline } from 'antd';
import moment from 'moment';

import { UserContextProps } from '../../../../../../context/user';
import { selectedAudienceType } from '../../../../../../utills';
import useEventController from './events-controller';
import AudienceDetails from '../audience-details';
import SearchRuleIcon from '../../../../../../images/icons/search-rule-icon';
import NoDataFound from '../../../../../../components/no-data-found';
import { LoadingOutlined } from '@ant-design/icons';
import ArrowRightIcon from "../../../../../../images/icons/arrow-right-icon";

interface EventsTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsAudience: any;
  user: UserContextProps | undefined;
  startDate?: string;
  endDate?: string;
  workspaceId: string;
  environmentId: string;
}

const EventsTab: React.FC<EventsTabProps> = ({
  detailsAudience,
  user,
  startDate,
  endDate,
  workspaceId,
  environmentId,
}) => {
  const { t, activitiesAudience, activeCollapse, onCollapseChange } =
    useEventController({
      detailsAudience,
      startDate,
      endDate,
      workspaceId,
      environmentId,
    });

  return (
    <div className="audience">
      <div className="audienceLeft">
        <AudienceDetails detailsAudience={detailsAudience} t={t} user={user} />
      </div>

      <div className="audienceRight">
        <div className="audienceActivities">
          <div className="audience-page-inner-right">
            <p className="title-sm m-b-28">{t('common.labels.activities')}</p>
            <Timeline>
              {activitiesAudience.isSuccess &&
              activitiesAudience.data &&
              activitiesAudience.data.length > 0 ? (
                <>
                  {activitiesAudience.data.map((activeAudience, index) => (
                    <Timeline.Item
                      className={`${`${activeAudience.key}`
                        .split('_')
                        .join('-')
                        // eslint-disable-next-line
                        .replace(/[&\/\\#,+()$~%.\[\]'":*?<>{}]/g, '')} ${
                        activeCollapse.includes(activeAudience.key + index)
                          ? 'isActive'
                          : ''
                      } ${activeAudience.key + index}`}>
                      <Collapse
                        onChange={() =>
                          onCollapseChange(activeAudience.key + index)
                        }
                        className="segments-events-collapse"
                        expandIcon={({ isActive }) =>
                          isActive ? (
                            <span className="anticon">
                              <ArrowRightIcon />
                            </span>
                          ) : (
                            <span className="anticon">
                              <ArrowRightIcon />
                            </span>
                          )
                        }
                        bordered={false}>
                        <Collapse.Panel
                          header={selectedAudienceType(activeAudience.key)}
                          key={activeAudience.key + index}
                          extra={
                            <span>
                              {moment(
                                new Date(activeAudience.timestamp)
                              ).format('DD MMM YYYY, h:mm a')}
                            </span>
                          }>
                          <div className="timeline-details">
                            <>
                              {Object.entries(activeAudience.segmentation).map(
                                (audience) => (
                                  <div className="timeline-details-row">
                                    <div className="timeline-detail-title gray-text">
                                      {audience[0]}
                                    </div>
                                    <div className="timeline-detail-value">
                                      {/* @ts-ignore */}
                                      {audience[1] ? audience[1] : '-'}
                                    </div>
                                  </div>
                                )
                              )}
                            </>
                          </div>
                        </Collapse.Panel>
                      </Collapse>
                    </Timeline.Item>
                  ))}
                </>
              ) : !activitiesAudience.isFetching ? (
                <NoDataFound
                  icon={<SearchRuleIcon />}
                  title={t('common.labels.no_activities_found')}
                />
              ) : (
                <Spin
                  className="HV-center max-height-spin"
                  indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
                  size="large"
                />
              )}
            </Timeline>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsTab;
