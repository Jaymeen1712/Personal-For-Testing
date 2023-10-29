import React from 'react';
import { TFunction } from 'react-i18next';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import ArrowLineIcon from '../../../../../images/icons/arrow-line-icon';
import { numberFormatter, percentage } from '../../../../../utills';

interface ICustomer {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customers: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customersPastData: any;
}

const Customer: React.FC<ICustomer> = ({ t, customers, customersPastData }) => {
  return (
    <div className="item-inner">
      <h3>{t('common.labels.customers')}</h3>
      {customers.isSuccess &&
      customersPastData.isSuccess &&
      customers.data &&
      customersPastData.data ? (
        <div className="ant-row ant-row-space-between">
          <p>
            {customers.data[0]?.totalUsers &&
            customers.data[0]?.totalUsers !== undefined
              ? numberFormatter(customers.data[0]?.totalUsers)
              : numberFormatter(0)}
          </p>
          <span
            className={`ant-tag ${
              customers.data &&
              customersPastData.data &&
              Math.abs(
                percentage(
                  customers.data[0]?.totalUsers,
                  customersPastData.data[0]?.totalUsers
                )
              ) > 0
                ? customers.data[0]?.totalUsers >=
                  customersPastData.data[0]?.totalUsers
                  ? 'ant-tag-success'
                  : 'ant-tag-error'
                : 'ant-tag-0'
            } rate`}>
            <i>
              <ArrowLineIcon />
            </i>
            {customers.data && customersPastData.data
              ? `${Math.abs(
                  percentage(
                    customers.data[0]?.totalUsers,
                    customersPastData.data[0]?.totalUsers
                  )
                ).toFixed(2)}%`
              : customersPastData.data[0]?.totalUsers === 0 &&
                customers.data &&
                customers.data[0]?.totalUsers > 0
              ? `100.00%`
              : `0.00%`}
          </span>
        </div>
      ) : (
        <>
          {!customers.isFetching && !customersPastData.isFetching ? (
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

export default Customer;
