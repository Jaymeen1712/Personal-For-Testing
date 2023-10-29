import React from 'react';

import { ICmsDashboard } from '../../../../types';
import UnitSoldByDevices from './unit-sold-by-devices';
import UnitSold from './unit-sold';
import TrendingUpProducts from './trending-up-products';
import useProductsController from './products-controller';
import TopSelling from './top-selling';
import HighPotential from './high-potential';
import AbandonProducts from './abandon-products';
import ToImprove from './to-improve';
import NotSelling from './not-selling';
import { Col, Row } from 'antd';

const Products: React.FC<ICmsDashboard> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
  pastStartDate,
  pastEndDate,
}) => {
  const { domain, currency } = useProductsController({
    workspaceId,
    environment,
  });

  return (
    <>
      <Row gutter={32} className="dashboard-high-chart-block m-b-32">
        <Col span={18} className="high-chart-block">
          <div className="border-box">
            <UnitSoldByDevices
              t={t}
              workspaceId={workspaceId}
              environment={environment}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </Col>
        <Col span={6} className="dashboard-counter-list counter-list-vertical">
          <div className=" counter-item">
            <UnitSold
              t={t}
              workspaceId={workspaceId}
              environment={environment}
              startDate={startDate}
              endDate={endDate}
              pastStartDate={pastStartDate}
              pastEndDate={pastEndDate}
            />
          </div>
        </Col>
      </Row>

      <div className='audienceActivities'>
      <HighPotential
        t={t}
        workspaceId={workspaceId}
        environment={environment}
        startDate={startDate}
        endDate={endDate}
        domain={domain}
        currency={currency}
      />

      <TrendingUpProducts
        t={t}
        workspaceId={workspaceId}
        environment={environment}
        startDate={startDate}
        endDate={endDate}
        domain={domain}
        currency={currency}
      />

      <TopSelling
        t={t}
        workspaceId={workspaceId}
        environment={environment}
        startDate={startDate}
        endDate={endDate}
        domain={domain}
        currency={currency}
      />

      <ToImprove
        t={t}
        workspaceId={workspaceId}
        environment={environment}
        startDate={startDate}
        endDate={endDate}
        domain={domain}
        currency={currency}
      />

      <AbandonProducts
        t={t}
        workspaceId={workspaceId}
        environment={environment}
        startDate={startDate}
        endDate={endDate}
        domain={domain}
        currency={currency}
      />

      <NotSelling
        t={t}
        workspaceId={workspaceId}
        environment={environment}
        startDate={startDate}
        endDate={endDate}
        domain={domain}
        currency={currency}
      />
      </div>
    </>
  );
};

export default Products;
