import { useEffect, useState } from 'react';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js';

import { IChangePassword } from '../../../../types';
import {
  getPasswordStrength,
  openNotificationWithIcon,
  PASSWORD_CIPHER_MESSAGE,
} from '../../../../utills';
import useError from '../../../../hooks/error';
import { useChangePassword } from '../services';

const useChangePasswordController = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const changePassword = useChangePassword();

  const [passwordStrength, setPasswordStrength] = useState('');
  const [isUpdateButtonDisable, setIsUpdateButtonDisable] =
    useState<boolean>(true);

  const passwordRegexPattern = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{10,}$/
  );

  useError({
    mutation: changePassword,
    entity: t('common.labels.old_password_label'),
    dependentEntities: t('common.labels.new_password_label'),
  });

  const onFinish = (values: IChangePassword) => {
    if (values.oldPassword && values.oldPassword.trim().length === 0) {
      form.setFields([
        {
          name: 'oldPassword',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.newPassword && values.newPassword.trim().length === 0) {
      form.setFields([
        {
          name: 'newPassword',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.newPassword && values.newPassword.trim().length > 255) {
      form.setFields([
        {
          name: 'newPassword',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.new_password_label'),
            }),
          ],
        },
      ]);
    } else if (
      values.confirmPassword &&
      values.confirmPassword.trim().length === 0
    ) {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (
      values.confirmPassword &&
      values.confirmPassword.trim().length > 255
    ) {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.confirm_password'),
            }),
          ],
        },
      ]);
    } else if (
      values.newPassword &&
      values.confirmPassword &&
      values.newPassword.trim().length > 0 &&
      values.confirmPassword.trim().length > 0 &&
      values.newPassword !== values.confirmPassword
    ) {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: [t('common.messages.password_not_match')],
        },
      ]);
    } else {
      if (!passwordRegexPattern.test(values.newPassword)) {
        openNotificationWithIcon(
          'error',
          t('common.messages.password_not_match_rxjs')
        );
      } else {
        values.oldPassword = CryptoJS.AES.encrypt(
          values.oldPassword,
          PASSWORD_CIPHER_MESSAGE
        ).toString();
        values.newPassword = CryptoJS.AES.encrypt(
          values.newPassword,
          PASSWORD_CIPHER_MESSAGE
        ).toString();
        values.confirmPassword = CryptoJS.AES.encrypt(
          values.confirmPassword,
          PASSWORD_CIPHER_MESSAGE
        ).toString();
        changePassword.mutate(values);
      }
    }
  };

  const onValuesChange = (
    values: IChangePassword,
    allValues: IChangePassword
  ) => {
    if (values.newPassword) {
      setPasswordStrength(getPasswordStrength(values.newPassword, t));
    } else {
      setPasswordStrength('');
    }

    if (
      !allValues.oldPassword ||
      !allValues.newPassword ||
      !allValues.confirmPassword
    ) {
      setIsUpdateButtonDisable(true);
    } else {
      setIsUpdateButtonDisable(false);
    }
  };

  const onCancel = () => {
    form.resetFields();
    setIsUpdateButtonDisable(true);
  };

  useEffect(() => {
    if (changePassword.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.change_password_success')
      );
      setPasswordStrength('');
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changePassword.isSuccess, t]);

  return {
    form,
    t,
    passwordStrength,
    onFinish,
    onValuesChange,
    changePassword,
    isUpdateButtonDisable,
    onCancel,
  };
};

export default useChangePasswordController;
