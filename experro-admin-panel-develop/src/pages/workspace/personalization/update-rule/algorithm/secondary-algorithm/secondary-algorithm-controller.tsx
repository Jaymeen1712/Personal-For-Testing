import React, { useEffect, useState } from 'react';
import RulesIcon from '../../../../../../images/icons/rules-icon';
import {
  PinTab,
  RuleTab,
  SlotTab,
  SortTab,
} from '../../merchandising/secondary';
import SortIcon from '../../../../../../images/icons/sort-icon';
import PinIcon from '../../../../../../images/icons/pin-icon';
import SlotIcon from '../../../../../../images/icons/slot-icon';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  IWorkspaceParams,
  PinEj,
  RulesEj,
  RuleType,
  SlotEj,
  SortEj,
} from '../../../../../../types';
import { customAlphabet } from 'nanoid';
import { ALPHABET } from '../../../../../../utills';

const useSecondaryAlgorithmController = (
  isSuccess: boolean,
  // eslint-disable-next-line
  ruleData: any,
  primaryId: string,
  secondaryId: string,
  environmentId: string,
  // eslint-disable-next-line
  algorithmList: any,
  // eslint-disable-next-line
  onSetRuleData: (data: any) => void,
  onSetSecondaryId: (id: string) => void
) => {
  const { t } = useTranslation();
  const nanoId = customAlphabet(ALPHABET, 12);
  const { workspaceId } = useParams<IWorkspaceParams>();
  // eslint-disable-next-line
  const [secondaryData, setSecondaryData] = useState<any>();
  const [isCustomRule, setCustomRule] = useState(false);
  const [isDeleteSubRule, setIsDeleteSubRule] = useState(false);
  const [isVisibleDirtyCheck, setVisibleDirtyCheck] = useState(false);
  // eslint-disable-next-line
  const [dirtyCheckData, setDirtyCheckData] = useState<any>();

  const onSecondaryAlgorithmChange = (id: string) => {
    const newRuleList = ruleData;

    const secondaryDetails = algorithmList?.data?.find(
      // eslint-disable-next-line
      (item: any) => item.id === id
    );

    if (id === 'custom') {
      setCustomRule(true);
      onSetSecondaryId(id);
    } else {
      if (
        newRuleList?.contentModelFieldData?.secondaryAlgorithmEj?.pinEj ||
        newRuleList?.contentModelFieldData?.secondaryAlgorithmEj?.rulesEj ||
        newRuleList?.contentModelFieldData?.secondaryAlgorithmEj?.sortEj ||
        newRuleList?.contentModelFieldData?.secondaryAlgorithmEj?.slotEj
      ) {
        setVisibleDirtyCheck(true);
        setDirtyCheckData(secondaryDetails);
      } else {
        onSetSecondaryId(id);
        setCustomRule(false);
      }
    }
  };

  const onCancel = () => {
    setVisibleDirtyCheck(false);
  };

  const onDirtyCheckSave = () => {
    onSetSecondaryId(dirtyCheckData?.id);
    setVisibleDirtyCheck(false);
    setCustomRule(false);
    const newRuleList = ruleData;
    if (newRuleList?.contentModelFieldData) {
      delete newRuleList?.contentModelFieldData?.secondaryAlgorithmEj;
      newRuleList.contentModelFieldData.secondaryAlgorithmEj = {
        algorithmInternalNameEsi: dirtyCheckData?.internalName,
        algorithmApiUrlEsi: dirtyCheckData.algorithmApiUrl,
      };
    }
    onSetRuleData(newRuleList);
  };

  /* Merchandising - Secondary Algorithm -  Add Rule   */

  const addRule =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: SortEj | RulesEj | PinEj | SlotEj | any, ruleType: RuleType) => {
      const newRuleList = ruleData;

      if (isCustomRule && newRuleList) {
        if (!newRuleList?.contentModelFieldData.secondaryAlgorithmEj) {
          // eslint-disable-next-line
          newRuleList!.contentModelFieldData.secondaryAlgorithmEj = {};
        }

        newRuleList.contentModelFieldData.secondaryAlgorithmEj.isCustomRuleEbi =
          isCustomRule;

        if (
          newRuleList?.contentModelFieldData.secondaryAlgorithmEj &&
          newRuleList?.contentModelFieldData.secondaryAlgorithmEj[
            `${ruleType}Ej`
          ] === undefined
        ) {
          data['id'] = nanoId();
          newRuleList.contentModelFieldData.secondaryAlgorithmEj[
            `${ruleType}Ej`
          ] = [data];
        } else {
          data['id'] = nanoId();
          newRuleList?.contentModelFieldData.secondaryAlgorithmEj &&
            newRuleList?.contentModelFieldData?.secondaryAlgorithmEj[
              `${ruleType}Ej`
            ]?.push(data);
        }

        onSetRuleData(newRuleList);
      }
    };

  /* Merchandising - Secondary Algorithm -  Edit Rule   */

  const editRule = (
    // eslint-disable-next-line
    data: SortEj | RulesEj | PinEj | SlotEj | any,
    ruleType: RuleType
  ) => {
    const newRuleList = ruleData;

    if (isCustomRule) {
      const ruleDataIndex =
        newRuleList?.contentModelFieldData?.secondaryAlgorithmEj &&
        newRuleList?.contentModelFieldData.secondaryAlgorithmEj[
          `${ruleType}Ej`
        ]?.findIndex((rule: { id: string }) => rule.id === data.id);
      if (ruleDataIndex !== undefined) {
        newRuleList?.contentModelFieldData?.secondaryAlgorithmEj &&
          newRuleList?.contentModelFieldData.secondaryAlgorithmEj[
            `${ruleType}Ej`
          ]?.splice(ruleDataIndex, 1);
        newRuleList?.contentModelFieldData?.secondaryAlgorithmEj &&
          newRuleList?.contentModelFieldData.secondaryAlgorithmEj[
            `${ruleType}Ej`
          ]?.splice(ruleDataIndex, 0, data);
      }

      onSetRuleData(newRuleList);
    }
  };

  /* Merchandising - Secondary Algorithm -  Delete Rule   */

  const deleteRule = (ruleType: RuleType, id?: string) => {
    const newRuleList = ruleData;

    if (isCustomRule) {
      const ruleDataIndex =
        newRuleList?.contentModelFieldData.secondaryAlgorithmEj &&
        newRuleList?.contentModelFieldData.secondaryAlgorithmEj[
          `${ruleType}Ej`
        ]?.findIndex((rule: { id: string | undefined }) => rule.id === id);
      if (ruleDataIndex !== undefined) {
        newRuleList?.contentModelFieldData.secondaryAlgorithmEj &&
          newRuleList?.contentModelFieldData.secondaryAlgorithmEj[
            `${ruleType}Ej`
          ]?.splice(ruleDataIndex, 1);
      }
      setIsDeleteSubRule(false);
      onSetRuleData(newRuleList);
    }
  };

  const onHideSubRuleDelete = () => {
    setIsDeleteSubRule(false);
  };

  const secondaryItems = [
    {
      label: (
        <div>
          <span className="display-block">
            <RulesIcon />
          </span>
          {t('common.labels.rules')}
        </div>
      ),
      key: t('common.labels.rules'),
      children: (
        <RuleTab
          rulesList={ruleData}
          addRule={addRule}
          deleteRule={deleteRule}
          editRule={editRule}
          onHideSubRuleDelete={onHideSubRuleDelete}
          isDeleteSubRule={isDeleteSubRule}
          isCustomRule={isCustomRule}
          index={0}
          setIsDeleteSubRule={setIsDeleteSubRule}
          t={t}
          workspaceId={workspaceId}
          environmentId={environmentId}
        />
      ),
      tabIcon: <RulesIcon />,
    },
    {
      key: t('common.labels.sort'),
      label: (
        <div>
          <span className="display-block">
            <SortIcon />
          </span>
          {t('common.labels.sort')}
        </div>
      ),
      children: (
        <SortTab
          rulesList={ruleData}
          addRule={addRule}
          deleteRule={deleteRule}
          editRule={editRule}
          onHideSubRuleDelete={onHideSubRuleDelete}
          isDeleteSubRule={isDeleteSubRule}
          isCustomRule={isCustomRule}
          setIsDeleteSubRule={setIsDeleteSubRule}
          t={t}
          workspaceId={workspaceId}
          environmentId={environmentId}
        />
      ),
      tabIcon: <SortIcon />,
    },
    {
      key: t('common.labels.pin'),
      label: (
        <div>
          <span className="display-block">
            <PinIcon />
          </span>
          {t('common.labels.pin')}
        </div>
      ),
      children: (
        <PinTab
          rulesList={ruleData}
          addRule={addRule}
          deleteRule={deleteRule}
          editRule={editRule}
          onHideSubRuleDelete={onHideSubRuleDelete}
          isDeleteSubRule={isDeleteSubRule}
          isCustomRule={isCustomRule}
          setIsDeleteSubRule={setIsDeleteSubRule}
          t={t}
          workspaceId={workspaceId}
          environmentId={environmentId}
        />
      ),
      tabIcon: <PinIcon />,
    },
    {
      key: t('common.labels.slot'),
      label: (
        <div>
          <span className="display-block">
            <SlotIcon />
          </span>
          {t('common.labels.slot')}
        </div>
      ),
      children: (
        <SlotTab
          rulesList={ruleData}
          addRule={addRule}
          deleteRule={deleteRule}
          editRule={editRule}
          onHideSubRuleDelete={onHideSubRuleDelete}
          isDeleteSubRule={isDeleteSubRule}
          isCustomRule={isCustomRule}
          setIsDeleteSubRule={setIsDeleteSubRule}
          t={t}
          workspaceId={workspaceId}
          environmentId={environmentId}
        />
      ),
      tabIcon: <SlotIcon />,
    },
  ];

  useEffect(() => {
    const tempArray = algorithmList?.data?.concat({
      id: 'custom',
      name: 'Custom Rule',
    });
    setSecondaryData(tempArray);
  }, [algorithmList.data]);

  useEffect(() => {
    if (isSuccess && ruleData) {
      const updatedList = ruleData;

      const algorithmDetails = algorithmList?.data?.find(
        // eslint-disable-next-line
        (item: any) => item.id === secondaryId
      );

      if (updatedList) {
        if (algorithmDetails) {
          if (
            updatedList?.contentModelFieldData?.secondaryAlgorithmEj ===
            undefined
          ) {
            updatedList.contentModelFieldData.secondaryAlgorithmEj = {};
          }
          updatedList.contentModelFieldData.secondaryAlgorithmEj.algorithmInternalNameEsi =
            algorithmDetails?.internalName;
          updatedList.contentModelFieldData.secondaryAlgorithmEj.algorithmApiUrlEsi =
            algorithmDetails?.algorithmApiUrl;
        } else {
        }
      }
      onSetRuleData(updatedList);
    }
    // eslint-disable-next-line
  }, [secondaryId, isCustomRule]);

  useEffect(() => {
    if (
      ruleData?.contentModelFieldData?.secondaryAlgorithmEj &&
      !secondaryId &&
      algorithmList.data
    ) {
      const algorithm = algorithmList?.data?.find(
        // eslint-disable-next-line
        (item: any) =>
          item.internalName ===
          ruleData?.contentModelFieldData?.secondaryAlgorithmEj
            ?.algorithmInternalNameEsi
      );
      if (algorithm) {
        onSetSecondaryId(algorithm?.id);
      } else {
        onSetSecondaryId('custom');
      }
    }
    // eslint-disable-next-line
  }, [algorithmList?.data, ruleData, isSuccess]);

  useEffect(() => {
    if (
      ruleData?.contentModelFieldData?.secondaryAlgorithmEj?.isCustomRuleEbi
    ) {
      setCustomRule(
        ruleData?.contentModelFieldData?.secondaryAlgorithmEj?.isCustomRuleEbi
      );
    }
  }, [ruleData]);

  return {
    t,
    isVisibleDirtyCheck,
    onCancel,
    onDirtyCheckSave,
    isCustomRule,
    secondaryId,
    secondaryData,
    secondaryItems,
    onSecondaryAlgorithmChange,
  };
};

export default useSecondaryAlgorithmController;
