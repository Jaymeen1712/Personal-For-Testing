import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { openNotificationWithIcon } from '../../../../utills';
import { useTranslation } from 'react-i18next';
import {
  I301Redirect,
  IWorkspaceParams,
  RedirectFormValues,
} from '../../../../types';
import { useCreate301Redirect, useUpdate301Redirect } from '../services';
import { useParams } from 'react-router-dom';
import { UseQueryResult } from 'react-query';
import useError from '../../../../hooks/error';

const useAdd301RedirectionController = (
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>,
  redirectId: string,
  isEdit: boolean,
  list301Redirects: UseQueryResult<
    {
      items: I301Redirect[];
      totalCount: number;
    },
    unknown
  >,
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean | undefined>>,
  editRedirectData: I301Redirect
) => {
  const [form] = Form.useForm();

  const { t } = useTranslation();

  const { workspaceId } = useParams<IWorkspaceParams>();

  const [disableSave, setIsDisableSave] = useState(true);

  const create301Redirect = useCreate301Redirect(workspaceId);
  const update301Redirect = useUpdate301Redirect(workspaceId, redirectId);

  useError({ mutation: create301Redirect, entity: t('common.labels.old_url') });

  useError({ mutation: update301Redirect, entity: t('common.labels.old_url') });

  const onCancel = () => {
    setIsDisableSave(true);
    setIsModalVisible(false);
    setIsEdit(false);
    form.resetFields();
  };

  const handleFieldChange = () => {
    const values = form.getFieldsValue();
    if (values.oldURL && values.newURL) {
      setIsDisableSave(false);
    } else {
      setIsDisableSave(true);
    }
  };

  const onCreateRedirect = async (values: RedirectFormValues) => {
    values.oldURL = values.oldURL.trim();
    values.newURL = values.newURL.trim();
    let tempOldUrl = values.oldURL;
    let tempNewUrl = values.newURL;

    if (
      values.oldURL.startsWith('https://') ||
      values.oldURL.startsWith('http://')
    ) {
      form.setFields([
        {
          name: 'oldURL',
          errors: [t('common.messages.please_provide_relative_url')],
        },
      ]);
    }

    if (
      values.newURL.startsWith('https://') ||
      values.newURL.startsWith('http://')
    ) {
      form.setFields([
        {
          name: 'newURL',
          errors: [t('common.messages.please_provide_relative_url')],
        },
      ]);
    }

    if (
      values.oldURL.trim().length === 0 ||
      // eslint-disable-next-line
      !/^[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]*$/.test(tempOldUrl)
    ) {
      form.setFields([
        {
          name: 'oldURL',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    }

    if (
      values.newURL.trim().length === 0 ||
      // eslint-disable-next-line
      !/^[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]*$/.test(tempNewUrl)
    ) {
      form.setFields([
        {
          name: 'newURL',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    }

    if (tempOldUrl.charAt(0) !== '/') {
      tempOldUrl = '/' + tempOldUrl;
    }

    if (tempNewUrl.charAt(0) !== '/') {
      tempNewUrl = '/' + tempNewUrl;
    }

    if (tempNewUrl.charAt(tempNewUrl.length - 1) !== '/') {
      tempNewUrl = tempNewUrl + '/';
    }

    if (
      values.oldURL.trim().length !== 0 &&
      values.newURL.trim().length !== 0 &&
      // eslint-disable-next-line
      /^[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]*$/.test(tempOldUrl) &&
      // eslint-disable-next-line
      /^[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]*$/.test(tempNewUrl) &&
      !values.oldURL.startsWith('https://') &&
      !values.oldURL.startsWith('http://') &&
      !values.newURL.startsWith('https://') &&
      !values.newURL.startsWith('http://')
    ) {
      if (isEdit) {
        if (tempOldUrl.charAt(tempOldUrl.length - 1) === '/') {
          tempOldUrl = tempOldUrl.substring(0, tempOldUrl.length - 1);
        }
        update301Redirect.mutate({
          oldURL: tempOldUrl.toLowerCase().trim(),
          newURL: tempNewUrl.toLowerCase().trim(),
        });
      } else {
        if (
          !list301Redirects.data?.items.some(
            (redirect) => redirect.oldUrl === values.oldURL.toLowerCase()
          )
        ) {
          if (tempOldUrl.charAt(tempOldUrl.length - 1) === '/') {
            tempOldUrl = tempOldUrl.substring(0, tempOldUrl.length - 1);
          }
          create301Redirect.mutate({
            // @ts-ignore
            oldURL: tempOldUrl.toLowerCase().trim(),
            newURL: tempNewUrl.toLowerCase().trim(),
          });
        } else {
          openNotificationWithIcon(
            'error',
            t('common.messages.redirect_already_exist')
          );
        }
      }
    }
  };

  useEffect(() => {
    if (create301Redirect.isSuccess) {
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.redirect_added_successfully')
      );
      list301Redirects.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [create301Redirect.isSuccess]);

  useEffect(() => {
    if (update301Redirect.isSuccess) {
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.redirect_updated_successfully')
      );
      list301Redirects.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update301Redirect.isSuccess]);

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({
        oldURL: editRedirectData.oldUrl,
        newURL: editRedirectData.newUrl,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  return {
    form,
    onCancel,
    disableSave,
    onCreateRedirect,
    handleFieldChange,
  };
};

export default useAdd301RedirectionController;
