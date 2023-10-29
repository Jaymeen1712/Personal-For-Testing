import { useTranslation } from 'react-i18next';
import { useWorkspaces } from '../../apis/authentication';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import { API_QUERY_KEY, removeCookies, USER_ACCESS_KEY } from '../../utills';
import queryClient from '../../query-client';
import useLogout from '../../apis/logout';

const useNotAccessController = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [noDataVisible, setNoDataVisible] = useState<boolean>(false);
  const [isLogout, setIsLogout] = useState<boolean>(false);

  const workspaces = useWorkspaces();
  const logout = useLogout(isLogout);

  useEffect(() => {
    if (workspaces.data && workspaces.data.length > 0) {
      history.push(`/workspaces/${workspaces.data[0].id}/dashboard/cms`);
      setNoDataVisible(false);
    } else {
      setNoDataVisible(true);
    }
  }, [workspaces, history]);

  const redirectToLogin = () => {
    setIsLogout(true);
    logout.remove();
  };

  useEffect(() => {
    if (isLogout && logout.isSuccess) {
      queryClient.refetchQueries([API_QUERY_KEY.PROFILE]);
      queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
      queryClient.refetchQueries([API_QUERY_KEY.USER_WORKSPACES]);
      setIsLogout(false);
      Cookies.remove(USER_ACCESS_KEY.TOKEN);
      Cookies.remove(USER_ACCESS_KEY.TENANT_ID);
      Cookies.remove(USER_ACCESS_KEY.STORE_LINK);
      Cookies.remove('pageEditorPopUp');
      localStorage.clear();
      localStorage.removeItem('environmentId');
      removeCookies();
      history.push('/login');
    }
  }, [logout.isSuccess, isLogout, history]);

  return {
    t,
    noDataVisible,
    workspaces,
    redirectToLogin,
  };
};

export default useNotAccessController;
