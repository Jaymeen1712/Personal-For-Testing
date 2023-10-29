import { Card, Spin, Row, Col } from 'antd';
import React from 'react';
import { TFunction } from 'react-i18next';
import { LoadingOutlined } from '@ant-design/icons';

import NoDataFound from '../../../../../../../components/no-data-found';
import SearchRuleIcon from '../../../../../../../images/icons/search-rule-icon';
import { currencyFormatter } from '../../../../../../../utills';

interface IRecentlyViewedProductsOverview {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentlyViewedProducts: any;
  t: TFunction<'translation', undefined>;
  domain?: string;
  currency?: string;
}

const RecentlyViewedProductsOverview = ({
  recentlyViewedProducts,
  t,
  domain,
  currency,
}: IRecentlyViewedProductsOverview) => {
  return (
    <div className="position-relative">
      <h4 className='title-default'>{t('common.labels.recently_viewed_products')}</h4>
      <Row gutter={16} className="merchandising-grid">
        {recentlyViewedProducts.isSuccess &&
        recentlyViewedProducts.data &&
        currency ? (
          recentlyViewedProducts.data.length > 0 ? (
            <>
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                recentlyViewedProducts.data.map((product: any) => (
                  <Col xl={6} className='m-b-16'>
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
                      <div className="productSKU">
                        <span title={product.sku}>
                          {t('common.labels.sku')} {product.sku}
                        </span>
                      </div>
                    </Card>
                  </Col>
                ))
              }
            </>
          ) : (
            <NoDataFound
              icon={<SearchRuleIcon />}
              title={t('common.labels.no_products_found')}
            />
          )
        ) : !recentlyViewedProducts.isFetching ? (
          <NoDataFound
            icon={<SearchRuleIcon />}
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

export default RecentlyViewedProductsOverview;
