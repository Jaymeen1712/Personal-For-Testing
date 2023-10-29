import React from 'react';
import { TFunction } from 'react-i18next';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import ArrowLineIcon from '../../../../../images/icons/arrow-line-icon';
import { numberFormatter } from '../../../../../utills';

interface IVisitors {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visitorsDashboard: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visitorsDashboardPreviousDurationRecords: any;
}

const Visitors: React.FC<IVisitors> = ({
  t,
  visitorsDashboard,
  visitorsDashboardPreviousDurationRecords,
}) => {
  return (
    <div className="item-inner">
      <h3>{t('common.labels.visitors')}</h3>
      {visitorsDashboard.isSuccess &&
      visitorsDashboardPreviousDurationRecords.isSuccess &&
      visitorsDashboard.data &&
      visitorsDashboardPreviousDurationRecords.data ? (
        <div className="ant-row ant-row-space-between">
          <p>
            {visitorsDashboard.data?.totalUsers &&
            visitorsDashboard.data?.totalUsers !== undefined
              ? numberFormatter(visitorsDashboard.data?.totalUsers)
              : numberFormatter(0)}
          </p>
          <span
            className={`ant-tag ${
              visitorsDashboard.data &&
              visitorsDashboardPreviousDurationRecords.data &&
              (visitorsDashboard.data?.totalUsers >=
              visitorsDashboardPreviousDurationRecords.data?.totalUsers
                ? 'ant-tag-success'
                : 'ant-tag-error')
            } rate`}>
            <i>
              <ArrowLineIcon />
            </i>
            {visitorsDashboard.data &&
            visitorsDashboardPreviousDurationRecords.data &&
            visitorsDashboard.data?.totalUsers > 0 &&
            visitorsDashboardPreviousDurationRecords.data?.totalUsers > 0
              ? visitorsDashboard.data?.totalUsers >=
                visitorsDashboardPreviousDurationRecords.data?.totalUsers
                ? `${(
                    (visitorsDashboard.data?.totalUsers /
                      visitorsDashboardPreviousDurationRecords.data
                        ?.totalUsers) *
                    100
                  ).toFixed(2)}%`
                : visitorsDashboard.data &&
                  visitorsDashboardPreviousDurationRecords.data &&
                  `${(
                    (visitorsDashboardPreviousDurationRecords.data?.totalUsers /
                      visitorsDashboard.data?.totalUsers) *
                    100
                  ).toFixed(2)}%`
              : visitorsDashboardPreviousDurationRecords.data?.totalUsers ===
                  0 &&
                visitorsDashboard.data &&
                visitorsDashboard.data?.totalUsers > 0
              ? `100.00%`
              : `0.00%`}
          </span>
        </div>
      ) : (
        <>
          {!visitorsDashboard.isFetching &&
          !visitorsDashboardPreviousDurationRecords.isFetching ? (
            <div className="ant-row ant-row-space-between">
              <p>{numberFormatter(0)}</p>
              <span className={`ant-tag ant-tag-success rate`}>
                <i>
                  <ArrowLineIcon />
                </i>
                <span>{`0.00%`}</span>
              </span>
            </div>
          ) : (
            <Spin
              className="HV-center table-center"
              indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
              size="large"
            />
          )}
        </>
      )}
    </div>
  );
};

export default Visitors;
