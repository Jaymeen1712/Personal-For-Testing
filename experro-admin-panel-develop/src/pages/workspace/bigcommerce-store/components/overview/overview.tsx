import { Alert, Progress, Skeleton } from 'antd';
import React from 'react';
import { TFunction } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import {
  IAPIError,
  IBigcommerceStore,
  IBigcommerceStoreStatistics,
} from '../../../../../types';
import { convertAndFormatDate } from '../../../../../utills';

interface OverviewProps {
  storeDetails: UseQueryResult<IBigcommerceStore | undefined, IAPIError>;
  t: TFunction<'translation', undefined>;
  timeZone?: string;
  userName?: string;
  lastSynced?: string;
  storeStatistics: UseQueryResult<
    IBigcommerceStoreStatistics | undefined,
    IAPIError
  >;
}

const Overview: React.FC<OverviewProps> = ({
  t,
  storeDetails,
  timeZone,
  userName,
  lastSynced,
  storeStatistics,
}) => {
  return (
    <div className="bigcommerce-store-section">
      {storeStatistics.isError ? (
        <>
          <Alert message={t('common.messages.sync_wait_message')} type="info" />
          <div className="w-50 m-b-28">
            <div className="media-content-details">
              <Skeleton active />
            </div>
          </div>
          <br />
          <div className="bigcommerce-store-grid">
            <div className="w-50">
              <Skeleton.Input active size="small" />
              <Skeleton.Button
                active
                size="small"
                shape="square"
                block={true}
              />
            </div>
            <div className="w-50">
              <Skeleton.Input active size="small" />
              <Skeleton.Button
                active
                size="small"
                shape="square"
                block={true}
              />
            </div>
            <div className="w-50">
              <Skeleton.Input active size="small" />
              <Skeleton.Button
                active
                size="small"
                shape="square"
                block={true}
              />
            </div>
            <div className="w-50">
              <Skeleton.Input active size="small" />
              <Skeleton.Button
                active
                size="small"
                shape="square"
                block={true}
              />
            </div>
            <div className="w-50">
              <Skeleton.Input active size="small" />
              <Skeleton.Button
                active
                size="small"
                shape="square"
                block={true}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {storeStatistics.isSuccess &&
            storeStatistics.data?.syncStatus?.status === 'Error' && (
              <Alert
                message={t('common.messages.store_sync_error_message')}
                type="error"
              />
            )}
          {storeDetails.isSuccess &&
          storeDetails.data?.status !== 'connected' &&
          storeDetails.data?.message === 'EX-00150' ? (
            <Alert
              message={t('common.messages.store_sync_error_message')}
              type="error"
            />
          ) : (
            <></>
          )}
          <div className="ant-row">
            {storeStatistics.isSuccess && storeDetails.isSuccess && (
              <div className="w-50">
                <h3 className='title-default'>{t('common.labels.details')}</h3>
                <div className="media-content-details">
                  <div className='ant-row m-b-16'>
                    <span>{t('common.labels.added_on')} </span>
                    <p>
                      {convertAndFormatDate(
                        storeDetails.data?.createdAt,
                        timeZone,
                        'DD MMM YYYY, hh:mm A'
                      )}
                    </p>
                  </div>
                  <div className='ant-row m-b-12'>
                    <span>{t('common.labels.added_by')} </span>
                    <p>{userName}</p>
                  </div>
                  <div className='ant-row'>
                    <span>{t('common.labels.last_synced')} </span>
                    <p>
                      {storeStatistics.isSuccess &&
                        storeDetails.isSuccess &&
                        (storeStatistics.data?.syncStatus &&
                        storeStatistics.data.syncStatus.status === 'In Progress'
                          ? t('common.labels.syncing_in_progress')
                          : storeStatistics.data?.syncStatus &&
                            storeStatistics.data.syncStatus.status ===
                              'Initiating'
                          ? t('common.labels.initiating')
                          : `${lastSynced} ${t('common.labels.ago')}`)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {storeDetails.isSuccess &&
              storeStatistics.isSuccess &&
              storeStatistics.data?.syncStatus &&
              storeStatistics.data?.syncStatus.status !== 'Initiating' &&
              storeStatistics.data?.syncStatus?.status !== 'Error' &&
              storeStatistics.data.syncStatus?.syncingItems && (
                <div className="w-50">
                  <p>
                    <b>{t('common.labels.sync_status')}</b>
                  </p>
                  {storeStatistics.data?.syncStatus?.syncingItems.products && (
                    <div className="ant-row sync-status-section">
                      <span className="sync-title">
                        {t('common.labels.products')}
                      </span>
                      <Progress
                        status={
                          Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .products.syncedCount
                          ) ===
                          Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .products.totalCount
                          )
                            ? 'success'
                            : 'active'
                        }
                        showInfo={false}
                        percent={
                          100 *
                          (Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .products.syncedCount
                          ) /
                            Number(
                              storeStatistics.data?.syncStatus?.syncingItems
                                .products.totalCount
                            ))
                        }
                      />
                      <span className="sync-count">
                        {storeStatistics.data?.syncStatus?.syncingItems.products
                          .syncedCount === '0'
                          ? t('common.labels.in_queue')
                          : `${storeStatistics.data?.syncStatus?.syncingItems.products.syncedCount} / ${storeStatistics.data?.syncStatus?.syncingItems.products.totalCount}`}
                      </span>
                    </div>
                  )}
                  {storeStatistics.data?.syncStatus?.syncingItems
                    .categories && (
                    <div className="ant-row sync-status-section">
                      <span className="sync-title">
                        {t('common.labels.categories')}
                      </span>
                      <Progress
                        status={
                          Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .categories.syncedCount
                          ) ===
                          Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .categories.totalCount
                          )
                            ? 'success'
                            : 'active'
                        }
                        showInfo={false}
                        percent={
                          100 *
                          (Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .categories.syncedCount
                          ) /
                            Number(
                              storeStatistics.data?.syncStatus?.syncingItems
                                .categories.totalCount
                            ))
                        }
                      />
                      <span className="sync-count">
                        {storeStatistics.data?.syncStatus?.syncingItems
                          .categories.syncedCount === '0'
                          ? t('common.labels.in_queue')
                          : `${storeStatistics.data?.syncStatus?.syncingItems.categories.syncedCount} / ${storeStatistics.data?.syncStatus?.syncingItems.categories.totalCount}`}
                      </span>
                    </div>
                  )}
                  {storeStatistics.data?.syncStatus?.syncingItems.brands && (
                    <div className="ant-row sync-status-section">
                      <span className="sync-title">
                        {t('common.labels.brands')}
                      </span>
                      <Progress
                        status={
                          Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .brands.syncedCount
                          ) ===
                          Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .brands.totalCount
                          )
                            ? 'success'
                            : 'active'
                        }
                        showInfo={false}
                        percent={
                          100 *
                          (Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .brands.syncedCount
                          ) /
                            Number(
                              storeStatistics.data?.syncStatus?.syncingItems
                                .brands.totalCount
                            ))
                        }
                      />
                      <span className="sync-count">
                        {storeStatistics.data?.syncStatus?.syncingItems.brands
                          .syncedCount === '0'
                          ? t('common.labels.in_queue')
                          : `${storeStatistics.data?.syncStatus?.syncingItems.brands.syncedCount} / ${storeStatistics.data?.syncStatus?.syncingItems.brands.totalCount}`}
                      </span>
                    </div>
                  )}
                  {storeStatistics.data?.syncStatus?.syncingItems.customers && (
                    <div className="ant-row sync-status-section">
                      <span className="sync-title">
                        {t('common.labels.customers')}
                      </span>
                      <Progress
                        status={
                          Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .customers.syncedCount
                          ) ===
                          Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .customers.totalCount
                          )
                            ? 'success'
                            : 'active'
                        }
                        showInfo={false}
                        percent={
                          100 *
                          (Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .customers.syncedCount
                          ) /
                            Number(
                              storeStatistics.data?.syncStatus?.syncingItems
                                .customers.totalCount
                            ))
                        }
                      />
                      <span className="sync-count">
                        {storeStatistics.data?.syncStatus?.syncingItems
                          .customers.syncedCount === '0'
                          ? t('common.labels.in_queue')
                          : `${storeStatistics.data?.syncStatus?.syncingItems.customers.syncedCount} / ${storeStatistics.data?.syncStatus?.syncingItems.customers.totalCount}`}
                      </span>
                    </div>
                  )}
                  {storeStatistics.data?.syncStatus?.syncingItems.orders && (
                    <div className="ant-row sync-status-section">
                      <span className="sync-title">
                        {t('common.labels.orders')}
                      </span>
                      <Progress
                        status={
                          Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .orders.syncedCount
                          ) ===
                          Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .orders.totalCount
                          )
                            ? 'success'
                            : 'active'
                        }
                        showInfo={false}
                        percent={
                          100 *
                          (Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .orders.syncedCount
                          ) /
                            Number(
                              storeStatistics.data?.syncStatus?.syncingItems
                                .orders.totalCount
                            ))
                        }
                      />
                      <span className="sync-count">
                        {storeStatistics.data?.syncStatus?.syncingItems.orders
                          .syncedCount === '0'
                          ? t('common.labels.in_queue')
                          : `${storeStatistics.data?.syncStatus?.syncingItems.orders.syncedCount} / ${storeStatistics.data?.syncStatus?.syncingItems.orders.totalCount}`}
                      </span>
                    </div>
                  )}
                  {storeStatistics.data?.syncStatus?.syncingItems
                    .currencies && (
                    <div className="ant-row sync-status-section">
                      <span className="sync-title">
                        {t('common.labels.currencies')}
                      </span>
                      <Progress
                        status={
                          Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .currencies.syncedCount
                          ) ===
                          Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .currencies.totalCount
                          )
                            ? 'success'
                            : 'active'
                        }
                        showInfo={false}
                        percent={
                          100 *
                          (Number(
                            storeStatistics.data?.syncStatus?.syncingItems
                              .currencies.syncedCount
                          ) /
                            Number(
                              storeStatistics.data?.syncStatus?.syncingItems
                                .currencies.totalCount
                            ))
                        }
                      />

                      <span className="sync-count">
                        {storeStatistics.data?.syncStatus?.syncingItems
                          .currencies.syncedCount === '0'
                          ? t('common.labels.in_queue')
                          : `${storeStatistics.data?.syncStatus?.syncingItems.currencies.syncedCount} / ${storeStatistics.data?.syncStatus?.syncingItems.currencies.totalCount}`}
                      </span>
                    </div>
                  )}
                </div>
              )}
          </div>
          {storeStatistics.isSuccess && (
            <div>
              <h6 className='title-sm m-b-24'>{t('common.labels.overview')}</h6>
              <div className="bigcommerce-store-grid">
                <div>
                  <span>{t('common.labels.products')} </span>
                  <p>{storeStatistics.data?.itemsCount.product}</p>
                </div>
                <div>
                  <span>{t('common.labels.categories')} </span>
                  <p>{storeStatistics.data?.itemsCount.category}</p>
                </div>
                <div>
                  <span>{t('common.labels.brands')} </span>
                  <p>{storeStatistics.data?.itemsCount.brand}</p>
                </div>
                <div>
                  <span>{t('common.labels.customers')} </span>
                  <p>{storeStatistics.data?.itemsCount.customer}</p>
                </div>
                <div>
                  <span>{t('common.labels.orders')} </span>
                  <p>{storeStatistics.data?.itemsCount.order}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Overview;
