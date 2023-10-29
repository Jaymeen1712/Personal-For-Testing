import React from 'react';
import { TFunction } from 'react-i18next';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import ArrowLineIcon from '../../../../../images/icons/arrow-line-icon';
import { numberFormatter, percentage } from '../../../../../utills';

interface INewVisitors {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visitorsDashboard: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visitorsDashboardPreviousDurationRecords: any;
}

const NewVisitors: React.FC<INewVisitors> = ({
  t,
  visitorsDashboard,
  visitorsDashboardPreviousDurationRecords,
}) => {
  return (
    <div className="item-inner">
      <h3>{t('common.labels.new_visitors')}</h3>
      {visitorsDashboard.isSuccess &&
      visitorsDashboardPreviousDurationRecords.isSuccess &&
      visitorsDashboard.data &&
      visitorsDashboardPreviousDurationRecords.data ? (
        <div className="ant-row ant-row-space-between">
          <p>
            {visitorsDashboard.data?.newUsers &&
            visitorsDashboard.data?.newUsers !== undefined
              ? numberFormatter(visitorsDashboard.data?.newUsers)
              : numberFormatter(0)}
          </p>
          <span
            className={`ant-tag ${
              visitorsDashboard.data &&
              visitorsDashboardPreviousDurationRecords.data &&
              Math.abs(
                percentage(
                  visitorsDashboard.data?.newUsers,
                  visitorsDashboardPreviousDurationRecords.data?.newUsers
                )
              ) > 0
                ? visitorsDashboard.data?.newUsers >=
                  visitorsDashboardPreviousDurationRecords.data?.newUsers
                  ? 'ant-tag-success'
                  : 'ant-tag-error'
                : 'ant-tag-0'
            } rate`}>
            <i>
              <ArrowLineIcon />
            </i>
            {visitorsDashboard.data &&
            visitorsDashboardPreviousDurationRecords.data
              ? `${Math.abs(
                  percentage(
                    visitorsDashboard.data?.newUsers,
                    visitorsDashboardPreviousDurationRecords.data?.newUsers
                  )
                ).toFixed(2)}%`
              : visitorsDashboardPreviousDurationRecords.data?.newUsers === 0 &&
                visitorsDashboard.data &&
                visitorsDashboard.data?.newUsers > 0
              ? `100.00%`
              : `0.00%`}
          </span>
        </div>
      ) : (
        <>
          {!visitorsDashboard.isFetching &&
          !visitorsDashboardPreviousDurationRecords.isFetching ? (
            <div className="ant-row ant-row-space-between">
              <p>
                {visitorsDashboard.data?.newUsers &&
                visitorsDashboard.data?.newUsers !== undefined
                  ? numberFormatter(visitorsDashboard.data?.newUsers)
                  : numberFormatter(0)}
              </p>
              <span className={`ant-tag ant-tag-0 rate`}>
                <i>
                  <ArrowLineIcon />
                </i>
                {`0.00%`}
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

export default NewVisitors;
