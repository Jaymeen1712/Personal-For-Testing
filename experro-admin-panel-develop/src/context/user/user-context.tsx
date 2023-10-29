import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';

import useWorkspaces from '../../../../apis/authentication/workspaces';
import { useListLanguages } from '../../../../apis/internationalization';
import { USER_ACCESS_KEY, PERMISSIONS, removeCookies } from '../../../../utills';
import Cookies from 'js-cookie';
import { useListAllUser } from '../../../../apis/user';
import { IWorkspace, ILanguage } from '../../../../types';
import { useGetPermissions, useProfile } from '../../../../apis/authentication';

// import { useAllWorkspaces } from '../../apis/authentication';

export interface UserContextProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    timezone: string;
    permissions: { [key: string]: boolean };
    workspaceId?: string;
    isProfileImage?: boolean;
    profileUrl?: string;
    id?: string;
    tenantId?: string;
  };
  isLoading: boolean;
  isAuthenticated: boolean;
  listAllUser?: { [k: string]: string };
  AllWorkspacesList?: IWorkspace[];
  languagesList: ILanguage[];
}

interface UserContextProviderProps {
  children?: ReactNode;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const match = useRouteMatch<{ workspaceId?: string }>(
    '/workspaces/:workspaceId'
  );

  const [listUserName, setListUserName] = useState<{ [k: string]: string }>();
  const [languagesList, setLanguagesList] = useState<ILanguage[]>([]);
  const profile = useProfile();
  const workspaces = useWorkspaces();
  const listAllUser = useListAllUser();
  const getLanguagesList = useListLanguages();
  const workspaceId =
    workspaces.data &&
    workspaces.data.length > 0 &&
    !profile.data?.hasGlobalRole
      ? workspaces.data[0].id
      : '';

  // const allWorkspaces = useAllWorkspaces();
  const permissions = useGetPermissions(
    match?.params?.workspaceId || workspaceId,
    !(profile.isSuccess && workspaces.isSuccess)
  );
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (
      (location.pathname === '/' ||
        location.pathname === '/login' ||
        location.pathname.search('workspaces') !== -1 ||
        location.pathname === '/groups' ||
        location.pathname === '/users' ||
        location.pathname === '/roles') &&
      localStorage.getItem('isTwoFactorAuthentication') === 'true'
    ) {
      Cookies.remove(USER_ACCESS_KEY.TOKEN);
      Cookies.remove(USER_ACCESS_KEY.TENANT_ID);
      Cookies.remove(USER_ACCESS_KEY.STORE_LINK);
      Cookies.remove('pageEditorPopUp');
      localStorage.clear();
      localStorage.removeItem('environmentId');
      localStorage.removeItem('isTwoFactorAuthentication');
      removeCookies();
      history.push('/login');
    }

