import React from 'react';
import { Redirect } from 'react-router-dom';

import useUser from '../../hooks/user';
import Spinner from '../spinner';

interface AuthenticatedRouteProps {
  checkPermission?: () => boolean;
  component: React.FC<{ onMainSidebarActiveItem?: (val: string) => void }>;
  onMainSidebarActiveItem?: (val: string) => void;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
  checkPermission,
  component: Component,
  onMainSidebarActiveItem,
}) => {
  const userContext = useUser();

  if (!userContext || userContext.isLoading) {
    return <Spinner />;
  }

  if (!userContext.isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (checkPermission ? !checkPermission() : false) {
    return <Redirect to="/login" />;
  }

  return <Component onMainSidebarActiveItem={onMainSidebarActiveItem} />;
};

export default AuthenticatedRoute;
