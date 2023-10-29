import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { Form } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';

import { ISetPassword } from '../../../types';
import {
  getPasswordStrength,
  openNotificationWithIcon,
  PASSWORD_CIPHER_MESSAGE,
  USER_ACCESS_KEY,
} from '../../../utills';
import useError from '../../../hooks/error';
import { useSetPassword, useVerifyUser } from './services';

const recaptchaRef = React.createRef<ReCAPTCHA>();

const useSetPasswordController = ({
  isResetPassword,
}: {
  isResetPassword: boolean;
}) => {
  const { t } = useTranslation();
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');
  const [form] = Form.useForm();

  const history = useHistory();
  const verifyUser = useVerifyUser();
  const setPassword = useSetPassword(token);

  const [passwordStrength, setPasswordStrength] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>('');
  const [isCaptchaLoaded, setIsCaptchaLoaded] = useState(false);

  useError({
    mutation: setPassword,
    cb: () => recaptchaRef.current?.reset(),
  });

  useError({
    mutation: verifyUser,
    entity: t('common.labels.password'),
    cb: () => {
      setCaptchaToken('');
      history.push('/login');
    },
  });

  const onValuesChange = (values: ISetPassword) => {
    if (values.password) {
      setPasswordStrength(getPasswordStrength(values.password, t));
    } else {
      setPasswordStrength('');
    }
  };

  const onFinish = (value: ISetPassword) => {
    if (value.password && value.password.trim().length === 0) {
      form.setFields([
        {
          name: 'password',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (
      value.confirmPassword &&
      value.confirmPassword.trim().length === 0
    ) {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (
      value.confirmPassword &&
      value.confirmPassword.trim().length > 255
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
      value.password &&
      value.confirmPassword &&
      value.password.trim().length > 0 &&
      value.confirmPassword.trim().length > 0 &&
      value.password !== value.confirmPassword
    ) {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: [t('common.messages.password_not_match')],
        },
      ]);
    } else {
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{10,}$/.test(
          value.password
        )
      ) {
        openNotificationWithIcon(
          'error',
          t('common.messages.password_not_match_rxjs')
        );
      } else {
        value.password = CryptoJS.AES.encrypt(
          value.password,
          PASSWORD_CIPHER_MESSAGE
        ).toString();
        setPassword.mutate({
          password: value.password,
          captchaToken: captchaToken,
        });
      }
    }
  };

  const redirectToLogin = () => {
    if (isResetPassword) {
      openNotificationWithIcon(
        'success',
        t('common.messages.password_reset_successfully')
      );
    }

    history.push('/login');
  };

  useEffect(() => {
    if (!isResetPassword && token && setPassword.isSuccess) {
      verifyUser.mutate(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResetPassword, setPassword.isSuccess]);

  useEffect(() => {
    if (verifyUser.isSuccess) {
      setCaptchaToken('');
      openNotificationWithIcon(
        'success',
        t('common.messages.password_has_been_set')
      );
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyUser.isSuccess, t]);

  useEffect(() => {
    if (verifyUser.isError) {
      openNotificationWithIcon('error', t('common.messages.link_expired'));
      history.push('/login');
    }
  }, [verifyUser.isError, t, history]);

  useEffect(() => {
    Cookies.remove(USER_ACCESS_KEY.TOKEN);
    Cookies.remove(USER_ACCESS_KEY.TENANT_ID);
    Cookies.remove(USER_ACCESS_KEY.STORE_LINK);
    Cookies.remove('pageEditorPopUp');
  }, []);

  useEffect(() => {
    setIsCaptchaLoaded(true);
  }, []);

  const onCaptchaLoaded = (value: string | null) => {
    setCaptchaToken(value);
  };

  return {
    t,
    onFinish,
    onValuesChange,
    passwordStrength,
    setPassword,
    isRequestCompleted: setPassword.isSuccess || verifyUser.isSuccess,
    redirectToLogin,
    isCaptchaLoaded,
    onCaptchaLoaded,
    captchaToken,
    form,
    recaptchaRef,
  };
};

export default useSetPasswordController;
