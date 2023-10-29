import React from 'react';
import { TFunction } from 'react-i18next';
import { Card, Col, Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { currencyFormatter } from '../../../../../utills';
import NoDataFound from '../../../../../components/no-data-found';
import useTrendingUpProductsController from './trending-up-products-controller';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';

interface ITrendingUpProducts {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
  domain?: string;
  currency?: string;
}

const TrendingUpProducts: React.FC<ITrendingUpProducts> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
  domain,
  currency,
}) => {
  const { trendingUpProducts } = useTrendingUpProductsController({
    workspaceId,
    environment,
    startDate,
    endDate,
  });

  return (
    <div className="position-relative">
      <h3 className='gray-text title-default m-b-4'>{t('common.labels.trending_up')}</h3>
      <p className='m-0 m-b-16 gray-text'>
        <small>
        {t('common.labels.most_growth_products_compared_to_previous_period')}
        </small>
      </p>

      <Row gutter={16} className="dasborad-product-grid">
        {trendingUpProducts.isSuccess && trendingUpProducts.data && currency ? (
          trendingUpProducts.data.length > 0 ? (
            <>
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                trendingUpProducts.data.map((product: any) => (
                  <Col xl={6}>
                    <Card
                      onClick={() =>
                        window.open(
                          `https://${domain}${product.pageSlug}`,
                          '_blank'
                        )
                      }
                      hoverable
                      cover={
                        <img src={product.urlThumbnail} alt={product.name} />
                      }>
                      <div className="productName">
                        <h4 title={product.name}>{product.name}</h4>
                      </div>
                      <div className="productPrice">
                        <span title={product.price}>
                          {currencyFormatter(currency, product.price)}
                        </span>
                      </div>
                      <div className="media-content-details">
                        <div className='ant-row ant-row-space-between'>
                          <span title={product.currentPeriodSoldQty}>
                            {t('common.labels.unit_sold')}
                          </span>
                          <p className='text-right font-semibold'>{product.currentPeriodSoldQty}</p>
                        </div>
                        <div className='ant-row ant-row-space-between'>
                          <span title={product.currentPeriodSoldQty}>
                            {t('common.labels.growth_rate')}
                          </span>
                          <p className='text-right font-semibold'>{product.growthRate ? `${product.growthRate}%` : '0%'}</p>
                        </div>
                      </div>
                      {/* <div className="productSKU">
                        <span title={product.growthRate}>
                          {t('common.labels.growth_rate')}{' '}
                          {product.growthRate ? `${product.growthRate}%` : '0%'}
                        </span>
                      </div> */}
                    </Card>
                  </Col>
                ))
              }
            </>
          ) : (
            <NoDataFound
              icon={<NoRecordIcon />}
              title={t('common.labels.no_products_found')}
            />
          )
        ) : !trendingUpProducts.isFetching ? (
          <NoDataFound
            icon={<NoRecordIcon />}
            title={t('common.labels.no_products_found')}
          />
        ) : (
          <Spin
            className="HV-center max-height-spin w-100"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        )}
      </Row>
    </div>
  );
};

export default TrendingUpProducts;
