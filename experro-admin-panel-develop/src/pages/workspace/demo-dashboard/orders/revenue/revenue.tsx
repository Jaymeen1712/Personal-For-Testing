import React from 'react';
import { TFunction } from 'react-i18next';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import ArrowLineIcon from '../../../../../images/icons/arrow-line-icon';
import { currencyFormatter, percentage } from '../../../../../utills';

interface IRevenue {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revenueBuyer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revenueBuyerPastData: any;
  currency?: string;
}

const Revenue: React.FC<IRevenue> = ({
  t,
  revenueBuyer,
  revenueBuyerPastData,
  currency,
}) => {
  return (
    <div className="item-inner">
      <h3>{t('common.labels.revenue')}</h3>
      {revenueBuyer.isSuccess &&
      revenueBuyerPastData.isSuccess &&
      revenueBuyer.data &&
      revenueBuyerPastData.data ? (
        <div className="ant-row ant-row-space-between">
          <p>
            {revenueBuyer.data[0]?.eventSum &&
            revenueBuyer.data[0]?.eventSum !== undefined
              ? currency &&
                currencyFormatter(currency, revenueBuyer.data[0]?.eventSum)
              : currency && currencyFormatter(currency, 0)}
          </p>
          <span
            className={`ant-tag ${
              revenueBuyer.data &&
              revenueBuyerPastData.data &&
              Math.abs(
                percentage(
                  revenueBuyer.data[0]?.eventSum,
                  revenueBuyerPastData.data[0]?.eventSum
                )
              ) > 0
                ? revenueBuyer.data[0]?.eventSum >=
                  revenueBuyerPastData.data[0]?.eventSum
                  ? 'ant-tag-success'
                  : 'ant-tag-error'
                : 'ant-tag-0'
            } rate`}>
            <i>
              <ArrowLineIcon />
            </i>
            {revenueBuyer.data && revenueBuyerPastData.data
              ? `${Math.abs(
                  percentage(
                    revenueBuyer.data[0]?.eventSum,
                    revenueBuyerPastData.data[0]?.eventSum
                  )
                ).toFixed(2)}%`
              : revenueBuyerPastData.data[0]?.eventSum === 0 &&
                revenueBuyer.data &&
                revenueBuyer.data[0]?.eventSum > 0
              ? `100.00%`
              : `0.00%`}
          </span>
        </div>
      ) : (
        <>
          {!revenueBuyer.isFetching && !revenueBuyerPastData.isFetching ? (
            <div className="ant-row ant-row-space-between">
              <p>{0}</p>
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

export default Revenue;
