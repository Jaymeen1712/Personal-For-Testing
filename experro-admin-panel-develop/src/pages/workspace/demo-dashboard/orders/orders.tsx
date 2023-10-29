import React from 'react';
import { Col, Row, Spin } from 'antd';

import { ICmsDashboard } from '../../../../types';
import Revenue from './revenue';
import useOrdersController from './orders-controller';
import NewBuyerRevenueShare from './new-buyer-revenue-share';
import AverageOrderValue from './average-order-value';
import Order from './order';
import NewBuyer from './new-buyer';
import RepeatedBuyer from './repeted-buyers';
import PurchaseByCategory from './purchase-by-category';
import PurchaseByDevice from './purchase-by-device';
import FromSessionStartToPurchase from './from-session-start-to-purchase';
import OrderByLocation from './order-by-location';
import { LoadingOutlined } from '@ant-design/icons';

const Orders: React.FC<ICmsDashboard> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
  pastStartDate,
  pastEndDate,
}) => {
  const {
    revenueBuyer,
    revenueBuyerPastData,
    currency,
    averageOrderValue,
    averageOrderValuePastData,
    averageOrder,
    averageOrderPastData,
  } = useOrdersController({
    workspaceId,
    environment,
    startDate,
    endDate,
    pastStartDate,
    pastEndDate,
  });

  return (
    <>
      {environment && environment !== null ? (
        <>
          <Row gutter={32}>
            <Col span={8} className="m-b-32 counter-item">
              <Revenue
                t={t}
                revenueBuyer={revenueBuyer}
                revenueBuyerPastData={revenueBuyerPastData}
                currency={currency}
              />
            </Col>

            <Col span={8} className="m-b-32 counter-item">
              <NewBuyerRevenueShare
                t={t}
                revenueBuyer={revenueBuyer}
                revenueBuyerPastData={revenueBuyerPastData}
              />
            </Col>

            <Col span={8} className="m-b-32 counter-item">
              <AverageOrderValue
                t={t}
                averageOrderValue={averageOrderValue}
                averageOrderValuePastData={averageOrderValuePastData}
                currency={currency}
              />
            </Col>
            <Col span={8} className="m-b-32 counter-item">
              <Order
                t={t}
                averageOrder={averageOrder}
                averageOrderPastData={averageOrderPastData}
              />
            </Col>

            <Col span={8} className="m-b-32 counter-item">
              <NewBuyer
                t={t}
                revenueBuyer={revenueBuyer}
                revenueBuyerPastData={revenueBuyerPastData}
              />
            </Col>

            <Col span={8} className="m-b-32 counter-item">
              <RepeatedBuyer
                t={t}
                revenueBuyer={revenueBuyer}
                revenueBuyerPastData={revenueBuyerPastData}
              />
            </Col>
          </Row>

          <Row gutter={32} className="dashboard-counter-list m-b-32">
            <Col span={16} className="high-chart-block">
              <div className="border-box">
                <PurchaseByCategory
                  t={t}
                  workspaceId={workspaceId}
                  environment={environment}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </Col>

            <Col span={8} className="counter-item">
              <PurchaseByDevice
                t={t}
                workspaceId={workspaceId}
                environment={environment}
                startDate={startDate}
                endDate={endDate}
              />
            </Col>
          </Row>

          <Row gutter={32} className="dashboard-counter-list">
            <Col span={16} className="high-chart-block">
              <div className="border-box">
                <FromSessionStartToPurchase
                  t={t}
                  workspaceId={workspaceId}
                  environment={environment}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </Col>

            <Col span={8} className="counter-item">
              <OrderByLocation
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

export default Orders;
