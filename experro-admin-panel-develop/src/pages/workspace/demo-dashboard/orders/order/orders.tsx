import { TFunction } from 'react-i18next';
import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import ArrowLineIcon from '../../../../../images/icons/arrow-line-icon';
import { numberFormatter, percentage } from '../../../../../utills';

interface IOrders {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  averageOrder: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  averageOrderPastData: any;
}

const Order: React.FC<IOrders> = ({
  t,
  averageOrder,
  averageOrderPastData,
}) => {
  return (
    <div className="item-inner">
      <h3>{t('common.labels.orders')}</h3>
      {averageOrder.isSuccess &&
      averageOrderPastData.isSuccess &&
      averageOrder.data &&
      averageOrderPastData.data ? (
        <div className="ant-row ant-row-space-between">
          <p>
            {averageOrder.data[0]?.eventCount &&
            averageOrder.data[0]?.eventCount !== undefined &&
            averageOrder.data[0]?.eventCount !== '-Infinity'
              ? numberFormatter(averageOrder.data[0]?.eventCount)
              : averageOrder.data[0]?.eventCount === '-Infinity'
              ? numberFormatter(0)
              : numberFormatter(0)}
          </p>
          <span
            className={`ant-tag ${
              averageOrder.data &&
              averageOrderPastData.data &&
              Math.abs(
                percentage(
                  averageOrder.data[0]?.eventCount,
                  averageOrderPastData.data[0]?.eventCount
                )
              ) > 0
                ? averageOrder.data[0]?.eventCount >=
                    averageOrderPastData.data[0]?.eventCount ||
                  averageOrder.data[0]?.eventCount === '-Infinity' ||
                  averageOrderPastData.data[0]?.eventCount === '-Infinity'
                  ? 'ant-tag-success'
                  : 'ant-tag-error'
                : 'ant-tag-0'
            } rate`}>
            <i>
              <ArrowLineIcon />
            </i>
            {averageOrder.data &&
            averageOrderPastData.data &&
            (averageOrder.data[0]?.eventCount === '-Infinity' ||
              averageOrderPastData.data[0]?.eventCount === '-Infinity')
              ? `100%`
              : averageOrder.data && averageOrderPastData.data
              ? `${Math.abs(
                  percentage(
                    averageOrder.data[0]?.eventCount,
                    averageOrderPastData.data[0]?.eventCount
                  )
                ).toFixed(2)}%`
              : averageOrderPastData.data &&
                averageOrderPastData.data[0]?.eventCount === 0 &&
                averageOrder.data &&
                averageOrder.data[0]?.eventCount > 0
              ? `100.00%`
              : `0.00%`}
          </span>
        </div>
      ) : (
        <>
          {!averageOrder.isFetching && !averageOrderPastData.isFetching ? (
            <div className="ant-row ant-row-space-between">
              <p>{numberFormatter(0)}</p>
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

export default Order;
