import { TFunction } from 'react-i18next';
import React from 'react';
import useNotSelling from '../../services/not-selling/not-selling';
import { Card, Col, Row, Spin } from 'antd';
import { currencyFormatter } from '../../../../../utills';
import NoDataFound from '../../../../../components/no-data-found';
import { LoadingOutlined } from '@ant-design/icons';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';

interface INotSelling {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
  domain?: string;
  currency?: string;
}

const NotSelling: React.FC<INotSelling> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
  domain,
  currency,
}) => {
  const notSelling = useNotSelling(
    workspaceId,
    environment,
    startDate,
    endDate
  );

  return (
    <div className="position-relative">
      <h3 className="gray-text title-default m-b-4">
        {t('common.labels.not_selling')}
      </h3>
      <p className="m-0 m-b-16 gray-text">
        <small>{t('common.labels.viewed_but_not_sell')}</small>
      </p>

      <Row gutter={16} className="dasborad-product-grid">
        {notSelling.isSuccess && notSelling.data && currency ? (
          notSelling.data.length > 0 ? (
            <>
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                notSelling.data.map((product: any) => (
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
                          <span title={product.purchasedCount}>
                            {t('common.labels.unit_sold')}
                          </span>
                          <p className="text-right font-semibold">
                            {product.purchasedCount}
                          </p>
                        </div>
                        <div className="ant-row ant-row-space-between">
                          <span title={product.viewedCount}>
                            {t('common.labels.sessions')}
                          </span>
                          <p className="text-right font-semibold">
                            {product.viewedCount}
                          </p>
                        </div>
                      </div>
                      {/* <div className="productSKU">
                        <span title={product.viewedCount}>
                          {t('common.labels.sessions')}
                          {product.viewedCount}
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
              title={t('common.labels.no_results_found')}
            />
          )
        ) : !notSelling.isFetching ? (
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

export default NotSelling;
