import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useListEnvironments from '../../apis/environments/list';
import { IListEnvironments } from '../../types';
import { openNotificationWithIcon } from '../../utills';

const useEnvironmentSelectorController = (
  isEnvironmentSelectorDisable?: boolean
) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const [defaultSelect, setDefaultSelect] = useState('');
  const [environmentList, setEnvironmentList] = useState<IListEnvironments[]>(
    []
  );

  const getEnvironmentList = useListEnvironments(workspaceId);

  const onChange = (val: string) => {
    document.dispatchEvent(new CustomEvent('envChange', { detail: val }));
    openNotificationWithIcon(
      'success',
      t('common.messages.environment_change')
    );
    setDefaultSelect(val);
    localStorage.setItem(`${workspaceId}/environmentId`, val);
    document.dispatchEvent(
      new CustomEvent('environmentChange', { detail: val })
    );
  };

  const onRedirect = () => {
    if (getEnvironmentList.data) {
      if (isEnvironmentSelectorDisable) {
        const findEnvironment = getEnvironmentList.data.find(
          (item) => item.type === 'PRODUCTION'
        );
        if (findEnvironment) {
          if (findEnvironment.customDomain) {
            window.open(`https://${findEnvironment.customDomain}`, '_blank');
          } else if (findEnvironment.cacheDomain) {
            window.open(`https://${findEnvironment.cacheDomain}`, '_blank');
          } else {
            window.open(`https://${findEnvironment.workspaceDomain}`, '_blank');
          }
        }
      } else {
        const selectedEnvironmentDetail = getEnvironmentList.data.find(
          (environment) => environment.id === defaultSelect
        );

        if (selectedEnvironmentDetail) {
          if (
            selectedEnvironmentDetail.customDomain &&
            selectedEnvironmentDetail.customDomain !== ''
          ) {
            window.open(
              `https://${selectedEnvironmentDetail.customDomain}`,
              '_blank'
            );
          } else if (
            selectedEnvironmentDetail.cacheDomain &&
            selectedEnvironmentDetail.cacheDomain !== ''
          ) {
            window.open(
              `https://${selectedEnvironmentDetail.cacheDomain}`,
              '_blank'
            );
          } else {
            window.open(
              `https://${selectedEnvironmentDetail.workspaceDomain}`,
              '_blank'
            );
          }
        }
      }
    }
  };

  useEffect(() => {
    if (getEnvironmentList.isSuccess) {
      const envId = localStorage.getItem(`${workspaceId}/environmentId`);
      if (getEnvironmentList.data && getEnvironmentList.data.length > 0) {
        setEnvironmentList(getEnvironmentList.data);

        if (envId) {
          setDefaultSelect(envId);
          document.dispatchEvent(
            new CustomEvent('environmentChange', {
              detail: envId,
            })
          );
        } else {
          const isDefaultEnvironment = getEnvironmentList.data.find(
            (item) => item.isDefault
          );
          setDefaultSelect(
            isDefaultEnvironment
              ? isDefaultEnvironment.id
              : getEnvironmentList.data[0].id
          );
          localStorage.setItem(
            `${workspaceId}/environmentId`,
            isDefaultEnvironment
              ? isDefaultEnvironment.id
              : getEnvironmentList.data[0].id
          );
          document.dispatchEvent(
            new CustomEvent('environmentChange', {
              detail: isDefaultEnvironment
                ? isDefaultEnvironment.id
                : getEnvironmentList.data[0].id,
            })
          );
        }
      }
    }
  }, [getEnvironmentList.isSuccess, getEnvironmentList.data, workspaceId]);

  useEffect(() => {
    if (getEnvironmentList.isError) {
      console.log(getEnvironmentList.error);
    }
  }, [getEnvironmentList.isError, getEnvironmentList.error]);

  return { environmentList, defaultSelect, onChange, t, onRedirect };
};

export default useEnvironmentSelectorController;
