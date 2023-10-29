import { Alert, Button, Progress, Skeleton, Tag } from 'antd';
import React from 'react';
import { TFunction } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import {
  IAPIError,
  IBigcommerceStoreStatistics,
  IShopifyStoreResponse,
} from '../../../../../../../../types';
import { convertAndFormatDate } from '../../../../../../../../utills';
import ProductsIcon from '../../../../../../../../images/icons/products-icon';
import CategoriesIcon from '../../../../../../../../images/icons/categories-icon';
import useOverviewController from './overview-controller';

interface OverviewProps {
  storeDetails: UseQueryResult<IShopifyStoreResponse | undefined, IAPIError>;
  t: TFunction<'translation', undefined>;
  timeZone?: string;
  userName?: string;
  lastSyncAt?: string;
  storeStatistics: UseQueryResult<
    IBigcommerceStoreStatistics | undefined,
    IAPIError
  >;
  onDeleteStoreButtonClick: () => void;
  isSyncButtonDisabled: boolean;
  onSyncButtonClick: (val: boolean) => void;
  canUpdateEcommerceStore: () => boolean;
  canDeleteEcommerceStore: () => boolean;
}

const Overview: React.FC<OverviewProps> = ({
  t,
  storeDetails,
  timeZone,
  userName,
  lastSyncAt,
  storeStatistics,
  onDeleteStoreButtonClick,
  isSyncButtonDisabled,
  onSyncButtonClick,
  canDeleteEcommerceStore,
  canUpdateEcommerceStore,
}) => {
  const { storeEnvironments } = useOverviewController({
    storeDetails,
  });
  return (
    <div className="bigcommerce-store-section m-t-32">
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
          {storeStatistics.isSuccess && (
            <div className="m-b-40">
              <h3 className="title-default m-b-24">
                {t('common.labels.overview')}
              </h3>
              <div className="bigcommerce-store-grid">
                <div>
                  <div>
                    <span>{t('common.labels.products')} </span>
                    <p>
                      {storeStatistics.data?.itemsCount.product
                        ? storeStatistics.data?.itemsCount.product
                        : storeStatistics.data?.syncStatus?.syncingItems
                            .products?.totalCount}
                    </p>
                  </div>
                  <ProductsIcon />
                </div>
                <div>
                  <div>
                    <span>{t('common.labels.categories')} </span>
                    <p>
                      {storeStatistics.data?.itemsCount.category
                        ? storeStatistics.data?.itemsCount.category
                        : storeStatistics.data?.syncStatus?.syncingItems
                            .categories?.totalCount}
                    </p>
                  </div>
                  <CategoriesIcon />
                </div>
              </div>
            </div>
          )}
          <div className="ant-row">
            {storeStatistics.isSuccess && storeDetails.isSuccess && (
              <div className="w-50">
                <h3 className="title-default">{t('common.labels.details')}</h3>
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
                    <span>{t('common.labels.environment')}</span>
                    <p>{storeEnvironments.join(', ')}</p>
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
                  <div className="ant-row">
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
                          : `${lastSyncAt} ${t('common.labels.ago')}`)}
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
                </div>
              )}
          </div>
        </>
      )}
      <div className="ant-row form-top-border">
        <div className="m-r-16">
          <Button
            id={t('common.labels.save')}
            type="primary"
            onClick={() => onSyncButtonClick(true)}
            disabled={
              storeStatistics.isError ||
              isSyncButtonDisabled ||
              canUpdateEcommerceStore()
            }
            loading={
              storeStatistics.isSuccess &&
              (storeStatistics.data?.syncStatus?.status === 'In Progress' ||
                storeStatistics.data?.syncStatus?.status === 'Initiating')
            }>
            {t('common.labels.sync_now')}
          </Button>
        </div>
        {canDeleteEcommerceStore() && (
          <Button
            // className='without-default-border'
            type="text"
            danger
            id={t('common.labels.cancel')}
            onClick={onDeleteStoreButtonClick}>
            {t('common.labels.remove_store')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Overview;
