import { useTranslation } from 'react-i18next';
import { Form, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  createUpdateSiteRuleParams,
  PinEj,
  RulesEj,
  RuleType,
  SlotEj,
  SortEj,
} from '../../../../../../types';
import { customAlphabet } from 'nanoid';
import { ALPHABET } from '../../../../../../utills';
import { useParams } from 'react-router-dom';

const useCustomAlgorithmController = (
  isCustomAlgorithm: boolean,
  // eslint-disable-next-line
  algorithmList: any,
  // eslint-disable-next-line
  ruleData: any,
  // eslint-disable-next-line
  onSetRuleData: (ruleData: any) => void,
  onSetCustomMerchandising: (val: boolean) => void,
  environmentId: string | null
) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const nanoId = customAlphabet(ALPHABET, 12);
  const { workspaceId } = useParams<createUpdateSiteRuleParams>();
  // eslint-disable-next-line
  // eslint-disable-next-line
  const [customIndexArray, setCustomIndexArray] = useState<any>([]);
  const [isDeleteSubRule, setIsDeleteSubRule] = useState(false);
  // eslint-disable-next-line
  const [initialCustomData, setInitialCustomData] = useState<any>([
    {
      algorithmInternalNameEsi: '',
      algorithmApiUrlEsi: '',
      start: '',
      end: '',
      isMerchandisingEbi: false,
    },
  ]);

  /* Custom Algorithm - Merchandising   */

  const onEnableMerchandising = (checked: boolean, index: number) => {
    const newRuleList = ruleData;

    // setCustomIndex(index);
    if (checked) {
      onSetCustomMerchandising(true);
      customIndexArray[index] = true;
      setCustomIndexArray([...customIndexArray]);
    } else {
      onSetCustomMerchandising(false);
      customIndexArray[index] = false;
      setCustomIndexArray([...customIndexArray]);
    }

    if (newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj) {
      // eslint-disable-next-line
      newRuleList!.contentModelFieldData.customPrimaryAlgorithmEj[index] = {
        ...newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj[index],
        isMerchandisingEbi: checked,
      };
    }

    onSetRuleData(newRuleList);
  };

  const onHideSubRuleDelete = () => {
    setIsDeleteSubRule(false);
  };

  /* Merchandising - Custom Algorithm -  Add Rule   */

  const addRule = async (
    // eslint-disable-next-line
    data: SortEj | RulesEj | PinEj | SlotEj | any,
    ruleType: RuleType,
    index: number
  ) => {
    const newRuleList = ruleData;

    if (isCustomAlgorithm && newRuleList) {
      if (!newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj) {
        newRuleList.contentModelFieldData.customPrimaryAlgorithmEj = [];
      }

      if (
        !newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj[index]
          .rulesEj
      ) {
        newRuleList.contentModelFieldData.customPrimaryAlgorithmEj[
          index
        ].rulesEj = [];
      }
      data['id'] = nanoId();
      newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj[index] &&
        newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj[
          index
        ].rulesEj.push(data);
      onSetRuleData(newRuleList);
    }

    message.success(t('common.messages.added_successfully'));
  };

  /* Merchandising - Custom Algorithm -  Edit Rule   */

  const editRule = (
    // eslint-disable-next-line
    data: SortEj | RulesEj | PinEj | SlotEj | any,
    ruleType: RuleType,
    index: number
  ) => {
    const newRuleList = ruleData;

    if (isCustomAlgorithm) {
      const ruleDataIndex =
        newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj &&
        newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj[index][
          `${ruleType}Ej`
          // eslint-disable-next-line
        ]?.findIndex((rule: any) => rule.id === data.id);

      if (ruleDataIndex !== undefined) {
        newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj &&
          newRuleList?.contentModelFieldData.customPrimaryAlgorithmEj[index][
            `${ruleType}Ej`
          ]?.splice(ruleDataIndex, 1);
        newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj &&
          newRuleList?.contentModelFieldData.customPrimaryAlgorithmEj[index][
            `${ruleType}Ej`
          ]?.splice(ruleDataIndex, 0, data);
      }

      onSetRuleData(newRuleList);

      message.success(t('common.messages.edited_successfully'));
    }
  };

  /* Merchandising - Custom Algorithm -  Delete Rule   */

  const deleteRule = (ruleType: RuleType, index: number, id?: string) => {
    const newRuleList = ruleData;
    if (isCustomAlgorithm) {
      const ruleDataIndex =
        newRuleList?.contentModelFieldData.customPrimaryAlgorithmEj &&
        newRuleList?.contentModelFieldData.customPrimaryAlgorithmEj[index][
          `${ruleType}Ej`
          // eslint-disable-next-line
        ]?.findIndex((rule: any) => rule.id === id);
      if (ruleDataIndex !== undefined) {
        newRuleList?.contentModelFieldData.customPrimaryAlgorithmEj &&
          newRuleList?.contentModelFieldData.customPrimaryAlgorithmEj[index][
            `${ruleType}Ej`
          ]?.splice(ruleDataIndex, 1);
      }
      setIsDeleteSubRule(false);
      onSetRuleData(newRuleList);

      message.success(t('common.messages.removed_successfully'));
    }
  };

  const onDeleteCustomAlgorithm = (index: number) => {
    initialCustomData.splice(index, 1);
    setInitialCustomData([...initialCustomData]);

    const newRuleList = ruleData;
    if (newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj) {
      newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj.splice(
        index,
        1
      );
      onSetRuleData(newRuleList);
      form.setFieldsValue({
        conditions: ruleData?.contentModelFieldData?.customPrimaryAlgorithmEj,
      });
    }
  };
  useEffect(() => {
    if (
      ruleData?.contentModelFieldData?.customPrimaryAlgorithmEj &&
      algorithmList?.data
    ) {
      const temp: {
        algorithmInternalNameEsi: string | undefined;
        start: string;
        end: string;
        isMerchandisingEbi: boolean;
      }[] = [];

      if (
        ruleData?.contentModelFieldData?.customPrimaryAlgorithmEj.length > 0
      ) {
        ruleData?.contentModelFieldData?.customPrimaryAlgorithmEj.map(
          // eslint-disable-next-line
          (item: any, index: number) => {
            algorithmList?.data?.find(
              (primary: { internalName: string; name: string }) => {
                if (primary.internalName === item.algorithmInternalNameEsi) {
                  temp.push({
                    algorithmInternalNameEsi: primary.name,
                    start: item.start,
                    end: item.end,
                    isMerchandisingEbi: item.isMerchandisingEbi,
                  });
                  customIndexArray[index] = item.isMerchandisingEbi;
                }
                return '';
              }
            );
          }
        );
        setInitialCustomData([...temp]);
      } else {
        setInitialCustomData([
          {
            algorithmName: '',
            start: '',
            end: '',
          },
        ]);
      }
      form.setFieldsValue({
        conditions: [...temp],
      });
    }
    // eslint-disable-next-line
  }, [algorithmList?.data]);

  const onAddClick = () => {
    if (ruleData) {
      ruleData?.contentModelFieldData?.customPrimaryAlgorithmEj.push({
        algorithmInternalNameEsi: '',
        start: '',
        end: '',
        isMerchandisingEbi: false,
      });
      onSetRuleData(ruleData);
      form.setFieldsValue({
        conditions: ruleData?.contentModelFieldData?.customPrimaryAlgorithmEj,
      });
    }
  };

  useEffect(() => {
    if (
      isCustomAlgorithm &&
      ruleData?.contentModelFieldData?.customPrimaryAlgorithmEj === undefined
    ) {
      ruleData.contentModelFieldData.customPrimaryAlgorithmEj = [
        {
          algorithmInternalNameEsi: '',
          algorithmApiUrlEsi: '',
          start: '',
          end: '',
          isMerchandisingEbi: false,
        },
      ];
    }
    // eslint-disable-next-line
  }, [isCustomAlgorithm]);

  return {
    t,
    form,
    workspaceId,
    customIndexArray,
    isDeleteSubRule,
    initialCustomData,
    setIsDeleteSubRule,
    addRule,
    editRule,
    deleteRule,
    onHideSubRuleDelete,
    onEnableMerchandising,
    onDeleteCustomAlgorithm,
    onAddClick,
  };
};

export default useCustomAlgorithmController;
