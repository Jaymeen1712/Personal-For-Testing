import React from 'react';
import { Layout } from 'antd';

import Tabs from '../../../../../components/tabs';
import useCreateUpdateRulesController from './create-update-rules-controller';
import { ICreateUpdateRules } from '../../../../../types';
import CreateUpdateRule from '../list/create-update';
import ProductList from './product/list';
import HeaderCreateUpdate from './header';
import DirtyCheckCreateUpdateRules from './dirty-check';

const CreateUpdateRules: React.FC<ICreateUpdateRules> = ({
  hideAddRule,
  addParentRule,
  setAddParentRule,
  initialValue,
  setInitialValue,
}) => {
  const {
    t,
    items,
    saveRule,
    rulesList,
    onEditRuleData,
    listRuleProducts,
    backToListPage,
    selectedTag,
    onProductAddSiteRuleSearchRule,
    listProductCategories,
    selectedProductsCategories,
    onProductChangeCategory,
    selectedProductSearchRule,
    startDate,
    endDate,
    productCount,
    setSkipCount,
    selectedPage,
    setSelectedPage,
    skipCount,
    setCheckedProduct,
    checkedProduct,
    onEditRule,
    selectedProductGlobal,
    onProductDeleteSiteRuleSearchRule,
    handleTagClick,
    buttonLoading,
    isNotRedirectPage,
    isDirtyCheckModelVisible,
    subMenu,
    workspaceId,
    setIsDirtyCheckModelVisible,
    setSelectedProductGlobal,
    setSelectedProductsCategories,
    setSelectedProductSearchRule,
    onPreviewClick,
    domain,
    disabledStartDate,
    disabledEndDate,
    onStartChange,
    onEndChange,
    isSaveButtonDisable,
    form,
    onTabChange,
  } = useCreateUpdateRulesController({
    setAddParentRule,
    setInitialValue,
    hideAddRule,
    addParentRule,
  });

  return (
    <>
      <Layout>
        <HeaderCreateUpdate
          backToListPage={backToListPage}
          rulesList={rulesList}
          onEditRuleData={onEditRuleData}
          t={t}
          startDate={startDate}
          endDate={endDate}
          isNotRedirectPage={isNotRedirectPage}
          buttonLoading={isDirtyCheckModelVisible ? false : buttonLoading}
          saveRule={saveRule}
          onPreviewClick={onPreviewClick}
          disabledStartDate={disabledStartDate}
          disabledEndDate={disabledEndDate}
          onStartChange={onStartChange}
          onEndChange={onEndChange}
          isSaveButtonDisable={isSaveButtonDisable}
          form={form}
        />

        <div className="ant-row merchandising-section">
          <div className="merchandising-sidebar">
            <Tabs
              onChange={onTabChange}
              destroyInactiveTabPane
              items={items}
              id="site-rule-tabs"
            />
          </div>

          <div className="merchandising-rightbar">
            <ProductList
              listRuleProducts={listRuleProducts.data?.items}
              selectedTag={selectedTag}
              subMenu={subMenu}
              onProductAddSiteRuleSearchRule={onProductAddSiteRuleSearchRule}
              listProductCategories={listProductCategories}
              selectedProductsCategories={selectedProductsCategories}
              onProductChangeCategory={onProductChangeCategory}
              selectedProductSearchRule={selectedProductSearchRule}
              productCount={productCount}
              setSkipCount={setSkipCount}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              skipCount={skipCount}
              setCheckedProduct={setCheckedProduct}
              checkedProduct={checkedProduct}
              listProductIsSuccess={listRuleProducts.isSuccess}
              listProductIsLoading={listRuleProducts.isLoading}
              listProductIsError={listRuleProducts.isError}
              selectedProductGlobal={selectedProductGlobal}
              onProductDeleteSiteRuleSearchRule={
                onProductDeleteSiteRuleSearchRule
              }
              handleTagClick={handleTagClick}
              domain={domain}
              workspaceId={workspaceId}
            />
          </div>
        </div>
      </Layout>
      {addParentRule && (
        <CreateUpdateRule
          t={t}
          subMenu={subMenu}
          onSave={onEditRule}
          hideAddRule={hideAddRule}
          initialValue={initialValue}
          workspaceId={workspaceId}
          buttonLoading={buttonLoading}
        />
      )}

      <DirtyCheckCreateUpdateRules
        isDirtyCheckModelVisible={isDirtyCheckModelVisible}
        setIsDirtyCheckModelVisible={setIsDirtyCheckModelVisible}
        buttonLoading={buttonLoading}
        saveRule={saveRule}
        setCheckedProduct={setCheckedProduct}
        setSelectedProductGlobal={setSelectedProductGlobal}
        setSelectedProductsCategories={setSelectedProductsCategories}
        setSelectedProductSearchRule={setSelectedProductSearchRule}
      />
    </>
  );
};

export default CreateUpdateRules;
