import React from 'react';
import { Layout } from 'antd';

import usePreviewController from './preview-controller';
import HeaderPreview from './header';
import Tabs from '../../../../../components/tabs';
import ProductPreview from './product';

const PreviewRules = () => {
  const {
    t,
    rulesList,
    backToEditor,
    previewSideBarItems,
    subMenu,
    listProductCategories,
    selectedProductsCategoriesPreview,
    selectedTag,
    onProductChangeCategory,
    selectedProductGlobalPreview,
    onProductAddSiteRuleSearchRule,
    onProductDeleteSiteRuleSearchRule,
    handleTagClick,
    selectedProductSearchRulePreview,
    listPreviewProduct,
    skipCount,
    setCheckedProduct,
    checkedProduct,
    productCount,
    selectedPage,
    onEnableDisableExternalAffectingRules,
    isAllRuleEnabled,
    domain,
    onPageChange,
    workspaceId,
  } = usePreviewController();

  return (
    <Layout>
      <HeaderPreview backToEditor={backToEditor} t={t} rulesList={rulesList} />

      <div className="ant-row merchandising-section merchandising-preview-section">
        <div className="merchandising-sidebar">
          <Tabs
            destroyInactiveTabPane
            items={previewSideBarItems}
            id="preview-tabs"
          />
        </div>

        <div className="merchandising-rightbar">
          <ProductPreview
            subMenu={subMenu}
            selectedTag={selectedTag}
            selectedProductGlobalPreview={selectedProductGlobalPreview}
            onProductDeleteSiteRuleSearchRule={
              onProductDeleteSiteRuleSearchRule
            }
            onProductAddSiteRuleSearchRule={onProductAddSiteRuleSearchRule}
            handleTagClick={handleTagClick}
            selectedProductSearchRulePreview={selectedProductSearchRulePreview}
            listProductCategories={listProductCategories}
            selectedProductsCategoriesPreview={
              selectedProductsCategoriesPreview
            }
            onProductChangeCategory={onProductChangeCategory}
            listPreviewProduct={listPreviewProduct.data?.items}
            listPreviewProductIsSuccess={listPreviewProduct.isSuccess}
            listPreviewProductIsLoading={listPreviewProduct.isLoading}
            listPreviewProductIsError={listPreviewProduct.isError}
            skipCount={skipCount}
            setCheckedProduct={setCheckedProduct}
            checkedProduct={checkedProduct}
            productCount={productCount}
            selectedPage={selectedPage}
            isAllRuleEnabled={isAllRuleEnabled}
            onEnableDisableExternalAffectingRules={
              onEnableDisableExternalAffectingRules
            }
            domain={domain}
            enabledRuleCount={listPreviewProduct.data?.enabledRuleCount}
            allRuleCount={listPreviewProduct.data?.allRuleCount}
            onPageChange={onPageChange}
            workspaceId={workspaceId}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PreviewRules;
