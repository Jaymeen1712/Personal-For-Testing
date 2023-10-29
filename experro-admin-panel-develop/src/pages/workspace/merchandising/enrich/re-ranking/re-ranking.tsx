import React from 'react';
import { Button, Radio, Card, Spin, Row, Col } from 'antd';
import useReRankingController from './re-ranking-controller';
import UnionIcon from '../../../../../images/icons/union-icon';
import ReRankingCustomStrategyDetails from './re-ranking-custom/re-ranking-custom-strategy-details';
import { onSidebarToggle } from '../../../../../utills';
import HamburgerIcon from '../../../../../images/icons/hamburger-icon';
import { LoadingOutlined } from '@ant-design/icons';
import BigcommerceBannerImage from '../../../../../images/icons/bigcommerce-banner-image';

const ReRanking = () => {
  const {
    t,
    strategies,
    newSelectedStrategy,
    isStrategyFetching,
    isStoreFound,
    isSavedAction,
    isActionEnabled,
    isUnknownError,
    onAddStore,
    permission,
    onSaveStrategy,
    updateStrategy,
    updateSavedAction,
    onCancel,
    updateActionEnabled,
    onStrategySelectionChange,
  } = useReRankingController();
  return (
    <>
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div
            data-testid={'sidebar-toggle'}
            className="hamburgericon"
            onClick={onSidebarToggle}>
            <HamburgerIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {t('common.labels.header_re_ranking')}
            </span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              {t('common.labels.subtitle_re_ranking')}
            </span>
          </div>
        </div>

        <div className="headerright">
          {isStoreFound && !isUnknownError && (
            <div className="ant-row ant-row-end">
              <>
                <Button
                  id={`re-ranking-${t('common.labels.cancel')}`}
                  onClick={onCancel}
                  disabled={!isActionEnabled}>
                  {t('common.labels.cancel')}
                </Button>

                <Button
                  id={`re-ranking-${t('common.labels.save')}`}
                  type="primary"
                  onClick={onSaveStrategy}
                  disabled={!isActionEnabled}>
                  {t('common.labels.save')}
                </Button>
              </>
            </div>
          )}
        </div>
      </div>
      {isStrategyFetching && newSelectedStrategy.strategy.length === 0 ? (
        <Spin
          data-testid={'loader'}
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      ) : (
        <>
          {!isStoreFound && !isUnknownError && (
            <Row className="generate-box ant-row ant-space-align-center p-32">
              <Col span={12}>
                <div className="generate-box-content p-l-32">
                  <h1 className="h4 m-b-16 secondary-black">
                    {t('common.labels.no_store_found')}
                  </h1>
                  <p className="m-b-32">
                    {t('common.messages.re_ranking_no_store_found')}
                  </p>
                  {permission.canReadEcommerceStore() &&
                    permission.canCreateEcommerceStore() && (
                      <Button type="primary" onClick={onAddStore}>
                        {t('common.labels.add_store')}
                      </Button>
                    )}
                </div>
              </Col>
              <Col span={12}>
                <div className="generate-box-img">
                  <BigcommerceBannerImage />
                </div>
              </Col>
            </Row>
          )}
          {isStoreFound && !isUnknownError && (
            <div className="re-ranking-section">
              <h3 className="subtitle-with-border">
                {t('common.labels.basic_optimize')}
              </h3>
              {strategies.map((strategy) => {
                return (
                  <Card
                    data-testid={`card-${strategy.id}`}
                    key={strategy.id}
                    bordered={true}
                    className={
                      newSelectedStrategy.strategy === strategy.id
                        ? 'active'
                        : undefined
                    }>
                    <div className="ant-row ant-row-space-between">
                      <div className="re-ranking-details">
                        <Radio
                          data-testid={`radio-${strategy.id}`}
                          disabled={!strategy.isEnabled}
                          checked={newSelectedStrategy.strategy === strategy.id}
                          onChange={onStrategySelectionChange}
                          value={strategy.id}>
                          {strategy.title}
                        </Radio>
                        <div className="ranking-card-body">
                          <p className="gray-text">{strategy.subTitle}</p>
                          {newSelectedStrategy.strategy === strategy.id ? (
                            strategy.id === 'custom' ? (
                              <ReRankingCustomStrategyDetails
                                newSelectedStrategy={newSelectedStrategy}
                                updateStrategy={updateStrategy}
                                updateActionEnabled={updateActionEnabled}
                                isSavedAction={isSavedAction}
                                updateSavedAction={updateSavedAction}
                              />
                            ) : (
                              <Button
                                id={t('common.labels.learn_more')}
                                icon={
                                  <span className="anticon">
                                    <UnionIcon />
                                  </span>
                                }>
                                {t('common.labels.learn_more')}
                              </Button>
                            )
                          ) : null}
                        </div>
                      </div>
                      <div className="re-ranking-images ant-row ant-row-space-between">
                        {newSelectedStrategy.strategy === strategy.id
                          ? strategy.products.map((product, index) => (
                              <div
                                data-testid={`${strategy.id}-product-${index}`}
                                key={index}>
                                <span className={'image-count'}>
                                  {index + 1}
                                </span>
                                <img src={product.image} alt={'product'} />
                                <div className="custom-skeleton">&nbsp;</div>
                                {product.value ? (
                                  <div className="ant-row">
                                    {product.text && (
                                      <span className="display-block re-ranking-images-title">
                                        {product.text}
                                      </span>
                                    )}
                                    <span
                                      className="display-block re-ranking-images-title"
                                      style={{ color: product.valueColor }}>
                                      {product.value}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="custom-skeleton small-skeleton">
                                    &nbsp;
                                  </div>
                                )}
                              </div>
                            ))
                          : null}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ReRanking;
