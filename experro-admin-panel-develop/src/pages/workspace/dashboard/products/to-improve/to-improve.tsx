import { TFunction } from 'react-i18next';
import React from 'react';
import { useToImprove } from '../../services';
import { Card, Col, Row, Spin } from 'antd';
import { currencyFormatter } from '../../../../../utills';
import NoDataFound from '../../../../../components/no-data-found';
import { LoadingOutlined } from '@ant-design/icons';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';

interface IToImprove {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
  domain?: string;
  currency?: string;
}

const ToImprove = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
  domain,
  currency,
}: IToImprove) => {
  const toImprove = useToImprove(workspaceId, environment, startDate, endDate);

  return (
    <div className="position-relative">
      <h3 className='gray-text title-default m-b-4'>{t('common.labels.to_improve')}</h3>
      <p className='m-0 m-b-16 gray-text'><small>{t('common.labels.get_lot_of_traffic_but_not_sell_more')}</small>
      </p>

      <Row gutter={16} className="dasborad-product-grid">
        {toImprove.isSuccess && toImprove.data && currency ? (
          toImprove.data.length > 0 ? (
            <>
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                toImprove.data.map((product: any) => (
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
                          <span title={product.conversionRate}>
                            {t('common.labels.conversion_rate')}:

                          </span>
                          <p className='text-right font-semibold'>
                            {product.conversionRate
                              ? `${
                                  product.conversionRate
                                    ? product.conversionRate
                                    : 0
                                }%`
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
              title={t('common.labels.no_products_found')}
            />
          )
        ) : !toImprove.isFetching ? (
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

export default ToImprove;
