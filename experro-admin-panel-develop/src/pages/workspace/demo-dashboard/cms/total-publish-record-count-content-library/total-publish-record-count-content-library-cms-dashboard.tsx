import React from 'react';

import { ICmsDashboard } from '../../../../../types';
import useTotalPublishRecordCountContentLibraryCmsDashboardController from './total-publish-record-count-controller-cms-dashboard';
import { numberFormatter } from '../../../../../utills';
import { Col } from 'antd';

const TotalPublishRecordCountContentLibraryCmsDashboard: React.FC<
  ICmsDashboard
> = ({ t, workspaceId, environment, startDate, endDate }) => {
  const { contentLibraryPublishedAndAllCount } =
    useTotalPublishRecordCountContentLibraryCmsDashboardController({
      workspaceId,
      environment,
      startDate,
      endDate,
    });

  return (
    <>
      <Col span={6} className="counter-item">
        <div className="item-inner">
          <h3>{t('common.labels.total_records_cms')}</h3>
          <div className="ant-row ant-row-space-between">
            <p>
              {contentLibraryPublishedAndAllCount.isSuccess &&
              contentLibraryPublishedAndAllCount.data?.contentModelDataCount
                ? numberFormatter(
                    contentLibraryPublishedAndAllCount.data
                      ?.contentModelDataCount
                  )
                : numberFormatter(0)}
            </p>
          </div>
        </div>
      </Col>
      <Col span={6} className="counter-item">
        <div className="item-inner">
          <h3>{t('common.labels.published_records')}</h3>
          <div className="ant-row ant-row-space-between">
            <p>
              {contentLibraryPublishedAndAllCount.isSuccess &&
              contentLibraryPublishedAndAllCount.data
                ?.contentModelPublishedDataCount
                ? numberFormatter(
                    contentLibraryPublishedAndAllCount.data
                      ?.contentModelPublishedDataCount
                  )
                : numberFormatter(0)}
            </p>
          </div>
        </div>
      </Col>
    </>
  );
};

export default TotalPublishRecordCountContentLibraryCmsDashboard;
