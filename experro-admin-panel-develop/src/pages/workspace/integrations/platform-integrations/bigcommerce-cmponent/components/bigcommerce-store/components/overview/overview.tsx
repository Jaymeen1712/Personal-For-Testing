import { Alert, Button, Progress, Skeleton, Space, Spin, Tag } from 'antd';
import React from 'react';
import { TFunction } from 'react-i18next';
import { UseMutationResult, UseQueryResult } from 'react-query';
import {
  DeleteStoreParameter,
  IAPIError,
  IBigcommerceStore,
  IBigcommerceStoreStatistics,
} from '../../../../../../../../../types';
import { convertAndFormatDate } from '../../../../../../../../../utills';
import ProductsIcon from '../../../../../../../../../images/icons/products-icon';
import CategoriesIcon from '../../../../../../../../../images/icons/categories-icon';
import BrandsIcon from '../../../../../../../../../images/icons/brands-icon';
import CustomersIcon from '../../../../../../../../../images/icons/customers-icon';
import OrdersIcon from '../../../../../../../../../images/icons/orders-icon';
import useOverviewController from './overview-controller';
import { LoadingOutlined } from '@ant-design/icons';

interface OverviewProps {
  storeDetails: UseQueryResult<IBigcommerceStore | undefined, IAPIError>;
  t: TFunction<'translation', undefined>;
  timeZone?: string;
  isSyncFailed: boolean;
  userName?: string;
  lastSynced?: string;
  storeStatistics: UseQueryResult<
    IBigcommerceStoreStatistics | undefined,
    IAPIError
  >;
  isSyncButtonDisabled: boolean;
  showDeleteModal: () => void;
  showSyncModal: () => void;
  onReSyncStore: () => void;
  deleteBigcommerceStore: UseMutationResult<
    void,
    IAPIError,
    DeleteStoreParameter,
    string
  >;
  canUpdateBigcommerceStore: () => boolean;
  canDeleteBigcommerceStore: () => boolean;
}

