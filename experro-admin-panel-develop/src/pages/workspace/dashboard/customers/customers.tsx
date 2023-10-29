import React from 'react';

import { ICmsDashboard } from '../../../../types';
import Customer from './customer';
import { useCustomers } from '../services';
import NewCustomers from './new-customers';
import NewCustomerRate from './new-customer-rate';
import ReturningCustomerRate from './returning-customer-rate';
import TopCustomersByRevenue from './top-customers-by-revenue';
import CustomerByRegion from './customer-by-region';
import TopNewCustomersBasedOnRevenue from './top-new-customers-based-on-revenue';
import AllCustomersSummaryBasedOnRevenue from './all-customers-summary-based-on-revenue';
import { Col, Row } from 'antd';

const Customers: React.FC<ICmsDashboard> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
  pastStartDate,
  pastEndDate,
}) => {
  const customers = useCustomers(
    workspaceId,
    environment,
    'eventSum',
    'sum',
    startDate,
    endDate
  );

  const customersPastData = useCustomers(
    workspaceId,
    environment,
    'eventSum',
    'sum',
    pastStartDate,
    pastEndDate
  );

  return (
    <>
      <Row gutter={32} className='m-b-32'>
        <Col span={6} className=" counter-item">
          <Customer
            t={t}
            customers={customers}
            customersPastData={customersPastData}
          />
        </Col>
        <Col span={6} className=" counter-item">
          <NewCustomers
            t={t}
            customers={customers}
            customersPastData={customersPastData}
          />
        </Col>
        <Col span={6} className=" counter-item">
          <NewCustomerRate
            t={t}
            customers={customers}
            customersPastData={customersPastData}
          />
        </Col>
        <Col span={6} className=" counter-item">
          <ReturningCustomerRate
            t={t}
            customers={customers}
            customersPastData={customersPastData}
          />
        </Col>
      </Row>

      <Row gutter={32} className="m-b-32 dashboard-high-chart-block">
        <Col span={16} className="high-chart-block">
          <div className="border-box">
            <TopCustomersByRevenue
              t={t}
              workspaceId={workspaceId}
              environment={environment}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </Col>

        <Col span={8} className="counter-item">
          <CustomerByRegion
            t={t}
            workspaceId={workspaceId}
            environment={environment}
            startDate={startDate}
            endDate={endDate}
          />
        </Col>
      </Row>

      <Row gutter={32} className="m-b-32 dashboard-table">
        <Col span={24}>
          <TopNewCustomersBasedOnRevenue
            t={t}
            workspaceId={workspaceId}
            environment={environment}
            startDate={startDate}
            endDate={endDate}
          />
        </Col>
      </Row>

      <Row gutter={32} className="m-b-32 dashboard-table">
        <Col span={24} >
          <AllCustomersSummaryBasedOnRevenue
            t={t}
            workspaceId={workspaceId}
            environment={environment}
            startDate={startDate}
            endDate={endDate}
          />
        </Col>
      </Row>
    </>
  );
};

export default Customers;
