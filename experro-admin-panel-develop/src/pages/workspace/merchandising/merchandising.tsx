//@ts-nocheck
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { SIDEBAR_KEYS } from '../../../utills';
import MerchandisingController from './merchandising-controller';
import Facets from './facets';
import FacetsDetail from './facets/facets-detail';
import AnalyticsDashboard from './analytics-dashboard';
import SubSideBar from '../../../components/sub-sidebar/sub-sidebar';
import { CreateUpdateRules, ListRules } from './rules';
import ListStopwords from './dictionaries/stopwords/list';
import StopWordsSettings from './dictionaries/stopwords/settings';
import { ListSpellCheck } from './dictionaries/spellCheck';
import SpellCheckSettings from './dictionaries/spellCheck/settings';
import ListSynonyms from './enrich/synonyms/list';
import SynonymsSettings from './enrich/synonyms/settings';
import ListSynonymsSmartSuggestions from './enrich/synonyms/smart-suggestions';
import ListPhrases from './enrich/phrases/list';
import PhrasesSettings from './enrich/phrases/settings';
import ListPhrasesSmartSuggestions from './enrich/phrases/smart-suggestions';
import ReRanking from './enrich/re-ranking';
import PageNotFound from '../../../components/page-not-found';
import PreviewRules from './rules/preview';
import ListAutoComplete from './enrich/auto-complete/list';
import AutoCompleteSettings from './enrich/auto-complete/settings/auto-complete-settings';

