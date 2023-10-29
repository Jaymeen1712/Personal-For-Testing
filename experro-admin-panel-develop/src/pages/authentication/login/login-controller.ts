import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Form } from 'antd';
import Cookies from 'js-cookie';
import { SubmitHandler } from 'react-hook-form';
import CryptoJS from 'crypto-js';
import { useHistory } from 'react-router-dom';

import {
  API_QUERY_KEY,
  EMAIL_REGEX_PATTERN,
  openNotificationWithIcon,
  PASSWORD_CIPHER_MESSAGE,
  USER_ACCESS_KEY,
} from '../../../utills';
import queryClient from '../../../query-client';
import { ISignIn } from '../../../types';
import useError from '../../../hooks/error';
import { useLinks, useToken, useVerifyUser } from './services';

const useLoginController = () => {
  const {t  } = useTranslation();
  const history = useHistory();

  const [form] = Form.useForm();

  const [showOrganizationPage, setShowOrganizationPage] =
    useState<boolean>(false);

  const token = useToken();
  const links = useLinks();
  const verifyUser = useVerifyUser();
  const queryParams = new URLSearchParams(window.location.search);
  const tokenId = queryParams.get('token');

  useError({
    mutation: links,
    entity: t('common.labels.email'),
    dependentEntities: t('common.labels.password'),
  });

  useEffect(() => {
    if (tokenId) {
      verifyUser.mutate(tokenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish: SubmitHandler<ISignIn> = (data) => {
    const userNameValue = form.getFieldValue('username');
    const userPassword = form.getFieldValue('password');
    if (userNameValue && userNameValue.trim().length === 0) {
      form.setFields([
        {
          name: 'username',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (
      userNameValue.trim().length > 0 &&
      !EMAIL_REGEX_PATTERN.test(userNameValue)
    ) {
      form.setFields([
        {
          name: 'username',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.email'),
            }),
          ],
        },
      ]);
    } else if (!userPassword) {
      form.setFields([
        {
          name: 'password',
          errors: [t('common.messages.login_password_required')],
        },
      ]);
      form.setFields([{ name: ['password'], value: '' }]);
    } else if (userPassword && userPassword.trim().length === 0) {
      form.setFields([
        {
          name: 'password',
          errors: [t('common.messages.please_provide')],
        },
      ]);
      form.setFields([{ name: ['password'], value: '' }]);
    } else {
      form.setFields([
        {
          name: 'username',
          errors: [],
        },
      ]);
      form.setFields([
        {
          name: 'password',
          errors: [],
        },
      ]);
      localStorage.clear();
      localStorage.removeItem('environmentId');
      Cookies.remove(USER_ACCESS_KEY.TOKEN);
      Cookies.remove('pageEditorPopUp');
      Cookies.remove(USER_ACCESS_KEY.TENANT_ID);
      Cookies.remove(USER_ACCESS_KEY.STORE_LINK);
      data.username = data.username.trim();
      data.password = CryptoJS.AES.encrypt(
        data.password,
        PASSWORD_CIPHER_MESSAGE
      ).toString();
      links.mutate(data);
    }
  };

  const onBlur = () => {
    const userNameValue = form.getFieldValue('username');

    if (
      userNameValue.trim().length > 0 &&
      !EMAIL_REGEX_PATTERN.test(userNameValue)
    ) {
      form.setFields([
        {
          name: 'username',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.email'),
            }),
          ],
        },
      ]);
    }
  };

  useEffect(() => {
    if (links.isSuccess && links.variables && links.data.items.length <= 1) {
      Cookies.set(USER_ACCESS_KEY.TENANT_ID, links.data?.items[0].id, {
        secure: true,
        sameSite: 'lax',
      });
      token.mutate({
        ...links.variables,
        linkName: links.data.items[0].linkName,
      });
    } else {
      if (links.isSuccess) {
        setShowOrganizationPage(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links.data, links.isSuccess]);

  const onSubmitOrganization = (value: { organization: string }) => {
    const linkData = links.data?.items.filter(
      (link) => link.id === value.organization
    );
    if (linkData && links.variables && linkData.length > 0) {
      Cookies.set(USER_ACCESS_KEY.TENANT_ID, linkData[0].id, {
        secure: true,
        sameSite: 'lax',
      });
      token.mutate({ ...links.variables, linkName: linkData[0].linkName });
    } else {
      openNotificationWithIcon('error', t('common.messages.tenant_not_exist'));
    }
  };

  useEffect(() => {
    if (token.isSuccess && token.data) {
      if (
        token.data.item.isMfa &&
        token.data.item.isMfaEnable &&
        (token.data.item.isMfaMail ||
          (token.data.item.isMfaAuthApp &&
            token.data.item.isRecoveryKeyGenerated))
      ) {
        Cookies.set(USER_ACCESS_KEY.TOKEN, token.data.item.accesstoken, {
          secure: true,
          sameSite: 'lax',
        });
        if (
          token.data.item.isMfa &&
          token.data.item.isMfaEnable &&
          token.data.item.isMfaMail &&
          token.data.item.isMfaAuthApp &&
          token.data.item.isRecoveryKeyGenerated &&
          token.data.item.mfaPreference
        ) {
          localStorage.setItem('isTwoFactorAuthentication', 'true');
          history.push(
            `/two-factor-authentication/authenticateUsingBoth/${token.data.item.mfaPreference}`
          );
        } else if (
          token.data.item.isMfa &&
          token.data.item.isMfaEnable &&
          token.data.item.isMfaMail
        ) {
          localStorage.setItem('isTwoFactorAuthentication', 'true');
          history.push('/two-factor-authentication/email/email');
        } else if (
          token.data.item.isMfa &&
          token.data.item.isMfaEnable &&
          token.data.item.isMfaAuthApp &&
          token.data.item.isRecoveryKeyGenerated
        ) {
          localStorage.setItem('isTwoFactorAuthentication', 'true');
          history.push(
            '/two-factor-authentication/authenticatorApp/authenticatorApp'
          );
        }
      } else {
        Cookies.set(USER_ACCESS_KEY.TOKEN, token.data.item.accesstoken, {
          secure: true,
          sameSite: 'lax',
        });

        queryClient.refetchQueries([API_QUERY_KEY.PROFILE]);
        queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
        queryClient.refetchQueries([API_QUERY_KEY.USER_WORKSPACES]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token.data, token.isSuccess]);

  return {
    t,
    onBlur,
    onFinish,
    isError: links.isError || token.isError,
    form,
    links,
    showOrganizationPage,
    onSubmitOrganization,
  };
};

export default useLoginController;
