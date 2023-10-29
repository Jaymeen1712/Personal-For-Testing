import React from 'react';
import { TFunction } from 'react-i18next';
import { Spin, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';
import useTopLandingPagesController from './top-landing-pages-controller';

interface ITopLandingPages {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
  pastStartDate?: string;
  pastEndDate?: string;
}

const TopLandingPages: React.FC<ITopLandingPages> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
  pastStartDate,
  pastEndDate,
}) => {
  const {
    topLandingPages,
    topLandingPagesPreviousDates,
    columns,
    topLandingPagesData,
  } = useTopLandingPagesController({
    t,
    workspaceId,
    environment,
    startDate,
    endDate,
    pastStartDate,
    pastEndDate,
  });
  return (
    <div className="border-box">
      <h3 className="dashboard-title">
        {t('common.labels.top_landing_pages')}
      </h3>
      {topLandingPages.data &&
      topLandingPages.isSuccess &&
      topLandingPagesPreviousDates.data &&
      topLandingPagesPreviousDates.isSuccess ? (
        <div className="table-section">
          <Table
            columns={columns}
            dataSource={topLandingPagesData}
            locale={{
              emptyText: (
                <NoDataFound
                  icon={<NoRecordIcon />}
                  title={t('common.labels.no_record_found')}
                />
              ),
            }}
            pagination={false}
          />
        </div>
      ) : (
        (topLandingPages.isLoading ||
          topLandingPages.isFetching ||
          topLandingPagesPreviousDates.isLoading ||
          topLandingPagesPreviousDates.isFetching) && (
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        )
      )}
    </div>
  );
};

export default TopLandingPages;
