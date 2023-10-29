import HeaderWidgetRule from './header/header-widget-rule';
import useUpdateWidgetRuleController from './update-widget-rule-controller';
import { Alert, Layout } from 'antd';
import PrimaryAlgorithm from './algorithm/primary-algorithm';
import SecondaryAlgorithm from './algorithm/secondary-algorithm';
import ProductList from '../update-rule/product-list/list';
import React from 'react';

interface IUpdateWidgetRuleNew {
  selectedWidget: { id: string; type?: string | undefined } | undefined;
  isEditRule: boolean;
  onSetEditRule: (val: boolean) => void;
  isAddRuleModalVisible: boolean;
  onAddEditRuleModalVisible: (val: boolean) => void;
}

const UpdateWidgetRule = ({
  selectedWidget,
  isEditRule,
  onSetEditRule,
  isAddRuleModalVisible,
  onAddEditRuleModalVisible,
}: IUpdateWidgetRuleNew) => {
  const {
    t,
    ruleData,
    primaryId,
    secondaryId,
    startDate,
    endDate,
    globalConflict,
    keywordExist,
    pageRuleExist,
    isDateConflict,
    productList,
    skipCount,
    checkedProduct,
    selectedKeyword,
    selectedPage,
    setSkipCount,
    setCheckedProduct,
    setSelectedPage,
    environmentId,
    algorithmList,
    isFallback,
    onSetRuleData,
    onChangeFallBack,
    onAddKeyWord,
    onDeleteKeyWord,
    pageURL,
    onChangePageURL,
    onSetStartDate,
    onSetEndDate,
    isSuccess,
    onSaveWidgetRulData,
    onChangeSecondaryId,
    onChangePrimaryId,
    onSetCustomMerchandising,
    onCustomAlgorithmChange,
    onChangeStartSlot,
    onChangeEndSlot,
    onBackToList,
    productCount,
    isMainSaveLoading,
  } = useUpdateWidgetRuleController(selectedWidget);

  return (
    <>
      <Layout>
        <HeaderWidgetRule
          ruleData={ruleData}
          isSuccess={isSuccess}
          isMainSaveLoading={isMainSaveLoading}
          isEditRule={isEditRule}
          isDateConflict={isDateConflict}
          startDate={startDate}
          endDate={endDate}
          onSetStartDate={onSetStartDate}
          onSetEndDate={onSetEndDate}
          onSetEditRule={onSetEditRule}
          selectedWidget={selectedWidget}
          onSetRuleData={onSetRuleData}
          onBackToList={onBackToList}
          isAddRuleModalVisible={isAddRuleModalVisible}
          onAddEditRuleModalVisible={onAddEditRuleModalVisible}
          onSaveWidgetRulData={onSaveWidgetRulData}
        />
        <div className="ant-row merchandising-section personalization-section">
          <div className="merchandising-sidebar">
            <div className="sidebar-top-section">
              <PrimaryAlgorithm
                ruleData={ruleData}
                primaryId={primaryId}
                secondaryId={secondaryId}
                onChangePrimaryId={onChangePrimaryId}
                isSuccess={isSuccess}
                environmentId={environmentId}
                algorithmList={algorithmList}
                onSetRuleData={onSetRuleData}
                onChangeFallBack={onChangeFallBack}
                onSetCustomMerchandising={onSetCustomMerchandising}
                onCustomAlgorithmChange={onCustomAlgorithmChange}
                onChangeStartSlot={onChangeStartSlot}
                onChangeEndSlot={onChangeEndSlot}
              />

              {(isFallback ||
                ruleData?.contentModelFieldData?.isFallbackEbi) && (
                <SecondaryAlgorithm
                  ruleData={ruleData}
                  isSuccess={isSuccess}
                  primaryId={primaryId}
                  secondaryId={secondaryId}
                  onChangeSecondaryId={onChangeSecondaryId}
                  environmentId={environmentId}
                  algorithmList={algorithmList}
                  onSetRuleData={onSetRuleData}
                />
              )}
            </div>
          </div>

          <div className="merchandising-rightbar">
            {globalConflict &&
              !isDateConflict &&
              !startDate &&
              !endDate &&
              ruleData?.contentModelFieldData?.widgetRuleApplicableOnEsi ===
                'global' && (
                <Alert
                  type="warning"
                  message={t('personalization_global_conflict_error')}
                />
              )}

            {keywordExist &&
              !isDateConflict &&
              !startDate &&
              !endDate &&
              ruleData?.contentModelFieldData?.widgetRuleApplicableOnEsi ===
                'keyword' && (
                <Alert
                  type="warning"
                  message={t('personalization_keyword_conflict_error')}
                />
              )}

            {pageRuleExist &&
              !isDateConflict &&
              !startDate &&
              !endDate &&
              ruleData?.contentModelFieldData?.widgetRuleApplicableOnEsi ===
                'page' && (
                <Alert
                  type="warning"
                  message={t('personalization_page_conflict_error')}
                />
              )}

            {isDateConflict && (
              <Alert
                type="error"
                message={
                  ruleData?.contentModelFieldData?.widgetRuleApplicableOnEsi ===
                  'global'
                    ? t(
                        'common.messages.personalization_date_global_conflict_error'
                      )
                    : ruleData?.contentModelFieldData
                        ?.widgetRuleApplicableOnEsi === 'keyword'
                    ? t(
                        'common.messages.personalization_date_keyword_conflict_error'
                      )
                    : ruleData?.contentModelFieldData
                        ?.widgetRuleApplicableOnEsi === 'page'
                    ? t(
                        'common.messages.personalization_date_page_conflict_error'
                      )
                    : ''
                }
              />
            )}

            <ProductList
              isLoading={productList?.isLoading}
              listRuleProducts={productList?.data?.items}
              productCount={productCount}
              setSkipCount={setSkipCount}
              skipCount={skipCount}
              selectedPage={selectedPage}
              setCheckedProduct={setCheckedProduct}
              setSelectedPage={setSelectedPage}
              checkedProduct={checkedProduct}
              listProductIsSuccess={productList.isSuccess}
              listProductIsFetching={productList.isLoading}
              selectedKeyword={selectedKeyword}
              onAddProductName={onAddKeyWord}
              onDeleteProductName={onDeleteKeyWord}
              pageURLValue={pageURL}
              onChangePageURLValue={onChangePageURL}
              ruleType={
                ruleData?.contentModelFieldData?.widgetRuleApplicableOnEsi
              }
            />
          </div>
        </div>
      </Layout>
    </>
  );
};
export default UpdateWidgetRule;
