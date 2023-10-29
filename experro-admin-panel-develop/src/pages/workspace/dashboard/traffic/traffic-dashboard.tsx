import React from 'react';

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
import { Col, Row } from 'antd';

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
      <Row gutter={32} className='m-b-32'>
        <Col span={18}>
          <div className="border-box">
            <WebsiteTraffic
              t={t}
              visitorsDashboard={visitorsDashboard}
              websiteOptions={websiteOptions}
            />
          </div>
        </Col>
        <Col span={6}>
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
      {/* <div className="ant-row row dashboard-high-chart-block">
        <div className="col high-chart-block">
          <div className="border-box">
            <WebsiteTraffic
              t={t}
              visitorsDashboard={visitorsDashboard}
              websiteOptions={websiteOptions}
            />
          </div>
        </div>

        <div className="col dashboard-counter-list counter-list-vertical">
          <div className=" counter-item">
            <Visitors
              t={t}
              visitorsDashboard={visitorsDashboard}
              visitorsDashboardPreviousDurationRecords={
                visitorsDashboardPreviousDurationRecords
              }
            />
          </div>

          <div className=" counter-item">
            <NewVisitors
              t={t}
              visitorsDashboard={visitorsDashboard}
              visitorsDashboardPreviousDurationRecords={
                visitorsDashboardPreviousDurationRecords
              }
            />
          </div>

          <div className=" counter-item">
            <ReturningVisitors
              t={t}
              visitorsDashboard={visitorsDashboard}
              visitorsDashboardPreviousDurationRecords={
                visitorsDashboardPreviousDurationRecords
              }
            />
          </div>
        </div>
      </div> */}
      <Row gutter={32} className='m-b-32 dashboard-four-col'>
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
      {/* <div className="row ant-row dashboard-counter-list ">
        <div className="col counter-item">
          <TopDevices
            t={t}
            pieChartDashboardTopCategories={pieChartDashboardTopCategories}
            topDevicesOptions={topDevicesOptions}
          />
        </div>

        <div className="col counter-item">
          <TopOs
            t={t}
            pieChartDashboardTopCategories={pieChartDashboardTopCategories}
            topOsOptions={topOsOptions}
          />
        </div>

        <div className="col counter-item">
          <TopBrowser
            t={t}
            pieChartDashboardTopCategories={pieChartDashboardTopCategories}
            topBrowsers={topBrowsers}
          />
        </div>

        <div className="col counter-item">
          <TopCountries
            t={t}
            pieChartDashboardTopCategories={pieChartDashboardTopCategories}
            topLocations={topLocations}
          />
        </div>
      </div> */}
      <Row gutter={32} className='m-b-32 dashboard-table'>
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
    </>
  );
};

export default TrafficDashboard;
