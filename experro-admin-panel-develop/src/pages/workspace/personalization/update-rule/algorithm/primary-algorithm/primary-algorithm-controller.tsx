import React, { useEffect, useState } from 'react';
import RulesIcon from '../../../../../../images/icons/rules-icon';
import SortIcon from '../../../../../../images/icons/sort-icon';
import PinIcon from '../../../../../../images/icons/pin-icon';
import SlotIcon from '../../../../../../images/icons/slot-icon';
import { useTranslation } from 'react-i18next';
import { PinTab, RuleTab, SlotTab, SortTab } from '../../merchandising/primary';
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
import { ALPHABET, openNotificationWithIcon } from '../../../../../../utills';

const usePrimaryAlgorithmController = (
  // eslint-disable-next-line
  ruleData: any,
  primaryId: string,
  secondaryId: string,
  environmentId: string,
  // eslint-disable-next-line
  algorithmList: any,
  // eslint-disable-next-line
  onSetRuleData: (data: any) => void,
  isSuccess: boolean,
  onChangeFallBack: (val: boolean) => void,
  onChangePrimaryId: (id: string) => void
) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  // eslint-disable-next-line
  const [primaryData, SetPrimaryData] = useState<any>();
  const [isMerchandising, setMerchandising] = useState(false);
  const [isDeleteSubRule, setIsDeleteSubRule] = useState(false);
  const [isCustomAlgorithm, setCustomAlgorithm] = useState(false);
  const [isVisibleDirtyCheck, setVisibleDirtyCheck] = useState(false);
  // eslint-disable-next-line
  const [dirtyCheckData, setDirtyCheckData] = useState<any>();
  const nanoId = customAlphabet(ALPHABET, 12);

  const onCancel = () => {
    setVisibleDirtyCheck(false);
  };

  const onHideSubRuleDelete = () => {
    setIsDeleteSubRule(false);
  };

  const onChangePrimary = (val: string) => {
    const primaryDetails = algorithmList?.data?.find(
      // eslint-disable-next-line
      (item: any) => item.id === val
    );

    const newRuleList = ruleData;

    if (
      newRuleList?.contentModelFieldData?.primaryAlgorithmEj?.pinEj ||
      newRuleList?.contentModelFieldData?.primaryAlgorithmEj?.rulesEj ||
      newRuleList?.contentModelFieldData?.primaryAlgorithmEj?.sortEj ||
      newRuleList?.contentModelFieldData?.primaryAlgorithmEj?.slotEj ||
      newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj
    ) {
      setVisibleDirtyCheck(true);
      setDirtyCheckData(primaryDetails ? primaryDetails : 'custom');
    } else {
      onChangePrimaryId(val);
      if (val === 'custom') {
        setCustomAlgorithm(true);
        delete newRuleList.contentModelFieldData.primaryAlgorithmEj;
      } else {
        setCustomAlgorithm(false);
        newRuleList.contentModelFieldData.primaryAlgorithmEj = {
          algorithmInternalNameEsi: primaryDetails.internalName,
          algorithmApiUrlEsi: primaryDetails.algorithmApiUrl,
          isMerchandisingEbi: isMerchandising,
        };
      }
    }

    onSetRuleData(newRuleList);
  };

  const onDirtyCheckSave = () => {
    onChangePrimaryId(dirtyCheckData?.id ? dirtyCheckData?.id : dirtyCheckData);
    setVisibleDirtyCheck(false);
    setMerchandising(false);

    const newRuleList = ruleData;

    if (dirtyCheckData === 'custom') {
      delete newRuleList?.contentModelFieldData?.primaryAlgorithmEj;
      setCustomAlgorithm(true);
    } else {
      setCustomAlgorithm(false);
      if (newRuleList?.contentModelFieldData) {
        delete newRuleList?.contentModelFieldData?.customPrimaryAlgorithmEj;
        newRuleList.contentModelFieldData.primaryAlgorithmEj = {
          algorithmInternalNameEsi: dirtyCheckData?.internalName,
          algorithmApiUrlEsi: dirtyCheckData.algorithmApiUrl,
          isMerchandisingEbi: isMerchandising,
        };
      }
    }
  };

  const onEnableMerchandising = (checked: boolean) => {
    if (checked) {
      setMerchandising(true);
    } else {
      setMerchandising(false);
    }
  };

  const addRule = (
    // eslint-disable-next-line
    data: SortEj | RulesEj | PinEj | SlotEj | any,
    ruleType: RuleType
  ) => {
    const newRuleList = ruleData;

    if (isMerchandising) {
      if (!newRuleList?.contentModelFieldData.primaryAlgorithmEj) {
        // eslint-disable-next-line
        newRuleList!.contentModelFieldData.primaryAlgorithmEj = {};
      }

      if (
        newRuleList?.contentModelFieldData.primaryAlgorithmEj &&
        newRuleList?.contentModelFieldData.primaryAlgorithmEj[
          `${ruleType}Ej`
        ] === undefined
      ) {
        data['id'] = nanoId();
        newRuleList.contentModelFieldData.primaryAlgorithmEj[`${ruleType}Ej`] =
          [data];
      } else {
        data['id'] = nanoId();
        newRuleList?.contentModelFieldData.primaryAlgorithmEj &&
          newRuleList?.contentModelFieldData.primaryAlgorithmEj[
            `${ruleType}Ej`
          ]?.push(data);
      }

      onSetRuleData(newRuleList);
    }
    openNotificationWithIcon(
      'success',
      t('common.messages.added_successfully')
    );
  };

  const editRule = (
    // eslint-disable-next-line
    data: SortEj | RulesEj | PinEj | SlotEj | any,
    ruleType: RuleType
  ) => {
    const newRuleList = ruleData;

    if (isMerchandising) {
      const ruleDataIndex =
        newRuleList?.contentModelFieldData?.primaryAlgorithmEj &&
        newRuleList?.contentModelFieldData?.primaryAlgorithmEj[
          `${ruleType}Ej`
          // eslint-disable-next-line
        ]?.findIndex((rule: { id: any }) => rule.id === data.id);
      if (ruleDataIndex !== undefined) {
        newRuleList?.contentModelFieldData?.primaryAlgorithmEj &&
          newRuleList?.contentModelFieldData.primaryAlgorithmEj[
            `${ruleType}Ej`
          ]?.splice(ruleDataIndex, 1);
        newRuleList?.contentModelFieldData?.primaryAlgorithmEj &&
          newRuleList?.contentModelFieldData.primaryAlgorithmEj[
            `${ruleType}Ej`
          ]?.splice(ruleDataIndex, 0, data);
      }

      onSetRuleData(newRuleList);

      openNotificationWithIcon(
        'success',
        t('common.messages.edited_successfully')
      );
    }
  };

  const deleteRule = (ruleType: RuleType, id?: string) => {
    const newRuleList = ruleData;

    if (isMerchandising) {
      const ruleDataIndex =
        newRuleList?.contentModelFieldData.primaryAlgorithmEj &&
        newRuleList?.contentModelFieldData.primaryAlgorithmEj[
          `${ruleType}Ej`
        ]?.findIndex((rule: { id: string | undefined }) => rule.id === id);
      if (ruleDataIndex !== undefined) {
        newRuleList?.contentModelFieldData.primaryAlgorithmEj &&
          newRuleList?.contentModelFieldData.primaryAlgorithmEj[
            `${ruleType}Ej`
          ]?.splice(ruleDataIndex, 1);
      }
      setIsDeleteSubRule(false);
      onSetRuleData(newRuleList);
      openNotificationWithIcon(
        'success',
        t('common.messages.removed_successfully')
      );
    }
  };

  const primaryItems = [
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
          enableMerchandising={isMerchandising}
          isDeleteSubRule={isDeleteSubRule}
          setIsDeleteSubRule={setIsDeleteSubRule}
          t={t}
          index={0}
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
          enableMerchandising={isMerchandising}
          isDeleteSubRule={isDeleteSubRule}
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
          enableMerchandising={isMerchandising}
          isDeleteSubRule={isDeleteSubRule}
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
          enableMerchandising={isMerchandising}
          isDeleteSubRule={isDeleteSubRule}
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
    const primaryTemp = algorithmList?.data?.concat({
      id: 'custom',
      name: 'Custom Algorithm',
    });
    SetPrimaryData(primaryTemp);
  }, [algorithmList.data]);

  useEffect(() => {
    if (isSuccess && ruleData) {
      const updatedList = ruleData;

      const algorithmDetails = algorithmList?.data?.find(
        // eslint-disable-next-line
        (item: any) => item.id === primaryId
      );

      if (updatedList) {
        if (
          updatedList.contentModelFieldData.primaryAlgorithmEj === undefined &&
          algorithmDetails
        ) {
          updatedList.contentModelFieldData.primaryAlgorithmEj = {
            algorithmInternalNameEsi: algorithmDetails?.internalName,
            algorithmApiUrlEsi: algorithmDetails?.algorithmApiUrl,
            isMerchandisingEbi: isMerchandising,
          };
        } else {
          if (updatedList?.contentModelFieldData?.primaryAlgorithmEj) {
            updatedList.contentModelFieldData.primaryAlgorithmEj.algorithmInternalNameEsi =
              algorithmDetails?.internalName;
            updatedList.contentModelFieldData.primaryAlgorithmEj.algorithmApiUrlEsi =
              algorithmDetails?.algorithmApiUrl;
            updatedList.contentModelFieldData.primaryAlgorithmEj.isMerchandisingEbi =
              isMerchandising;
          }
        }
        onSetRuleData(updatedList);
      }
    }
    // eslint-disable-next-line
  }, [primaryId, isMerchandising]);

  useEffect(() => {
    if (
      ruleData?.contentModelFieldData?.primaryAlgorithmEj &&
      algorithmList.data
    ) {
      const algorithm = algorithmList?.data?.find(
        // eslint-disable-next-line
        (item: any) =>
          item.internalName ===
          ruleData?.contentModelFieldData?.primaryAlgorithmEj
            ?.algorithmInternalNameEsi
      );
      if (algorithm) {
        onChangePrimaryId(algorithm?.id);
      }
      //check and remove

      setMerchandising(
        ruleData?.contentModelFieldData?.primaryAlgorithmEj?.isMerchandisingEbi
      );
    } else {
      if (ruleData?.contentModelFieldData?.customPrimaryAlgorithmEj) {
        onChangePrimaryId('custom');
      }
    }
    // eslint-disable-next-line
  }, [algorithmList?.data, ruleData, isSuccess]);

  //checl and remove

  useEffect(() => {
    if (ruleData) {
      onChangeFallBack(ruleData.contentModelFieldData.isFallbackEbi);
    }

    if (ruleData?.contentModelFieldData?.customPrimaryAlgorithmEj) {
      setCustomAlgorithm(true);
    }
    // eslint-disable-next-line
  }, [ruleData]);

  return {
    t,
    isMerchandising,
    isCustomAlgorithm,
    isVisibleDirtyCheck,
    primaryData,
    primaryItems,
    primaryId,
    onChangePrimary,
    onEnableMerchandising,
    onCancel,
    onDirtyCheckSave,
  };
};
export default usePrimaryAlgorithmController;
