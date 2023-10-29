import React from 'react';
import { TFunction } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { Col, Spin, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import ArrowLineIcon from '../../../../../images/icons/arrow-line-icon';
import { numberFormatter, percentage } from '../../../../../utills';
import InfoIconCircleTooltip from '../../../../../images/icons/Info-icon-circle-tootltip';

interface IZeroResultSearches {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  totalZeroResultSearches: UseQueryResult<any, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  totalZeroResultPreviousSearches: UseQueryResult<any, unknown>;
}

const ZeroResultSearches: React.FC<IZeroResultSearches> = ({
  t,
  totalZeroResultSearches,
  totalZeroResultPreviousSearches,
}) => {
  return (
    <Col span={8} className="counter-item">
      <div className="item-inner">
        <div className="ant-row ant-row-middle discovery-title">
          <h3 className="m-r-4">{t('common.labels.zero_result_search')}</h3>
          <Tooltip
            overlayClassName="custom-tooltip custom-medium"
            className=""
            title={t(
              'common.messages.merchandising_dashboard_zero_result_searches'
            )}
            placement="right">
            <span className="anticon">
              <InfoIconCircleTooltip />
            </span>
          </Tooltip>
        </div>
        {totalZeroResultSearches.isSuccess &&
        totalZeroResultPreviousSearches.isSuccess &&
        totalZeroResultSearches.data &&
        totalZeroResultPreviousSearches.data ? (
          <>
            <div className="ant-row ant-row-space-between">
              <p>
                {totalZeroResultSearches.data[0]?.sum &&
                totalZeroResultSearches.data[0]?.sum !== undefined
                  ? numberFormatter(totalZeroResultSearches.data[0]?.sum)
                  : numberFormatter(0)}
              </p>
            </div>
            <div className="matrixChangeDetail">
              <span
                className={`ant-tag ${
                  totalZeroResultSearches.data[0] &&
                  totalZeroResultPreviousSearches.data[0] &&
                  Math.abs(
                    percentage(
                      totalZeroResultSearches.data[0]?.sum,
                      totalZeroResultPreviousSearches.data[0]?.sum
                    )
                  ) > 0
                    ? totalZeroResultSearches.data[0]?.sum >=
                      totalZeroResultPreviousSearches.data[0]?.sum
                      ? 'ant-tag-success'
                      : 'ant-tag-error'
                    : 'ant-tag-0-text'
                } rate`}>
                <i>
                  <ArrowLineIcon />
                </i>
                {totalZeroResultSearches.data &&
                totalZeroResultPreviousSearches.data
                  ? `${Math.abs(
                      percentage(
                        totalZeroResultSearches.data[0]?.sum,
                        totalZeroResultPreviousSearches.data[0]?.sum
                      )
                    ).toFixed(2)}%`
                  : totalZeroResultPreviousSearches.data[0]?.sum === 0 &&
                    totalZeroResultSearches.data &&
                    totalZeroResultSearches.data[0]?.sum > 0
                  ? `100.00%`
                  : `0.00%`}
                {totalZeroResultSearches.data[0] &&
                totalZeroResultPreviousSearches.data[0] &&
                Math.abs(
                  percentage(
                    totalZeroResultSearches.data[0]?.sum,
                    totalZeroResultPreviousSearches.data[0]?.sum
                  )
                ) > 0
                  ? totalZeroResultSearches.data[0]?.sum >=
                    totalZeroResultPreviousSearches.data[0]?.sum
                    ? t('common.labels.higher')
                    : t('common.labels.lower')
                  : ''}
              </span>
              {(Math.abs(
                percentage(
                  totalZeroResultSearches.data[0]?.sum,
                  totalZeroResultPreviousSearches.data[0]?.sum
                )
              ) > 0 ||
                (totalZeroResultSearches.data[0].sum > 0 &&
                  totalZeroResultSearches.data[0].sum > 0 &&
                  Math.abs(
                    percentage(
                      totalZeroResultSearches.data[0]?.sum,
                      totalZeroResultSearches.data[0]?.sum
                    )
                  ) === 0)) && (
                <span className="matrixChangedFromCaption">
                  {t('common.labels.from')}
                </span>
              )}
              <span className="matrixChangedNo">
                {Math.abs(
                  percentage(
                    totalZeroResultSearches.data[0]?.sum,
                    totalZeroResultPreviousSearches.data[0]?.sum
                  )
                ) > 0 ||
                (totalZeroResultSearches.data[0].sum > 0 &&
                  totalZeroResultPreviousSearches.data[0].sum > 0 &&
                  Math.abs(
                    percentage(
                      totalZeroResultSearches.data[0]?.sum,
                      totalZeroResultPreviousSearches.data[0]?.sum
                    )
                  ) === 0)
                  ? totalZeroResultPreviousSearches.data[0].sum
                    ? numberFormatter(
                        totalZeroResultPreviousSearches.data[0].sum
                      )
                    : numberFormatter(0)
                  : ''}
              </span>
            </div>
          </>
        ) : (
          <>
            {!totalZeroResultSearches.isFetching &&
            !totalZeroResultSearches.isFetching ? (
              <>
                <div className="ant-row ant-row-space-between">
                  <p>{numberFormatter(0)}</p>
                </div>
                <div className="matrixChangeDetail">
                  <span className={`ant-tag ant-tag-0-text rate`}>
                    <i>
                      <ArrowLineIcon />
                    </i>
                    {`0.00%`}
                  </span>
                </div>
              </>
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
    </Col>
  );
};

export default ZeroResultSearches;
