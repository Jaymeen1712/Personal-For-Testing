import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';

import { EMAIL_REGEX_PATTERN } from '../../../utills';
import { useForgotPassword } from './services';

const recaptchaRef = React.createRef<ReCAPTCHA>();

const useForgotPasswordController = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [email, setEmail] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string | null>('');
  const [isCaptchaLoaded, setIsCaptchaLoaded] = useState<boolean>(false);

  const forgotPassword = useForgotPassword();

  // useError({
  //   mutation: forgotPassword,
  //   entity: t('common.labels.user'),
  //   dependentEntities: t('common.labels.user'),
  // });

  const onFinish = (values: { email: string }) => {
    if (values.email.trim().length === 0) {
      form.setFields([
        {
          name: 'email',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else {
      if (
        values.email.trim().length > 0 &&
        !EMAIL_REGEX_PATTERN.test(values.email)
      ) {
        form.setFields([
          {
            name: 'email',
            errors: [t('common.messages.email_invalid')],
          },
        ]);
      } else {
        setEmail(values.email);
        forgotPassword.mutate({
          email: values.email,
          captchaToken: captchaToken,
        });
      }
    }
  };

  const onBlur = () => {
    const emailAddress = form.getFieldValue('email');

    if (emailAddress.trim().length === 0) {
      form.setFields([
        {
          name: 'email',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    }

    if (
      emailAddress.trim().length > 0 &&
      !EMAIL_REGEX_PATTERN.test(emailAddress)
    ) {
      form.setFields([
        {
          name: 'email',
          errors: [t('common.messages.email_invalid')],
        },
      ]);
    }
  };

  useEffect(() => {
    setIsCaptchaLoaded(true);
  }, []);

  const onCaptchaLoaded = (value: string | null) => {
    setCaptchaToken(value);
  };

  useEffect(() => {
    if (forgotPassword.isSuccess) {
      setCaptchaToken('');
    }
  }, [forgotPassword.isSuccess]);

  useEffect(() => {
    if (forgotPassword.isError) {
      recaptchaRef.current?.reset();
    }
  }, [forgotPassword.isError]);

  return {
    t,
    email,
    isRequestCompleted: forgotPassword.isError || forgotPassword.isSuccess,
    onFinish,
    form,
    forgotPassword,
    onBlur,
    isCaptchaLoaded,
    onCaptchaLoaded,
    captchaToken,
    recaptchaRef,
  };
};

export default useForgotPasswordController;
