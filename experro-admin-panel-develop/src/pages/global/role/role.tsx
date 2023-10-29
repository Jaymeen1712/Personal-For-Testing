import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SubSideBar from '../../../components/sub-sidebar/sub-sidebar';
import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../utills';
import ListRole from './list';
import CreateUpdateRole from '../../../components/role/create-update';

const Role: React.FC = () => {
  const { path } = useRouteMatch();
  return (
    <div className="page-wrapper">
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.GLOBAL.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.GLOBAL.SETTINGS.GENERAL.ROLES
        }>
        <Switch>
          <Route exact path={`${path}/`}>
            <ListRole />
          </Route>
          <Route exact path={`${path}/create`}>
            <CreateUpdateRole />
          </Route>
          <Route exact path={`${path}/:roleId`}>
            <CreateUpdateRole />
          </Route>
        </Switch>
      </SubSideBar>
    </div>
  );
};

export default Role;
