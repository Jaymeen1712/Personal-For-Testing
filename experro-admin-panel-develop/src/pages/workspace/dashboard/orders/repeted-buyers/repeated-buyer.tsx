import { TFunction } from 'react-i18next';
import React from 'react';
import ArrowLineIcon from '../../../../../images/icons/arrow-line-icon';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { numberFormatter } from '../../../../../utills';

interface IRepeatedBuyer {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revenueBuyer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revenueBuyerPastData: any;
}

const RepeatedBuyer: React.FC<IRepeatedBuyer> = ({
  t,
  revenueBuyer,
  revenueBuyerPastData,
}) => {
  return (
    <div className="item-inner">
      <h3>{t('common.labels.repeated_buyer')}</h3>
      {revenueBuyer.isSuccess &&
      revenueBuyerPastData.isSuccess &&
      revenueBuyer.data &&
      revenueBuyerPastData.data ? (
        <div className="ant-row ant-row-space-between">
          <p>
            {revenueBuyer.data[0]?.totalUsers &&
            revenueBuyer.data[0]?.totalUsers !== undefined &&
            revenueBuyer.data[0]?.newUsers &&
            revenueBuyer.data[0]?.newUsers !== undefined
              ? numberFormatter(
                  revenueBuyer.data[0]?.totalUsers -
                    revenueBuyer.data[0]?.newUsers
                )
              : numberFormatter(0)}
          </p>
          <span
            className={`ant-tag ${
              revenueBuyer.data &&
              revenueBuyerPastData.data &&
              (revenueBuyer.data[0]?.totalUsers -
                revenueBuyer.data[0]?.newUsers >=
              revenueBuyerPastData.data[0]?.totalUsers -
                revenueBuyerPastData.data[0]?.newUsers
                ? 'ant-tag-success'
                : 'ant-tag-error')
            } rate`}>
            <i>
              <ArrowLineIcon />
            </i>
            {revenueBuyer.data &&
            revenueBuyerPastData.data &&
            revenueBuyer.data[0]?.totalUsers - revenueBuyer.data[0]?.newUsers >
              0 &&
            revenueBuyerPastData.data[0]?.totalUsers -
              revenueBuyerPastData.data[0]?.newUsers >
              0
              ? revenueBuyer.data[0]?.totalUsers -
                  revenueBuyer.data[0]?.newUsers >=
                revenueBuyerPastData.data[0]?.totalUsers -
                  revenueBuyerPastData.data[0]?.newUsers
                ? `${(
                    (revenueBuyer.data[0]?.totalUsers -
                      revenueBuyer.data[0]?.newUsers /
                        revenueBuyerPastData.data[0]?.totalUsers -
                      revenueBuyerPastData.data[0]?.newUsers) *
                    100
                  ).toFixed(2)}%`
                : revenueBuyer.data &&
                  revenueBuyerPastData.data &&
                  `${(
                    (revenueBuyerPastData.data[0]?.totalUsers -
                      revenueBuyerPastData.data[0]?.newUsers /
                        revenueBuyer.data[0]?.totalUsers -
                      revenueBuyer.data[0]?.newUsers) *
                    100
                  ).toFixed(2)}%`
              : revenueBuyerPastData.data[0]?.totalUsers -
                  revenueBuyerPastData.data[0]?.newUsers ===
                  0 &&
                revenueBuyer.data &&
                revenueBuyer.data[0]?.totalUsers -
                  revenueBuyer.data[0]?.newUsers >
                  0
              ? `100%`
              : `0.00%`}
          </span>
        </div>
      ) : (
        <>
          {!revenueBuyer.isFetching && !revenueBuyerPastData.isFetching ? (
            <div className="ant-row ant-row-space-between">
              <p>{numberFormatter(0)}</p>
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

export default RepeatedBuyer;
