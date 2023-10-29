import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { ActionMeta } from 'react-select';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

import {
  useCountPreviewProduct,
  useGetRuleDetails,
  useListPreviewProduct,
  useListProductCategories,
} from '../../services';
import SiteIcon from '../../../../../images/icons/site-icon';
import SearchIcon from '../../../../../images/icons/search-icon';
import CategoryIcon from '../../../../../images/icons/category-icon';
import { CategoryTab, SearchTab, SiteTab } from './tabs';
import { IListRuleProductDynamicFieldRequest } from '../../../../../types';
import useError from '../../../../../hooks/error';
import {
  openNotificationWithIcon,
  TAG_REGEX_PATTERN,
} from '../../../../../utills';
import { useListEnvironmentsAudience } from '../../../audience/services';

interface IPreviewRules {
  workspaceId: string;
  versionId: string;
  contentModalId: string;
  contentModalDataId: string;
  environmentId: string;
  subMenu?: string;
}

interface IRules {
  description: string[];
  keywords?: string[];
  pin: number;
  ruleTypeEsi: string;
  ruleTitleEti: string;
  enabled: boolean;
  rules: number;
  slot: number;
  sort: number;
  id: string;
}

const usePreviewController = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const {
    workspaceId,
    versionId,
    contentModalId,
    contentModalDataId,
    environmentId,
    subMenu,
  } = useParams<IPreviewRules>();

  const rules = useGetRuleDetails(
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId,
    environmentId
  );

  const [skipCount, setSkipCount] = useState<number>(0);
  const [selectedPage, setSelectedPage] = useState<number>(1);

  const [rulesList, setRulesList] = useState(rules.data);

  const [selectedProductGlobalPreview, setSelectedProductGlobalPreview] =
    useState<{ id: string; text: string; className?: string }[]>([]);
  const [
    selectedProductsCategoriesPreview,
    setSelectedProductsCategoriesPreview,
  ] = useState<
    | {
        label: string;
        value: string;
        id?: string;
        toggle?: boolean;
      }[]
  >(rulesList?.contentModelFieldData.categoriesEslai);
  const [
    selectedProductSearchRulePreview,
    setSelectedProductSearchRulePreview,
  ] = useState<{ id: string; text: string; className?: string }[]>([]);
  const [checkedProduct, setCheckedProduct] = useState<CheckboxValueType[]>([
    'skuEsi',
    'clickRateEfi',
    'revenueEfi',
  ]);
  const [isAllRuleEnabled, setIsAllRuleEnabled] = useState<boolean | undefined>(
    false
  );
  const [domain, setDomain] = useState<string>();

  const listEnvironments = useListEnvironmentsAudience(workspaceId);

  const listProductCategories = useListProductCategories({
    workspaceId,
    subMenu,
    environmentId,
  });

  const listPreviewProduct = useListPreviewProduct(
    workspaceId,
    versionId,
    subMenu
  );

  const countPreviewProduct = useCountPreviewProduct(workspaceId, subMenu);

  const [listPreviewProductData, setListPreviewProductData] = useState(
    listPreviewProduct.data
  );

  useEffect(() => {
    setListPreviewProductData(listPreviewProduct.data);
  }, [listPreviewProduct, listPreviewProduct.data]);

  useError({
    mutation: listPreviewProduct,
    entity: t('common.labels.rule_name'),
  });

  const backToEditor = () => {
    setSelectedProductsCategoriesPreview([]);
    setSelectedProductSearchRulePreview([]);
    setSelectedProductGlobalPreview([]);
    history.push(
      `/workspaces/${workspaceId}/discovery/rules/${subMenu}/create-edit/${versionId}/${contentModalId}/${contentModalDataId}/${environmentId}`
    );
  };

  const onEnableDisableSiteRule = (
    rule: IRules,
    checked: boolean,
    type: string
  ) => {
    const tempListPreviewProduct = JSON.parse(
      JSON.stringify(listPreviewProduct)
    );

    if (type === 'site-rule') {
      for (
        let i = 0;
        i <= tempListPreviewProduct.data?.sitesRule.length - 1;
        i++
      ) {
        if (tempListPreviewProduct.data?.sitesRule[i].id === rule.id) {
          tempListPreviewProduct.data.sitesRule[i].enabled = checked;
        }
      }
    }

    if (type === 'category-rule') {
      for (
        let i = 0;
        i <= tempListPreviewProduct.data?.categoryRule.length - 1;
        i++
      ) {
        if (tempListPreviewProduct.data?.categoryRule[i].id === rule.id) {
          tempListPreviewProduct.data.categoryRule[i].enabled = checked;
        }
      }
    }

    if (type === 'search-rule') {
      for (
        let i = 0;
        i <= tempListPreviewProduct.data?.searchRule.length - 1;
        i++
      ) {
        if (tempListPreviewProduct.data?.searchRule[i].id === rule.id) {
          tempListPreviewProduct.data.searchRule[i].enabled = checked;
        }
      }
    }

    setSkipCount(0);
    setSelectedPage(1);

    setListPreviewProductData(tempListPreviewProduct);

    const dataToPut: IListRuleProductDynamicFieldRequest = {
      environmentsId: environmentId,
      dynamicFieldsData: { ...rulesList?.contentModelFieldData },
    };

    listPreviewProduct.mutate({
      skipCount: 0,
      ruleData: dataToPut,
      previewData: tempListPreviewProduct.data,
    });

    countPreviewProduct.mutate({
      skipCount: 0,
      ruleData: dataToPut,
      previewData: tempListPreviewProduct.data,
    });
  };

  const previewSideBarItems = useMemo(() => {
    return [
      {
        label: (
          <div>
            <span className="display-block">
              <SiteIcon />
            </span>
            {t('common.labels.global')} (
            {listPreviewProduct.data &&
            listPreviewProduct.data.sitesRule &&
            listPreviewProduct.data.sitesRule.length > 0
              ? listPreviewProduct.data.sitesRule.length
              : 0}
            )
          </div>
        ),
        key: t('common.labels.site'),
        children: (
          <SiteTab
            listPreviewProductIsSuccess={listPreviewProduct.isSuccess}
            listPreviewProductIsLoading={listPreviewProduct.isLoading}
            // @ts-ignore
            listPreviewProduct={listPreviewProduct.data}
            t={t}
            onEnableDisableSiteRule={onEnableDisableSiteRule}
          />
        ),
        tabIcon: <SiteIcon />,
      },
      {
        label: (
          <div>
            <span className="display-block">
              <CategoryIcon />
            </span>
            {t('common.labels.category')} (
            {listPreviewProduct.data &&
            listPreviewProduct.data.categoryRule &&
            listPreviewProduct.data.categoryRule.length > 0
              ? listPreviewProduct.data.categoryRule.length
              : 0}
            )
          </div>
        ),
        key: t('common.labels.category'),
        children: (
          <CategoryTab
            listPreviewProductIsSuccess={listPreviewProduct.isSuccess}
            listPreviewProductIsLoading={listPreviewProduct.isLoading}
            // @ts-ignore
            listPreviewProduct={listPreviewProduct.data}
            t={t}
            onEnableDisableSiteRule={onEnableDisableSiteRule}
          />
        ),
        tabIcon: <CategoryIcon />,
      },
      {
        label: (
          <div>
            <span className="display-block">
              <SearchIcon />
            </span>
            {t('common.labels.search')} (
            {listPreviewProduct.data &&
            listPreviewProduct.data.searchRule &&
            listPreviewProduct.data.searchRule.length > 0
              ? listPreviewProduct.data.searchRule.length
              : 0}
            )
          </div>
        ),
        key: t('common.labels.search'),
        children: (
          <SearchTab
            listPreviewProductIsSuccess={listPreviewProduct.isSuccess}
            listPreviewProductIsLoading={listPreviewProduct.isLoading}
            // @ts-ignore
            listPreviewProduct={listPreviewProduct.data}
            t={t}
            onEnableDisableSiteRule={onEnableDisableSiteRule}
          />
        ),
        tabIcon: <SearchIcon />,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, listPreviewProduct.data]);

  const selectedTag = (selectedTag: string, selectedTagId: string) => {
    const newRuleList = rulesList;
    const tempListPreviewProduct = JSON.parse(
      JSON.stringify(listPreviewProduct)
    );

    selectedProductsCategoriesPreview.map((product) => {
      if (product.id === selectedTagId) {
        product.toggle = true;
      } else {
        product.toggle = false;
      }
      return undefined;
    });

    setSelectedProductsCategoriesPreview([
      ...selectedProductsCategoriesPreview,
    ]);

    if (newRuleList?.contentModelFieldData) {
      if (subMenu === 'category-rules') {
        newRuleList.contentModelFieldData.categories = selectedTag;
        newRuleList.contentModelFieldData.categoryId = selectedTagId;
      }
    }

    setRulesList(newRuleList);
    setSelectedPage(1);
    setSkipCount(0);

    const dataToPut: IListRuleProductDynamicFieldRequest = {
      environmentsId: environmentId,
      dynamicFieldsData: { ...rulesList?.contentModelFieldData },
    };

    listPreviewProduct.mutate({
      skipCount: 0,
      ruleData: dataToPut,
      previewData: tempListPreviewProduct.data,
    });

    countPreviewProduct.mutate({
      skipCount: 0,
      ruleData: dataToPut,
      previewData: tempListPreviewProduct.data,
    });
  };

  const handleTagClick = (position: number) => {
    const newRuleList = rulesList;
    const tempListPreviewProduct = JSON.parse(
      JSON.stringify(listPreviewProduct)
    );

    if (newRuleList?.contentModelFieldData) {
      if (subMenu === 'global-rules') {
        selectedProductGlobalPreview.map((globalProduct, index) => {
          if (index === position) {
            globalProduct['className'] = 'custom_tag';
          } else {
            globalProduct['className'] = '';
          }
          return undefined;
        });

        const tempSelectedProductGlobal = selectedProductGlobalPreview.filter(
          (product, index) => index === position
        );

        setSelectedProductGlobalPreview([...selectedProductGlobalPreview]);

        if (tempSelectedProductGlobal.length > 0) {
          newRuleList.contentModelFieldData.globalTermsEslai =
            tempSelectedProductGlobal[
              tempSelectedProductGlobal.length - 1
            ].text;
        } else {
          newRuleList.contentModelFieldData.globalTermsEslai = '';
        }
      } else if (subMenu === 'search-rules') {
        selectedProductSearchRulePreview.map((globalProduct, index) => {
          if (index === position) {
            globalProduct['className'] = 'custom_tag';
          } else {
            globalProduct['className'] = '';
          }
          return undefined;
        });

        const tempSelectedProductSearch =
          selectedProductSearchRulePreview.filter(
            (product, index) => index === position
          );

        setSelectedProductSearchRulePreview([
          ...selectedProductSearchRulePreview,
        ]);

        if (tempSelectedProductSearch.length > 0) {
          newRuleList.contentModelFieldData.searchTerms =
            tempSelectedProductSearch[
              tempSelectedProductSearch.length - 1
            ].text;
        } else {
          newRuleList.contentModelFieldData.searchTerms = '';
        }
      }

      setRulesList(newRuleList);
      setSelectedPage(1);
      setSkipCount(0);

      const dataToPut: IListRuleProductDynamicFieldRequest = {
        environmentsId: environmentId,
        dynamicFieldsData: { ...rulesList?.contentModelFieldData },
      };

      listPreviewProduct.mutate({
        skipCount: 0,
        ruleData: dataToPut,
        previewData: tempListPreviewProduct.data,
      });

      countPreviewProduct.mutate({
        skipCount: 0,
        ruleData: dataToPut,
        previewData: tempListPreviewProduct.data,
      });
    }
  };

  const onProductAddSiteRuleSearchRule = (tags: {
    id: string;
    text: string;
    className?: string;
  }) => {
    if (!listPreviewProduct.isLoading && TAG_REGEX_PATTERN.test(tags.text)) {
      const newRuleList = rulesList;
      const tempListPreviewProduct = JSON.parse(
        JSON.stringify(listPreviewProduct)
      );

      if (newRuleList?.contentModelFieldData.searchTermsEslai === undefined) {
        setSelectedProductSearchRulePreview([]);
      }

      if (newRuleList?.contentModelFieldData) {
        if (subMenu === 'global-rules') {
          const tempSelectedProductGlobalRule = [
            ...selectedProductGlobalPreview,
          ];

          if (tempSelectedProductGlobalRule.length > 0) {
            tempSelectedProductGlobalRule.map(
              (SelectedProductGlobalRule) =>
                (SelectedProductGlobalRule.className = '')
            );
          }

          tags['className'] = 'custom_tag';

          tempSelectedProductGlobalRule.push(tags);

          setSelectedProductGlobalPreview(tempSelectedProductGlobalRule);

          newRuleList.contentModelFieldData.globalTermsEslai = tags.text;
        } else if (subMenu === 'search-rules') {
          const tempSelectProductSearchRule = [
            ...selectedProductSearchRulePreview,
          ];

          if (tempSelectProductSearchRule.length > 0) {
            tempSelectProductSearchRule.map(
              (SelectProductSearchRule) =>
                (SelectProductSearchRule.className = '')
            );
          }

          const searchProducts: string[] = [];

          tags['className'] = 'custom_tag';

          tempSelectProductSearchRule.push(tags);

          newRuleList.contentModelFieldData.searchTerms = tags.text;
          tempSelectProductSearchRule.map((product) =>
            searchProducts.push(product.text)
          );

          newRuleList.contentModelFieldData.searchTermsEslai = searchProducts;
          setSelectedProductSearchRulePreview(tempSelectProductSearchRule);
        }
      }

      setRulesList(newRuleList);
      setSelectedPage(1);
      setSkipCount(0);

      const dataToPut: IListRuleProductDynamicFieldRequest = {
        environmentsId: environmentId,
        dynamicFieldsData: { ...rulesList?.contentModelFieldData },
      };

      listPreviewProduct.mutate({
        skipCount: 0,
        ruleData: dataToPut,
        previewData: tempListPreviewProduct.data,
      });

      countPreviewProduct.mutate({
        skipCount: 0,
        ruleData: dataToPut,
        previewData: tempListPreviewProduct.data,
      });
    } else {
      if (!listPreviewProduct.isLoading) {
        openNotificationWithIcon(
          'error',
          t('common.messages.special_character_not_allow')
        );
      }
    }
  };

  const onProductDeleteSiteRuleSearchRule = (position: number) => {
    if (!listPreviewProduct.isLoading) {
      const newRuleList = rulesList;
      const tempListPreviewProduct = JSON.parse(
        JSON.stringify(listPreviewProduct)
      );

      if (newRuleList?.contentModelFieldData) {
        if (subMenu === 'global-rules') {
          const tempSelectedProductGlobal = selectedProductGlobalPreview.filter(
            (product, index) => index !== position
          );

          if (tempSelectedProductGlobal.length > 0) {
            newRuleList.contentModelFieldData.globalTermsEslai =
              tempSelectedProductGlobal[
                tempSelectedProductGlobal.length - 1
              ].text;

            tempSelectedProductGlobal.map((globalProduct, index) => {
              if (index === tempSelectedProductGlobal.length - 1) {
                globalProduct.className = 'custom_tag';
              } else {
                globalProduct.className = '';
              }
              return undefined;
            });

            setSelectedProductGlobalPreview(tempSelectedProductGlobal);
          } else {
            newRuleList.contentModelFieldData.globalTermsEslai = '';
            setSelectedProductGlobalPreview([]);
          }
        } else if (subMenu === 'search-rules') {
          const tempSelectedProductSearch =
            selectedProductSearchRulePreview.filter(
              (product, index) => index !== position
            );

          if (tempSelectedProductSearch.length > 0) {
            const searchProducts: string[] = [];
            newRuleList.contentModelFieldData.searchTerms =
              tempSelectedProductSearch[
                tempSelectedProductSearch.length - 1
              ].text;

            tempSelectedProductSearch.map((searchProduct, index) => {
              if (index === tempSelectedProductSearch.length - 1) {
                searchProduct.className = 'custom_tag';
              } else {
                searchProduct.className = '';
              }
              return undefined;
            });

            tempSelectedProductSearch.map((product) =>
              searchProducts.push(product.text)
            );

            newRuleList.contentModelFieldData.searchTermsEslai = searchProducts;
            setSelectedProductSearchRulePreview(tempSelectedProductSearch);
          } else {
            newRuleList.contentModelFieldData.searchTerms = '';
            newRuleList.contentModelFieldData.searchTermsEslai = [];
            setSelectedProductSearchRulePreview([]);
          }
        }

        setRulesList(newRuleList);
        setSelectedPage(1);
        setSkipCount(0);

        const dataToPut: IListRuleProductDynamicFieldRequest = {
          environmentsId: environmentId,
          dynamicFieldsData: { ...rulesList?.contentModelFieldData },
        };

        listPreviewProduct.mutate({
          skipCount: 0,
          ruleData: dataToPut,
          previewData: tempListPreviewProduct.data,
        });

        countPreviewProduct.mutate({
          skipCount: 0,
          ruleData: dataToPut,
          previewData: tempListPreviewProduct.data,
        });
      }
    }
  };

  const onProductChangeCategory = (
    products: { label: string; value: string; id?: string; toggle?: boolean }[],
    actionMeta: ActionMeta<{
      label: string;
      value: string;
      id?: string;
      toggle?: boolean;
    }>
  ) => {
    if (!listPreviewProduct.isLoading) {
      if (actionMeta.action === 'remove-value') {
        const newRuleList = rulesList;
        const tempListPreviewProduct = JSON.parse(
          JSON.stringify(listPreviewProduct)
        );

        const categoryProducts: string[] = [];
        const categoryProductsIds: string[] = [];

        const tempSelectedProductCategories =
          selectedProductsCategoriesPreview.filter(
            (product) => product.id !== actionMeta.removedValue.id
          );

        setSelectedProductsCategoriesPreview([]);

        const tempProducts: {
          label: string;
          value: string;
          id?: string;
          toggle?: boolean;
        }[] = [];

        for (let i = 0; i <= tempSelectedProductCategories.length - 1; i++) {
          if (i === tempSelectedProductCategories.length - 1) {
            tempSelectedProductCategories[i]['toggle'] = true;
            tempProducts.push(tempSelectedProductCategories[i]);
          } else {
            tempSelectedProductCategories[i]['toggle'] = false;
            tempProducts.push(tempSelectedProductCategories[i]);
          }
        }

        setSelectedProductsCategoriesPreview([...tempProducts]);

        for (let i = 0; i <= tempProducts.length - 1; i++) {
          // @ts-ignore
          categoryProductsIds.push(tempProducts[i].id);
          categoryProducts.push(tempProducts[i].value);
        }

        if (subMenu === 'category-rules') {
          if (newRuleList?.contentModelFieldData) {
            newRuleList.contentModelFieldData.categoriesEslai =
              categoryProducts;
            newRuleList.contentModelFieldData.categoryId =
              categoryProductsIds[categoryProductsIds.length - 1];
            newRuleList.contentModelFieldData.categories =
              categoryProducts[categoryProducts.length - 1];
            newRuleList.contentModelFieldData.categoryIdEsai =
              categoryProductsIds;
          }
        }

        setRulesList(newRuleList);
        setSelectedPage(1);
        setSkipCount(0);

        const dataToPut: IListRuleProductDynamicFieldRequest = {
          environmentsId: environmentId,
          dynamicFieldsData: { ...rulesList?.contentModelFieldData },
        };

        listPreviewProduct.mutate({
          skipCount: 0,
          ruleData: dataToPut,
          previewData: tempListPreviewProduct.data,
        });

        countPreviewProduct.mutate({
          skipCount: 0,
          ruleData: dataToPut,
          previewData: tempListPreviewProduct.data,
        });
      } else {
        const newRuleList = rulesList;
        const tempListPreviewProduct = JSON.parse(
          JSON.stringify(listPreviewProduct)
        );

        const categoryProducts: string[] = [];
        const categoryProductsIds: string[] = [];

        setSelectedProductsCategoriesPreview([]);

        const tempProducts: {
          label: string;
          value: string;
          id?: string;
          toggle?: boolean;
        }[] = [];

        products.map((product, index) => {
          if (index === products.length - 1) {
            product['toggle'] = true;
            tempProducts.push(product);
          } else {
            product['toggle'] = false;
            tempProducts.push(product);
          }
          return undefined;
        });

        setSelectedProductsCategoriesPreview([...tempProducts]);

        tempProducts?.map((product) => {
          // @ts-ignore
          categoryProductsIds.push(product.id);
          categoryProducts.push(product.value);
          return true;
        });

        if (subMenu === 'category-rules') {
          if (newRuleList?.contentModelFieldData) {
            newRuleList.contentModelFieldData.categoriesEslai =
              categoryProducts;
            newRuleList.contentModelFieldData.categoryId =
              categoryProductsIds[categoryProductsIds.length - 1];
            newRuleList.contentModelFieldData.categories =
              categoryProducts[categoryProducts.length - 1];
            newRuleList.contentModelFieldData.categoryIdEsai =
              categoryProductsIds;
          }
        }

        setRulesList(newRuleList);
        setSelectedPage(1);
        setSkipCount(0);

        const dataToPut: IListRuleProductDynamicFieldRequest = {
          environmentsId: environmentId,
          dynamicFieldsData: { ...rulesList?.contentModelFieldData },
        };

        listPreviewProduct.mutate({
          skipCount: 0,
          ruleData: dataToPut,
          previewData: tempListPreviewProduct.data,
        });

        countPreviewProduct.mutate({
          skipCount: 0,
          ruleData: dataToPut,
          previewData: tempListPreviewProduct.data,
        });
      }
    }
  };

  const onEnableDisableExternalAffectingRules = (checked: boolean) => {
    const tempListPreviewProduct = JSON.parse(
      JSON.stringify(listPreviewProduct)
    );

    if (subMenu === 'category-rules') {
      if (tempListPreviewProduct.data.sitesRule.length > 0) {
        for (
          let i = 0;
          i <= tempListPreviewProduct.data?.sitesRule.length - 1;
          i++
        ) {
          tempListPreviewProduct.data.sitesRule[i].enabled = checked;
        }
      }

      if (tempListPreviewProduct.data.categoryRule.length > 0) {
        for (
          let i = 0;
          i <= tempListPreviewProduct.data?.categoryRule.length - 1;
          i++
        ) {
          if (tempListPreviewProduct.data.categoryRule[i].default) {
            tempListPreviewProduct.data.categoryRule[i].default = true;
            tempListPreviewProduct.data.categoryRule[i].enabled = true;
          } else {
            tempListPreviewProduct.data.categoryRule[i].enabled = checked;
          }
        }
      }
    }

    if (subMenu === 'search-rules') {
      if (tempListPreviewProduct.data.sitesRule.length > 0) {
        for (
          let i = 0;
          i <= tempListPreviewProduct.data?.sitesRule.length - 1;
          i++
        ) {
          tempListPreviewProduct.data.sitesRule[i].enabled = checked;
        }
      }

      if (tempListPreviewProduct.data?.searchRule.length > 0) {
        for (
          let i = 0;
          i <= tempListPreviewProduct.data?.searchRule.length - 1;
          i++
        ) {
          if (tempListPreviewProduct.data.searchRule[i].default) {
            tempListPreviewProduct.data.searchRule[i].default = true;
            tempListPreviewProduct.data.searchRule[i].enabled = true;
          } else {
            tempListPreviewProduct.data.searchRule[i].enabled = checked;
          }
        }
      }
    }

    if (subMenu === 'global-rules') {
      if (tempListPreviewProduct.data.sitesRule.length > 0) {
        for (
          let i = 0;
          i <= tempListPreviewProduct.data?.sitesRule.length - 1;
          i++
        ) {
          if (tempListPreviewProduct.data.sitesRule[i].default) {
            tempListPreviewProduct.data.sitesRule[i].default = true;
            tempListPreviewProduct.data.sitesRule[i].enabled = true;
          } else {
            tempListPreviewProduct.data.sitesRule[i].enabled = checked;
          }
        }
      }

      if (tempListPreviewProduct.data?.searchRule.length > 0) {
        for (
          let i = 0;
          i <= tempListPreviewProduct.data?.searchRule.length - 1;
          i++
        ) {
          tempListPreviewProduct.data.searchRule[i].enabled = checked;
        }
      }
    }

    const dataToPut: IListRuleProductDynamicFieldRequest = {
      environmentsId: environmentId,
      dynamicFieldsData: { ...rulesList?.contentModelFieldData },
    };

    setIsAllRuleEnabled(checked);
    setSkipCount(0);
    setSelectedPage(1);

    listPreviewProduct.mutate({
      skipCount: 0,
      ruleData: dataToPut,
      previewData: tempListPreviewProduct.data,
    });

    countPreviewProduct.mutate({
      skipCount: 0,
      ruleData: dataToPut,
      previewData: tempListPreviewProduct.data,
    });
  };

  const onPageChange = (page: number, pageSize: number) => {
    setSkipCount((page - 1) * pageSize);
    setSelectedPage(page);

    const tempListPreviewProduct = JSON.parse(
      JSON.stringify(listPreviewProductData)
    );

    const dataToPut: IListRuleProductDynamicFieldRequest = {
      environmentsId: environmentId,
      dynamicFieldsData: { ...rulesList?.contentModelFieldData },
    };

    listProductCategories.refetch();
    listPreviewProduct.mutate({
      skipCount: (page - 1) * pageSize,
      ruleData: dataToPut,
      previewData: tempListPreviewProduct,
    });
  };

  useEffect(() => {
    if (rulesList && rulesList.contentModelFieldData) {
      if (
        rulesList?.contentModelFieldData.searchTermsEslai === undefined ||
        typeof rulesList?.contentModelFieldData.searchTermsEslai[0] === 'string'
      ) {
        setSelectedProductSearchRulePreview([]);
      } else {
        setSelectedProductSearchRulePreview(
          rulesList?.contentModelFieldData.searchTermsEslai
        );
      }

      if (
        rulesList?.contentModelFieldData.categoriesEslai === undefined ||
        typeof rulesList?.contentModelFieldData.categoriesEslai[0] === 'string'
      ) {
        setSelectedProductsCategoriesPreview([]);
      } else {
        setSelectedProductsCategoriesPreview(
          rulesList?.contentModelFieldData.categoriesEslai
        );
      }

      const dataToPut: IListRuleProductDynamicFieldRequest = {
        environmentsId: environmentId,
        dynamicFieldsData: { ...rulesList?.contentModelFieldData },
      };

      listProductCategories.refetch();
      listPreviewProduct.mutate({
        skipCount: 0,
        ruleData: dataToPut,
        previewData:
          subMenu === 'global-rules'
            ? { sitesRule: [{ id: versionId, enabled: true, default: true }] }
            : subMenu === 'search-rules'
            ? { searchRule: [{ id: versionId, enabled: true, default: true }] }
            : subMenu === 'category-rules'
            ? {
                categoryRule: [{ id: versionId, enabled: true, default: true }],
              }
            : {},
      });
      countPreviewProduct.mutate({
        skipCount: 0,
        ruleData: dataToPut,
        previewData:
          subMenu === 'global-rules'
            ? { sitesRule: [{ id: versionId, enabled: true, default: true }] }
            : subMenu === 'search-rules'
            ? { searchRule: [{ id: versionId, enabled: true, default: true }] }
            : subMenu === 'category-rules'
            ? {
                categoryRule: [{ id: versionId, enabled: true, default: true }],
              }
            : {},
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rulesList]);

  useEffect(() => {
    if (rules && rules.data) {
      setRulesList(rules.data);
    }
  }, [rules.data, rules]);

  useEffect(() => {
    if (listPreviewProduct.isSuccess && listPreviewProduct.data) {
      setIsAllRuleEnabled(listPreviewProduct.data?.isAllRuleEnabled);
    }
  }, [listPreviewProduct.data, listPreviewProduct]);

  useEffect(() => {
    rules.refetch();
    listProductCategories.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subMenu, workspaceId, versionId, contentModalId, contentModalDataId]);

  useEffect(() => {
    if (listPreviewProduct.isError) {
      openNotificationWithIcon('error', 'error while creating rule');
    }
  }, [listPreviewProduct.isError]);

  useEffect(() => {
    if (listEnvironments.isSuccess && listEnvironments.data) {
      listEnvironments.data.forEach((environment) => {
        if (environment.id === environmentId) {
          if (environment.customDomain) {
            setDomain(environment.customDomain);
          } else if (environment?.cacheDomain) {
            setDomain(environment.cacheDomain);
          } else {
            setDomain(environment.workspaceDomain);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listEnvironments.isSuccess, listEnvironments.data, environmentId]);

  return {
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
    selectedPage,
    listPreviewProduct,
    skipCount,
    setCheckedProduct,
    checkedProduct,
    productCount: countPreviewProduct.data,
    onEnableDisableExternalAffectingRules,
    isAllRuleEnabled,
    domain,
    onPageChange,
    workspaceId,
  };
};

export default usePreviewController;