const Merchandising: React.FC<{
  onMainSidebarActiveItem?: (val: string) => void;
}> = ({ onMainSidebarActiveItem }) => {
  const {
    menuItems,
    onSubSidebarMenuItemClick,
    selectedContent,
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
    buttonLoading,
    isEnableStopWord,
    isEnableAutoComplete,
    isEnableSpellCheck,
    isEnableSynonyms,
    isEnablePhrases,
    isEnablePhrasesSmartSuggestions,
    isEnableSynonymsSmartSuggestions,
    isEnableSpellCheckSmartSuggestions,
    setIsEnableSynonyms,
    setIsEnableAutoComplete,
    setIsEnablePhrasesSmartSuggestions,
    setIsEnableSynonymsSmartSuggestions,
    setIsEnableSpellCheckSmartSuggestions,
    setIsEnableSpellCheck,
    setIsEnableStopWord,
    setIsEnablePhrases,
    t,
  } = MerchandisingController({ onMainSidebarActiveItem });

  return (
    <div
      className={
        location.pathname.search('list-records') !== -1 ||
        location.pathname.search('facets') !== -1 ||
        location.pathname.search('analytics') !== -1 ||
        location.pathname.search('dictionaries') !== -1 ||
        location.pathname.search('enrich') !== -1
          ? 'page-wrapper'
          : 'page-wrapper merchandising-content'
      }>
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.MERCHANDISING}
        subSidebarMenuItems={menuItems}
        onSubSidebarMenuItemClick={onSubSidebarMenuItemClick}
        subSidebarActiveItemKey={menuItems.length > 0 && selectedContent?.id}
        openSubSidebarMenuItems={[
          'analytics',
          'rules',
          'facets',
          'dictionaries',
          'enrich',
        ]}
        isEnvironmentSelectorVisible={true}
        onEnvironmentSelectValueChange={onEnvironmentChange}
        isEnvironmentSelectorDisable={
          location.pathname.search('add-facet') !== -1 ? true : false
        }
        disableEnvironmentToolTipMessage={
          location.pathname.search('add-facet') !== -1 &&
          t('common.messages.shared_across_the_workspace')
        }>
        <Switch>
          <Route exact path={`${path}/analytics/dashboard`}>
            <AnalyticsDashboard environment={environment} />
          </Route>
          <Route exact path={`${path}/:parentMenu/:subMenu/list-records`}>
            <ListRules
              onAddRule={onAddRule}
              hideAddRule={onHideAddRule}
              addParentRule={addParentRule}
              onSave={onCreateRule}
              environment={environment}
              buttonLoading={buttonLoading}
              setIsAddRuleButtonVisible={setIsAddRuleButtonVisible}
              isAddRuleButtonVisible={isAddRuleButtonVisible}
              onDuplicateRule={onDuplicateRule}
            />
          </Route>
          <Route
            exact
            path={`${path}/:parentMenu/:subMenu/create-edit/:versionId/:contentModalId/:contentModalDataId/:environmentId`}>
            <CreateUpdateRules
              hideAddRule={onHideAddRule}
              addParentRule={addParentRule}
              setAddParentRule={setAddParentRule}
              initialValue={initialValue}
              setInitialValue={setInitialValue}
            />
          </Route>
          <Route
            exact
            path={`${path}/:parentMenu/:subMenu/preview/:versionId/:contentModalId/:contentModalDataId/:environmentId`}>
            <PreviewRules />
          </Route>
          <Route exact path={`${path}/facets`}>
            <Facets onAddFacetClick={onAddFacetClick} />
          </Route>
          <Route
            exact
            path={`${path}/:environmentId/facets/:facetName/add-facet`}>
            <FacetsDetail onSaveFacetClick={onSaveFacetClick} ref={childRef} />
          </Route>

          <Route exact path={`${path}/dictionaries/stop-words`}>
            <ListStopwords
              isEnableStopWord={isEnableStopWord}
              setIsEnableStopWord={setIsEnableStopWord}
              environment={environment}
            />
          </Route>
          <Route exact path={`${path}/dictionaries/stop-words/settings`}>
            <StopWordsSettings
              isEnableStopWord={isEnableStopWord}
              setIsEnableStopWord={setIsEnableStopWord}
              environment={environment}
            />
          </Route>

          <Route exact path={`${path}/dictionaries/spell-check`}>
            <ListSpellCheck
              isEnableSpellCheck={isEnableSpellCheck}
              setIsEnableSpellCheck={setIsEnableSpellCheck}
              environment={environment}
            />
          </Route>
          <Route exact path={`${path}/dictionaries/spell-check/settings`}>
            <SpellCheckSettings
              isEnableSpellCheck={isEnableSpellCheck}
              setIsEnableSpellCheck={setIsEnableSpellCheck}
              isEnableSmartSuggestions={isEnableSpellCheckSmartSuggestions}
              setIsEnableSmartSuggestions={
                setIsEnableSpellCheckSmartSuggestions
              }
              environment={environment}
            />
          </Route>
          {/*<Route*/}
          {/*  exact*/}
          {/*  path={`${path}/dictionaries/spell-check/smart-suggestions`}>*/}
          {/*  <ListSpellCheckSmartSuggestions*/}
          {/*    isEnableSmartSuggestion={isEnableSpellCheckSmartSuggestions}*/}
          {/*    setIsEnableSmartSuggestions={*/}
          {/*      setIsEnableSpellCheckSmartSuggestions*/}
          {/*    }*/}
          {/*    environment={environment}*/}
          {/*  />*/}
          {/*</Route>*/}

          <Route exact path={`${path}/enrich/synonyms`}>
            <ListSynonyms
              isEnableSynonyms={isEnableSynonyms}
              setIsEnableSynonyms={setIsEnableSynonyms}
              environment={environment}
            />
          </Route>
          <Route exact path={`${path}/enrich/synonyms/settings`}>
            <SynonymsSettings
              isEnableSynonyms={isEnableSynonyms}
              isEnableSmartSuggestions={isEnableSynonymsSmartSuggestions}
              setIsEnableSynonyms={setIsEnableSynonyms}
              setIsEnableSmartSuggestions={setIsEnableSynonymsSmartSuggestions}
              environment={environment}
            />
          </Route>
          <Route exact path={`${path}/enrich/synonyms/smart-suggestions`}>
            <ListSynonymsSmartSuggestions
              isEnableSmartSuggestions={isEnableSynonymsSmartSuggestions}
              setIsEnableSmartSuggestions={setIsEnableSynonymsSmartSuggestions}
              environment={environment}
            />
          </Route>

          <Route exact path={`${path}/enrich/phrases`}>
            <ListPhrases
              isEnablePhrases={isEnablePhrases}
              setIsEnablePhrases={setIsEnablePhrases}
              environment={environment}
            />
          </Route>
          <Route exact path={`${path}/enrich/phrases/settings`}>
            <PhrasesSettings
              isEnablePhrases={isEnablePhrases}
              setIsEnablePhrases={setIsEnablePhrases}
              isEnableSmartSuggestions={isEnablePhrasesSmartSuggestions}
              setIsEnableSmartSuggestions={setIsEnablePhrasesSmartSuggestions}
              environment={environment}
            />
          </Route>
          <Route exact path={`${path}/enrich/phrases/smart-suggestions`}>
            <ListPhrasesSmartSuggestions
              isEnablePhrasesSmartSuggestions={isEnablePhrasesSmartSuggestions}
              setIsEnableSmartSuggestions={setIsEnablePhrasesSmartSuggestions}
              environment={environment}
            />
          </Route>
          <Route exact path={`${path}/enrich/auto-complete`}>
            <ListAutoComplete
              isEnableAutoComplete={isEnableAutoComplete}
              setIsEnableAutoComplete={setIsEnableAutoComplete}
              environment={environment}
            />
          </Route>
          <Route exact path={`${path}/enrich/auto-complete/settings`}>
            <AutoCompleteSettings
              isEnableAutoComplete={isEnableAutoComplete}
              setIsEnableAutoComplete={setIsEnableAutoComplete}
              environment={environment}
            />
          </Route>
          <Route exact path={`${path}/enrich/re-ranking`}>
            <ReRanking />
          </Route>
          <Route path="*" component={PageNotFound} />
        </Switch>
      </SubSideBar>
    </div>
  );
};

export default Merchandising;
