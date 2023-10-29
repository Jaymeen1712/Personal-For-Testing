import React, { Suspense, lazy, useEffect } from 'react';
import { QueryClientProvider } from 'react-query';
import './i18n';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import queryClient from './query-client';
import Spinner from './components/spinner';

import { UserContextProvider } from './context/user';
import { openNotificationWithIcon, USER_ACCESS_KEY } from './utills';
import Cookies from 'js-cookie';
const Login = lazy(() => import('./pages/authentication/login'));
const ForgotPassword = lazy(
  () => import('./pages/authentication/forgot-password')
);
const TwoFactorAuthentication = lazy(
  () => import('./pages/authentication/two-factor-authentication')
);
const GlobalRoutes = lazy(() => import('./pages/global/routes'));
const WorkspaceRoute = lazy(() => import('./pages/workspace/routes'));
const SetPassword = lazy(() => import('./pages/authentication/set-password'));
const NotAccess = lazy(() => import('./components/not-access'));
const PageNotFound = lazy(() => import('./components/page-not-found'));

const App = () => {
  useEffect(() => {
    window.addEventListener('offline', (event) => {
      openNotificationWithIcon(
        'error',
        'Please check your network connection and try again.'
      );
    });
  }, []);
  return (
    <Suspense fallback={<Spinner />}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <UserContextProvider>
            <Switch>
              <Route exact path="/">
                {Cookies.get(USER_ACCESS_KEY.TOKEN) ? (
                  <Redirect to="/workspaces" />
                ) : (
                  <Redirect to="/login" />
                )}
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route path="/forgot-password">
                <ForgotPassword />
              </Route>
              <Route path="/set-password">
                <SetPassword />
              </Route>
              <Route path="/reset-password">
                <SetPassword isResetPassword />
              </Route>
              <Route path="/two-factor-authentication/:type/:preference">
                <TwoFactorAuthentication />
              </Route>
              <Route path="/workspaces/:workspaceId">
                <WorkspaceRoute />
              </Route>
              <Route path="/not-access">
                <NotAccess />
              </Route>
              <GlobalRoutes />
              <Route path="/*" exact component={PageNotFound} />
            </Switch>
          </UserContextProvider>
        </Router>
      </QueryClientProvider>
    </Suspense>
  );
};

export default App;
