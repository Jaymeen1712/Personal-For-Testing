import React from 'react';
import { TFunction } from 'react-i18next';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import ArrowLineIcon from '../../../../../images/icons/arrow-line-icon';
import { numberFormatter, percentage } from '../../../../../utills';

interface INewBuyer {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revenueBuyer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revenueBuyerPastData: any;
}

const NewBuyer: React.FC<INewBuyer> = ({
  t,
  revenueBuyer,
  revenueBuyerPastData,
}) => {
  return (
    <div className="item-inner">
      <h3>{t('common.labels.new_buyer')}</h3>
      {revenueBuyer.isSuccess &&
      revenueBuyerPastData.isSuccess &&
      revenueBuyer.data &&
      revenueBuyerPastData.data ? (
        <div className="ant-row ant-row-space-between">
          <p>
            {revenueBuyer.data[0]?.newUsers &&
            revenueBuyer.data[0]?.newUsers !== undefined
              ? numberFormatter(revenueBuyer.data[0]?.newUsers)
              : numberFormatter(0)}
          </p>
          <span
            className={`ant-tag ${
              revenueBuyer.data &&
              revenueBuyerPastData.data &&
              Math.abs(
                percentage(
                  revenueBuyer.data[0]?.newUsers,
                  revenueBuyerPastData.data[0]?.newUsers
                )
              ) > 0
                ? revenueBuyer.data[0]?.newUsers >=
                  revenueBuyerPastData.data[0]?.newUsers
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
                    revenueBuyer.data[0]?.newUsers,
                    revenueBuyerPastData.data[0]?.newUsers
                  )
                ).toFixed(2)}%`
              : revenueBuyerPastData.data[0]?.newUsers === 0 &&
                revenueBuyer.data &&
                revenueBuyer.data[0]?.newUsers > 0
              ? `100.00%`
              : `0.00%`}
          </span>
        </div>
      ) : (
        <>
          {!revenueBuyer.isFetching && !revenueBuyerPastData.isFetching ? (
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

export default NewBuyer;
