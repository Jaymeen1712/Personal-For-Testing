import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SubSideBar from '../../../components/sub-sidebar/sub-sidebar';
import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../utills';
import ListRole from './list';
import CreateUpdateRole from '../../../components/role/create-update';
import AuthenticatedRoute from '../../../components/authenticated-route/authenticated-route';
import usePermissions from '../../../hooks/permissions/permissions';
import { useTranslation } from 'react-i18next';

const Role: React.FC = () => {
  const { path } = useRouteMatch();
  const { canCreateRole, canUpdateRole } = usePermissions();
  const { t } = useTranslation();

  return (
    <div className="page-wrapper">
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.ADMINISTRATION.ROLES
        }
        isEnvironmentSelectorVisible={true}
        isEnvironmentSelectorDisable={true}
        environmentSelectDefaultValue={'All'}
        disableEnvironmentToolTipMessage={t(
          'common.messages.environment_is_not_applicable'
        )}>
        <Switch>
          <Route exact path={`${path}/`}>
            <ListRole />
          </Route>
          <Route exact path={`${path}/create`}>
            <AuthenticatedRoute
              checkPermission={canCreateRole}
              component={CreateUpdateRole}
            />
          </Route>
          <Route exact path={`${path}/:roleId`}>
            <AuthenticatedRoute
              checkPermission={canUpdateRole}
              component={CreateUpdateRole}
            />
          </Route>
        </Switch>
      </SubSideBar>
    </div>
  );
};

export default Role;
