import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import Select, { components } from 'react-select';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import {
  Button,
  Card,
  Pagination,
  Popover,
  Spin,
  Switch,
  Row,
  Col,
  Tag,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import PinIcon from '../../../../../../images/icons/pin-icon';
import SlotIcon from '../../../../../../images/icons/slot-icon';
import NoDataFound from '../../../../../../components/no-data-found';
import SearchRuleIcon from '../../../../../../images/icons/search-rule-icon';
import { IListProductItems } from '../../../../../../types';
import useProductPreviewController from './product-preview-controller';
import GearIcon from '../../../../../../images/icons/gear-icon';
import SearchIcon from '../../../../../../images/icons/search-icon';

interface IProductPreview {
  subMenu?: string;
  selectedTag: (selectedTag: string, selectedTagId: string) => void;
  selectedProductGlobalPreview?: { id: string; text: string }[];
  onProductAddSiteRuleSearchRule: (products: {
    id: string;
    text: string;
  }) => void;
  onProductDeleteSiteRuleSearchRule: (index: number) => void;
  handleTagClick: (index: number) => void;
  selectedProductSearchRulePreview?: { id: string; text: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listProductCategories?: { label: string; value: string }[] | any;
  selectedProductsCategoriesPreview: {
    label: string;
    value: string;
    toggle?: boolean;
    id?: string;
  }[];
  onProductChangeCategory: (
    product: { label: string; value: string; id?: string }[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actionMeta: any
  ) => void;
  listPreviewProduct?: IListProductItems[];
  listPreviewProductIsSuccess: boolean;
  listPreviewProductIsLoading: boolean;
  listPreviewProductIsError: boolean;
  skipCount: number;
  setCheckedProduct: (checkedProduct: CheckboxValueType[]) => void;
  checkedProduct: CheckboxValueType[];
  productCount?: string;
  selectedPage: number;
  isAllRuleEnabled?: boolean;
  onEnableDisableExternalAffectingRules: (checked: boolean) => void;
  domain?: string;
  enabledRuleCount?: number;
  allRuleCount?: number;
  onPageChange: (page: number, pageSize: number) => void;
  workspaceId: string;
}

const ProductPreview: React.FC<IProductPreview> = ({
  subMenu,
  selectedTag,
  selectedProductGlobalPreview,
  onProductAddSiteRuleSearchRule,
  onProductDeleteSiteRuleSearchRule,
  handleTagClick,
  selectedProductSearchRulePreview,
  listProductCategories,
  selectedProductsCategoriesPreview,
  onProductChangeCategory,
  listPreviewProduct,
  listPreviewProductIsSuccess,
  listPreviewProductIsLoading,
  listPreviewProductIsError,
  skipCount,
  setCheckedProduct,
  checkedProduct,
  productCount,
  selectedPage,
  isAllRuleEnabled,
  onEnableDisableExternalAffectingRules,
  domain,
  enabledRuleCount,
  allRuleCount,
  onPageChange,
  workspaceId,
}) => {
  const ReactSelectStyles = () => ({
    // @ts-ignore
    multiValue: (styles, { data: { toggle } }) => {
      return {
        ...styles,
        background: toggle ? '#4f46e5' : null,
        color: toggle ? '#fff' : null,
      };
    },
    //@ts-ignore
    multiValueLabel: (styles, { data: { toggle } }) => ({
      ...styles,
      color: toggle ? '#fff' : null,
    }),

    // eslint-disable-next-line
    control: (base: any) => ({
      ...base,
      minHeight: '34px',
    }),

    // eslint-disable-next-line
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: '6px 8px',
    }),

    // eslint-disable-next-line
    clearIndicator: (base: any) => ({
      ...base,
      padding: '6px 8px',
    }),
  });

  const { menu, t, onInputChange, autoCompleteData } =
    useProductPreviewController({
      setCheckedProduct,
      checkedProduct,
      listPreviewProduct,
      workspaceId,
    });

  return (
    <>
      <div className="search-section ant-row ant-row-space-between m-b-16">
        <div className="react-tag-input-search react-tag-preview">
          <div className="react-tag-input-search-icon">
            <SearchIcon />
          </div>
          {subMenu === 'category-rules' ? (
            <Select
              key="category-rule-preview"
              isMulti={true}
              isSearchable={true}
              options={
                listProductCategories &&
                listProductCategories.data &&
                listProductCategories.data.length > 0 &&
                selectedProductsCategoriesPreview &&
                selectedProductsCategoriesPreview !== undefined &&
                selectedProductsCategoriesPreview !== [] &&
                selectedProductsCategoriesPreview.length > 0
                  ? listProductCategories.data.filter(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (productCategory: any) =>
                        !selectedProductsCategoriesPreview.some(
                          (selectedCategory) =>
                            selectedCategory.id === productCategory.id
                        )
                    )
                  : listProductCategories.data
              }
              // @ts-ignore
              value={
                selectedProductsCategoriesPreview
                  ? selectedProductsCategoriesPreview
                  : []
              }
              placeholder={t('common.labels.search_category')}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              getOptionValue={(selectedOption: any) => selectedOption.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              getOptionLabel={(selectedOption: any) => selectedOption.label}
              // @ts-ignore
              onChange={onProductChangeCategory}
              closeMenuOnSelect={true}
              // @ts-ignore
              styles={ReactSelectStyles()}
              isOptionSelected={(option, selectValue) =>
                selectValue.some((i) => i === option)
              }
              components={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                MultiValueLabel: (props: any) => {
                  return (
                    <div
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() =>
                        selectedTag(props.data.value, props.data.id)
                      }>
                      <components.MultiValueLabel {...props} />
                    </div>
                  );
                },
              }}
            />
          ) : (
            <>
              {subMenu === 'global-rules' ? (
                <div>
                  <ReactTags
                    suggestions={autoCompleteData}
                    handleInputChange={onInputChange}
                    key="site-rule-preview"
                    inputFieldPosition="inline"
                    tags={
                      selectedProductGlobalPreview
                        ? selectedProductGlobalPreview
                        : []
                    }
                    handleAddition={onProductAddSiteRuleSearchRule}
                    handleDelete={onProductDeleteSiteRuleSearchRule}
                    handleTagClick={handleTagClick}
                    placeholder={t('common.labels.search_keyword')}
                    allowDragDrop={false}
                  />
                </div>
              ) : (
                <div>
                  <ReactTags
                    suggestions={autoCompleteData}
                    handleInputChange={onInputChange}
                    key="search-rule-preview"
                    inputFieldPosition="inline"
                    tags={
                      selectedProductSearchRulePreview
                        ? selectedProductSearchRulePreview
                        : []
                    }
                    handleAddition={onProductAddSiteRuleSearchRule}
                    handleDelete={onProductDeleteSiteRuleSearchRule}
                    handleTagClick={handleTagClick}
                    placeholder={t('common.labels.search_keyword')}
                    allowDragDrop={false}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className="ant-row ant-space-align-center">
          <>
            {listPreviewProductIsSuccess && (
              <div className="ant-row ant-space-align-center label-switch-inline m-r-16">
                <span className="search-count">
                  {t('common.labels.external_affecting_rules')}(
                  {enabledRuleCount ? enabledRuleCount : 0})
                </span>

                <Switch
                  // @ts-ignore
                  disabled={allRuleCount <= 1}
                  checked={isAllRuleEnabled}
                  onChange={(checked) =>
                    onEnableDisableExternalAffectingRules(checked)
                  }
                />
              </div>
            )}
          </>
          {listPreviewProduct && listPreviewProduct?.length > 0 && (
            <>
              <Popover
                className="gear-icon"
                placement="bottomRight"
                content={menu}>
                <Button icon={<GearIcon />}></Button>
              </Popover>
            </>
          )}
        </div>
      </div>

      {Number(productCount) > 0 && (
        <div>
          <p className="m-b-28 gray-text search-count">
            <small>
              {Number(productCount) > 1
                ? t('common.labels.total_products', {
                    entity: Number(productCount),
                  })
                : t('common.labels.total_product', {
                    entity: Number(productCount),
                  })}
            </small>
          </p>
        </div>
      )}

      {
        <>
          {listPreviewProductIsSuccess ? (
            <>
              {listPreviewProduct && listPreviewProduct?.length > 0 ? (
                <Row gutter={16} className="merchandising-grid">
                  {listPreviewProduct.map((product, index) => (
                    <Col xl={6} lg={8} md={12} className="m-b-16">
                      <Card
                        onClick={
                          product.pageSlugEsi
                            ? () =>
                                window.open(
                                  `https://${domain}${product.pageSlugEsi}`,
                                  '_blank'
                                )
                            : (e) => e.stopPropagation()
                        }
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
                            <div className="ant-row ant-row-space-between ant-space-align-center">
                              <span>
                                {typeof key === 'string' &&
                                key === 'profitPercentageEfi'
                                  ? t('common.labels.profit_margin')
                                  : typeof key === 'string' && key !== 'skuEsi'
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
                              {key !== 'profitPercentageEfi' ? (
                                <p
                                  className={
                                    key === 'descriptionEti'
                                      ? 'description-truncate'
                                      : ''
                                  }>
                                  {/* @ts-ignore */}
                                  {product[key] ? product[key] : '-'}
                                </p>
                              ) : (
                                <p>
                                  {
                                    //@ts-ignore
                                    product[key] > 0 ? (
                                      <Tag
                                        className="profit-margin-tag"
                                        color={`${
                                          //@ts-ignore
                                          product[key] > 0 && product[key] <= 20
                                            ? '#EF4444'
                                            : //@ts-ignore
                                            product[key] > 20 &&
                                              //@ts-ignore
                                              product[key] <= 40
                                            ? '#F87171'
                                            : //@ts-ignore
                                            product[key] > 40 &&
                                              //@ts-ignore
                                              product[key] <= 60
                                            ? '#34D399'
                                            : //@ts-ignore
                                            product[key] > 60 &&
                                              //@ts-ignore
                                              product[key] <= 80
                                            ? '#00B679'
                                            : //@ts-ignore
                                              product[key] > 80 && '#059669'
                                        }`}>
                                        {/* @ts-ignore */}
                                        {`${product[key]}%`}
                                      </Tag>
                                    ) : (
                                      '-'
                                    )
                                  }
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <>
                  {!listPreviewProductIsLoading &&
                    (subMenu === 'category-rules' ? (
                      selectedProductsCategoriesPreview === undefined ||
                      selectedProductsCategoriesPreview.length === 0 ? (
                        <div className="empty-box">
                          <NoDataFound
                            icon={<SearchRuleIcon />}
                            title={t('common.labels.no_category_added')}
                            description={t(
                              'common.labels.no_category_added_description'
                            )}
                          />
                        </div>
                      ) : (
                        <div className="empty-box">
                          <NoDataFound
                            icon={<SearchRuleIcon />}
                            title={t('common.labels.no_products_found')}
                            description={t(
                              'common.labels.no_product_found_description'
                            )}
                          />
                        </div>
                      )
                    ) : subMenu === 'search-rules' ? (
                      selectedProductSearchRulePreview === undefined ||
                      selectedProductSearchRulePreview.length === 0 ? (
                        <div className="empty-box">
                          <NoDataFound
                            icon={<SearchRuleIcon />}
                            title={t('common.labels.no_keywords_added')}
                            description={t(
                              'common.labels.no_keywords_added_description'
                            )}
                          />
                        </div>
                      ) : (
                        <div className="empty-box">
                          <NoDataFound
                            icon={<SearchRuleIcon />}
                            title={t('common.labels.no_products_found')}
                            description={t(
                              'common.labels.no_product_found_description'
                            )}
                          />
                        </div>
                      )
                    ) : selectedProductGlobalPreview === undefined ||
                      selectedProductGlobalPreview.length === 0 ? (
                      <div className="empty-box">
                        <NoDataFound
                          icon={<SearchRuleIcon />}
                          title={t('common.labels.no_keywords_added')}
                          description={t(
                            'common.labels.no_keywords_added_description'
                          )}
                        />
                      </div>
                    ) : (
                      <div className="empty-box">
                        <NoDataFound
                          icon={<SearchRuleIcon />}
                          title={t('common.labels.no_products_found')}
                          description={t(
                            'common.labels.no_product_found_description'
                          )}
                        />
                      </div>
                    ))}
                </>
              )}
            </>
          ) : !listPreviewProductIsError && listPreviewProductIsLoading ? (
            <>
              <Spin
                className="HV-center table-center"
                indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
                size="large"
              />
            </>
          ) : (
            <div className="empty-box">
              <NoDataFound
                icon={<SearchRuleIcon />}
                title={t('common.labels.no_products_found')}
                description={t('common.labels.no_product_found_description')}
              />
            </div>
          )}
        </>
      }

      <div className="text-right">
        {Number(productCount) > 0 && !listPreviewProductIsLoading && (
          <Pagination
            defaultCurrent={selectedPage}
            defaultPageSize={50}
            total={Number(productCount) > 0 ? Number(productCount) : 50}
            showTitle={false}
            onChange={onPageChange}
            showSizeChanger={false}
            hideOnSinglePage={
              !!(
                Number(productCount) &&
                Number(productCount) &&
                Number(productCount) < 50
              )
            }
          />
        )}
      </div>
    </>
  );
};

export default ProductPreview;
