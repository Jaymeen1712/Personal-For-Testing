import React from 'react';
import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../utills';
import { Route, Switch } from 'react-router-dom';
import UpdateEnvironments from '../environments/update';
import GraphQlEnvironments from '../environments/graphQl';
import SubSideBar from '../../../components/sub-sidebar';
import ListEnvironments from './list';
import useEnvironmentsController from './environments-controller';

interface IListEnvironments {
  onMainSidebarActiveItem?: (val: string) => void;
}

const Environments: React.FC<IListEnvironments> = ({
  onMainSidebarActiveItem,
}) => {
  const { path, t } = useEnvironmentsController({ onMainSidebarActiveItem });

  return (
    <div className="page-wrapper">
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.ENVIRONMENTS
        }
        isEnvironmentSelectorVisible={true}
        isEnvironmentSelectorDisable={true}
        environmentSelectDefaultValue={'All'}
        disableEnvironmentToolTipMessage={t(
          'common.messages.environment_is_not_applicable'
        )}>
        <Switch>
          <Route exact path={`${path}/`}>
            <ListEnvironments />
          </Route>
          <Route exact path={`${path}/:environmentId`}>
            <UpdateEnvironments />
          </Route>
          <Route exact path={`${path}/:environmentId/graphQl`}>
            <GraphQlEnvironments />
          </Route>
        </Switch>
      </SubSideBar>
    </div>
  );
};

export default Environments;
