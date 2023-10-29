import { TFunction } from 'react-i18next';
import React from 'react';
import { Card, Col, Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { currencyFormatter } from '../../../../../utills';
import NoDataFound from '../../../../../components/no-data-found';
import useAbandonProductsController from './abandon-products-controller';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';

interface IAbandonProducts {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
  domain?: string;
  currency?: string;
}

const AbandonProducts: React.FC<IAbandonProducts> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
  domain,
  currency,
}) => {
  const { abandonProducts } = useAbandonProductsController({
    workspaceId,
    environment,
    startDate,
    endDate,
  });

  return (
    <div className="position-relative">
      <h3 className="gray-text title-default m-b-4">
        {t('common.labels.abandon_products')}
      </h3>
      <p className="m-0 m-b-16 gray-text">
        <small>{t('common.labels.often_added_to_cart_but_not_sell')}</small>
      </p>

      <Row gutter={16} className="dasborad-product-grid">
        {abandonProducts.isSuccess && abandonProducts.data && currency ? (
          abandonProducts.data.length > 0 ? (
            <>
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                abandonProducts.data.map((product: any) => (
                  <Col md={12} lg={8} xl={6}>
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
                        <div className="ant-row ant-row-space-between">
                          <span title={product.addedToCart}>
                            {t('common.labels.added_to_cart')}:
                          </span>
                          <p className="text-right font-semibold">
                            {product.addedToCart}
                          </p>
                        </div>
                        <div className="ant-row ant-row-space-between">
                          <span title={product.abondonedRate.toFixed(2)}>
                            {t('common.labels.abaondoned_rate')}:
                          </span>
                          <p className="text-right font-semibold">
                            {product.abondonedRate
                              ? `${product.abondonedRate.toFixed(2)}%`
                              : '0%'}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))
              }
            </>
          ) : (
            <NoDataFound
              icon={<NoRecordIcon />}
              title={t('common.labels.no_results_found')}
            />
          )
        ) : !abandonProducts.isFetching ? (
          <NoDataFound
            icon={<NoRecordIcon />}
            title={t('common.labels.no_results_found')}
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

export default AbandonProducts;
