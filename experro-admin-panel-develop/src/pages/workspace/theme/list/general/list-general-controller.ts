import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useListEnvironments } from '../../../../../apis/environments';
import { useListTheme, usePublishTheme } from '../../services';
import {
  IAPIError,
  IListEnvironments,
  IThemeStatus,
} from '../../../../../types';
import { IListThemeResponse } from '../../../../../types';
import useUser from '../../../../../hooks/user';
import { useEffect, useState } from 'react';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../../utills';
import useError from '../../../../../hooks/error/error';
import usePermissions from '../../../../../hooks/permissions/permissions';
import { UseQueryResult } from 'react-query';
import queryClient from '../../../../../query-client';

const useListGeneralController = (
  themePublishStatus: UseQueryResult<IThemeStatus | undefined, IAPIError>
) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const userDetails = useUser();
  const publishTheme = usePublishTheme(workspaceId);

  const listEnvironments = useListEnvironments(workspaceId);
  const listTheme = useListTheme(workspaceId);

  const environmentRecord: IListEnvironments[] = [];
  const myThemeRecord: IListThemeResponse[] = [];

  const [
    isPublishEnvironmentModalVisible,
    setIsPublishEnvironmentModalVisible,
  ] = useState<boolean>(false);

  const [selectedPublishThemeEnvironment, setSelectedThemePublishEnvironment] =
    useState<string | null>();

  const [themeId, setThemeId] = useState<string>('');

  const [isPublishButtonVisible, setIsPublishButtonVisible] =
    useState<boolean>(true);

  const [themePublishedEnvironmentId, setThemePublishedEnvironmentId] =
    useState<string>('');

  const { canPublishTheme } = usePermissions();

  useError({
    mutation: publishTheme,
    entity: t('common.labels.theme'),
  });

  const developmentId = listEnvironments?.data?.find(
    (ele) => ele.type.toLowerCase() === 'dev'
  )?.id;

  const developmentObject = listTheme?.data?.items.find(
    (element) =>
      element.publishEnvironmentId === developmentId &&
      element.status === 'PUBLISHED'
  );

  const productionId = listEnvironments?.data?.find(
    (ele) => ele.type.toLowerCase() === 'production'
  )?.id;

  const productionObject = listTheme?.data?.items.find(
    (element) =>
      element.publishEnvironmentId === productionId &&
      element.status === 'PUBLISHED'
  );

  const stagingId = listEnvironments?.data?.find(
    (ele) => ele.type.toLowerCase() === 'custom'
  )?.id;

  const stagingObject = listTheme?.data?.items.find(
    (element) =>
      element.publishEnvironmentId === stagingId &&
      element.status === 'PUBLISHED'
  );

  const onPublishTheme = (id: string, publishEnvironmentId: string) => {
    setThemeId(id);
    setThemePublishedEnvironmentId(publishEnvironmentId);
    setIsPublishEnvironmentModalVisible(true);
  };

  const onHideSelectEnvironment = () => {
    setIsPublishEnvironmentModalVisible(false);
    setThemeId('');
    setSelectedThemePublishEnvironment(null);
    setIsPublishButtonVisible(true);
  };

  const onEnvironmentToPublish = () => {
    if (themeId && selectedPublishThemeEnvironment) {
      publishTheme.mutate({
        envId: selectedPublishThemeEnvironment,
        themeId: themeId,
      });

      setTimeout(() => {
        themePublishStatus.refetch();
      }, 1000);
    }
  };

  const onSelectEnvironmentToPublish = (id: string) => {
    setSelectedThemePublishEnvironment(id);
    setIsPublishButtonVisible(false);
  };

  useEffect(() => {
    if (publishTheme.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.theme_published_successfully')
      );
      setIsPublishEnvironmentModalVisible(false);
      setThemeId('');
      setSelectedThemePublishEnvironment(null);
      setIsPublishButtonVisible(true);
      listTheme.refetch();
      queryClient.removeQueries([API_QUERY_KEY.THEME_LIST]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishTheme.isSuccess, t]);

  return {
    t,
    developmentObject,
    myThemeRecord,
    productionObject,
    stagingObject,
    environmentRecord,
    isPublishEnvironmentModalVisible,
    onHideSelectEnvironment,
    onEnvironmentToPublish,
    isPublishButtonVisible,
    selectedPublishThemeEnvironment,
    onSelectEnvironmentToPublish,
    listEnvironments,
    themePublishedEnvironmentId,
    onPublishTheme,
    // themePublishStatus,
    canPublishTheme,
    listTheme,
    workspaceId,
    userDetails,
  };
};

export default useListGeneralController;
