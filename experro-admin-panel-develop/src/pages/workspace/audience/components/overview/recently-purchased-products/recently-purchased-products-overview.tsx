import React from 'react';
import { Card, Spin } from 'antd';
import { TFunction } from 'react-i18next';
import { LoadingOutlined } from '@ant-design/icons';

import NoDataFound from '../../../../../../components/no-data-found';
import SearchRuleIcon from '../../../../../../images/icons/search-rule-icon';
import { currencyFormatter } from '../../../../../../utills';

interface IRecentlyPurchasedProductsOverview {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentlyPurchasedProducts: any;
  t: TFunction<'translation', undefined>;
  domain?: string;
  currency?: string;
}

const RecentlyPurchasedProductsOverview = ({
  recentlyPurchasedProducts,
  t,
  domain,
  currency,
}: IRecentlyPurchasedProductsOverview) => {
  return (
    <div className="position-relative">
      <h4> {t('common.labels.recently_purchased_products')}</h4>

      <div className="merchandising-grid">
        {recentlyPurchasedProducts.isSuccess &&
        recentlyPurchasedProducts.data &&
        currency ? (
          recentlyPurchasedProducts.data.length > 0 ? (
            <>
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                recentlyPurchasedProducts.data.map((product: any) => (
                  <div>
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
                  </div>
                ))
              }
            </>
          ) : (
            <NoDataFound
              icon={<SearchRuleIcon />}
              title={t('common.labels.no_products_found')}
            />
          )
        ) : !recentlyPurchasedProducts.isFetching ? (
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
      </div>
    </div>
  );
};

export default RecentlyPurchasedProductsOverview;