const Overview: React.FC<OverviewProps> = ({
  t,
  isSyncFailed,
  storeDetails,
  timeZone,
  userName,
  lastSynced,
  storeStatistics,
  isSyncButtonDisabled,
  showDeleteModal,
  showSyncModal,
  deleteBigcommerceStore,
  canUpdateBigcommerceStore,
  canDeleteBigcommerceStore,
  onReSyncStore,
}) => {
  const { storeEnvironments, channelStatus } = useOverviewController({
    storeDetails,
  });
  return (
    <div className="bigcommerce-store-section">
      {storeStatistics.isSuccess || storeStatistics.isError ? (
        <>
          {channelStatus === false && (
            <Alert
              className="display-block"
              message={t('common.messages.channel_not_created')}
              description={t('common.messages.channel_not_created_message')}
              type="warning"
              action={
                <Space direction="horizontal" className='m-0 m-t-16'>
                  <Button
                    type="primary"
                    id={t('common.labels.retry')}
                    onClick={onReSyncStore}>
                    {t('common.labels.retry')}
                  </Button>
                  <Button id={t('common.labels.support')}>
                    {t('common.labels.support')}
                  </Button>
                </Space>
              }
            />
          )}
          {isSyncFailed && (
            <Alert message={t('common.messages.sync_failed')} type="error" />
          )}
          {storeStatistics.isError ? (
            <>
              <Alert
                message={t('common.messages.sync_wait_message')}
                type="info"
              />

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
              <div className="w-50 m-b-32 m-t-32">
                <div className="media-content-details">
                  <Skeleton active />
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
              {storeStatistics.isSuccess && (
                <>
                  <div className="m-b-40">
                    {/* <h3 className='title-default m-b-24'>{t('common.labels.overview')}</h3> */}
                    <div className="bigcommerce-store-grid">
                      <div>
                        <div>
                          <span>{t('common.labels.products')}</span>
                          <p className="font-medium">{storeStatistics.data?.itemsCount.product}</p>
                        </div>
                        <ProductsIcon />
                      </div>
                      <div>
                        <div>
                          <span>{t('common.labels.categories')}</span>
                          <p>{storeStatistics.data?.itemsCount.category}</p>
                        </div>
                        <CategoriesIcon />
                      </div>
                      <div>
                        <div>
                          <span>{t('common.labels.brands')}</span>
                          <p>{storeStatistics.data?.itemsCount.brand}</p>
                        </div>
                        <BrandsIcon />
                      </div>
                      <div>
                        <div>
                          <span>{t('common.labels.customers')}</span>
                          <p>{storeStatistics.data?.itemsCount.customer}</p>
                        </div>
                        <CustomersIcon />
                      </div>
                      <div>
                        <div>
                          <span>{t('common.labels.orders')}</span>
                          <p>{storeStatistics.data?.itemsCount.order}</p>
                        </div>
                        <OrdersIcon />
                      </div>
                    </div>
                  </div>

                  <div className="ant-row">
                    {storeStatistics.isSuccess && storeDetails.isSuccess && (
                      <div className="w-50">
                        <h6 className="title-sm m-b-24">
                          {t('common.labels.details')}
                        </h6>
                        <div className="media-content-details">
                          <div className="ant-row m-b-16">
                            <span>{t('common.labels.status')} </span>
                            <p>
                              {storeDetails.data?.status === 'connected' ? (
                                <Tag color="success">
                                  {t('common.labels.connected')}
                                </Tag>
                              ) : (
                                <Tag color="ghost">
                                  {t('common.labels.disconnected')}
                                </Tag>
                              )}
                            </p>
                          </div>
                          <div className="ant-row m-b-12">
                            <span>{t('common.labels.channel')}</span>
                            <p>
                              {channelStatus ? (
                                <Tag color="success">
                                  {t('common.labels.connected')}
                                </Tag>
                              ) : (
                                <Tag color="ghost">
                                  {t('common.labels.disconnected')}
                                </Tag>
                              )}
                            </p>
                          </div>
                          <div className="ant-row m-b-12">
                            <span>{t('common.labels.environment')}</span>
                            <p>
                              {storeEnvironments.map(
                                (storeEnvironment, index) =>
                                  index === storeEnvironments.length - 1
                                    ? storeEnvironment
                                    : storeEnvironment + `, `
                              )}
                            </p>
                          </div>
                          <div className="ant-row m-b-12">
                            <span>{t('common.labels.modified_on')} </span>
                            <p>
                              {convertAndFormatDate(
                                storeDetails.data?.modifiedAt,
                                timeZone,
                                'DD MMM YYYY, hh:mm A'
                              )}
                            </p>
                          </div>
                          <div className="ant-row m-b-12">
                            <span>{t('common.labels.modified_by')} </span>
                            <p>{userName}</p>
                          </div>
                          <div className="ant-row ">
                            <span>{t('common.labels.last_synced')} </span>
                            <p>
                              {storeStatistics.isSuccess &&
                                storeDetails.isSuccess &&
                                (storeStatistics.data?.syncStatus &&
                                storeStatistics.data.syncStatus.status ===
                                  'In Progress'
                                  ? t('common.labels.syncing_in_progress')
                                  : storeStatistics.data?.syncStatus &&
                                    storeStatistics.data.syncStatus.status ===
                                      'Initiating'
                                  ? t('common.labels.initiating')
                                  : `${lastSynced}`)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {storeDetails.isSuccess &&
                      storeStatistics.isSuccess &&
                      storeStatistics.data?.syncStatus &&
                      storeStatistics.data?.syncStatus.status !==
                        'Initiating' &&
                      storeStatistics.data?.syncStatus?.status !== 'Error' &&
                      storeStatistics.data.syncStatus?.syncingItems && (
                        <div className="w-50">
                          <h6 className='title-sm m-b-24'>{t('common.labels.sync_status')}</h6>
                          {storeStatistics.data?.syncStatus?.syncingItems
                            .products && (
                            <div className="ant-row sync-status-section">
                              <span className="sync-title">
                                {t('common.labels.products')}
                              </span>
                              <Progress
                                status={
                                  Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.products.syncedCount
                                  ) ===
                                  Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.products.totalCount
                                  )
                                    ? 'success'
                                    : 'active'
                                }
                                showInfo={false}
                                percent={
                                  100 *
                                  (Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.products.syncedCount
                                  ) /
                                    Number(
                                      storeStatistics.data?.syncStatus
                                        ?.syncingItems.products.totalCount
                                    ))
                                }
                              />
                              <span className="sync-count">
                                {storeStatistics.data?.syncStatus?.syncingItems
                                  .products.syncedCount === '0'
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
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.categories.syncedCount
                                  ) ===
                                  Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.categories.totalCount
                                  )
                                    ? 'success'
                                    : 'active'
                                }
                                showInfo={false}
                                percent={
                                  100 *
                                  (Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.categories.syncedCount
                                  ) /
                                    Number(
                                      storeStatistics.data?.syncStatus
                                        ?.syncingItems.categories.totalCount
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
                          {storeStatistics.data?.syncStatus?.syncingItems
                            .brands && (
                            <div className="ant-row sync-status-section">
                              <span className="sync-title">
                                {t('common.labels.brands')}
                              </span>
                              <Progress
                                status={
                                  Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.brands.syncedCount
                                  ) ===
                                  Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.brands.totalCount
                                  )
                                    ? 'success'
                                    : 'active'
                                }
                                showInfo={false}
                                percent={
                                  100 *
                                  (Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.brands.syncedCount
                                  ) /
                                    Number(
                                      storeStatistics.data?.syncStatus
                                        ?.syncingItems.brands.totalCount
                                    ))
                                }
                              />
                              <span className="sync-count">
                                {storeStatistics.data?.syncStatus?.syncingItems
                                  .brands.syncedCount === '0'
                                  ? t('common.labels.in_queue')
                                  : `${storeStatistics.data?.syncStatus?.syncingItems.brands.syncedCount} / ${storeStatistics.data?.syncStatus?.syncingItems.brands.totalCount}`}
                              </span>
                            </div>
                          )}
                          {storeStatistics.data?.syncStatus?.syncingItems
                            .customers && (
                            <div className="ant-row sync-status-section">
                              <span className="sync-title">
                                {t('common.labels.customers')}
                              </span>
                              <Progress
                                status={
                                  Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.customers.syncedCount
                                  ) ===
                                  Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.customers.totalCount
                                  )
                                    ? 'success'
                                    : 'active'
                                }
                                showInfo={false}
                                percent={
                                  100 *
                                  (Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.customers.syncedCount
                                  ) /
                                    Number(
                                      storeStatistics.data?.syncStatus
                                        ?.syncingItems.customers.totalCount
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
                          {storeStatistics.data?.syncStatus?.syncingItems
                            .orders && (
                            <div className="ant-row sync-status-section">
                              <span className="sync-title">
                                {t('common.labels.orders')}
                              </span>
                              <Progress
                                status={
                                  Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.orders.syncedCount
                                  ) ===
                                  Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.orders.totalCount
                                  )
                                    ? 'success'
                                    : 'active'
                                }
                                showInfo={false}
                                percent={
                                  100 *
                                  (Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.orders.syncedCount
                                  ) /
                                    Number(
                                      storeStatistics.data?.syncStatus
                                        ?.syncingItems.orders.totalCount
                                    ))
                                }
                              />
                              <span className="sync-count">
                                {storeStatistics.data?.syncStatus?.syncingItems
                                  .orders.syncedCount === '0'
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
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.currencies.syncedCount
                                  ) ===
                                  Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.currencies.totalCount
                                  )
                                    ? 'success'
                                    : 'active'
                                }
                                showInfo={false}
                                percent={
                                  100 *
                                  (Number(
                                    storeStatistics.data?.syncStatus
                                      ?.syncingItems.currencies.syncedCount
                                  ) /
                                    Number(
                                      storeStatistics.data?.syncStatus
                                        ?.syncingItems.currencies.totalCount
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
                </>
              )}
            </>
          )}
          <div className="ant-row form-top-border">
            <div className="m-r-16">
              <Button
                id={t('common.labels.save')}
                type="primary"
                onClick={showSyncModal}
                loading={
                  storeStatistics.isSuccess &&
                  (storeStatistics.data?.syncStatus?.status === 'In Progress' ||
                    storeStatistics.data?.syncStatus?.status === 'Initiating')
                }
                disabled={
                  storeStatistics.isError ||
                  isSyncButtonDisabled ||
                  !canUpdateBigcommerceStore()
                }>
                {t('common.labels.sync_now')}
              </Button>
            </div>
            {canDeleteBigcommerceStore() && (
              <Button
                // className='without-default-border'
                type="text"
                danger
                id={t('common.labels.cancel')}
                onClick={showDeleteModal}
                loading={deleteBigcommerceStore.isLoading}>
                {t('common.labels.remove_store')}
              </Button>
            )}
          </div>
        </>
      ) : (
        <Spin
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      )}
    </div>
  );
};

export default Overview;
