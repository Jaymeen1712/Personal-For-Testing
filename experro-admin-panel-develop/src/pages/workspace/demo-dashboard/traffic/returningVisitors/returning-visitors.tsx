import ArrowLineIcon from '../../../../../images/icons/arrow-line-icon';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';
import { TFunction } from 'react-i18next';
import { numberFormatter, percentage } from '../../../../../utills';

interface IReturningVisitors {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visitorsDashboard: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visitorsDashboardPreviousDurationRecords: any;
}

const ReturningVisitors: React.FC<IReturningVisitors> = ({
  t,
  visitorsDashboard,
  visitorsDashboardPreviousDurationRecords,
}) => {
  return (
    <div className="item-inner">
      <h3>{t('common.labels.returning_visitors')}</h3>
      {visitorsDashboard.isSuccess &&
      visitorsDashboardPreviousDurationRecords.isSuccess &&
      visitorsDashboard.data &&
      visitorsDashboardPreviousDurationRecords.data ? (
        <div className="ant-row ant-row-space-between">
          <p>
            {visitorsDashboard.data?.returnVisitors &&
            visitorsDashboard.data?.returnVisitors !== undefined
              ? numberFormatter(visitorsDashboard.data?.returnVisitors)
              : numberFormatter(0)}
          </p>
          <span
            className={`ant-tag ${
              visitorsDashboard.data &&
              visitorsDashboardPreviousDurationRecords.data &&
              Math.abs(
                percentage(
                  visitorsDashboard.data?.returnVisitors,
                  visitorsDashboardPreviousDurationRecords.data?.returnVisitors
                )
              ) > 0
                ? visitorsDashboard.data?.returnVisitors >=
                  visitorsDashboardPreviousDurationRecords.data?.returnVisitors
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
                    visitorsDashboard.data?.returnVisitors,
                    visitorsDashboardPreviousDurationRecords.data
                      ?.returnVisitors
                  )
                ).toFixed(2)}%`
              : visitorsDashboardPreviousDurationRecords.data
                  ?.returnVisitors === 0 &&
                visitorsDashboard.data &&
                visitorsDashboard.data?.returnVisitors > 0
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
                {visitorsDashboard.data?.returnVisitors &&
                visitorsDashboard.data?.returnVisitors !== undefined
                  ? numberFormatter(visitorsDashboard.data?.returnVisitors)
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
export default ReturningVisitors;
