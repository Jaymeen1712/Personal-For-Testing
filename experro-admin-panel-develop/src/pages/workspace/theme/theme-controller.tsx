import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_KEYS } from '../../../utills';
import { useParams } from 'react-router-dom';
import { useListEnvironments } from '../../../apis/environments';
import { useGetThemeStatus } from './services';

interface IUseListThemeController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useListThemeController = ({
  onMainSidebarActiveItem,
}: IUseListThemeController) => {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const listEnvironments = useListEnvironments(workspaceId);

  const [environmentIds, setEnvironmentIds] = useState<string[]>([]);

  const [isThemePublished, setIsThemePublished] = useState(false);

  const themePublishStatus = useGetThemeStatus(workspaceId, environmentIds);

  let apiCallInterval: ReturnType<typeof setInterval>;

  const [isPublishButtonDisabled, setIsPublishButtonDisabled] =
    useState<boolean>(false);

  const { t } = useTranslation();

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>();

  const refetchThemeStatus = () => {
    themePublishStatus.refetch();
  };

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (listEnvironments.isSuccess) {
      const envIds = [...environmentIds];
      listEnvironments.data.forEach((env) => {
        if (!environmentIds.some((id) => id === env.id)) {
          envIds.push(env.id);
        }
      });
      setEnvironmentIds(envIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listEnvironments.isSuccess]);

  useEffect(() => {
    if (
      themePublishStatus.isSuccess &&
      themePublishStatus.isFetched &&
      themePublishStatus.data
    ) {
      const value = Object.values(themePublishStatus.data).some(
        (value) => value === true
      );

      setIsPublishButtonDisabled(value);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themePublishStatus.isFetching]);

  useEffect(() => {
    // eslint-disable-next-line
    apiCallInterval = setInterval(refetchThemeStatus, 30000);

    intervalIdRef.current = apiCallInterval;

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, []);

  return {
    t,
    listEnvironments,
    isPublishButtonDisabled,
    setIsPublishButtonDisabled,
    themePublishStatus,
    environmentIds,
    isThemePublished,
    setIsThemePublished,
  };
};

export default useListThemeController;
