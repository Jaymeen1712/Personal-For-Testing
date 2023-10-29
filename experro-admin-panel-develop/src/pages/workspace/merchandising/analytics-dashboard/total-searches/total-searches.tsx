import React from 'react';
import { TFunction } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { Col, Spin, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import ArrowLineIcon from '../../../../../images/icons/arrow-line-icon';
import { numberFormatter, percentage } from '../../../../../utills';
import InfoIconCircleTooltip from '../../../../../images/icons/Info-icon-circle-tootltip';

interface ITotalSearches {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  totalSearch: UseQueryResult<any, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  totalPreviousSearch: UseQueryResult<any, unknown>;
}

const TotalSearches: React.FC<ITotalSearches> = ({
  t,
  totalSearch,
  totalPreviousSearch,
}) => {
  return (
    <Col span={8} className="col counter-item">
      <div className="item-inner">
        <div className="ant-row ant-row-middle discovery-title">
          <h3 className="m-r-4">{t('common.labels.total_searches')}</h3>
          <Tooltip
            overlayClassName="custom-tooltip custom-medium"
            className=""
            title={t('common.messages.merchandising_dashboard_total_searches')}
            placement="right">
            <span className="anticon">
              <InfoIconCircleTooltip />
            </span>
          </Tooltip>
        </div>
        {totalSearch.isSuccess &&
        totalPreviousSearch.isSuccess &&
        totalSearch.data &&
        totalPreviousSearch.data ? (
          <>
            <div className="ant-row ant-row-space-between">
              <p>
                {totalSearch.data[0]?.sum &&
                totalSearch.data[0]?.sum !== undefined
                  ? numberFormatter(totalSearch.data[0]?.sum)
                  : numberFormatter(0)}
              </p>
            </div>
            <div className="matrixChangeDetail">
              <span
                className={`ant-tag ${
                  totalSearch.data[0] &&
                  totalPreviousSearch.data[0] &&
                  Math.abs(
                    percentage(
                      totalSearch.data[0]?.sum,
                      totalPreviousSearch.data[0]?.sum
                    )
                  ) > 0
                    ? totalSearch.data[0]?.sum >=
                      totalPreviousSearch.data[0]?.sum
                      ? 'ant-tag-success'
                      : 'ant-tag-error'
                    : 'ant-tag-0-text'
                } rate`}>
                <i>
                  <ArrowLineIcon />
                </i>
                {totalSearch.data && totalPreviousSearch.data
                  ? `${Math.abs(
                      percentage(
                        totalSearch.data[0]?.sum,
                        totalPreviousSearch.data[0]?.sum
                      )
                    ).toFixed(2)}%`
                  : totalPreviousSearch.data[0]?.sum === 0 &&
                    totalSearch.data &&
                    totalSearch.data[0]?.sum > 0
                  ? `100.00%`
                  : `0.00%`}
                {totalSearch.data[0] &&
                totalPreviousSearch.data[0] &&
                Math.abs(
                  percentage(
                    totalSearch.data[0]?.sum,
                    totalPreviousSearch.data[0]?.sum
                  )
                ) > 0
                  ? totalSearch.data[0]?.sum >= totalPreviousSearch.data[0]?.sum
                    ? t('common.labels.higher')
                    : t('common.labels.lower')
                  : ''}
              </span>
              {(Math.abs(
                percentage(
                  totalSearch.data[0]?.sum,
                  totalPreviousSearch.data[0]?.sum
                )
              ) > 0 ||
                (totalSearch.data[0].sum > 0 &&
                  totalPreviousSearch.data[0].sum > 0 &&
                  Math.abs(
                    percentage(
                      totalSearch.data[0]?.sum,
                      totalPreviousSearch.data[0]?.sum
                    )
                  ) === 0)) && (
                <span className="matrixChangedFromCaption">
                  {t('common.labels.from')}
                </span>
              )}

              <span className="matrixChangedNo">
                {Math.abs(
                  percentage(
                    totalSearch.data[0]?.sum,
                    totalPreviousSearch.data[0]?.sum
                  )
                ) > 0 ||
                (totalSearch.data[0].sum > 0 &&
                  totalPreviousSearch.data[0].sum > 0 &&
                  Math.abs(
                    percentage(
                      totalSearch.data[0]?.sum,
                      totalPreviousSearch.data[0]?.sum
                    )
                  ) === 0)
                  ? totalPreviousSearch.data[0].sum
                    ? numberFormatter(totalPreviousSearch.data[0].sum)
                    : numberFormatter(0)
                  : ''}
              </span>
            </div>
          </>
        ) : (
          <>
            {!totalSearch.isFetching && !totalPreviousSearch.isFetching ? (
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

export default TotalSearches;
