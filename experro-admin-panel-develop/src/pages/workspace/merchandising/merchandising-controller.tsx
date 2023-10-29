import {
  useHistory,
  useParams,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { Form } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';

import {
  ICreateRuleRequest,
  IRule,
  IRuleRowRecord,
  IWorkspaceParams,
} from '../../../types';
import BulletIcon from '../../../images/icons/bullet-icon';
import useUser from '../../../hooks/user';
import {
  allowSpecificDomain,
  openNotificationWithIcon,
  SIDEBAR_KEYS,
} from '../../../utills';
import useError from '../../../hooks/error';
import { useCreateRule, usePatchRule, useUpdateRule } from './services';
import DownArrowIcon from '../../../images/icons/downarrow-icon';

interface IMerchandisingController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const MerchandisingController = ({
  onMainSidebarActiveItem,
}: IMerchandisingController) => {
  const { t } = useTranslation();
  const { workspaceId, contentModalId, contentModalDataId } = useParams<
    IWorkspaceParams & { contentModalId?: string; contentModalDataId?: string }
  >();
  const history = useHistory();
  const location = useLocation();
  const { path } = useRouteMatch();
  const [form] = Form.useForm();
  const childRef = useRef(null);

  const user = useUser();
  const createRule = useCreateRule(workspaceId);
  const updateRule = useUpdateRule(workspaceId);
  const patchRule = usePatchRule(
    workspaceId,
    contentModalId,
    contentModalDataId
  );

  useError({
    mutation: createRule,
    entity: t('common.labels.rule_name'),
  });

  useError({
    mutation: updateRule,
    entity: t('common.labels.rule_name'),
    cb: () => onHideAddRule(),
  });

  const [environment, setEnvironment] = useState<string | null>(
    localStorage.getItem(`${workspaceId}/environmentId`)
  );
  const [isAddRuleButtonVisible, setIsAddRuleButtonVisible] =
    useState<boolean>(false);
  const [addParentRule, setAddParentRule] = useState(false);

  const [isEnableStopWord, setIsEnableStopWord] = useState(true);
  const [isEnableAutoComplete, setIsEnableAutoComplete] = useState(true);
  const [isEnableSpellCheck, setIsEnableSpellCheck] = useState(true);
  const [isEnableSynonyms, setIsEnableSynonyms] = useState(true);
  const [isEnablePhrases, setIsEnablePhrases] = useState(true);
  const [isStopWordModalVisible, setIsStopWordModalVisible] = useState(false);
  const [
    isEnableSpellCheckSmartSuggestions,
    setIsEnableSpellCheckSmartSuggestions,
  ] = useState(false);
  const [
    isEnableSynonymsSmartSuggestions,
    setIsEnableSynonymsSmartSuggestions,
  ] = useState(false);
  const [isEnablePhrasesSmartSuggestions, setIsEnablePhrasesSmartSuggestions] =
    useState(false);

  const [initialValue, setInitialValue] = useState<IRule>();
  const [selectedContent, setSelectedContent] = useState<{
    type: string;
    id: string;
    label?: string;
  } | null>();

  const [isDuplicateRule, setIsDuplicateRule] = useState<boolean>(false);
  const [duplicateRuleData, setDuplicateRuleData] = useState<
    IRuleRowRecord | undefined
  >();

  const menuItems = useMemo(() => {
    if (
      location.pathname.search('create-edit') !== -1 ||
      location.pathname.search('preview') !== -1
    ) {
      return [];
    }
    return [
      allowSpecificDomain(user?.user?.email) && {
        key: 'analytics',
        label: t('common.labels.analytics'),
        icon: (
          <div className={`ant-menu-submenu-arrows`}>
            <DownArrowIcon />
          </div>
        ),
        children: [
          {
            key: 'dashboard',
            label: t('common.labels.dashboard'),
            icon: (
              <>
                <div className="folders-icon bullet-icon ant-row">
                  <BulletIcon />
                </div>
              </>
            ),
          },
        ],
      },
      {
        key: 'rules',
        label: t('common.labels.rules'),
        icon: (
          <div className={`ant-menu-submenu-arrows`}>
            <DownArrowIcon />
          </div>
        ),
        children: [
          {
            key: 'global-rules',
            label: t('common.labels.global_rules'),
            icon: (
              <>
                <div className="folders-icon bullet-icon ant-row">
                  <BulletIcon />
                </div>
              </>
            ),
          },
          {
            key: 'category-rules',
            label: t('common.labels.category_rules'),
            icon: (
              <>
                <div className="folders-icon bullet-icon ant-row">
                  <BulletIcon />
                </div>
              </>
            ),
          },
          {
            key: 'search-rules',
            label: t('common.labels.search_rules'),
            icon: (
              <>
                <div className="folders-icon bullet-icon ant-row">
                  <BulletIcon />
                </div>
              </>
            ),
          },
        ],
      },
      {
        key: 'facets',
        label: t('common.labels.facets'),
        icon: (
          <div className={`ant-menu-submenu-arrows`}>
            <DownArrowIcon />
          </div>
        ),
        children: [
          {
            key: 'facet-all',
            label: t('common.labels.all'),
            icon: (
              <>
                <div className="folders-icon bullet-icon ant-row">
                  <BulletIcon />
                </div>
              </>
            ),
          },
        ],
      },
      allowSpecificDomain(user?.user?.email) && {
        key: 'dictionaries',
        label: t('common.labels.dictionaries'),
        icon: (
          <div className={`ant-menu-submenu-arrows`}>
            <DownArrowIcon />
          </div>
        ),
        children: [
          {
            key: 'stop-words',
            label: t('common.labels.stop_words'),
            icon: (
              <>
                <div className="folders-icon bullet-icon ant-row">
                  <BulletIcon />
                </div>
              </>
            ),
          },
          {
            key: 'spell-check',
            label: t('common.labels.spell_check'),
            icon: (
              <>
                <div className="folders-icon bullet-icon ant-row">
                  <BulletIcon />
                </div>
              </>
            ),
          },
        ],
      },
      allowSpecificDomain(user?.user?.email) && {
        key: 'enrich',
        label: t('common.labels.enrich'),
        icon: (
          <div className={`ant-menu-submenu-arrows`}>
            <DownArrowIcon />
          </div>
        ),
        children: [
          {
            key: 'synonyms',
            label: t('common.labels.synonyms'),
            icon: (
              <>
                <div className="folders-icon bullet-icon ant-row">
                  <BulletIcon />
                </div>
              </>
            ),
          },
          {
            key: 'phrases',
            label: t('common.labels.phrases'),
            icon: (
              <>
                <div className="folders-icon bullet-icon ant-row">
                  <BulletIcon />
                </div>
              </>
            ),
          },
          {
            key: 'auto-complete',
            label: t('common.labels.header_auto_complete'),
            icon: (
              <>
                <div className="folders-icon bullet-icon ant-row">
                  <BulletIcon />
                </div>
              </>
            ),
          },
          {
            key: 're-ranking',
            label: t('common.labels.header_re_ranking'),
            icon: (
              <>
                <div className="folders-icon bullet-icon ant-row">
                  <BulletIcon />
                </div>
              </>
            ),
          },
        ],
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, location]);

  const onSubSidebarMenuItemClick = useCallback(
    (menu: MenuInfo) => {
      if (menu.key === 'facet-all') {
        history.push(`/workspaces/${workspaceId}/discovery/facets`);
      } else if (menu.key === 'dashboard') {
        history.push(
          `/workspaces/${workspaceId}/discovery/analytics/dashboard`
        );
      } else if (menu.keyPath[1] === 'rules') {
        history.push(
          `/workspaces/${workspaceId}/discovery/${menu.keyPath[1]}/${menu.key}/list-records`
        );
      } else {
        history.push(
          `/workspaces/${workspaceId}/discovery/${menu.keyPath[1]}/${menu.key}`
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, workspaceId, menuItems]
  );

  const onAddFacetClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/${environment}/facets/All/add-facet`
    );
  };

  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      if (
        location.pathname.search('list-records') === -1 &&
        location.pathname.search('dashboard') === -1 &&
        location.pathname.search('facets') === -1 &&
        location.pathname.search('stop-words') === -1 &&
        location.pathname.search('spell-check') === -1 &&
        location.pathname.search('synonyms') === -1 &&
        location.pathname.search('re-ranking') === -1 &&
        location.pathname.search('phrases') === -1 &&
        location.pathname.search('auto-complete') === -1
      ) {
        if (
          // menuItems[0] !== {} &&
          menuItems[0] &&
          menuItems[0].children &&
          menuItems[0].children !== null &&
          menuItems[0].children !== undefined &&
          menuItems[0].children.length > 0
        ) {
          setSelectedContent({
            type: 'analytics',
            id: 'dashboard',
          });
          history.push(
            `/workspaces/${workspaceId}/discovery/analytics/dashboard`
          );
        } else {
          if (menuItems[1] && menuItems[1].children) {
            setSelectedContent({
              type: 'rules',
              id: 'global-rules',
            });
            history.push(
              `/workspaces/${workspaceId}/discovery/rules/${menuItems[1].children[0].key}/list-records`
            );
          }
        }
      } else if (
        location.pathname.search('facets') !== -1 &&
        location.pathname.search('add-facet') === -1
      ) {
        setSelectedContent({
          type: 'facets',
          id: 'facet-all',
        });
      } else if (location.pathname.search('add-facet') !== -1) {
        setSelectedContent({
          type: 'facets',
          id: 'facet-all',
        });
      } else {
        setSelectedContent({
          type: location.pathname.split('/')[4],
          id: location.pathname.split('/')[5],
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItems, location]);

  const onAddRule = () => {
    setAddParentRule(true);
  };

  const onHideAddRule = () => {
    setInitialValue({});
    setAddParentRule(false);
  };

  const onSaveFacetClick = () => {
    //@ts-ignore
    childRef.current.onSave();
  };

  const onEnvironmentChange = (environment: string) => {
    setEnvironment(environment);
  };

  const onCreateRule = async (values: ICreateRuleRequest) => {
    if (
      values.description &&
      values.description.length > 0 &&
      values.description.length !== null &&
      values.description.length !== undefined
    ) {
      values.description = values.description.trim();
    }
    values.title = values.title.trim();
    values.environmentsId = [values.environmentsId];
    createRule.mutate(values);
  };

  const onDuplicateRule = (rule: IRuleRowRecord) => {
    if (rule && rule.language) {
      // @ts-ignore
      delete rule.language;
    }
    rule.rulesEj && (rule.rulesEj = JSON.parse(rule.rulesEj));
    rule.pinEj && (rule.pinEj = JSON.parse(rule.pinEj));
    rule.slotEj && (rule.slotEj = JSON.parse(rule.slotEj));
    rule.sortEj && (rule.sortEj = JSON.parse(rule.sortEj));
    rule.ruleTitleEti = rule.ruleTitleEti + ' Copy';
    setIsDuplicateRule(true);
    setDuplicateRuleData(rule);
    const values = {} as ICreateRuleRequest;
    if (
      rule.description &&
      rule.description.length > 0 &&
      rule.description.length !== null &&
      rule.description.length !== undefined
    ) {
      values.description = rule.description.trim();
    }
    values.title = rule.title.trim() + ' Copy';
    values.environmentsId = [rule.environmentId];

    createRule.mutate(values);
  };

  useEffect(() => {
    if (createRule.isSuccess && !isDuplicateRule) {
      const values = {
        ruleTitleEti: createRule.variables?.title,
        descriptionEt: createRule.variables?.description,
        ruleTypeEsi:
          selectedContent?.id === 'global-rules'
            ? 'global'
            : selectedContent?.id === 'category-rules'
            ? 'category'
            : 'search',
        statusEsi: 'active',
        environmentId: [createRule.data.environmentsId],
        contentModelId: createRule.data?.contentModelId,
        contentModelDataId: createRule.data.contentModelDataId,
        contentModelFieldDataId: createRule.data.contentModelFieldDataId,
        versionId: createRule.data.versionId,
      };
      updateRule.mutate(values);
    } else if (createRule.isSuccess && isDuplicateRule) {
      const values = {
        ...duplicateRuleData,
        contentModelId: createRule.data?.contentModelId,
        contentModelDataId: createRule.data.contentModelDataId,
        contentModelFieldDataId: createRule.data.contentModelFieldDataId,
        versionId: createRule.data.versionId,
        environmentsId: [createRule.data.environmentsId],
      };
      updateRule.mutate(values);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createRule.isSuccess, patchRule.isSuccess]);

  useEffect(() => {
    if (updateRule.isSuccess) {
      history.push(
        `create-edit/${updateRule.variables?.versionId}/${updateRule.variables?.contentModelId}/${updateRule.variables?.contentModelDataId}/${createRule.data?.environmentsId}`
      );
      openNotificationWithIcon(
        'success',
        t('common.messages.rule_created_successfully')
      );
      onHideAddRule();
      setIsDuplicateRule(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRule.isSuccess, t]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.MERCHANDISING);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    menuItems,
    onSubSidebarMenuItemClick,
    selectedContent,
    form,
    location,
    path,
    onAddRule,
    onHideAddRule,
    addParentRule,
    setAddParentRule,
    initialValue,
    setInitialValue,
    onAddFacetClick,
    childRef,
    onSaveFacetClick,
    onEnvironmentChange,
    environment,
    isAddRuleButtonVisible,
    setIsAddRuleButtonVisible,
    onCreateRule,
    onDuplicateRule,
    isEnableStopWord,
    isEnableAutoComplete,
    isEnableSpellCheck,
    isEnableSynonyms,
    isEnablePhrases,
    isEnableSynonymsSmartSuggestions,
    isEnablePhrasesSmartSuggestions,
    setIsEnableSynonyms,
    setIsEnablePhrasesSmartSuggestions,
    setIsEnableSynonymsSmartSuggestions,
    setIsEnableSpellCheck,
    setIsEnableStopWord,
    setIsEnableAutoComplete,
    setIsEnablePhrases,
    setIsEnableSpellCheckSmartSuggestions,
    isEnableSpellCheckSmartSuggestions,
    isStopWordModalVisible,
    setIsStopWordModalVisible,
    buttonLoading: updateRule.isLoading || createRule.isLoading,
    t,
  };
};
export default MerchandisingController;
