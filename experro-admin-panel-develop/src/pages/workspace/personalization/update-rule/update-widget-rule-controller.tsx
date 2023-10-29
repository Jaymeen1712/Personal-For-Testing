import React, { useEffect, useState } from 'react';
import useWidgetRuleDetails from '../../../../apis/Personalization/rule/details';
import { useHistory, useParams } from 'react-router-dom';
import useListAlgorithm from '../../../../apis/Personalization/algoritham/list';
import useListWidgetRuleProduct from '../../../../apis/Personalization/widget-search';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import useUpdateWidgetRule from '../../../../apis/Personalization/rule/update';
import { openNotificationWithIcon } from '../../../../utills';
import { useTranslation } from 'react-i18next';
import useListWidgetRule from '../../../../apis/Personalization/rule/list';
import moment from 'moment';
import useCountProduct from './product-list/count';

const useUpdateWidgetRuleController = (
  selectedWidget: { id: string; type?: string | undefined } | undefined
) => {
  const { t } = useTranslation();
  const history = useHistory();

  const {
    workspaceId,
    versionId,
    contentModalId,
    contentModalDataId,
    environmentId,
    subMenu,
  } = useParams<{
    workspaceId: string;
    versionId: string;
    contentModalId: string;
    contentModalDataId: string;
    environmentId: string;
    subMenu: string;
  }>();

  const [isFallback, setFallback] = useState(false);

  //product listing states  =================>>>>>>>>>>>>>>>>><<<<<<<<<<<==================

  const [skipCount, setSkipCount] = useState<number>(0);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [checkedProduct, setCheckedProduct] = useState<CheckboxValueType[]>([
    'skuEsi',
    'calculatedPriceEfi',
  ]);
  const [selectedKeyword, setSelectedKeyword] = useState<
    { id: string; text: string; className?: string }[]
  >([]);
  const [pageURL, setPageURL] = useState('');
  const [primaryId, setPrimaryId] = useState('');
  const [secondaryId, setSecondaryId] = useState('');
  //eslint-disable-next-line
  const [globalData, setGlobalData] = useState<any>();
  const [startDate, setStartDate] = useState<string | undefined>('');
  const [endDate, setEndDate] = useState<string | undefined>('');
  const [isCustomMerchandising, setCustomMerchandising] = useState(false);

  // =================>>>>>>>>>>>>>>>>><<<<<<<<<<<==================

  const widgetRulesDetails = useWidgetRuleDetails(
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId,
    environmentId
  );

  const updateWidgetRule = useUpdateWidgetRule(
    workspaceId,
    contentModalId,
    contentModalDataId
  );

  const productList = useListWidgetRuleProduct(workspaceId, skipCount);
  const countProduct = useCountProduct(workspaceId, skipCount, subMenu);

  const algorithmList = useListAlgorithm(workspaceId, environmentId);

  const listWidgetRule = useListWidgetRule(subMenu, workspaceId, environmentId);

  const [keywordData, setKeywordData] = useState(widgetRulesDetails?.data);
  const [ruleData, setRuleData] = useState(widgetRulesDetails.data);
  const [globalConflict, setGlobalConflict] = useState(false);
  const [isDateConflict, setIsDateConflict] = useState(false);

  //eslint-disable-next-line
  const onSetRuleData = (data: any) => {
    setRuleData({ ...data });
  };

  const onChangePrimaryId = (id: string) => {
    setPrimaryId(id);
  };

  const onChangeSecondaryId = (id: string) => {
    setSecondaryId(id);
  };

  const onSetStartDate = (val: string) => {
    setStartDate(val);
  };

  const onSetEndDate = (val: string) => {
    setEndDate(val);
  };

  const onSetCustomMerchandising = (val: boolean) => {
    setCustomMerchandising(val);
  };

  const onChangeFallBack = (val: boolean) => {
    if (val) {
      setFallback(true);
    } else {
      setFallback(false);
    }
  };

  const onCustomAlgorithmChange = (data: string, index: number) => {
    if (ruleData) {
      if (!ruleData?.contentModelFieldData?.customPrimaryAlgorithmEj) {
        ruleData.contentModelFieldData.customPrimaryAlgorithmEj = [];
      }
    }

    if (ruleData?.contentModelFieldData.customPrimaryAlgorithmEj) {
      ruleData.contentModelFieldData.customPrimaryAlgorithmEj[index] = {
        ...(ruleData.contentModelFieldData.customPrimaryAlgorithmEj &&
          ruleData.contentModelFieldData.customPrimaryAlgorithmEj[index]),
        algorithmInternalNameEsi: JSON.parse(data).internalName,
        algorithmApiUrlEsi: JSON.parse(data).algorithmApiUrl,
        isMerchandisingEbi: isCustomMerchandising,
      };
    }

    //eslint-disable-next-line
    const updateValues: any = {
      environmentsId: environmentId,
      dynamicFieldsData: { ...ruleData?.contentModelFieldData },
    };

    if (
      updateValues?.dynamicFieldsData.customPrimaryAlgorithmEj[index].start &&
      updateValues?.dynamicFieldsData.customPrimaryAlgorithmEj[index].end
    ) {
      productList.mutate(updateValues);
      countProduct.mutate(updateValues);
    }
  };
  //eslint-disable-next-line
  const onChangeStartSlot = (index: number, startSlot: any) => {
    if (ruleData?.contentModelFieldData.customPrimaryAlgorithmEj && startSlot) {
      ruleData.contentModelFieldData.customPrimaryAlgorithmEj[index] = {
        ...(ruleData?.contentModelFieldData.customPrimaryAlgorithmEj &&
          ruleData?.contentModelFieldData.customPrimaryAlgorithmEj[index]),
        start: startSlot,
      };
    }

    // eslint-disable-next-line
    const updateValues: any = {
      environmentsId: environmentId,
      dynamicFieldsData: { ...ruleData?.contentModelFieldData },
    };

    if (
      updateValues?.dynamicFieldsData.customPrimaryAlgorithmEj[index]
        .algorithmInternalNameEsi &&
      updateValues?.dynamicFieldsData.customPrimaryAlgorithmEj[index].end
    ) {
      productList.mutate(updateValues);
      countProduct.mutate(updateValues);
    }
  };
  //eslint-disable-next-line
  const onChangeEndSlot = (index: number, endSlot: any) => {
    // const newRuleList = ruleData;

    if (ruleData?.contentModelFieldData.customPrimaryAlgorithmEj && endSlot) {
      ruleData.contentModelFieldData.customPrimaryAlgorithmEj[index] = {
        ...(ruleData?.contentModelFieldData.customPrimaryAlgorithmEj &&
          ruleData?.contentModelFieldData.customPrimaryAlgorithmEj[index]),
        end: endSlot,
      };
    }

    //eslint-disable-next-line
    const updateValues: any = {
      environmentsId: environmentId,
      dynamicFieldsData: { ...ruleData?.contentModelFieldData },
    };

    if (
      updateValues?.dynamicFieldsData.customPrimaryAlgorithmEj[index]
        .algorithmInternalNameEsi &&
      updateValues?.dynamicFieldsData.customPrimaryAlgorithmEj[index].start
    ) {
      productList.mutate(updateValues);
      countProduct.mutate(updateValues);
    }
  };

  useEffect(() => {
    const newRuleList = ruleData;
    if (newRuleList?.contentModelFieldData) {
      newRuleList.contentModelFieldData.isFallbackEbi = isFallback;
    }
    onSetRuleData(newRuleList);
    // eslint-disable-next-line
  }, [isFallback]);

  const onAddKeyWord = (tags: {
    id: string;
    text: string;
    className?: string;
  }) => {
    const newRuleList = ruleData;
    const tempKeyword = [...selectedKeyword];
    if (newRuleList) {
      if (tempKeyword.length > 0) {
        tempKeyword[tempKeyword.length - 1].className = '';
      }

      const searchProducts: string[] = [];

      tags['className'] = 'custom_tag';

      tempKeyword.push(tags);

      newRuleList.contentModelFieldData.keywordEsai = tags.text;
      tempKeyword.map((product) => searchProducts.push(product.text));

      newRuleList.contentModelFieldData.keywordEsai = searchProducts;
      setSelectedKeyword(tempKeyword);
    }
    setKeywordData(newRuleList);
    setSkipCount(0);
  };

  const onDeleteKeyWord = (position: number) => {
    const newRuleList = ruleData;
    if (newRuleList?.contentModelFieldData) {
      const tempSelectedKeyword = selectedKeyword.filter(
        (product, index) => index !== position
      );

      if (tempSelectedKeyword.length > 0) {
        const globalProduct: string[] = [];

        newRuleList.contentModelFieldData.keywordEsai =
          tempSelectedKeyword[tempSelectedKeyword.length - 1].text;

        tempSelectedKeyword.map((globalProduct, index) => {
          if (index === tempSelectedKeyword.length - 1) {
            globalProduct.className = 'custom_tag';
          } else {
            globalProduct.className = '';
          }
          return undefined;
        });

        tempSelectedKeyword.map((product) => globalProduct.push(product.text));

        newRuleList.contentModelFieldData.keywordEsai = globalProduct;
        setSelectedKeyword(tempSelectedKeyword);
      } else {
        newRuleList.contentModelFieldData.keywordEsai = '';
        setSelectedKeyword([]);
      }

      setKeywordData(newRuleList);
    }
  };

  useEffect(() => {
    if (ruleData?.contentModelFieldData?.keywordEsai !== undefined) {
      setSelectedKeyword(ruleData?.contentModelFieldData?.keywordEsai);
    }
    if (ruleData?.contentModelFieldData.isFallbackEbi) {
      onChangeFallBack(ruleData.contentModelFieldData.isFallbackEbi);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruleData]);

  const onChangePageURL = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    if (event?.target?.value) {
      setPageURL(event?.target?.value);
    }
  };

  useEffect(() => {
    if (pageURL && ruleData) {
      ruleData.contentModelFieldData.pageUrlEsi = pageURL;
    }
  }, [ruleData, pageURL]);

  useEffect(() => {
    if (ruleData?.contentModelFieldData?.pageUrlEsi) {
      setPageURL(ruleData?.contentModelFieldData?.pageUrlEsi);
    }
  }, [ruleData]);

  useEffect(() => {
    setRuleData(widgetRulesDetails.data);
  }, [widgetRulesDetails.isSuccess, widgetRulesDetails.data]);

  useEffect(() => {
    if (widgetRulesDetails.isSuccess) {
      const newRuleList = widgetRulesDetails.data;

      const bestSeller = algorithmList?.data?.find(
        (item) => item.internalName === 'best_seller' && item.isSystemGenerated
      );

      if (
        newRuleList?.contentModelFieldData?.isSystemGeneratedEbi &&
        algorithmList?.data
      ) {
        algorithmList?.data?.map((algorithm) => {
          if (
            algorithm.internalName ===
            newRuleList?.contentModelFieldData?.algorithmInternalNameEsi
          ) {
            newRuleList.contentModelFieldData.primaryAlgorithmEj = {
              algorithmInternalNameEsi: algorithm.internalName,
              algorithmApiUrlEsi: algorithm.algorithmApiUrl,
            };
          }
          return '';
        });
      } else {
        if (
          !newRuleList?.contentModelFieldData?.isSystemGeneratedEbi &&
          newRuleList?.contentModelFieldData?.primaryAlgorithmEj ===
            undefined &&
          newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj ===
            undefined
        ) {
          // eslint-disable-next-line
          newRuleList!.contentModelFieldData.primaryAlgorithmEj = {
            algorithmInternalNameEsi: bestSeller?.internalName,
            algorithmApiUrlEsi: bestSeller?.algorithmApiUrl,
          };
        }
      }
      onSetRuleData(newRuleList);
    }
  }, [
    widgetRulesDetails.isSuccess,
    widgetRulesDetails.data,
    algorithmList?.data,
  ]);

  const onSaveWidgetRulData = () => {
    const searchValues: string[] = [];

    const newRuleList = ruleData;

    if (newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj) {
      newRuleList.contentModelFieldData.customPrimaryAlgorithmEj =
        newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj?.filter(
          // eslint-disable-next-line
          (item: any) => item.algorithmInternalNameEsi !== ''
        );
    }

    onSetRuleData(newRuleList);

    // eslint-disable-next-line
    const updateValues: any = {
      versionId: versionId,
      dynamicFieldsData: { ...ruleData?.contentModelFieldData },
    };

    if (keywordData?.contentModelFieldData?.keywordEsai) {
      keywordData?.contentModelFieldData?.keywordEsai.forEach(
        // eslint-disable-next-line
        (search: any) => {
          if (typeof search !== 'string') {
            searchValues.push(search['text']);
          } else {
            searchValues.push(search);
          }
        }
      );
      updateValues.dynamicFieldsData.keywordEsai = searchValues;
    }

    updateWidgetRule.mutate(updateValues);
  };

  const onBackToList = () => {
    history.push(
      `/workspaces/${workspaceId}/personalization/${selectedWidget?.type}/${selectedWidget?.id}/list-records`
    );
  };

  useEffect(() => {
    if (updateWidgetRule.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.entity_added_successfully', {
          entity: t('common.labels.rule'),
        })
      );
      onBackToList();
    }
    // eslint-disable-next-line
  }, [updateWidgetRule.isSuccess]);

  useEffect(() => {
    if (ruleData) {
      //eslint-disable-next-line
      const updateValues: any = {
        environmentsId: environmentId,
        dynamicFieldsData: { ...ruleData?.contentModelFieldData },
      };

      productList.mutate(updateValues);
      countProduct.mutate(updateValues);
    }
    //eslint-disable-next-line
  }, [ruleData, skipCount]);

  const [keywordExist, setKeywordExist] = useState(false);
  const [pageRuleExist, setPageRuleExist] = useState(false);

  useEffect(() => {
    if (listWidgetRule.data && ruleData) {
      //eslint-disable-next-line
      const globalArray: any = [];
      listWidgetRule?.data?.forEach((rule) => {
        if (rule.widgetRuleApplicableOnEsi === 'global') {
          globalArray.push(rule);
          setGlobalData([...globalArray]);
        }
      });
    }
    // eslint-disable-next-line
  }, [listWidgetRule?.data]);

  useEffect(() => {
    if (keywordData && listWidgetRule?.data) {
      for (const rule of listWidgetRule?.data) {
        const tempKeyword = rule?.keywordEsai?.some((item) =>
          keywordData?.contentModelFieldData?.keywordEsai.includes(item)
        );
        if (tempKeyword) {
          setKeywordExist(true);
          break;
        } else {
          setKeywordExist(false);
        }
      }
    }
  }, [listWidgetRule?.data, keywordData, selectedKeyword]);

  useEffect(() => {
    if (ruleData) {
      listWidgetRule?.data?.forEach((item) => {
        if (item.pageUrlEsi) {
          if (item.pageUrlEsi === ruleData?.contentModelFieldData?.pageUrlEsi) {
            setPageRuleExist(true);
          } else {
            setPageRuleExist(false);
          }
        }
      });
    }
  }, [pageURL, ruleData, listWidgetRule?.data]);

  useEffect(() => {
    if (globalData && globalData?.length > 1) {
      setGlobalConflict(true);
    }
  }, [globalData]);

  useEffect(() => {
    if (startDate && endDate) {
      // eslint-disable-next-line
      listWidgetRule.data?.map((rule: any) => {
        if (widgetRulesDetails?.data?.contentModelData?.id !== rule.id) {
          if (
            widgetRulesDetails?.data?.contentModelFieldData
              ?.widgetRuleApplicableOnEsi === rule.widgetRuleApplicableOnEsi
          ) {
            if (rule.startDateEdti && rule.endDateEdti) {
              const start = Date.parse(startDate);
              const end = Date.parse(endDate);
              const ruleStart = Date.parse(rule?.startDateEdti);
              const ruleEnd = Date.parse(rule?.endDateEdti);
              const startCompare = moment(start).isBetween(ruleStart, ruleEnd);
              const endCompare = moment(end).isBetween(ruleStart, ruleEnd);

              const startCompareStartSame = moment(start).isSame(ruleStart);
              const startCompareEndSame = moment(start).isSame(ruleEnd);
              const endCompareStartSame = moment(end).isSame(ruleStart);
              const endCompareEndSame = moment(end).isSame(ruleStart);

              const ruleStartCompare = moment(ruleStart).isBetween(start, end);
              const ruleEndCompare = moment(ruleEnd).isBetween(start, end);

              if (
                startCompare ||
                endCompare ||
                ruleStartCompare ||
                ruleEndCompare ||
                startCompareStartSame ||
                startCompareEndSame ||
                endCompareStartSame ||
                endCompareEndSame
              ) {
                setIsDateConflict(true);
              } else {
                setIsDateConflict(false);
              }
            }
          }
        }
      });
    }
    //eslint-disable-next-line
  }, [startDate, endDate]);

  return {
    t,
    ruleData,
    primaryId,
    secondaryId,
    startDate,
    endDate,
    productList,
    environmentId,
    algorithmList,
    globalConflict,
    isDateConflict,
    keywordExist,
    pageRuleExist,
    pageURL,
    skipCount,
    selectedKeyword,
    checkedProduct,
    selectedPage,
    setSkipCount,
    setSelectedPage,
    setCheckedProduct,
    isFallback,
    onSetRuleData,
    onSetStartDate,
    onSetEndDate,
    onChangeFallBack,
    onAddKeyWord,
    onDeleteKeyWord,
    onChangePageURL,
    onSaveWidgetRulData,
    onChangePrimaryId,
    onChangeSecondaryId,
    onSetCustomMerchandising,
    onCustomAlgorithmChange,
    onChangeStartSlot,
    onChangeEndSlot,
    onBackToList,
    isSuccess: widgetRulesDetails?.isSuccess,
    productCount: countProduct.data,
    isMainSaveLoading: updateWidgetRule?.isLoading,
  };
};

export default useUpdateWidgetRuleController;
