import React from 'react';
import { TFunction } from 'react-i18next';
import useAllCustomersSummaryBasedOnRevenueController from './all-customers-summary-based-on-revenue-controller';
import { Table } from 'antd';
import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';

interface IAllCustomersSummaryBasedOnRevenue {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const AllCustomersSummaryBasedOnRevenue: React.FC<
  IAllCustomersSummaryBasedOnRevenue
> = ({ t, workspaceId, environment, startDate, endDate }) => {
  const {
    allCustomersSummaryBasedOnRevenue,
    allCustomersSummaryBasedOnRevenueColumns,
    pagination,
  } = useAllCustomersSummaryBasedOnRevenueController({
    t,
    workspaceId,
    environment,
    startDate,
    endDate,
  });

  return (
    <div className="border-box">
      <h3 className="dashboard-title">
        {t('common.labels.all_customers_summary_based_on_revenue')}
      </h3>
      <div className="table-section">
        {allCustomersSummaryBasedOnRevenue.isSuccess &&
          allCustomersSummaryBasedOnRevenue.data && (
            <Table
              columns={allCustomersSummaryBasedOnRevenueColumns}
              dataSource={allCustomersSummaryBasedOnRevenue.data}
              pagination={pagination}
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

export default AllCustomersSummaryBasedOnRevenue;
