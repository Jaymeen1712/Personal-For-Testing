import React from 'react';
import { Col, Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { ICmsDashboard } from '../../../../types';
import useTrafficDashboardController from './traffic-dashboard-controller';
import WebsiteTraffic from './websiteTraffic';
import Visitors from './visitors';
import NewVisitors from './newVisitors';
import ReturningVisitors from './returningVisitors';
import TopDevices from './topDevices';
import TopOs from './topOs';
import TopBrowser from './topBrowsers';
import TopCountries from './topCountries';
import SessionByTrafficSources from './session-by-traffic-sources';
import TopLandingPages from './topLandingPages';
import { allowSpecificDomain } from '../../../../utills';

const TrafficDashboard: React.FC<ICmsDashboard> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
  pastStartDate,
  pastEndDate,
}) => {
  const {
    websiteOptions,
    topDevicesOptions,
    topOsOptions,
    topBrowsers,
    topLocations,
    visitorsDashboard,
    visitorsDashboardPreviousDurationRecords,
    pieChartDashboardTopCategories,
    userEmail,
  } = useTrafficDashboardController({
    workspaceId,
    environment,
    startDate,
    endDate,
    pastStartDate,
    pastEndDate,
    t,
  });

  return (
    <>
      {environment && environment !== null ? (
        <>
          <Row gutter={32} className="m-b-32">
            <Col span={18}>
              <div className="border-box">
                <WebsiteTraffic
                  t={t}
                  visitorsDashboard={visitorsDashboard}
                  websiteOptions={websiteOptions}
                />
              </div>
            </Col>
            <Col span={6} className="counter-list-vertical">
              <div className="w-100 m-b-32 counter-item">
                <Visitors
                  t={t}
                  visitorsDashboard={visitorsDashboard}
                  visitorsDashboardPreviousDurationRecords={
                    visitorsDashboardPreviousDurationRecords
                  }
                />
              </div>

              <div className="w-100 m-b-32 counter-item">
                <NewVisitors
                  t={t}
                  visitorsDashboard={visitorsDashboard}
                  visitorsDashboardPreviousDurationRecords={
                    visitorsDashboardPreviousDurationRecords
                  }
                />
              </div>

              <div className="w-100 counter-item">
                <ReturningVisitors
                  t={t}
                  visitorsDashboard={visitorsDashboard}
                  visitorsDashboardPreviousDurationRecords={
                    visitorsDashboardPreviousDurationRecords
                  }
                />
              </div>
            </Col>
          </Row>
          <Row gutter={32} className="m-b-32 dashboard-four-col">
            <Col span={6}>
              <TopDevices
                t={t}
                pieChartDashboardTopCategories={pieChartDashboardTopCategories}
                topDevicesOptions={topDevicesOptions}
              />
            </Col>
            <Col span={6}>
              <TopOs
                t={t}
                pieChartDashboardTopCategories={pieChartDashboardTopCategories}
                topOsOptions={topOsOptions}
              />
            </Col>
            <Col span={6}>
              <TopBrowser
                t={t}
                pieChartDashboardTopCategories={pieChartDashboardTopCategories}
                topBrowsers={topBrowsers}
              />
            </Col>
            <Col span={6}>
              <TopCountries
                t={t}
                pieChartDashboardTopCategories={pieChartDashboardTopCategories}
                topLocations={topLocations}
              />
            </Col>
          </Row>
          {allowSpecificDomain(userEmail) && (
            <Row gutter={32} className="m-b-32 dashboard-table">
              <Col span={12}>
                <SessionByTrafficSources
                  t={t}
                  workspaceId={workspaceId}
                  environment={environment}
                  startDate={startDate}
                  endDate={endDate}
                  pastStartDate={pastStartDate}
                  pastEndDate={pastEndDate}
                />
              </Col>

              <Col span={12}>
                <TopLandingPages
                  t={t}
                  workspaceId={workspaceId}
                  environment={environment}
                  startDate={startDate}
                  endDate={endDate}
                  pastStartDate={pastStartDate}
                  pastEndDate={pastEndDate}
                />
              </Col>
            </Row>
          )}
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

export default TrafficDashboard;
