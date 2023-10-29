import { TFunction } from 'react-i18next';
import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useUnitSoldController from './unit-sold-controller';
import ArrowLineIcon from '../../../../../images/icons/arrow-line-icon';
import { numberFormatter, percentage } from '../../../../../utills';

interface IUnitSold {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
  pastStartDate?: string;
  pastEndDate?: string;
}

const UnitSold: React.FC<IUnitSold> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
  pastStartDate,
  pastEndDate,
}) => {
  const { unitSold, unitSoldPastData } = useUnitSoldController({
    workspaceId,
    environment,
    startDate,
    endDate,
    pastStartDate,
    pastEndDate,
  });

  return (
    <div className="item-inner">
      <h3>{t('common.labels.unit_sold')}</h3>
      {unitSold.isSuccess &&
      unitSoldPastData.isSuccess &&
      unitSold.data &&
      unitSoldPastData.data ? (
        <div className="ant-row ant-row-space-between">
          <p>
            {unitSold.data[0]?.quantity &&
            unitSold.data[0]?.quantity !== undefined
              ? numberFormatter(unitSold.data[0]?.quantity)
              : numberFormatter(0)}
          </p>
          <span
            className={`ant-tag ${
              unitSold.data &&
              unitSoldPastData.data &&
              Math.abs(
                percentage(
                  unitSold.data[0]?.quantity,
                  unitSoldPastData.data[0]?.quantity
                )
              ) > 0
                ? unitSold.data[0]?.quantity >=
                  unitSoldPastData.data[0]?.quantity
                  ? 'ant-tag-success'
                  : 'ant-tag-error'
                : 'ant-tag-0'
            } rate`}>
            <i>
              <ArrowLineIcon />
            </i>
            {unitSold.data && unitSoldPastData.data
              ? `${Math.abs(
                  percentage(
                    unitSold.data[0]?.quantity,
                    unitSoldPastData.data[0]?.quantity
                  )
                ).toFixed(2)}%`
              : unitSoldPastData.data &&
                unitSoldPastData.data[0]?.quantity === 0 &&
                unitSold.data &&
                unitSold.data[0]?.quantity > 0
              ? `100.00%`
              : `0.00%`}
          </span>
        </div>
      ) : (
        <>
          {!unitSold.isFetching && !unitSoldPastData.isFetching ? (
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

export default UnitSold;
