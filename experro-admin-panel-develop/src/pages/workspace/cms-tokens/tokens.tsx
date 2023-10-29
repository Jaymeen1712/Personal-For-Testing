import React from 'react';
import { Tabs } from 'antd';

import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../utills';
import useTokensController from './tokens-controller';
import SubSideBar from '../../../components/sub-sidebar';
import TokensHeader from './tokens-header';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { CreateUpdateApiToken, ListApiToken } from './api-token';
import { ListCLIToken } from './cli-token';

interface ITokens {
  onMainSidebarActiveItem?: (val: string) => void;
}

const Tokens: React.FC<ITokens> = ({ onMainSidebarActiveItem }) => {
  const {
    onTabChange,
    canReadAPITokenPermission,
    canReadCLITokenPermission,
    defaultActiveKey,
    t,
  } = useTokensController({
    onMainSidebarActiveItem,
  });
  const { path } = useRouteMatch();

  return (
    <div className="page-wrapper">
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.CMS_TOKENS
        }
        isGlobalPage={false}
        isEnvironmentSelectorVisible={true}
        isEnvironmentSelectorDisable={true}
        environmentSelectDefaultValue={'All'}
        disableEnvironmentToolTipMessage={t(
          'common.messages.environment_is_not_applicable'
        )}>
        <Switch>
          <Route exact path={`${path}/`}>
            <TokensHeader t={t} />
            <div className="cms-tokens">
              <Tabs
                onChange={onTabChange}
                defaultActiveKey={defaultActiveKey}
                className="email-tabs">
                <>
                  {canReadAPITokenPermission && (
                    <Tabs.TabPane
                      tab={t('common.labels.api_tokens')}
                      key="apiToken">
                      <ListApiToken />
                    </Tabs.TabPane>
                  )}
                  {canReadCLITokenPermission && (
                    <Tabs.TabPane
                      tab={t('common.labels.cli_tokens')}
                      key="cliToken">
                      <ListCLIToken />
                    </Tabs.TabPane>
                  )}
                </>
              </Tabs>
            </div>
          </Route>
          <Route exact path={`${path}/create`}>
            <CreateUpdateApiToken />
          </Route>
          <Route exact path={`${path}/:tokenId`}>
            <CreateUpdateApiToken />
          </Route>
        </Switch>
      </SubSideBar>
    </div>
  );
};

export default Tokens;
