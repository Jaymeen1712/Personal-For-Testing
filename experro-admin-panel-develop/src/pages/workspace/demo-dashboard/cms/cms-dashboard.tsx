import React from 'react';

import { ICmsDashboard } from '../../../../types';
import TotalPublishRecordCountContentLibraryCmsDashboard from './total-publish-record-count-content-library';
import TotalRecordsStorageSizeMediaCmsDashboard from './total-records-storage-size-media/total-records-storage-size-media-cms-dashboard';
import RecentlyAddedRecordsCmsDashboard from './recently-added-records';
import RecentlyModifiedRecordsCmsDashboard from './recently-modified-records';
import RecentlyPublishedRecordsCmsDashboard from './recently-published-records';
import RecentlyScheduleRecordsCmsDashboard from './recently-schedule-records';
import { Col, Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const CmsDashboard: React.FC<ICmsDashboard> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}) => {
  return (
    <>
      {environment && environment !== null ? (
        <>
          <Row gutter={32} className="m-b-32 cms-dashboard">
            <TotalPublishRecordCountContentLibraryCmsDashboard
              t={t}
              workspaceId={workspaceId}
              environment={environment}
              startDate={startDate}
              endDate={endDate}
            />
            <TotalRecordsStorageSizeMediaCmsDashboard
              t={t}
              workspaceId={workspaceId}
              startDate={startDate}
              endDate={endDate}
            />
          </Row>

          <Row gutter={32} className="m-b-32 dashboard-table">
            <Col span={12}>
              <RecentlyAddedRecordsCmsDashboard
                t={t}
                workspaceId={workspaceId}
                environment={environment}
                startDate={startDate}
                endDate={endDate}
              />
            </Col>
            <Col span={12}>
              <RecentlyModifiedRecordsCmsDashboard
                t={t}
                workspaceId={workspaceId}
                environment={environment}
                startDate={startDate}
                endDate={endDate}
              />
            </Col>
          </Row>
          <Row gutter={32} className="m-b-24 dashboard-table">
            <Col span={12}>
              <RecentlyPublishedRecordsCmsDashboard
                t={t}
                workspaceId={workspaceId}
                environment={environment}
                startDate={startDate}
                endDate={endDate}
              />
            </Col>
            <Col span={12}>
              <RecentlyScheduleRecordsCmsDashboard
                t={t}
                workspaceId={workspaceId}
                environment={environment}
                startDate={startDate}
                endDate={endDate}
              />
            </Col>
          </Row>
        </>
      ) : (
        <Spin
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      )}
    </>
  );
};

export default CmsDashboard;
