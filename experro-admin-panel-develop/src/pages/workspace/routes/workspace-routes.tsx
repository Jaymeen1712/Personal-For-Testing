import React, { useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Layout } from 'antd';

import usePermissions from '../../../hooks/permissions';
import { ContentLibraryContextProvider } from '../content-library/context';
import AppIntegrations from '../integrations/app-integrations';
import Tokens from '../cms-tokens/tokens';
import Menu from '../../../components/menu';
import AuthenticatedRoute from '../../../components/authenticated-route';
import Dashboard from '../demo-dashboard';
import Security from '../security';
import Profile from '../profile';
import WorkspaceUserComponent from '../user';
import WorkspaceRoleComponent from '../role';
import Workspace from '../workspace/index';
import MediaManager from '../media-manager/index';
import ContentLibrary from '../content-library';
import ListBigcommerceStore from '../bigcommerce-store/list';
import CreateUpdateBigcommerceStore from '../bigcommerce-store/create-update';
import ListTheme from '../theme';
import DetailsBigcommerceStore from '../bigcommerce-store/details';
import NavigationComponent from '../navigation';
import Merchandising from '../merchandising';
import publishQueue from '../publishQueue';
// import Personalization from '../personalization';
import ContentModel from '../content-model';
import Redirects from '../301-redirects/list';
import Emails from '../emails';
import EdgeCaching from '../edge-caching';
import PageNotFound from '../../../components/page-not-found';
import Internationalization from '../internationalization';
import Environments from '../environments/environments';
import Audience from '../new-audience';
import queryClient from '../../../query-client';
import { API_QUERY_KEY } from '../../../utills';
import Platforms from '../integrations/platform-integrations';
import PersonalizationNew from '../personalization';

const WorkspaceRoutes = () => {
  const { path } = useRouteMatch();
  const {
    canReadInternationalizationLanguage,
    canAccessDashboard,
    canReadUser,
    canReadRole,
    canReadEcommerceStore,
    canCreateEcommerceStore,
    canUpdateEcommerceStore,
    canAccessMediaManager,
    canRead301Redirect,
    permissions,
  } = usePermissions();

  const [mainSidebarActiveItem, setMainSidebarActiveItem] = useState('');

  const [mainSidebarCollapsed, setMainSidebarCollapsed] = useState(false);

  const onMainSidebarActiveItem = (mainSidebarActiveItemKey: string) => {
    setMainSidebarActiveItem(mainSidebarActiveItemKey);
  };

  useEffect(() => {
    queryClient.refetchQueries([API_QUERY_KEY.USERS_ALL]);
  }, []);

  useEffect(() => {
    //@ts-ignore
    const onMainSidebarCollapsed = (e) => {
      setMainSidebarCollapsed(e.detail);
    };

    document.addEventListener('toggleMainSidebar', onMainSidebarCollapsed);

    return () => {
      document.removeEventListener('toggleMainSidebar', onMainSidebarCollapsed);
    };
  }, [mainSidebarCollapsed]);

  return (
    <Layout className={'page'}>
      {!mainSidebarCollapsed && Object.keys(permissions).length > 0 && (
        <Layout.Sider collapsed className="mainmenu">
          <Menu
            isGlobalPage={false}
            sidebarActiveItemKey={mainSidebarActiveItem}
          />
        </Layout.Sider>
      )}

      <Switch>
        <Route exact path={`${path}/dashboard/:dashboardType`}>
          <AuthenticatedRoute
            checkPermission={canAccessDashboard}
            component={Dashboard}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route exact path={`${path}/workspace`}>
          <AuthenticatedRoute
            component={Workspace}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/cms-tokens`}>
          <AuthenticatedRoute
            component={Tokens}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/internationalization`}>
          <AuthenticatedRoute
            checkPermission={canReadInternationalizationLanguage}
            component={Internationalization}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/environments`}>
          <AuthenticatedRoute
            component={Environments}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/users`}>
          <AuthenticatedRoute
            checkPermission={canReadUser}
            component={WorkspaceUserComponent}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/content-model`}>
          <AuthenticatedRoute
            component={ContentModel}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/roles`}>
          <AuthenticatedRoute
            checkPermission={canReadRole}
            component={WorkspaceRoleComponent}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route exact path={`${path}/bigcommerce-store`}>
          <AuthenticatedRoute
            checkPermission={canReadEcommerceStore}
            component={ListBigcommerceStore}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route exact path={`${path}/bigcommerce-store/create`}>
          <AuthenticatedRoute
            checkPermission={canCreateEcommerceStore}
            component={CreateUpdateBigcommerceStore}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route exact path={`${path}/bigcommerce-store/:storeId`}>
          <AuthenticatedRoute
            checkPermission={canUpdateEcommerceStore}
            component={CreateUpdateBigcommerceStore}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route exact path={`${path}/bigcommerce-store/:storeId/details`}>
          <AuthenticatedRoute
            checkPermission={canReadEcommerceStore}
            component={DetailsBigcommerceStore}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route exact path={`${path}/media-manager`}>
          <AuthenticatedRoute
            checkPermission={canAccessMediaManager}
            //@ts-ignore
            component={MediaManager}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>

        <Route path={`${path}/navigation`}>
          <AuthenticatedRoute
            component={NavigationComponent}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route exact path={`${path}/theme`}>
          <AuthenticatedRoute
            component={ListTheme}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route exact path={`${path}/profile`}>
          <AuthenticatedRoute
            component={Profile}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route exact path={`${path}/security`}>
          <AuthenticatedRoute
            component={Security}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/content-library`}>
          <ContentLibraryContextProvider>
            <AuthenticatedRoute
              component={ContentLibrary}
              onMainSidebarActiveItem={onMainSidebarActiveItem}
            />
          </ContentLibraryContextProvider>
        </Route>
        <Route path={`${path}/discovery`}>
          <AuthenticatedRoute
            component={Merchandising}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/audience`}>
          <AuthenticatedRoute
            component={Audience}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/personalization`}>
          <AuthenticatedRoute
            component={PersonalizationNew}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/publishQueue`}>
          <AuthenticatedRoute
            component={publishQueue}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/301-redirects`}>
          <AuthenticatedRoute
            component={Redirects}
            checkPermission={canRead301Redirect}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/emails`}>
          <AuthenticatedRoute
            component={Emails}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/edge-caching`}>
          <AuthenticatedRoute
            component={EdgeCaching}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/apps`}>
          <AuthenticatedRoute
            component={AppIntegrations}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route path={`${path}/platforms`}>
          <AuthenticatedRoute
            component={Platforms}
            onMainSidebarActiveItem={onMainSidebarActiveItem}
          />
        </Route>
        <Route component={PageNotFound} />
      </Switch>
    </Layout>
  );
};

export default WorkspaceRoutes;
