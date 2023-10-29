import React from 'react';
import { Button, Popover, Card, Form, Input, Row, Col, Spin } from 'antd';
import { WithContext as ReactTags } from 'react-tag-input';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { IListProductItems } from '../../../../../../types';
import PinIcon from '../../../../../../images/icons/pin-icon';
import NoDataFound from '../../../../../../components/no-data-found';
import SearchRuleIcon from '../../../../../../images/icons/search-rule-icon';
import SlotIcon from '../../../../../../images/icons/slot-icon';
import useProductListController from './product-list-controller';
import { LoadingOutlined } from '@ant-design/icons';
import GearIcon from '../../../../../../images/icons/gear-icon';

interface IProductList {
  isLoading: boolean;
  listRuleProducts?: IListProductItems[];
  onAddProductName: (products: { id: string; text: string }) => void;
  onDeleteProductName: (index: number) => void;
  productCount?: string;
  setSkipCount: (skipCount: number) => void;
  skipCount: number;
  setCheckedProduct: (checkedProduct: CheckboxValueType[]) => void;
  selectedPage: number;
  setSelectedPage: (selectedPage: number) => void;
  checkedProduct: CheckboxValueType[];
  listProductIsSuccess: boolean;
  listProductIsFetching: boolean;
  selectedKeyword?: { id: string; text: string }[];
  ruleType?: string;
  pageURLValue: string;
  // eslint-disable-next-line
  onChangePageURLValue: (event: any) => void;
}

const ProductList: React.FC<IProductList> = ({
  isLoading,
  listRuleProducts,
  onAddProductName,
  productCount,
  setSkipCount,
  skipCount,
  setCheckedProduct,
  selectedPage,
  setSelectedPage,
  checkedProduct,
  listProductIsSuccess,
  listProductIsFetching,
  selectedKeyword,
  onDeleteProductName,
  ruleType,
  pageURLValue,
  onChangePageURLValue,
}) => {
  const { t, menu } = useProductListController({
    listRuleProducts,
    setSkipCount,
    setSelectedPage,
    setCheckedProduct,
    checkedProduct,
  });

  return (
    <>
      <div className="search-section ant-row ant-row-space-between ant-space-align-center m-b-16">
        <>
          {ruleType === 'keyword' && (
            <ReactTags
              inputFieldPosition="inline"
              tags={selectedKeyword}
              handleAddition={onAddProductName}
              handleDelete={onDeleteProductName}
              placeholder={t('common.labels.search')}
              allowDragDrop={false}
            />
          )}
        </>
        {ruleType === 'page' && (
          <div className="react-tags-wrapper">
            <Form>
              <Input
                addonBefore="Page URL"
                placeholder="/example"
                value={pageURLValue}
                onChange={(event) => onChangePageURLValue(event)}
              />
            </Form>
          </div>
        )}
        {ruleType === 'global' && (
          <>
            {Number(listRuleProducts?.length) > 0 ? (
              <div>
                <p className="m-0 gray-text search-count">
                  {t('common.labels.total_products', {
                    entity: Number(productCount),
                  })}
                </p>
              </div>
            ) : (
              <div>
                <p className="m-0 gray-text search-count">
                  {t('common.labels.total_product', {
                    entity: 0,
                  })}
                </p>
              </div>
            )}
          </>
        )}

        {listRuleProducts && listRuleProducts?.length > 0 && (
          <>
            <Popover placement="bottomRight" content={menu}>
              <Button icon={<GearIcon />}></Button>
            </Popover>
          </>
        )}
      </div>
      {Number(productCount) > 0 && ruleType !== 'global' && (
        <div>
          <p className="m-b-32 gray-text search-count">
            {t('common.labels.total_products', {
              entity: Number(productCount),
            })}
          </p>
        </div>
      )}
      {
        <>
          {listProductIsSuccess ? (
            <>
              {listRuleProducts && listRuleProducts?.length > 0 ? (
                <Row gutter={16} className="merchandising-grid">
                  {listRuleProducts.map((product, index) => (
                    <Col xl={6} md={8} className="m-b-16">
                      <Card
                        hoverable
                        cover={
                          product.urlThumbnail.length > 0 ? (
                            <img
                              alt={product.nameEti}
                              src={product.urlThumbnail}
                            />
                          ) : (
                            product.nameEti
                          )
                        }>
                        <div
                          className={`product-count ${
                            product.pin ? 'product-count-pin' : ''
                          }`}>
                          {index + 1 + skipCount}
                          {product.pin && <PinIcon />}
                        </div>
                        {product.slot && (
                          <div className={'product-count product-slot'}>
                            <SlotIcon />
                          </div>
                        )}
                        <div>
                          <h4 title={product.nameEti}>{product.nameEti}</h4>
                          <p
                            className="m-0 m-t-8"
                            title={product.calculatedPriceEfi}>
                            <b>{product.calculatedPriceEfi}</b>
                          </p>
                        </div>
                        <div className="media-content-details">
                          {checkedProduct.map((key) => (
                            <div className="ant-row ant-row-space-between">
                              <span>
                                {typeof key === 'string' && key !== 'skuEsi'
                                  ? key
                                      .replace(/([A-Z])/g, ' $1')
                                      .split(' ')
                                      .join('_')
                                      .toLowerCase()
                                      .slice(
                                        0,
                                        key
                                          .replace(/([A-Z])/g, ' $1')
                                          .split(' ')
                                          .join('_')
                                          .toLowerCase()
                                          .lastIndexOf('_')
                                      )
                                      .split('_')
                                      .join(' ')
                                  : typeof key === 'string' &&
                                    key
                                      .replace(/([A-Z])/g, ' $1')
                                      .split(' ')
                                      .join('_')
                                      .toLowerCase()
                                      .slice(
                                        0,
                                        key
                                          .replace(/([A-Z])/g, ' $1')
                                          .split(' ')
                                          .join('_')
                                          .toLowerCase()
                                          .lastIndexOf('_')
                                      )
                                      .split('_')
                                      .join(' ')
                                      .replace(
                                        /\w\s*/g,
                                        (m) =>
                                          m.charAt(0).toUpperCase() +
                                          m.substring(1).toLowerCase()
                                      )}
                                :
                              </span>

                              <p
                                className={
                                  key === 'descriptionEti'
                                    ? 'description-truncate'
                                    : key === 'revenueEfi'
                                    ? 'text-green'
                                    : ''
                                }>
                                {/* @ts-ignore */}
                                {product[key] ? product[key] : '-'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <>
                  {!listProductIsFetching && (
                    <div className="empty-box">
                      <NoDataFound
                        icon={<SearchRuleIcon />}
                        title={t('common.labels.no_products_found')}
                        description={t('common.labels.no_product_description')}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <Spin
                className="HV-center table-center"
                indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
                size="large"
              />
            </>
          )}
        </>
      }
    </>
  );
};

export default ProductList;
