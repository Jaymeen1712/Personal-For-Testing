import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import Sider from 'antd/es/layout/Sider';

import AuthenticatedRoute from '../../../components/authenticated-route';
import User from '../user';
import RoleComponent from '../role';
import { ListWorkspace } from '../workspaces';
import usePermissions from '../../../hooks/permissions';
import PageNotFound from '../../../components/page-not-found';
import Menu from '../../../components/menu';
import Group from '../group';
import AuditLogs from '../audit-logs';

const GlobalRoutes = () => {
  const { canManageGlobalUserAndSecurity } = usePermissions();

  const [mainSidebarActiveItem, setMainSidebarActiveItem] = useState('');

  const onMainSidebarActiveItem = (mainSidebarActiveItemKey: string) => {
    setMainSidebarActiveItem(mainSidebarActiveItemKey);
  };

  return (
    <Layout className={'page' + (true ? ' sidemenu-close' : '')}>
      <Sider collapsed className="mainmenu">
        <Menu
          isGlobalPage={true}
          sidebarActiveItemKey={mainSidebarActiveItem}
        />
      </Sider>
      <Switch>
        <Route exact path="/workspaces">
          <AuthenticatedRoute
            component={ListWorkspace}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>

        <Route path="/users">
          <AuthenticatedRoute
            checkPermission={canManageGlobalUserAndSecurity}
            component={User}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>

        <Route path="/groups">
          <AuthenticatedRoute
            checkPermission={canManageGlobalUserAndSecurity}
            component={Group}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>

        <Route path="/roles">
          <AuthenticatedRoute
            checkPermission={canManageGlobalUserAndSecurity}
            component={RoleComponent}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>

        <Route path="/audit-logs">
          <AuthenticatedRoute
            checkPermission={canManageGlobalUserAndSecurity}
            component={AuditLogs}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>

        <Route component={PageNotFound} />
      </Switch>
    </Layout>
  );
};

export default GlobalRoutes;
