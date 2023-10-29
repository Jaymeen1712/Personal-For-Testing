import React from 'react';

import useListDashboardController from './dashboard-controller';
import { SIDEBAR_KEYS } from '../../../utills';
import CmsDashboard from './cms/cms-dashboard';
import TrafficDashboard from './traffic/traffic-dashboard';
import SubSideBar from '../../../components/sub-sidebar/sub-sidebar';
import HeaderDashboard from './header-dashboard';
import Products from './products';
import Orders from './orders';
import Customers from './customers';

const Dashboard: React.FC<{
  onMainSidebarActiveItem?: (val: string) => void;
}> = ({ onMainSidebarActiveItem }) => {
  const {
    environment,
    onEnvironmentChange,
    t,
    workspaceId,
    onSubSidebarParentMenuItemClick,
    menuItems,
    dashboardType,
    startDate,
    endDate,
    pastStartDate,
    pastEndDate,
    onStartDateEndDateChange,
  } = useListDashboardController({ onMainSidebarActiveItem });

  return (
    <>
      <div className="page-wrapper">
        <SubSideBar
          sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.DASHBOARD}
          subSidebarMenuItems={menuItems}
          subSidebarActiveItemKey={dashboardType}
          onSubSidebarParentMenuItemClick={onSubSidebarParentMenuItemClick}
          isEnvironmentSelectorVisible={true}
          onEnvironmentSelectValueChange={onEnvironmentChange}>
          <HeaderDashboard
            dashboardType={dashboardType}
            t={t}
            startDate={startDate}
            endDate={endDate}
            onStartDateEndDateChange={onStartDateEndDateChange}
          />
          <div
            className={`dashboard-page ${
              dashboardType === 'orders' ? 'order-dashboard' :dashboardType ===  'customers'? 'customers-dashboard':''
              
            }`}>
            {dashboardType === 'cms' ? (
              <>
                <CmsDashboard
                  t={t}
                  workspaceId={workspaceId}
                  environment={environment}
                  startDate={startDate}
                  endDate={endDate}
                />
              </>
            ) : dashboardType === 'traffic' ? (
              <>
                <TrafficDashboard
                  t={t}
                  workspaceId={workspaceId}
                  environment={environment}
                  startDate={startDate}
                  endDate={endDate}
                  pastStartDate={pastStartDate}
                  pastEndDate={pastEndDate}
                />
              </>
            ) : dashboardType === 'orders' ? (
              <Orders
                t={t}
                workspaceId={workspaceId}
                environment={environment}
                startDate={startDate}
                endDate={endDate}
                pastStartDate={pastStartDate}
                pastEndDate={pastEndDate}
              />
            ) : dashboardType === 'products' ? (
              <Products
                t={t}
                workspaceId={workspaceId}
                environment={environment}
                startDate={startDate}
                endDate={endDate}
                pastStartDate={pastStartDate}
                pastEndDate={pastEndDate}
              />
            ) : (
              dashboardType === 'customers' && (
                <Customers
                  t={t}
                  workspaceId={workspaceId}
                  environment={environment}
                  startDate={startDate}
                  endDate={endDate}
                  pastStartDate={pastStartDate}
                  pastEndDate={pastEndDate}
                />
              )
            )}
          </div>
        </SubSideBar>
      </div>
    </>
  );
};

export default Dashboard;
