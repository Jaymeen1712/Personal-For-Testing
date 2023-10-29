import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SubSideBar from '../../../components/sub-sidebar/sub-sidebar';
import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../utills';
import ListUser from './list';
import AddUser from './add-update';
import AuthenticatedRoute from '../../../components/authenticated-route/authenticated-route';
import usePermissions from '../../../hooks/permissions/permissions';
import { useTranslation } from 'react-i18next';

const User: React.FC = () => {
  const { path } = useRouteMatch();
  const { canCreateUser, canUpdateUser } = usePermissions();
  const { t } = useTranslation();

  return (
    <div className="page-wrapper">
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.ADMINISTRATION.USERS
        }
        isEnvironmentSelectorVisible={true}
        isEnvironmentSelectorDisable={true}
        environmentSelectDefaultValue={'All'}
        disableEnvironmentToolTipMessage={t(
          'common.messages.environment_is_not_applicable'
        )}>
        <Switch>
          <Route exact path={`${path}/`}>
            <ListUser />
          </Route>
          <Route exact path={`${path}/add`}>
            <AuthenticatedRoute
              checkPermission={canCreateUser}
              component={AddUser}
            />
          </Route>
          <Route exact path={`${path}/:userId`}>
            <AuthenticatedRoute
              checkPermission={canUpdateUser}
              component={AddUser}
            />
          </Route>
        </Switch>
      </SubSideBar>
    </div>
  );
};

export default User;
