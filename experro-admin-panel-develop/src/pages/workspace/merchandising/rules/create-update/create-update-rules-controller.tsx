import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { customAlphabet } from 'nanoid';
import { useTranslation } from 'react-i18next';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import _ from 'lodash';
import { ActionMeta } from 'react-select';
import moment from 'moment/moment';
import { Badge, Form } from 'antd';

import {
  createUpdateSiteRuleParams,
  ICreateRuleRequest,
  IListRuleProductDynamicFieldRequest,
  IRule,
  IRuleData,
  IRuleList,
  PinEj,
  RulesEj,
  RuleType,
  SlotEj,
  SortEj,
} from '../../../../../types';
import { RuleTab, PinTab, SlotTab, SortTab } from './tabs';
import {
  ALPHABET,
  convertCurrentTimeZoneToUtc,
  convertUtcToCurrentTimeZone,
  openNotificationWithIcon,
  TAG_REGEX_PATTERN,
} from '../../../../../utills';
import RulesIcon from '../../../../../images/icons/rules-icon';
import SortIcon from '../../../../../images/icons/sort-icon';
import PinIcon from '../../../../../images/icons/pin-icon';
import SlotIcon from '../../../../../images/icons/slot-icon';
import useError from '../../../../../hooks/error';
import useUser from '../../../../../hooks/user';
import {
  useCountProduct,
  useGetRuleDetails,
  useListProductCategories,
  useListRuleProduct,
  usePatchRule,
  useUpdateRuleDetails,
} from '../../services';
import { useListEnvironmentsAudience } from '../../../audience/services';

interface IProductObject {
  id: '1';
  title: 'title';
  Data: [
    {
      key: string;
      value: string;
    }
  ];
}

interface IInitialData {
  setAddParentRule: (addRule: boolean) => void;
  setInitialValue: (initialValue: IRule) => void;
  subMenu?: string;
  hideAddRule: () => void;
  addParentRule: boolean;
}

