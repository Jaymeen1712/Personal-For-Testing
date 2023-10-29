import React from 'react';
import { TFunction } from 'react-i18next';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { currencyFormatter } from '../../../../../utills';
import ArrowLineIcon from '../../../../../images/icons/arrow-line-icon';

interface IAverageOrderValue {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  averageOrderValue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  averageOrderValuePastData: any;
  currency?: string;
}

const AverageOrderValue: React.FC<IAverageOrderValue> = ({
  t,
  averageOrderValue,
  averageOrderValuePastData,
  currency,
}) => {
  return (
    <div className="item-inner">
      <h3>{t('common.labels.average_order_value')}</h3>
      {averageOrderValue.isSuccess &&
      averageOrderValuePastData.isSuccess &&
      averageOrderValue.data &&
      averageOrderValuePastData.data ? (
        <div className="ant-row ant-row-space-between">
          <p>
            {averageOrderValue.data[0]?.eventSum &&
            averageOrderValue.data[0]?.eventSum !== undefined &&
            averageOrderValue.data[0]?.eventSum !== '-Infinity'
              ? currency &&
                currencyFormatter(currency, averageOrderValue.data[0]?.eventSum)
              : averageOrderValue.data[0]?.eventSum === '-Infinity'
              ? currency && currencyFormatter(currency, 0)
              : currency && currencyFormatter(currency, 0)}
          </p>
          <span
            className={`ant-tag ${
              averageOrderValue.data &&
              averageOrderValuePastData.data &&
              (averageOrderValue.data[0]?.eventSum >=
                averageOrderValuePastData.data[0]?.eventSum ||
              averageOrderValue.data[0]?.eventSum === '-Infinity' ||
              averageOrderValuePastData.data[0]?.eventSum === '-Infinity'
                ? 'ant-tag-success'
                : 'ant-tag-error')
            } rate`}>
            <i>
              <ArrowLineIcon />
            </i>
            {averageOrderValue.data &&
            averageOrderValuePastData.data &&
            (averageOrderValue.data[0]?.eventSum === '-Infinity' ||
              averageOrderValuePastData.data[0]?.eventSum === '-Infinity')
              ? `100%`
              : averageOrderValue.data[0]?.eventSum > 0 &&
                averageOrderValuePastData.data[0]?.eventSum > 0
              ? averageOrderValue.data[0]?.eventSum >=
                averageOrderValuePastData.data[0]?.eventSum
                ? `${(
                    (averageOrderValue.data[0]?.eventSum /
                      averageOrderValuePastData.data[0]?.eventSum) *
                    100
                  ).toFixed(2)}%`
                : averageOrderValue.data &&
                  averageOrderValuePastData.data &&
                  `${(
                    (averageOrderValuePastData.data[0]?.eventSum /
                      averageOrderValue.data[0]?.eventSum) *
                    100
                  ).toFixed(2)}%`
              : averageOrderValuePastData.data[0]?.eventSum === 0 &&
                averageOrderValue.data &&
                averageOrderValue.data[0]?.eventSum > 0
              ? `100%`
              : `0.00%`}
          </span>
        </div>
      ) : (
        <>
          {!averageOrderValue.isFetching &&
          !averageOrderValuePastData.isFetching ? (
            <div className="ant-row ant-row-space-between">
              <p>{0}</p>
              <span className={`ant-tag ant-tag-success rate`}>
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

export default AverageOrderValue;