    if (
      location.pathname === '/login' &&
      !permissions.isFetching &&
      !permissions.isLoading &&
      permissions.data &&
      permissions.isSuccess &&
      workspaces.data &&
      Cookies.get(USER_ACCESS_KEY.TOKEN)
    ) {
      const permissionList = permissions.data.item;

      if (profile.data?.workspaceId && workspaces.data.length > 0) {
        if (workspaces.data?.length > 0) {
          const workspaceData = workspaces.data?.find(
            (item) => item.id === profile.data?.workspaceId
          );
          if (workspaces && workspaces.data.length > 0) {
            history.push(`/workspaces`);
          } else {
            if (workspaceData) {
              history.push(`/workspaces/${workspaceData.id}/dashboard/traffic`);
            }
          }
        }
      } else if (permissionList[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']]) {
        history.push('/workspaces');
      } else if (
        permissionList[PERMISSIONS['GLOBAL.CAN_MANAGE_USER_AND_SECURITY']]
      ) {
        history.push('/users');
      } else if (
        permissionList &&
        workspaces.data.length === 0 &&
        !permissionList[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] &&
        !permissionList[PERMISSIONS['GLOBAL.CAN_MANAGE_USER_AND_SECURITY']]
      ) {
        history.push('/not-access');
      } else {
        const workspace = workspaces.data[0];
        if (workspaces.data.length > 0) {
          history.push('/workspaces');
        } else {
          history.push(`/workspaces/${workspace.id}/dashboard/traffic`);
        }
      }
    }

    if (
      ![
        '/login',
        '/two-factor-authentication/email/email',
        '/two-factor-authentication/authenticatorApp/authenticatorApp',
        '/two-factor-authentication/authenticateUsingBoth/email',
        '/two-factor-authentication/authenticateUsingBoth/authenticator_app',
      ].includes(location.pathname) &&
      !permissions.isFetching &&
      !permissions.isLoading &&
      !workspaces.isFetching &&
      !workspaces.isLoading &&
      workspaces.isSuccess &&
      workspaces.data &&
      permissions.isSuccess &&
      permissions.data &&
      JSON.stringify(permissions.data.item) !== '{}' &&
      Cookies.get(USER_ACCESS_KEY.TOKEN)
    ) {
      const permissionList = permissions.data.item;

      if (
        permissionList &&
        workspaces.data.length === 0 &&
        !permissionList[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] &&
        !permissionList[PERMISSIONS['GLOBAL.CAN_MANAGE_USER_AND_SECURITY']]
      ) {
        history.push('/not-access');
      }
    }

    if (
      ![
        '/login',
        '/two-factor-authentication/email/email',
        '/two-factor-authentication/authenticatorApp/authenticatorApp',
        '/two-factor-authentication/authenticateUsingBoth/email',
        '/two-factor-authentication/authenticateUsingBoth/authenticator_app',
      ].includes(location.pathname) &&
      !permissions.isFetching &&
      !permissions.isLoading &&
      !workspaces.isFetching &&
      !workspaces.isLoading &&
      workspaces.isSuccess &&
      workspaces.data &&
      permissions.isSuccess &&
      permissions.data &&
      Cookies.get(USER_ACCESS_KEY.TOKEN)
    ) {
      const permissionList = permissions.data.item;

      if (
        permissionList &&
        workspaces.data.length === 0 &&
        !permissionList[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] &&
        !permissionList[PERMISSIONS['GLOBAL.CAN_MANAGE_USER_AND_SECURITY']]
      ) {
        history.push('/not-access');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    history,
    location?.pathname,
    permissions.data,
    workspaces.data,
    profile.data?.workspaceId,
    permissions.isSuccess,
    workspaces.isSuccess,
    permissions.isLoading,
    permissions.isFetching,
    workspaces.isFetching,
    workspaces.isLoading,
  ]);

  useEffect(() => {
    if (
      profile.isSuccess &&
      permissions.isSuccess &&
      !Cookies.get(USER_ACCESS_KEY.TOKEN) &&
      ![
        '/login',
        '/forgot-password',
        '/set-password',
        '/reset-password',
      ].includes(location.pathname)
    ) {
      localStorage.clear();
      localStorage.removeItem('environmentId');
      history.push('/login');
    }
  }, [
    profile.isSuccess,
    profile.data,
    permissions.isSuccess,
    location.pathname,
    history,
  ]);

  useEffect(() => {
    if (
      workspaces.data &&
      match?.params?.workspaceId &&
      workspaces.data.length &&
      workspaces.data.findIndex(
        (workspace) => workspace.id === match?.params?.workspaceId
      ) === -1
    ) {
      localStorage.clear();
      localStorage.removeItem('environmentId');

      const workspace = workspaces.data[0];
      if (workspaces.data.length > 0) {
        history.push('/workspaces');
      } else {
        history.push(`/workspaces/${workspace.id}/dashboard/traffic`);
      }
    }
  }, [history, match?.params?.workspaceId, workspaces.data]);

  useEffect(() => {
    const listUserObject: { [k: string]: string } = {};
    if (listAllUser.isSuccess) {
      listAllUser.data.sort(function (a, b) {
        if (a.firstName.toLocaleLowerCase() < b.firstName.toLocaleLowerCase()) {
          return -1;
        }
        if (a.firstName.toLocaleLowerCase() > b.firstName.toLocaleLowerCase()) {
          return 1;
        }
        return 0;
      });
      listAllUser.data.map((item) => {
        return (listUserObject[item.id] = `${item.firstName} ${item.lastName}`);
      });
      setListUserName(listUserObject);
    }
  }, [listAllUser.isSuccess, listAllUser.data]);

  useEffect(() => {
    if (getLanguagesList.isSuccess) {
      setLanguagesList(getLanguagesList.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLanguagesList.isSuccess]);

  return (
    <UserContext.Provider
      value={{
        user:
          profile.data && permissions.data
            ? { ...profile.data, permissions: permissions.data.item }
            : undefined,
        isAuthenticated: profile.isSuccess && permissions.isSuccess,
        isLoading:
          profile.isLoading || permissions.isLoading || workspaces.isLoading,
        listAllUser: listUserName,
        AllWorkspacesList: workspaces.data,
        languagesList: languagesList,
      }}>
      {children}
    </UserContext.Provider>
  );
};
