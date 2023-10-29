import React from 'react';
import { TFunction } from 'react-i18next';
import { Card, Col, Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { currencyFormatter } from '../../../../../utills';
import NoDataFound from '../../../../../components/no-data-found';
import useTopSellingController from './top-selling-controller';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';

interface ITopSelling {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
  domain?: string;
  currency?: string;
}

const TopSelling: React.FC<ITopSelling> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
  domain,
  currency,
}) => {
  const { topSelling } = useTopSellingController({
    workspaceId,
    environment,
    startDate,
    endDate,
  });

  return (
    <div className="position-relative">
      <h3 className="gray-text title-default m-b-4">
        {t('common.labels.top_selling')}
      </h3>
      <p className="m-0 m-b-16 gray-text">
        <small>{t('common.labels.most_units_sold_in_this_period')} </small>
      </p>

      <Row gutter={16} className="dasborad-product-grid">
        {topSelling.isSuccess && topSelling.data && currency ? (
          topSelling.data.length > 0 ? (
            <>
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                topSelling.data.map((product: any) => (
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
                          <span title={product.soldQty}>
                            {t('common.labels.unit_sold')}
                          </span>
                          <p className="text-right font-semibold">
                            {product.soldQty ? product.soldQty : 0}
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
        ) : !topSelling.isFetching ? (
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

export default TopSelling;
