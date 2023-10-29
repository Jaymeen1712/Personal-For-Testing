import { TFunction } from 'react-i18next';
import React from 'react';
import { Table } from 'antd';

import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';
import useTopNewCustomersBasedOnRevenueController from './top-new-customers-based-on-revenue-controller';

interface ITopNewCustomersBasedOnRevenue {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const TopNewCustomersBasedOnRevenue: React.FC<
  ITopNewCustomersBasedOnRevenue
> = ({ t, workspaceId, environment, startDate, endDate }) => {
  const {
    topNewCustomersBasedOnRevenueColumns,
    topNewCustomersBasedOnRevenue,
  } = useTopNewCustomersBasedOnRevenueController({
    t,
    workspaceId,
    environment,
    startDate,
    endDate,
  });

  return (
    <div className="border-box">
      <h3 className="dashboard-title">
        {t('common.labels.top_new_customer_based_on_revenue')}
      </h3>
      <div className="table-section">
        {topNewCustomersBasedOnRevenue.isSuccess &&
          topNewCustomersBasedOnRevenue.data && (
            <Table
              columns={topNewCustomersBasedOnRevenueColumns}
              dataSource={topNewCustomersBasedOnRevenue.data}
              pagination={false}
              locale={{
                emptyText: (
                  <NoDataFound
                    icon={<NoRecordIcon />}
                    title={t('common.labels.no_results_found')}
                  />
                ),
              }}
            />
          )}
      </div>
    </div>
  );
};

export default TopNewCustomersBasedOnRevenue;
