import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { IGetSmtpEmailsResponse } from '../../../../types';
import {
  EMAIL_REGEX_PATTERN,
  NAME_REGEX_PATTERN,
  NUMBER_REGEX_PATTERN,
  openNotificationWithIcon,
} from '../../../../utills';
import useError from '../../../../hooks/error';
import usePermissions from '../../../../hooks/permissions';
import {
  useGetSmtpEmails,
  usePostSmtpEmails,
  usePutSmtpEmails,
} from '../services';

const useSmtpConfigController = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const permission = usePermissions();

  const [switchValue, setSwitchValue] = useState(false);
  const [isAuthenticationSwitch, setIsAuthenticationSwitch] = useState(false);
  const [isSwitchDisableModalVisible, setIsSwitchDisableModalVisible] =
    useState(false);
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState<boolean>(true);

  const getSmtpEmails = useGetSmtpEmails(workspaceId);
  const postSmtpEmails = usePostSmtpEmails(workspaceId);
  const putSmtpEmails = usePutSmtpEmails(workspaceId);

  useError({
    mutation: postSmtpEmails,
    entity: t('common.labels.form_name'),
  });

  useEffect(() => {
    if (getSmtpEmails.isSuccess && getSmtpEmails.data) {
      setIsAuthenticationSwitch(getSmtpEmails.data.isAuthenticationEnable);
      setSwitchValue(getSmtpEmails.data.isSmtpEnable);
      form.setFields([
        { name: ['smtpUsername'], value: getSmtpEmails.data.smtpUsername },
        { name: ['smtpPassword'], value: getSmtpEmails.data.smtpPassword },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSmtpEmails.isSuccess, getSmtpEmails.data]);

  const onSwitchChange = (switchValue: boolean) => {
    if (!switchValue && JSON.stringify(getSmtpEmails.data) !== '0') {
      if (permission.canUpdateEmailTemplatesSmtp()) {
        setIsSwitchDisableModalVisible(true);
      }
    } else if (!switchValue) {
      setSwitchValue(false);
    } else {
      openNotificationWithIcon(
        'success',
        t('common.messages.enabled_successfully')
      );
      setSwitchValue(true);
    }
  };

  const onHideDisableSwitchButton = () => {
    setIsSwitchDisableModalVisible(false);
  };

  const onDisableSmtpData = () => {
    if (getSmtpEmails.data) {
      getSmtpEmails.data.isSmtpEnable = false;
      putSmtpEmails.mutate(getSmtpEmails.data);
    }
  };

  const onAuthenticationSwitchChange = (value: boolean) => {
    if (
      value &&
      getSmtpEmails.data &&
      (!getSmtpEmails.data.smtpUsername || !getSmtpEmails.data.smtpPassword)
    ) {
      setIsSaveButtonVisible(true);
    } else {
      if (getSmtpEmails.data) {
        form.setFields([
          { name: ['smtpUsername'], value: getSmtpEmails.data.smtpUsername },
          { name: ['smtpPassword'], value: getSmtpEmails.data.smtpPassword },
        ]);
      } else {
        form.setFields([
          { name: ['smtpUsername'], value: '' },
          { name: ['smtpPassword'], value: '' },
        ]);
      }
    }

    setIsAuthenticationSwitch(value);
  };

  const onSmtpData = (values: IGetSmtpEmailsResponse) => {
    if (values.fromName.trim().length === 0) {
      form.setFields([
        {
          name: 'fromName',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.fromName.trim().length < 3) {
      form.setFields([
        {
          name: 'fromName',
          errors: [
            t('common.messages.min_length', {
              entity: t('common.labels.form_name'),
            }),
          ],
        },
      ]);
    } else if (values.fromName.trim().length > 255) {
      form.setFields([
        {
          name: 'fromName',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.form_name'),
            }),
          ],
        },
      ]);
    } else if (
      values.fromName.trim().length > 0 &&
      !NAME_REGEX_PATTERN.test(values.fromName)
    ) {
      form.setFields([
        {
          name: 'fromName',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.form_name'),
            }),
          ],
        },
      ]);
    } else if (
      values.fromEmail !== undefined &&
      values.fromEmail !== null &&
      values.fromEmail.trim().length === 0
    ) {
      form.setFields([
        {
          name: 'fromEmail',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (
      values.fromEmail !== undefined &&
      values.fromEmail !== null &&
      values.fromEmail.trim().length > 0 &&
      !EMAIL_REGEX_PATTERN.test(values.fromEmail)
    ) {
      form.setFields([
        {
          name: 'fromEmail',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.email'),
            }),
          ],
        },
      ]);
    } else if (values.smtpHost.trim().length < 3) {
      form.setFields([
        {
          name: 'smtpHost',
          errors: [
            t('common.messages.min_length', {
              entity: t('common.labels.smtp_host'),
            }),
          ],
        },
      ]);
    } else if (values.smtpPort.trim().length === 0) {
      form.setFields([
        {
          name: 'smtpPort',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (
      values.smtpPort.trim().length > 0 &&
      !NUMBER_REGEX_PATTERN.test(values.smtpPort)
    ) {
      form.setFields([
        {
          name: 'smtpPort',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.smtp_port'),
            }),
          ],
        },
      ]);
    } else {
      values.isSmtpEnable = switchValue;
      values.isAuthenticationEnable = isAuthenticationSwitch;
      if (JSON.stringify(getSmtpEmails.data) === '0') {
        postSmtpEmails.mutate(values);
      } else {
        if (getSmtpEmails.data) {
          values.id = getSmtpEmails.data?.id;
        }
        putSmtpEmails.mutate(values);
      }
    }
  };

  useEffect(() => {
    if (postSmtpEmails.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.created_successfully')
      );
      setIsSaveButtonVisible(true);
      getSmtpEmails.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postSmtpEmails.isSuccess, t]);

  useEffect(() => {
    if (putSmtpEmails.isSuccess) {
      if (isSwitchDisableModalVisible) {
        onHideDisableSwitchButton();
        setIsSaveButtonVisible(true);
        form.resetFields();
        getSmtpEmails.refetch();
        openNotificationWithIcon(
          'success',
          t('common.messages.disabled_successfully')
        );
        setSwitchValue(false);
      } else {
        getSmtpEmails.refetch();
        openNotificationWithIcon(
          'success',
          t('common.messages.updated_successfully')
        );
        setIsSaveButtonVisible(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [putSmtpEmails.isSuccess, t]);

  const onValueChange = (
    values: IGetSmtpEmailsResponse,
    allValues: IGetSmtpEmailsResponse
  ) => {
    if (
      !allValues.isAuthenticationEnable &&
      (!allValues.fromEmail ||
        !allValues.fromName ||
        !allValues.smtpHost ||
        !allValues.smtpPort ||
        !allValues.encryptionType)
    ) {
      setIsSaveButtonVisible(true);
    } else {
      if (
        allValues.isAuthenticationEnable &&
        (!allValues.fromEmail ||
          !allValues.fromName ||
          !allValues.smtpHost ||
          !allValues.smtpPort ||
          !allValues.encryptionType ||
          !allValues.smtpUsername ||
          !allValues.smtpPassword)
      ) {
        setIsSaveButtonVisible(true);
      } else {
        if (
          getSmtpEmails.data &&
          getSmtpEmails.data.fromEmail === allValues.fromEmail &&
          getSmtpEmails.data.fromName === allValues.fromName &&
          getSmtpEmails.data.smtpHost === allValues.smtpHost &&
          getSmtpEmails.data.smtpPort === allValues.smtpPort &&
          getSmtpEmails.data.isAuthenticationEnable ===
            allValues.isAuthenticationEnable &&
          getSmtpEmails.data.smtpUsername === allValues.smtpUsername &&
          getSmtpEmails.data.smtpPassword === allValues.smtpPassword &&
          getSmtpEmails.data.encryptionType === allValues.encryptionType
        ) {
          setIsSaveButtonVisible(true);
        } else {
          setIsSaveButtonVisible(false);
        }
      }
    }
  };

  return {
    t,
    form,
    switchValue,
    isSwitchDisableModalVisible,
    onSwitchChange,
    onDisableSmtpData,
    onSmtpData,
    onHideDisableSwitchButton,
    isAuthenticationSwitch,
    onAuthenticationSwitchChange,
    getSmtpEmails,
    permission,
    onValueChange,
    isSaveButtonVisible,
  };
};

export default useSmtpConfigController;
