import React from 'react';
import { TFunction } from 'react-i18next';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import ArrowLineIcon from '../../../../../images/icons/arrow-line-icon';

interface INewBuyerRevenueShare {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revenueBuyer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revenueBuyerPastData: any;
}

const NewBuyerRevenueShare: React.FC<INewBuyerRevenueShare> = ({
  t,
  revenueBuyer,
  revenueBuyerPastData,
}) => {
  return (
    <div className="item-inner">
      <h3>{t('common.labels.new_buyer_revenue_share')}</h3>
      {revenueBuyer.isSuccess &&
      revenueBuyerPastData.isSuccess &&
      revenueBuyer.data &&
      revenueBuyerPastData.data ? (
        <div className="ant-row ant-row-space-between">
          <p>
            {revenueBuyer.data[0]?.newUserEventsum &&
            revenueBuyer.data[0]?.newUserEventsum !== undefined &&
            revenueBuyer.data[0]?.eventSum &&
            revenueBuyer.data[0]?.eventSum !== undefined
              ? // @ts-ignore
                `${(
                  (revenueBuyer.data[0]?.newUserEventsum /
                    revenueBuyer.data[0]?.eventSum) *
                  100
                ).toFixed(2)}%`
              : // @ts-ignore
                '0.00%'}
          </p>
          <span
            className={`ant-tag ${
              revenueBuyer.data &&
              revenueBuyerPastData.data &&
              ((revenueBuyer.data[0]?.newUserEventsum /
                revenueBuyer.data[0]?.eventSum) *
                100 >=
                (revenueBuyerPastData.data[0]?.newUserEventsum /
                  revenueBuyerPastData.data[0]?.eventSum) *
                  100 ||
              isNaN(
                (revenueBuyerPastData.data[0]?.newUserEventsum /
                  revenueBuyerPastData.data[0]?.eventSum) *
                  100
              )
                ? 'ant-tag-success'
                : 'ant-tag-error')
            } rate`}>
            <i>
              <ArrowLineIcon />
            </i>
            {revenueBuyer.data &&
            revenueBuyerPastData.data &&
            (revenueBuyer.data[0]?.newUserEventsum /
              revenueBuyer.data[0]?.eventSum) *
              100 >
              0 &&
            (revenueBuyerPastData.data[0]?.newUserEventsum /
              revenueBuyerPastData.data[0]?.eventSum) *
              100 >
              0
              ? (revenueBuyer.data[0]?.newUserEventsum /
                  revenueBuyer.data[0]?.eventSum) *
                  100 >=
                (revenueBuyerPastData.data[0]?.newUserEventsum /
                  revenueBuyerPastData.data[0]?.eventSum) *
                  100
                ? `${(
                    (((revenueBuyer.data[0]?.newUserEventsum /
                      revenueBuyer.data[0]?.eventSum) *
                      100) /
                      ((revenueBuyerPastData.data[0]?.newUserEventsum /
                        revenueBuyerPastData.data[0]?.eventSum) *
                        100)) *
                    100
                  ).toFixed(2)}%`
                : revenueBuyer.data &&
                  revenueBuyerPastData.data &&
                  `${(
                    (((revenueBuyerPastData.data[0]?.newUserEventsum /
                      revenueBuyerPastData.data[0]?.eventSum) *
                      100) /
                      ((revenueBuyer.data[0]?.newUserEventsum /
                        revenueBuyer.data[0]?.eventSum) *
                        100)) *
                    100
                  ).toFixed(2)}%`
              : (revenueBuyerPastData.data[0]?.newUserEventsum /
                  revenueBuyerPastData.data[0]?.eventSum) *
                  100 ===
                  0 &&
                isNaN(
                  (revenueBuyerPastData.data[0]?.newUserEventsum /
                    revenueBuyerPastData.data[0]?.eventSum) *
                    100
                ) &&
                revenueBuyer.data &&
                (revenueBuyer.data[0]?.newUserEventsum /
                  revenueBuyer.data[0]?.eventSum) *
                  100 >
                  0
              ? `100%`
              : `0.00%`}
          </span>
        </div>
      ) : (
        <>
          {!revenueBuyer.isFetching && !revenueBuyerPastData.isFetching ? (
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

export default NewBuyerRevenueShare;
