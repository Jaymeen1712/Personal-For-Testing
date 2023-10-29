import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IEditEnvironment } from '../../../../types';
import queryClient from '../../../../query-client';
import {
  API_QUERY_KEY,
  DOMAIN_REGEX_PATTERN,
  openNotificationWithIcon,
  PASSWORD_CIPHER_MESSAGE,
} from '../../../../utills';
import useError from '../../../../hooks/error';
import CryptoJS from 'crypto-js';
import {
  useDetailsEnvironment,
  useGenerateSitemapUrl,
  useUpdateEnvironment,
} from '../services';

export interface IEnvironmentParams {
  environmentId: string;
  workspaceId: string;
}

const useUpdateEnvironmentsController = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const { environmentId, workspaceId } = useParams<IEnvironmentParams>();

  const [isPreviewCode, setIsPreviewCode] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isPreviewCodeData, setIsPreviewCodeData] = useState(false);
  const [generateSiteMap, setGenerateSiteMap] = useState<boolean>(false);
  const [disableSave, setIsDisableSave] = useState(true);
  const [isDirtyCheck, setDirtyCheck] = useState(false);
  const [isDirtyCheckModalVisible, setDirtyCheckModalVisible] = useState(false);

  const getEnvironment = useDetailsEnvironment(environmentId, workspaceId);
  const updateEnvironment = useUpdateEnvironment(environmentId, workspaceId);
  const generateSiteMapUrl = useGenerateSitemapUrl(
    workspaceId,
    generateSiteMap
  );

  const [isSetUpDomain, setIsSetUpDomain] = useState(
    getEnvironment.data?.pointYourDomain
  );

  useError({
    mutation: updateEnvironment,
    entity: t('common.labels.environment'),
  });

  const onCancel = () => {
    history.push(`/workspaces/${workspaceId}/environments`);
  };

  const onSaveEnvironment = async () => {
    const values: IEditEnvironment = await form.getFieldsValue();
    if (values.title.trim().length === 0) {
      form.setFields([
        {
          name: 'title',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.title.trim().length > 255) {
      form.setFields([
        {
          name: 'title',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.name'),
            }),
          ],
        },
      ]);
    } else if (
      values.httpRobots !== undefined &&
      values.httpRobots !== null &&
      values.httpRobots.length > 0 &&
      values.httpRobots.trim().length === 0
    ) {
      form.setFields([
        {
          name: 'httpRobots',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (
      values.customDomain !== undefined &&
      values.customDomain !== null &&
      values.customDomain.length > 0 &&
      !DOMAIN_REGEX_PATTERN.test(values.customDomain)
    ) {
      form.setFields([
        {
          name: 'customDomain',
          errors: [t('common.messages.this_input_invalid')],
        },
      ]);
    } else if (
      values.httpRobots !== undefined &&
      values.httpRobots !== null &&
      values.httpRobots.length > 2000
    ) {
      form.setFields([
        {
          name: 'httpRobots',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.http_robots'),
            }),
          ],
        },
      ]);
    } else if (
      values.passwordHash !== undefined &&
      values.passwordHash !== null &&
      values.passwordHash.length > 0 &&
      values.passwordHash.trim().length === 0
    ) {
      form.setFields([
        {
          name: 'passwordHash',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else {
      if (!values.pointYourDomain && getEnvironment.data?.customDomain) {
        values.customDomain = getEnvironment.data?.customDomain;
      }
      values.workspaceDomain = getEnvironment.data?.workspaceDomain;
      values.passwordHash = CryptoJS.AES.encrypt(
        values.passwordHash,
        PASSWORD_CIPHER_MESSAGE
      ).toString();

      updateEnvironment.mutate(values);
    }
  };

  const onChangePreviewCode = () => {
    setIsPreviewCodeData(true);
  };

  const onPasswordProtectionChecked = (checked: boolean) => {
    if (checked) {
      setIsPreviewCode(true);
      form.setFieldsValue({ enablePasswordProtect: true });
    } else {
      setIsPreviewCode(false);
      form.setFieldsValue({ enablePasswordProtect: false });
    }
  };

  const onMaintenanceModeChecked = (checked: boolean) => {
    if (checked) {
      setIsMaintenanceMode(true);
      form.setFieldsValue({ enableMaintenance: true });
    } else {
      setIsMaintenanceMode(false);
      form.setFieldsValue({ enableMaintenance: false });
    }
  };

  const onCustomDomainChecked = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ pointYourDomain: true });
      setIsSetUpDomain(true);
    } else {
      form.setFieldsValue({ pointYourDomain: false });
      setIsSetUpDomain(false);
    }
  };

  useEffect(() => {
    if (updateEnvironment.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.ENVIRONMENTS_LIST, workspaceId]);
      history.push(`/workspaces/${workspaceId}/environments`);
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateEnvironment.isSuccess, workspaceId, t]);

  useEffect(() => {
    if (getEnvironment?.data?.enablePasswordProtect) {
      setIsPreviewCode(true);
    }
    if (getEnvironment?.data?.enableMaintenance) {
      setIsMaintenanceMode(true);
    }
    if (getEnvironment?.data?.pointYourDomain) {
      setIsSetUpDomain(true);
    }
  }, [getEnvironment.data]);

  const onSiteMapCopy = () => {
    openNotificationWithIcon(
      'success',
      t('common.messages.copied_successfully')
    );
  };

  const onUpdateButtonClick = () => {
    setGenerateSiteMap(true);
    generateSiteMapUrl.refetch();
  };

  const handleFieldChange = () => {
    const values = form.getFieldsValue();
    if (
      values.httpRobots ||
      values.httpRobots.length === 0 ||
      values.pointYourDomain
    ) {
      setIsDisableSave(false);
      setDirtyCheck(true);
    } else {
      setIsDisableSave(true);
    }
  };

  useEffect(() => {
    if (
      generateSiteMapUrl.isSuccess &&
      getEnvironment.data &&
      getEnvironment?.data.type === 'PRODUCTION'
    ) {
      openNotificationWithIcon(
        'success',
        t('common.messages.sitemap_updated_successfully')
      );
      setGenerateSiteMap(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, generateSiteMapUrl.isSuccess]);

  const onBackButtonClick = () => {
    if (isDirtyCheck) {
      setDirtyCheckModalVisible(true);
    } else {
      history.push(`/workspaces/${workspaceId}/environments`);
    }
  };

  const onDiscardClick = () => {
    setDirtyCheckModalVisible(false);
    history.push(`/workspaces/${workspaceId}/environments`);
  };

  const onCancelDirtyCheckModal = () => {
    setDirtyCheckModalVisible(false);
  };

  return {
    t,
    form,
    onCancel,
    onSaveEnvironment,
    isSetUpDomain,
    isPreviewCode,
    isMaintenanceMode,
    isPreviewCodeData,
    getEnvironment,
    onPasswordProtectionChecked,
    onMaintenanceModeChecked,
    onCustomDomainChecked,
    onChangePreviewCode,
    onSiteMapCopy,
    onUpdateButtonClick,
    onBackButtonClick,
    handleFieldChange,
    disableSave,
    isDirtyCheckModalVisible,
    onDiscardClick,
    onCancelDirtyCheckModal,
  };
};

export default useUpdateEnvironmentsController;
