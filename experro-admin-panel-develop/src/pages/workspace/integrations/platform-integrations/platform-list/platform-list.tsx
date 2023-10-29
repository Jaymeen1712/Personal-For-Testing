import usePlatformListController from './platform-list-controller';
import { Card, Col, Row, Spin, Tag } from 'antd';
import ShopifyIcon from '../../../../../images/icons/shopify-icon';
import BigCommerceAppIcon from '../../../../../images/icons/big-commerce-app-icon';
import IntegrationsHeader from '../../header';
import { LoadingOutlined } from '@ant-design/icons';

const PlatformList = () => {
  const { t, platformsList, platFormItemClick } = usePlatformListController();
  return (
    <>
      <IntegrationsHeader isListHeader={true} type="platforms" />
      
      <Row gutter={32} className="apps-row platforms-rows">
        {platformsList ? (
          platformsList.map((item) => (
            <Col lg={12} xxl={8} key={item.id} className='m-b-32'>
            
              <Card
              hoverable
                onClick={() =>
                  platFormItemClick(
                    item.id,
                    item.integrationInternalName,
                    item.active
                  )
                }>
                <div className="m-b-24 ant-row ant-space-align-center ant-row-space-between">
                  {item.integrationName === 'BigCommerce' ? (
                    <BigCommerceAppIcon />
                  ) : item.integrationName === 'Shopify' ? (
                    <ShopifyIcon />
                  ) : (
                    ''
                  )}

                  <div>
                    {item?.active && (
                      <Tag color="success">{t('common.labels.installed')}</Tag>
                    )}
                  </div>
                </div>
                <p className="m-0 font-semibold">
                  {item.integrationName}
                </p>
                <p className="text-blue m-0 small-text">
                  <small>{item.categoryName}</small>
                </p>
                <p className="light-gray m-0 small-text description-truncate">
                  <small>{item.description}</small>
                </p>
              </Card>
            
            </Col>
          ))
        ) : (
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        )}
      
      </Row>
    </>
  );
};

export default PlatformList;