const useCreateUpdateRulesController = ({
  setAddParentRule,
  setInitialValue,
  hideAddRule,
  addParentRule,
}: IInitialData) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();

  const {
    workspaceId,
    versionId,
    contentModalId,
    contentModalDataId,
    environmentId,
    subMenu,
  } = useParams<createUpdateSiteRuleParams>();

  const rules = useGetRuleDetails(
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId,
    environmentId
  );

  const patchRule = usePatchRule(
    workspaceId,
    contentModalId,
    contentModalDataId
  );

  const user = useUser();

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isDeleteSubRule, setIsDeleteSubRule] = useState(false);
  const [rulesList, setRulesList] = useState(rules.data);
  const [initialRuleList, setInitialRuleList] = useState<
    IRuleList | undefined
  >();
  const [checkedProduct, setCheckedProduct] = useState<CheckboxValueType[]>([
    'skuEsi',
    'clickRateEfi',
    'revenueEfi',
  ]);

  const [selectedProductGlobal, setSelectedProductGlobal] = useState<
    { id: string; text: string; className?: string }[]
  >([]);

  const [selectedProductSearchRule, setSelectedProductSearchRule] = useState<
    { id: string; text: string; className?: string }[]
  >([]);

  const [selectedProductsCategories, setSelectedProductsCategories] = useState<
    | {
        label: string;
        value: string;
        id?: string;
        toggle?: boolean;
      }[]
  >(rulesList?.contentModelFieldData.categoriesEslai);

  const [startDate, setStartDate] = useState<string | undefined>('');
  const [endDate, setEndDate] = useState<string | undefined>('');

  const [skipCount, setSkipCount] = useState<number>(0);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [isNotRedirectPage, setIsNotRedirectPage] = useState(false);
  const [isDirtyCheckModelVisible, setIsDirtyCheckModelVisible] =
    useState(false);
  const [domain, setDomain] = useState<string>();
  const [isAddButtonVisibleRule, setIsAddButtonVisibleRule] =
    useState<boolean>(false);
  const [isAddButtonVisibleSort, setAddIsButtonVisibleSort] =
    useState<boolean>(false);
  const [isAddButtonVisiblePin, setAddIsButtonVisiblePin] =
    useState<boolean>(false);
  const [isAddButtonVisibleSlot, setAddIsButtonVisibleSlot] =
    useState<boolean>(false);

  const listEnvironments = useListEnvironmentsAudience(workspaceId);

  const listProductCategories = useListProductCategories({
    workspaceId,
    subMenu,
    environmentId,
  });

  const listRuleProducts = useListRuleProduct(workspaceId, skipCount, subMenu);
  const countProduct = useCountProduct(workspaceId, skipCount, subMenu);

  const updateRule = useUpdateRuleDetails(
    workspaceId,
    contentModalId,
    contentModalDataId,
    subMenu
  );

  useError({
    mutation: updateRule,
    entity: t('common.labels.rule_name'),
    cb: () => isDirtyCheckModelVisible && setIsDirtyCheckModelVisible(false),
  });

  useError({
    mutation: patchRule,
    entity: t('common.labels.rule_name'),
  });

  useError({
    mutation: listRuleProducts,
    entity: t('common.labels.rule_name'),
  });

  const nanoId = customAlphabet(ALPHABET, 12);

  const addRule = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: SortEj | RulesEj | PinEj | SlotEj | any, ruleType: RuleType) => {
      const newRuleList = rulesList;

      if (
        newRuleList?.contentModelFieldData &&
        newRuleList?.contentModelFieldData[`${ruleType}Ej`] === undefined
      ) {
        data['id'] = nanoId();
        newRuleList.contentModelFieldData[`${ruleType}Ej`] = [data];
      } else {
        data['id'] = nanoId();
        newRuleList?.contentModelFieldData[`${ruleType}Ej`]?.push(data);
      }

      setRulesList(newRuleList);
      setSelectedPage(1);
      setSkipCount(0);
      openNotificationWithIcon(
        'success',
        t('common.messages.rule_created_successfully')
      );

      const dataToPut: IListRuleProductDynamicFieldRequest = {
        environmentsId: environmentId,
        dynamicFieldsData: { ...rulesList?.contentModelFieldData },
      };

      listRuleProducts.mutate(dataToPut);
      countProduct.mutate(dataToPut);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rules.data, rulesList]
  );

  const editRule = useCallback(
    (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: SortEj | RulesEj | PinEj | SlotEj | any,
      ruleType: RuleType
    ) => {
      const newRuleList = rulesList;

      const ruleDataIndex = newRuleList?.contentModelFieldData[
        `${ruleType}Ej`
      ]?.findIndex((rule) => rule.id === data.id);

      if (ruleDataIndex !== undefined) {
        newRuleList?.contentModelFieldData[`${ruleType}Ej`]?.splice(
          ruleDataIndex,
          1,
          data
        );
      }

      setRulesList(newRuleList);
      setSelectedPage(1);
      setSkipCount(0);

      const dataToPut: IListRuleProductDynamicFieldRequest = {
        environmentsId: environmentId,
        dynamicFieldsData: { ...rulesList?.contentModelFieldData },
      };
      openNotificationWithIcon(
        'success',
        t('common.messages.rule_updated_successfully')
      );

      listRuleProducts.mutate(dataToPut);
      countProduct.mutate(dataToPut);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rules.data, rulesList]
  );

  const deleteRule = useCallback(
    (ruleType: RuleType, id?: string) => {
      const newRuleList = rulesList;
      const ruleDataIndex = newRuleList?.contentModelFieldData[
        `${ruleType}Ej`
      ]?.findIndex((rule) => rule.id === id);
      if (ruleDataIndex !== undefined) {
        newRuleList?.contentModelFieldData[`${ruleType}Ej`]?.splice(
          ruleDataIndex,
          1
        );
      }

      setIsDeleteSubRule(false);
      setSelectedPage(1);
      setSkipCount(0);
      setRulesList(newRuleList);

      const dataToPut: IListRuleProductDynamicFieldRequest = {
        environmentsId: environmentId,
        dynamicFieldsData: { ...rulesList?.contentModelFieldData },
      };
      openNotificationWithIcon(
        'success',
        t('common.messages.rule_deleted_successfully')
      );

      listRuleProducts.mutate(dataToPut);
      countProduct.mutate(dataToPut);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rulesList]
  );

  const saveRule = useCallback(async () => {
    const newRuleList = rulesList;
    const categories: string[] = [];
    const searchValues: string[] = [];

    if (
      newRuleList?.contentModelFieldData.startDateEdti === '' ||
      newRuleList?.contentModelFieldData.startDateEdti === undefined ||
      newRuleList.contentModelFieldData.startDateEdti === 'Invalid date'
    ) {
      setIsDirtyCheckModelVisible(false);
      form.setFields([
        {
          name: 'startDate',
          errors: [
            t('common.messages.required', {
              entity: t('common.labels.start_date'),
            }),
          ],
        },
      ]);
    } else {
      if (newRuleList?.contentModelFieldData) {
        newRuleList.contentModelFieldData.globalTermsEslai = '';
        if (user?.user?.id) {
          newRuleList.contentModelFieldData.modifiedBy = user?.user?.id;
        }

        if (
          newRuleList.contentModelFieldData.categoriesEslai !== null &&
          newRuleList.contentModelFieldData.categoriesEslai !== undefined &&
          newRuleList.contentModelFieldData.categoriesEslai &&
          newRuleList.contentModelFieldData.categoriesEslai.length > 0
        ) {
          newRuleList.contentModelFieldData.categoriesEslai.forEach(
            // eslint-disable-next-line
            (category: any) => {
              if (typeof category !== 'string') {
                categories.push(category['value']);
              } else {
                categories.push(category);
              }
            }
          );
          newRuleList.contentModelFieldData.categoriesEslai = categories;
        } else {
          newRuleList.contentModelFieldData.categoryId = [''];
          newRuleList.contentModelFieldData.categories = [''];
        }

        if (
          newRuleList.contentModelFieldData.searchTermsEslai !== null &&
          newRuleList.contentModelFieldData.searchTermsEslai !== undefined &&
          newRuleList.contentModelFieldData.searchTermsEslai &&
          newRuleList.contentModelFieldData.searchTermsEslai.length > 0
        ) {
          newRuleList.contentModelFieldData.searchTermsEslai.forEach(
            // eslint-disable-next-line
            (search: any) => {
              if (typeof search !== 'string') {
                searchValues.push(search['text']);
              } else {
                searchValues.push(search);
              }
            }
          );
          newRuleList.contentModelFieldData.searchTermsEslai = searchValues;
        }
      }

      setRulesList(newRuleList);

      const dataToPut: IRuleData = {
        versionId: versionId,
        dynamicFieldsData: { ...rulesList?.contentModelFieldData },
      };

      updateRule.mutate(dataToPut);
      setIsNotRedirectPage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rulesList]);

  const onHideSubRuleDelete = () => {
    setIsDeleteSubRule(false);
  };

  const items = useMemo(() => {
    return [
      {
        label: (
          <div>
            {rulesList?.contentModelFieldData.rulesEj &&
              rulesList.contentModelFieldData.rulesEj.length > 0 && (
                <Badge dot color="blue" className=" m-t-4" />
              )}
            <span className="display-block">
              <RulesIcon />
            </span>
            {t('common.labels.rules')}
          </div>
        ),
        key: t('common.labels.rules'),
        children: (
          <RuleTab
            rulesList={rulesList}
            addRule={addRule}
            deleteRule={deleteRule}
            editRule={editRule}
            onHideSubRuleDelete={onHideSubRuleDelete}
            isDeleteSubRule={isDeleteSubRule}
            setIsDeleteSubRule={setIsDeleteSubRule}
            t={t}
            workspaceId={workspaceId}
            environmentId={environmentId}
            setIsAddButtonVisibleRule={setIsAddButtonVisibleRule}
            isAddButtonVisibleRule={isAddButtonVisibleRule}
          />
        ),
        tabIcon: <RulesIcon />,
      },
      {
        key: t('common.labels.sort'),
        label: (
          <div>
            {rulesList?.contentModelFieldData.sortEj &&
              rulesList.contentModelFieldData.sortEj.length > 0 && (
                <Badge dot color="blue" className=" m-t-4" />
              )}
            <span className="display-block">
              <SortIcon />
            </span>
            {t('common.labels.sort')}
          </div>
        ),
        children: (
          <SortTab
            rulesList={rulesList}
            addRule={addRule}
            deleteRule={deleteRule}
            editRule={editRule}
            onHideSubRuleDelete={onHideSubRuleDelete}
            isDeleteSubRule={isDeleteSubRule}
            setIsDeleteSubRule={setIsDeleteSubRule}
            t={t}
            workspaceId={workspaceId}
            environmentId={environmentId}
            setAddIsButtonVisibleSort={setAddIsButtonVisibleSort}
            isAddButtonVisibleSort={isAddButtonVisibleSort}
          />
        ),
        tabIcon: <SortIcon />,
      },
      {
        key: t('common.labels.pin'),
        label: (
          <div>
            {rulesList?.contentModelFieldData.pinEj &&
              rulesList.contentModelFieldData.pinEj.length > 0 && (
                <Badge dot color="blue" className=" m-t-4" />
              )}
            <span className="display-block">
              <PinIcon />
            </span>
            {t('common.labels.pin')}
          </div>
        ),
        children: (
          <PinTab
            rulesList={rulesList}
            addRule={addRule}
            deleteRule={deleteRule}
            editRule={editRule}
            onHideSubRuleDelete={onHideSubRuleDelete}
            isDeleteSubRule={isDeleteSubRule}
            setIsDeleteSubRule={setIsDeleteSubRule}
            t={t}
            workspaceId={workspaceId}
            environmentId={environmentId}
            setAddIsButtonVisiblePin={setAddIsButtonVisiblePin}
            isAddButtonVisiblePin={isAddButtonVisiblePin}
          />
        ),
        tabIcon: <PinIcon />,
      },
      {
        key: t('common.labels.slot'),
        label: (
          <div>
            {rulesList?.contentModelFieldData.slotEj &&
              rulesList.contentModelFieldData.slotEj.length > 0 && (
                <Badge dot color="blue" className=" m-t-4" />
              )}
            <span className="display-block">
              <SlotIcon />
            </span>
            {t('common.labels.slot')}
          </div>
        ),
        children: (
          <SlotTab
            rulesList={rulesList}
            addRule={addRule}
            deleteRule={deleteRule}
            editRule={editRule}
            onHideSubRuleDelete={onHideSubRuleDelete}
            isDeleteSubRule={isDeleteSubRule}
            setIsDeleteSubRule={setIsDeleteSubRule}
            t={t}
            workspaceId={workspaceId}
            environmentId={environmentId}
            setAddIsButtonVisibleSlot={setAddIsButtonVisibleSlot}
            isAddButtonVisibleSlot={isAddButtonVisibleSlot}
          />
        ),
        tabIcon: <SlotIcon />,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rulesList,
    rulesList?.contentModelFieldData.rulesEj,
    rulesList?.contentModelFieldData.sortEj,
    rulesList?.contentModelFieldData.slotEj,
    rulesList?.contentModelFieldData.pinEj,
    isDeleteSubRule,
    isAddButtonVisibleRule,
    isAddButtonVisibleSort,
    isAddButtonVisiblePin,
    isAddButtonVisibleSlot,
  ]);

  const onProductSelectChange = useCallback(
    (ProductObject: object) => {
      const product = ProductObject as IProductObject;
      if (
        selectedProducts.findIndex(
          (selectedProduct) => selectedProduct === product.id
        ) === -1
      ) {
        setSelectedProducts([...selectedProducts, product.id]);
      } else {
        setSelectedProducts(
          selectedProducts.filter(
            (selectedProduct) => selectedProduct !== product.id
          )
        );
      }
    },
    [selectedProducts]
  );

  const onEditRuleData = () => {
    setInitialValue({
      title: rules.data?.contentModelData.title,
      description: rules.data?.contentModelData.description
        ? typeof rules.data?.contentModelData.description === 'string'
          ? rules.data?.contentModelData.description
          : rules.data?.contentModelData.description[0]
        : '',
      environmentsId: rules.data?.contentModelFieldData.environmentId[0],
    });
    setAddParentRule(true);
  };

  const backToListPage = useCallback(() => {
    if (!_.isEqual(initialRuleList, rulesList)) {
      if (
        subMenu === 'search-rules' &&
        initialRuleList &&
        initialRuleList.contentModelFieldData &&
        initialRuleList.contentModelFieldData.searchTermsEslai !== null &&
        initialRuleList.contentModelFieldData.searchTermsEslai !== undefined &&
        initialRuleList.contentModelFieldData.searchTermsEslai &&
        initialRuleList.contentModelFieldData.searchTermsEslai.length > 0
      ) {
        if (
          typeof initialRuleList.contentModelFieldData.searchTermsEslai[0] ===
          'object'
        ) {
          const tempInitialRuleListSearchTermEslai: string[] = [];
          initialRuleList.contentModelFieldData.searchTermsEslai.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (searchTerm: any) =>
              tempInitialRuleListSearchTermEslai.push(searchTerm.text)
          );
          initialRuleList.contentModelFieldData.searchTermsEslai =
            tempInitialRuleListSearchTermEslai;
        }
      }

      if (
        subMenu === 'category-rules' &&
        initialRuleList &&
        initialRuleList.contentModelFieldData
      ) {
        if (
          initialRuleList.contentModelFieldData.categoriesEslai !== null &&
          initialRuleList.contentModelFieldData.categoriesEslai !== undefined &&
          initialRuleList.contentModelFieldData.categoriesEslai &&
          initialRuleList.contentModelFieldData.categoriesEslai.length > 0 &&
          typeof initialRuleList.contentModelFieldData.categoriesEslai[0] ===
            'object'
        ) {
          const tempInitialRuleListCategoriesEslai: string[] = [];
          initialRuleList.contentModelFieldData.categoriesEslai.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (category: any) =>
              tempInitialRuleListCategoriesEslai.push(category.value)
          );
          initialRuleList.contentModelFieldData.categoriesEslai =
            tempInitialRuleListCategoriesEslai;
        } else {
          if (rulesList && initialRuleList) {
            if (
              rulesList.contentModelFieldData.categories &&
              rulesList.contentModelFieldData.categoryId &&
              !initialRuleList.contentModelFieldData.categories &&
              !initialRuleList.contentModelFieldData.categoryId
            ) {
              if (
                rulesList.contentModelFieldData.categories.length > 0 &&
                rulesList.contentModelFieldData.categories[0] === '' &&
                rulesList.contentModelFieldData.categoryId.length > 0 &&
                rulesList.contentModelFieldData.categoryId[0] === ''
              ) {
                delete rulesList.contentModelFieldData.categories;
                delete rulesList.contentModelFieldData.categoryId;
              }
            }
          }
        }
      }

      if (
        subMenu === 'global-rules' &&
        (initialRuleList?.contentModelFieldData.globalTermsEslai ===
          rulesList?.contentModelFieldData.globalTermsEslai ||
          initialRuleList?.contentModelFieldData.globalTermsEslai !==
            rulesList?.contentModelFieldData.globalTermsEslai) &&
        (((initialRuleList?.contentModelFieldData.pinEj === undefined ||
          initialRuleList.contentModelFieldData.pinEj.length === 0) &&
          rulesList?.contentModelFieldData.pinEj?.length === 0) ||
          _.isEqual(
            initialRuleList?.contentModelFieldData.pinEj,
            rulesList?.contentModelFieldData.pinEj
          )) &&
        (((initialRuleList?.contentModelFieldData.slotEj === undefined ||
          initialRuleList.contentModelFieldData.slotEj.length === 0) &&
          rulesList?.contentModelFieldData.slotEj?.length === 0) ||
          _.isEqual(
            initialRuleList?.contentModelFieldData.slotEj,
            rulesList?.contentModelFieldData.slotEj
          )) &&
        (((initialRuleList?.contentModelFieldData.sortEj === undefined ||
          initialRuleList.contentModelFieldData.sortEj.length === 0) &&
          rulesList?.contentModelFieldData.sortEj?.length === 0) ||
          _.isEqual(
            initialRuleList?.contentModelFieldData.sortEj,
            rulesList?.contentModelFieldData.sortEj
          )) &&
        (((initialRuleList?.contentModelFieldData.rulesEj === undefined ||
          initialRuleList.contentModelFieldData.rulesEj.length === 0) &&
          rulesList?.contentModelFieldData.rulesEj?.length === 0) ||
          _.isEqual(
            initialRuleList?.contentModelFieldData.rulesEj,
            rulesList?.contentModelFieldData.rulesEj
          )) &&
        _.isEqual(
          initialRuleList?.contentModelFieldData.workspaceId,
          rulesList?.contentModelFieldData.workspaceId
        ) &&
        _.isEqual(
          initialRuleList?.contentModelFieldData.contentModelId,
          rulesList?.contentModelFieldData.contentModelId
        ) &&
        _.isEqual(
          initialRuleList?.contentModelFieldData.contentModelDataId,
          rulesList?.contentModelFieldData.contentModelDataId
        ) &&
        _.isEqual(
          initialRuleList?.contentModelFieldData.environmentsId,
          rulesList?.contentModelFieldData.environmentsId
        ) &&
        _.isEqual(
          initialRuleList?.contentModelFieldData.environmentId,
          rulesList?.contentModelFieldData.environmentId
        ) &&
        _.isEqual(
          initialRuleList?.contentModelFieldData.tenantId,
          rulesList?.contentModelFieldData.tenantId
        ) &&
        _.isEqual(
          initialRuleList?.contentModelFieldData.statusEsi,
          rulesList?.contentModelFieldData.statusEsi
        ) &&
        (initialRuleList?.contentModelFieldData.endDateEdti &&
        moment(
          // @ts-ignore
          convertUtcToCurrentTimeZone(
            initialRuleList?.contentModelFieldData.endDateEdti
          )
        ).isBefore(Date.now())
          ? rulesList?.contentModelFieldData.endDateEdti === '' ||
            rulesList?.contentModelFieldData.endDateEdti === undefined ||
            _.isEqual(
              initialRuleList?.contentModelFieldData.endDateEdti,
              rulesList?.contentModelFieldData.endDateEdti
            )
          : _.isEqual(
              initialRuleList?.contentModelFieldData.endDateEdti,
              rulesList?.contentModelFieldData.endDateEdti
            )) &&
        (initialRuleList?.contentModelFieldData.endDateEdti &&
        moment(
          // @ts-ignore
          convertUtcToCurrentTimeZone(
            initialRuleList?.contentModelFieldData.endDateEdti
          )
        ).isBefore(Date.now())
          ? rulesList?.contentModelFieldData.startDateEdti === '' ||
            rulesList?.contentModelFieldData.startDateEdti === undefined ||
            _.isEqual(
              initialRuleList?.contentModelFieldData.startDateEdti,
              rulesList?.contentModelFieldData.startDateEdti
            )
          : _.isEqual(
              initialRuleList?.contentModelFieldData.startDateEdti,
              rulesList?.contentModelFieldData.startDateEdti
            )) &&
        _.isEqual(
          initialRuleList?.contentModelFieldData.isLocalizationEnabled,
          rulesList?.contentModelFieldData.isLocalizationEnabled
        ) &&
        _.isEqual(
          initialRuleList?.contentModelFieldData.versionId,
          rulesList?.contentModelFieldData.versionId
        ) &&
        _.isEqual(
          initialRuleList?.contentModelFieldData.language,
          rulesList?.contentModelFieldData.language
        )
      ) {
        setInitialValue({ title: '', description: '', environmentsId: '' });
        setCheckedProduct([]);
        history.push(
          `/workspaces/${workspaceId}/discovery/rules/${subMenu}/list-records`
        );
      } else {
        if (
          subMenu === 'category-rules' &&
          (((initialRuleList?.contentModelFieldData.pinEj === undefined ||
            initialRuleList.contentModelFieldData.pinEj.length === 0) &&
            rulesList?.contentModelFieldData.pinEj?.length === 0) ||
            _.isEqual(
              initialRuleList?.contentModelFieldData.pinEj,
              rulesList?.contentModelFieldData.pinEj
            )) &&
          (((initialRuleList?.contentModelFieldData.slotEj === undefined ||
            initialRuleList.contentModelFieldData.slotEj.length === 0) &&
            rulesList?.contentModelFieldData.slotEj?.length === 0) ||
            _.isEqual(
              initialRuleList?.contentModelFieldData.slotEj,
              rulesList?.contentModelFieldData.slotEj
            )) &&
          (((initialRuleList?.contentModelFieldData.sortEj === undefined ||
            initialRuleList.contentModelFieldData.sortEj.length === 0) &&
            rulesList?.contentModelFieldData.sortEj?.length === 0) ||
            _.isEqual(
              initialRuleList?.contentModelFieldData.sortEj,
              rulesList?.contentModelFieldData.sortEj
            )) &&
          (((initialRuleList?.contentModelFieldData.rulesEj === undefined ||
            initialRuleList.contentModelFieldData.rulesEj.length === 0) &&
            rulesList?.contentModelFieldData.rulesEj?.length === 0) ||
            _.isEqual(
              initialRuleList?.contentModelFieldData.rulesEj,
              rulesList?.contentModelFieldData.rulesEj
            )) &&
          _.isEqual(
            initialRuleList?.contentModelFieldData.workspaceId,
            rulesList?.contentModelFieldData.workspaceId
          ) &&
          _.isEqual(
            initialRuleList?.contentModelFieldData.contentModelId,
            rulesList?.contentModelFieldData.contentModelId
          ) &&
          _.isEqual(
            initialRuleList?.contentModelFieldData.contentModelDataId,
            rulesList?.contentModelFieldData.contentModelDataId
          ) &&
          _.isEqual(
            initialRuleList?.contentModelFieldData.environmentsId,
            rulesList?.contentModelFieldData.environmentsId
          ) &&
          _.isEqual(
            initialRuleList?.contentModelFieldData.environmentId,
            rulesList?.contentModelFieldData.environmentId
          ) &&
          _.isEqual(
            initialRuleList?.contentModelFieldData.tenantId,
            rulesList?.contentModelFieldData.tenantId
          ) &&
          _.isEqual(
            initialRuleList?.contentModelFieldData.statusEsi,
            rulesList?.contentModelFieldData.statusEsi
          ) &&
          (initialRuleList?.contentModelFieldData.endDateEdti &&
          moment(
            // @ts-ignore
            convertUtcToCurrentTimeZone(
              initialRuleList?.contentModelFieldData.endDateEdti
            )
          ).isBefore(Date.now())
            ? rulesList?.contentModelFieldData.endDateEdti === '' ||
              rulesList?.contentModelFieldData.endDateEdti === undefined ||
              _.isEqual(
                initialRuleList?.contentModelFieldData.endDateEdti,
                rulesList?.contentModelFieldData.endDateEdti
              )
            : _.isEqual(
                initialRuleList?.contentModelFieldData.endDateEdti,
                rulesList?.contentModelFieldData.endDateEdti
              )) &&
          (initialRuleList?.contentModelFieldData.endDateEdti &&
          moment(
            // @ts-ignore
            convertUtcToCurrentTimeZone(
              initialRuleList?.contentModelFieldData.endDateEdti
            )
          ).isBefore(Date.now())
            ? rulesList?.contentModelFieldData.startDateEdti === '' ||
              rulesList?.contentModelFieldData.startDateEdti === undefined ||
              _.isEqual(
                initialRuleList?.contentModelFieldData.startDateEdti,
                rulesList?.contentModelFieldData.startDateEdti
              )
            : _.isEqual(
                initialRuleList?.contentModelFieldData.startDateEdti,
                rulesList?.contentModelFieldData.startDateEdti
              )) &&
          _.isEqual(
            initialRuleList?.contentModelFieldData.isLocalizationEnabled,
            rulesList?.contentModelFieldData.isLocalizationEnabled
          ) &&
          _.isEqual(
            initialRuleList?.contentModelFieldData.versionId,
            rulesList?.contentModelFieldData.versionId
          ) &&
          _.isEqual(
            initialRuleList?.contentModelFieldData.language,
            rulesList?.contentModelFieldData.language
          ) &&
          (((initialRuleList?.contentModelFieldData.categoriesEslai ===
            undefined ||
            initialRuleList.contentModelFieldData.categoriesEslai.length ===
              0) &&
            rulesList?.contentModelFieldData.categoriesEslai?.length === 0) ||
            (_.isEqual(
              initialRuleList?.contentModelFieldData.categoriesEslai,
              rulesList?.contentModelFieldData.categoriesEslai
            ) &&
              _.isEqual(
                initialRuleList?.contentModelFieldData.categories,
                rulesList?.contentModelFieldData.categories
              )))
        ) {
          setInitialValue({ title: '', description: '', environmentsId: '' });
          setCheckedProduct([]);
          history.push(
            `/workspaces/${workspaceId}/discovery/rules/${subMenu}/list-records`
          );
        } else {
          if (
            subMenu === 'search-rules' &&
            (((initialRuleList?.contentModelFieldData.pinEj === undefined ||
              initialRuleList.contentModelFieldData.pinEj.length === 0) &&
              rulesList?.contentModelFieldData.pinEj?.length === 0) ||
              _.isEqual(
                initialRuleList?.contentModelFieldData.pinEj,
                rulesList?.contentModelFieldData.pinEj
              )) &&
            (((initialRuleList?.contentModelFieldData.slotEj === undefined ||
              initialRuleList.contentModelFieldData.slotEj.length === 0) &&
              rulesList?.contentModelFieldData.slotEj?.length === 0) ||
              _.isEqual(
                initialRuleList?.contentModelFieldData.slotEj,
                rulesList?.contentModelFieldData.slotEj
              )) &&
            (((initialRuleList?.contentModelFieldData.sortEj === undefined ||
              initialRuleList.contentModelFieldData.sortEj.length === 0) &&
              rulesList?.contentModelFieldData.sortEj?.length === 0) ||
              _.isEqual(
                initialRuleList?.contentModelFieldData.sortEj,
                rulesList?.contentModelFieldData.sortEj
              )) &&
            (((initialRuleList?.contentModelFieldData.rulesEj === undefined ||
              initialRuleList.contentModelFieldData.rulesEj.length === 0) &&
              rulesList?.contentModelFieldData.rulesEj?.length === 0) ||
              _.isEqual(
                initialRuleList?.contentModelFieldData.rulesEj,
                rulesList?.contentModelFieldData.rulesEj
              )) &&
            _.isEqual(
              initialRuleList?.contentModelFieldData.workspaceId,
              rulesList?.contentModelFieldData.workspaceId
            ) &&
            _.isEqual(
              initialRuleList?.contentModelFieldData.contentModelId,
              rulesList?.contentModelFieldData.contentModelId
            ) &&
            _.isEqual(
              initialRuleList?.contentModelFieldData.contentModelDataId,
              rulesList?.contentModelFieldData.contentModelDataId
            ) &&
            _.isEqual(
              initialRuleList?.contentModelFieldData.environmentsId,
              rulesList?.contentModelFieldData.environmentsId
            ) &&
            _.isEqual(
              initialRuleList?.contentModelFieldData.environmentId,
              rulesList?.contentModelFieldData.environmentId
            ) &&
            _.isEqual(
              initialRuleList?.contentModelFieldData.tenantId,
              rulesList?.contentModelFieldData.tenantId
            ) &&
            _.isEqual(
              initialRuleList?.contentModelFieldData.statusEsi,
              rulesList?.contentModelFieldData.statusEsi
            ) &&
            (initialRuleList?.contentModelFieldData.endDateEdti &&
            moment(
              // @ts-ignore
              convertUtcToCurrentTimeZone(
                initialRuleList?.contentModelFieldData.endDateEdti
              )
            ).isBefore(Date.now())
              ? rulesList?.contentModelFieldData.endDateEdti === '' ||
                rulesList?.contentModelFieldData.endDateEdti === undefined ||
                _.isEqual(
                  initialRuleList?.contentModelFieldData.endDateEdti,
                  rulesList?.contentModelFieldData.endDateEdti
                )
              : _.isEqual(
                  initialRuleList?.contentModelFieldData.endDateEdti,
                  rulesList?.contentModelFieldData.endDateEdti
                )) &&
            (initialRuleList?.contentModelFieldData.endDateEdti &&
            moment(
              // @ts-ignore
              convertUtcToCurrentTimeZone(
                initialRuleList?.contentModelFieldData.endDateEdti
              )
            ).isBefore(Date.now())
              ? rulesList?.contentModelFieldData.startDateEdti === '' ||
                rulesList?.contentModelFieldData.startDateEdti === undefined ||
                _.isEqual(
                  initialRuleList?.contentModelFieldData.startDateEdti,
                  rulesList?.contentModelFieldData.startDateEdti
                )
              : _.isEqual(
                  initialRuleList?.contentModelFieldData.startDateEdti,
                  rulesList?.contentModelFieldData.startDateEdti
                )) &&
            _.isEqual(
              initialRuleList?.contentModelFieldData.isLocalizationEnabled,
              rulesList?.contentModelFieldData.isLocalizationEnabled
            ) &&
            _.isEqual(
              initialRuleList?.contentModelFieldData.versionId,
              rulesList?.contentModelFieldData.versionId
            ) &&
            _.isEqual(
              initialRuleList?.contentModelFieldData.language,
              rulesList?.contentModelFieldData.language
            ) &&
            (((initialRuleList?.contentModelFieldData.searchTermsEslai ===
              undefined ||
              initialRuleList.contentModelFieldData.searchTermsEslai.length ===
                0) &&
              rulesList?.contentModelFieldData.searchTermsEslai?.length ===
                0) ||
              (_.isEqual(
                initialRuleList?.contentModelFieldData.searchTermsEslai,
                rulesList?.contentModelFieldData.searchTermsEslai
              ) &&
                _.isEqual(
                  initialRuleList?.contentModelFieldData.searchTerms,
                  rulesList?.contentModelFieldData.searchTerms
                )))
          ) {
            setInitialValue({ title: '', description: '', environmentsId: '' });
            setCheckedProduct([]);
            history.push(
              `/workspaces/${workspaceId}/discovery/rules/${subMenu}/list-records`
            );
          } else {
            setIsDirtyCheckModelVisible(true);
          }
        }
      }
    } else {
      setInitialValue({ title: '', description: '', environmentsId: '' });
      setCheckedProduct([]);
      history.push(
        `/workspaces/${workspaceId}/discovery/rules/${subMenu}/list-records`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRuleList, rulesList, subMenu, workspaceId, history]);

  const selectedTag = (selectedTag: string, selectedTagId: string) => {
    const newRuleList = rulesList;

    selectedProductsCategories.map((product) => {
      if (product.id === selectedTagId) {
        product.toggle = true;
      } else {
        product.toggle = false;
      }
      return undefined;
    });

    setSelectedProductsCategories([...selectedProductsCategories]);

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

    listRuleProducts.mutate(dataToPut);
    countProduct.mutate(dataToPut);
  };

  const handleTagClick = (position: number) => {
    const newRuleList = rulesList;

    if (newRuleList?.contentModelFieldData) {
      if (subMenu === 'global-rules') {
        selectedProductGlobal.map((globalProduct, index) => {
          if (index === position) {
            globalProduct['className'] = 'custom_tag';
          } else {
            globalProduct['className'] = '';
          }
          return undefined;
        });

        const tempSelectedProductGlobal = selectedProductGlobal.filter(
          (product, index) => index === position
        );

        setSelectedProductGlobal([...selectedProductGlobal]);

        if (tempSelectedProductGlobal.length > 0) {
          newRuleList.contentModelFieldData.globalTermsEslai =
            tempSelectedProductGlobal[
              tempSelectedProductGlobal.length - 1
            ].text;
        } else {
          newRuleList.contentModelFieldData.globalTermsEslai = '';
        }
      } else if (subMenu === 'search-rules') {
        selectedProductSearchRule.map((globalProduct, index) => {
          if (index === position) {
            globalProduct['className'] = 'custom_tag';
          } else {
            globalProduct['className'] = '';
          }
          return undefined;
        });

        const tempSelectedProductSearch = selectedProductSearchRule.filter(
          (product, index) => index === position
        );

        setSelectedProductSearchRule([...selectedProductSearchRule]);

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

      countProduct.mutate(dataToPut);
      listRuleProducts.mutate(dataToPut);
    }
  };

  const onProductAddSiteRuleSearchRule = (tags: {
    id: string;
    text: string;
    className?: string;
  }) => {
    if (TAG_REGEX_PATTERN.test(tags.text)) {
      const newRuleList = rulesList;
      if (newRuleList?.contentModelFieldData.searchTermsEslai === undefined) {
        setSelectedProductSearchRule([]);
      }

      if (newRuleList?.contentModelFieldData) {
        if (subMenu === 'global-rules') {
          const tempSelectedProductGlobalRule = [...selectedProductGlobal];

          if (tempSelectedProductGlobalRule.length > 0) {
            tempSelectedProductGlobalRule.map(
              (SelectedProductGlobalRule) =>
                (SelectedProductGlobalRule.className = '')
            );
          }

          tags['className'] = 'custom_tag';

          tempSelectedProductGlobalRule.push(tags);

          setSelectedProductGlobal(tempSelectedProductGlobalRule);

          newRuleList.contentModelFieldData.globalTermsEslai = tags.text;
        } else if (subMenu === 'search-rules') {
          const tempSelectProductSearchRule = [...selectedProductSearchRule];

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
          setSelectedProductSearchRule(tempSelectProductSearchRule);
        }
      }

      setRulesList(newRuleList);
      setSelectedPage(1);
      setSkipCount(0);

      const dataToPut: IListRuleProductDynamicFieldRequest = {
        environmentsId: environmentId,
        dynamicFieldsData: { ...rulesList?.contentModelFieldData },
      };

      countProduct.mutate(dataToPut);
      listRuleProducts.mutate(dataToPut);
    } else {
      openNotificationWithIcon(
        'error',
        t('common.messages.special_character_not_allow')
      );
    }
  };

  const onProductDeleteSiteRuleSearchRule = (position: number) => {
    const newRuleList = rulesList;

    if (newRuleList?.contentModelFieldData) {
      if (subMenu === 'global-rules') {
        const tempSelectedProductGlobal = selectedProductGlobal.filter(
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

          setSelectedProductGlobal(tempSelectedProductGlobal);
        } else {
          newRuleList.contentModelFieldData.globalTermsEslai = '';
          setSelectedProductGlobal([]);
        }
      } else if (subMenu === 'search-rules') {
        const tempSelectedProductSearch = selectedProductSearchRule.filter(
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
          setSelectedProductSearchRule(tempSelectedProductSearch);
        } else {
          newRuleList.contentModelFieldData.searchTerms = '';
          newRuleList.contentModelFieldData.searchTermsEslai = [];
          setSelectedProductSearchRule([]);
        }
      }

      setRulesList(newRuleList);
      setSelectedPage(1);
      setSkipCount(0);

      const dataToPut: IListRuleProductDynamicFieldRequest = {
        environmentsId: environmentId,
        dynamicFieldsData: { ...rulesList?.contentModelFieldData },
      };

      countProduct.mutate(dataToPut);
      listRuleProducts.mutate(dataToPut);
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
    if (actionMeta.action === 'remove-value') {
      const newRuleList = rulesList;
      const categoryProducts: string[] = [];
      const categoryProductsIds: string[] = [];

      const tempSelectedProductCategories = selectedProductsCategories.filter(
        (product) => product.id !== actionMeta.removedValue.id
      );

      setSelectedProductsCategories([]);

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

      setSelectedProductsCategories([...tempProducts]);

      for (let i = 0; i <= tempProducts.length - 1; i++) {
        // @ts-ignore
        categoryProductsIds.push(tempProducts[i].id);
        categoryProducts.push(tempProducts[i].value);
      }

      if (subMenu === 'category-rules') {
        if (newRuleList?.contentModelFieldData) {
          newRuleList.contentModelFieldData.categoriesEslai = categoryProducts;
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

      countProduct.mutate(dataToPut);
      listRuleProducts.mutate(dataToPut);
    } else {
      const newRuleList = rulesList;
      const categoryProducts: string[] = [];
      const categoryProductsIds: string[] = [];

      setSelectedProductsCategories([]);

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

      setSelectedProductsCategories([...tempProducts]);

      tempProducts?.map((product) => {
        // @ts-ignore
        categoryProductsIds.push(product.id);
        categoryProducts.push(product.value);
        return true;
      });

      if (subMenu === 'category-rules') {
        if (newRuleList?.contentModelFieldData) {
          newRuleList.contentModelFieldData.categoriesEslai = categoryProducts;
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

      countProduct.mutate(dataToPut);
      listRuleProducts.mutate(dataToPut);
    }
  };

  const onEditRule = (values: ICreateRuleRequest) => {
    if (
      values.description &&
      values.description.length > 0 &&
      values.description.length !== null &&
      values.description.length !== undefined
    ) {
      values.description = values.description.trim();
    }
    values.title = values.title.trim();
    const patchRuleDate = {
      title: values.title,
      description: values.description,
    };
    patchRule.mutate(patchRuleDate);
  };

  const onPreviewClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/rules/${subMenu}/preview/${versionId}/${contentModalId}/${contentModalDataId}/${environmentId}`
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onStartChange = (date: any) => {
    const newRuleList = rulesList;
    const startDate = convertCurrentTimeZoneToUtc(date);

    if (newRuleList?.contentModelFieldData) {
      if (date === null) {
        setStartDate('');
      } else {
        setStartDate(startDate);
      }
      form.resetFields();
      newRuleList.contentModelFieldData.startDateEdti = startDate;
    }
    setRulesList(newRuleList);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEndChange = (date: any) => {
    const newRuleList = rulesList;
    const endDate = convertCurrentTimeZoneToUtc(date);

    if (newRuleList?.contentModelFieldData) {
      if (date === null) {
        setEndDate('');
      } else {
        setEndDate(endDate);
      }

      newRuleList.contentModelFieldData.endDateEdti = endDate;
    }
    setRulesList(newRuleList);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const disabledStartDate = (startDateValue: any) => {
    setEndDate(endDate);

    if (!startDateValue || !moment(convertUtcToCurrentTimeZone(endDate))) {
      return false;
    }

    return (
      startDateValue.valueOf() >
      moment(
        convertUtcToCurrentTimeZone(endDate),
        'YYYY-MM-DD HH:mm:ss'
      ).valueOf()
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const disabledEndDate = (endDateValue: any) => {
    setStartDate(startDate);

    if (!endDateValue || !moment(convertUtcToCurrentTimeZone(startDate))) {
      return false;
    }

    return (
      endDateValue.valueOf() <
      moment(
        convertUtcToCurrentTimeZone(startDate),
        'YYYY-MM-DD HH:mm:ss'
      ).valueOf()
    );
  };

  const onTabChange = (activeItemKey: string) => {
    if (activeItemKey === 'Rules') {
      if (
        isAddButtonVisibleSort ||
        isAddButtonVisiblePin ||
        isAddButtonVisibleSlot
      ) {
        setAddIsButtonVisibleSort(false);
        setAddIsButtonVisiblePin(false);
        setAddIsButtonVisibleSlot(false);
      }
    } else if (activeItemKey === 'Sort') {
      if (
        isAddButtonVisibleRule ||
        isAddButtonVisiblePin ||
        isAddButtonVisibleSlot
      ) {
        setIsAddButtonVisibleRule(false);
        setAddIsButtonVisiblePin(false);
        setAddIsButtonVisibleSlot(false);
      }
    } else if (activeItemKey === 'Pin') {
      if (
        isAddButtonVisibleRule ||
        isAddButtonVisibleSort ||
        isAddButtonVisibleSlot
      ) {
        setIsAddButtonVisibleRule(false);
        setAddIsButtonVisibleSort(false);
        setAddIsButtonVisibleSlot(false);
      }
    } else if (activeItemKey === 'Slot') {
      setIsAddButtonVisibleRule(false);
      setAddIsButtonVisibleSort(false);
      setAddIsButtonVisiblePin(false);
    }
  };

  useEffect(() => {
    if (listRuleProducts.isError) {
      openNotificationWithIcon('error', 'error while creating rule');
    }
  }, [listRuleProducts.isError]);

  useEffect(() => {
    const dataToPut: IListRuleProductDynamicFieldRequest = {
      environmentsId: environmentId,
      dynamicFieldsData: { ...rulesList?.contentModelFieldData },
    };

    listProductCategories.refetch();
    listRuleProducts.mutate(dataToPut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCount]);

  useEffect(() => {
    if (rulesList && rulesList.contentModelFieldData) {
      if (
        rulesList?.contentModelFieldData.searchTermsEslai === undefined ||
        typeof rulesList?.contentModelFieldData.searchTermsEslai[0] === 'string'
      ) {
        setSelectedProductSearchRule([]);
      } else {
        setSelectedProductSearchRule(
          rulesList?.contentModelFieldData.searchTermsEslai
        );
      }

      if (
        rulesList?.contentModelFieldData.categoriesEslai === undefined ||
        typeof rulesList?.contentModelFieldData.categoriesEslai[0] === 'string'
      ) {
        setSelectedProductsCategories([]);
      } else {
        setSelectedProductsCategories(
          rulesList?.contentModelFieldData.categoriesEslai
        );
      }

      setStartDate(rulesList?.contentModelFieldData.startDateEdti);
      setEndDate(rulesList?.contentModelFieldData.endDateEdti);

      const dataToPut: IListRuleProductDynamicFieldRequest = {
        environmentsId: environmentId,
        dynamicFieldsData: { ...rulesList?.contentModelFieldData },
      };

      listProductCategories.refetch();
      countProduct.mutate(dataToPut);
      listRuleProducts.mutate(dataToPut);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rulesList]);

  useEffect(() => {
    if (updateRule.isSuccess) {
      if (isNotRedirectPage) {
        hideAddRule();
        openNotificationWithIcon(
          'success',
          t('common.messages.subrule_updated_successfully', {
            entity: `${subMenu?.charAt(0).toUpperCase()}${subMenu
              ?.split('-')[0]
              .slice(1)}`,
          })
        );
      } else {
        setCheckedProduct([]);
        setSelectedProductsCategories([]);
        setSelectedProductSearchRule([]);
        setSelectedProductGlobal([]);
        openNotificationWithIcon(
          'success',
          t('common.messages.subrule_updated_successfully', {
            entity: `${subMenu?.charAt(0).toUpperCase()}${subMenu
              ?.split('-')[0]
              .slice(1)}`,
          })
        );
        history.push(
          `/workspaces/${workspaceId}/discovery/rules/${subMenu}/list-records`
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    history,
    subMenu,
    updateRule.isSuccess,
    workspaceId,
    versionId,
    contentModalId,
    contentModalDataId,
    isNotRedirectPage,
  ]);

  useEffect(() => {
    setRulesList(rules.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rules.data, rules]);

  useEffect(() => {
    rules.refetch();
    listProductCategories.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subMenu, workspaceId, versionId, contentModalId, contentModalDataId]);

  useEffect(() => {
    if (rules.isSuccess && rules.data && rules.data !== undefined) {
      setInitialRuleList(JSON.parse(JSON.stringify(rules.data)));
    }
  }, [rules.isSuccess, rules.data]);

  useEffect(() => {
    if (patchRule.isSuccess) {
      const newRuleList = rulesList;
      const categories: string[] = [];
      const searchValues: string[] = [];

      if (newRuleList?.contentModelData) {
        newRuleList.contentModelData.title = patchRule.variables?.title;
        newRuleList.contentModelData.description =
          patchRule.variables?.description;
      }

      if (newRuleList?.contentModelFieldData) {
        newRuleList.contentModelFieldData.globalTermsEslai = '';
        newRuleList.contentModelFieldData.ruleTitleEti =
          patchRule.variables?.title;
        newRuleList.contentModelFieldData.descriptionEt =
          patchRule.variables?.description;

        if (
          newRuleList.contentModelFieldData.categoriesEslai !== null &&
          newRuleList.contentModelFieldData.categoriesEslai !== undefined &&
          newRuleList.contentModelFieldData.categoriesEslai &&
          newRuleList.contentModelFieldData.categoriesEslai.length > 0
        ) {
          newRuleList.contentModelFieldData.categoriesEslai.forEach(
            // eslint-disable-next-line
            (category: any) => {
              if (typeof category !== 'string') {
                categories.push(category['value']);
              } else {
                categories.push(category);
              }
            }
          );
          newRuleList.contentModelFieldData.categoriesEslai = categories;
        } else {
          newRuleList.contentModelFieldData.categories = [''];
          newRuleList.contentModelFieldData.categoryId = [''];
        }

        if (
          newRuleList.contentModelFieldData.searchTermsEslai !== null &&
          newRuleList.contentModelFieldData.searchTermsEslai !== undefined &&
          newRuleList.contentModelFieldData.searchTermsEslai &&
          newRuleList.contentModelFieldData.searchTermsEslai.length > 0
        ) {
          newRuleList.contentModelFieldData.searchTermsEslai.forEach(
            // eslint-disable-next-line
            (search: any) => {
              if (typeof search !== 'string') {
                searchValues.push(search['text']);
              } else {
                searchValues.push(search);
              }
            }
          );
          newRuleList.contentModelFieldData.searchTermsEslai = searchValues;
        }
      }

      setRulesList(newRuleList);

      const dataToPut: IRuleData = {
        versionId: versionId,
        dynamicFieldsData: { ...rulesList?.contentModelFieldData },
      };

      updateRule.mutate(dataToPut);
      setIsNotRedirectPage(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patchRule.isSuccess]);

  useEffect(() => {
    return () => {
      if (history.action === 'POP') {
        if (addParentRule) {
          setAddParentRule(false);
        }
      }
    };
  }, [history, addParentRule, setAddParentRule]);

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
  }, [listEnvironments.isSuccess, listEnvironments.data, environmentId]);

  return {
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
    productCount: countProduct.data,
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
    buttonLoading: isNotRedirectPage
      ? updateRule.isLoading || patchRule.isLoading
      : updateRule.isLoading,
    isNotRedirectPage,
    isDirtyCheckModelVisible,
    subMenu,
    workspaceId,
    onProductSelectChange,
    setIsDirtyCheckModelVisible,
    setSelectedProductGlobal,
    setSelectedProductsCategories,
    setSelectedProductSearchRule,
    onPreviewClick,
    domain,
    onStartChange,
    onEndChange,
    disabledStartDate,
    disabledEndDate,
    isSaveButtonDisable:
      isAddButtonVisibleRule ||
      isAddButtonVisibleSort ||
      isAddButtonVisiblePin ||
      isAddButtonVisibleSlot,
    form,
    onTabChange,
  };
};
export default useCreateUpdateRulesController;
