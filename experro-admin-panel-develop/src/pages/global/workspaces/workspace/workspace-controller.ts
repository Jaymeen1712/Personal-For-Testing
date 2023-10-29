import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import { useHistory, useParams } from 'react-router-dom';

import queryClient from '../../../../query-client';
import { openNotificationWithIcon, USER_ACCESS_KEY } from '../../../../utills';
import { useSwitchWorkspace, useWorkspaces } from '../services';
import { IWorkspace, IWorkspaceResponse } from '../../../../types';

interface IWorkspaceController {
  workspace: IWorkspaceResponse;
  onEditWorkspace: (workspace: IWorkspace) => void;
  onDeleteWorkspace: (workspace: IWorkspace) => void;
}

const useWorkspace = ({ workspace, onEditWorkspace }: IWorkspaceController) => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const workspaces = useWorkspaces();
  const switchWorkspace = useSwitchWorkspace();

  const link = useMemo(
    () => `/workspaces/${workspace.id}/dashboard/traffic`,
    [workspace]
  );

  const currentWorkspace = useMemo(() => {
    return workspaces.data?.find(
      (workspace) => workspace.id === link.split('/')[2]
    );
  }, [workspaces.data, link]);

  const duration = useMemo(() => {
    const sec = Math.floor(
      Math.abs(
        new Date().valueOf() -
          new Date(workspace.modifiedAt || workspace.createdAt).valueOf()
      ) / 1000
    );

    if (sec <= 60) {
      return `${sec} ${t('common.labels.sec')}`;
    }

    const minutes = Math.floor(sec / 60);
    if (minutes <= 60) {
      return `${minutes} ${
        minutes === 1 ? t('common.labels.minute') : t('common.labels.minutes')
      }`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours <= 60) {
      return `${hours} ${
        hours === 1 ? t('common.labels.hour') : t('common.labels.hours')
      }`;
    }

    const days = Math.floor(hours / 24);
    return `${days} ${
      days === 1 ? t('common.labels.day') : t('common.labels.days')
    }`;
  }, [t, workspace.createdAt, workspace.modifiedAt]);

  const onDuplicateClick = useCallback(
    (workspaceId: string, e?: React.MouseEvent<HTMLElement>) => {
      e?.stopPropagation();
      onEditWorkspace({
        name: workspace.name,
        description: workspace.description,
      });
    },
    [onEditWorkspace, workspace.description, workspace.name]
  );

  const copiedText = useCallback(() => {
    localStorage.clear();
    localStorage.removeItem('environmentId');
    openNotificationWithIcon('success', t('common.messages.linked_copied'));
  }, [t]);

  const onWorkspaceClick = useCallback(() => {
    localStorage.clear();
    localStorage.removeItem('environmentId');
    switchWorkspace.mutate(link.split('/')[2]);
  }, [link, switchWorkspace]);

  useEffect(() => {
    if (switchWorkspace.isSuccess) {
      push(link);
      queryClient.clear();
      if (currentWorkspace && currentWorkspace.storeLink) {
        Cookies.set(USER_ACCESS_KEY.STORE_LINK, currentWorkspace.storeLink);
      }
    }
  }, [switchWorkspace.isSuccess, link, push, currentWorkspace]);

  return {
    link,
    workspaceId,
    copiedText,
    duration,
    t,
    onWorkspaceClick,
    onDuplicateClick,
  };
};

export default useWorkspace;
