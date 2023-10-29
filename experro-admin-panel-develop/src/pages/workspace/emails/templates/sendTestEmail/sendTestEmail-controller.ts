import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { useParams } from 'react-router-dom';

import useError from '../../../../../hooks/error';
import {
  EMAIL_REGEX_PATTERN,
  openNotificationWithIcon,
} from '../../../../../utills';
import { useSendTestEmailTemplates } from '../../services';
import { IWorkspaceParams } from '../../../../../types';

interface ISendEmail {
  templateId: string;
  onHideSendTestEmail: () => void;
}

const useSendTestEmailController = ({
  templateId,
  onHideSendTestEmail,
}: ISendEmail) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [disableSave, setIsDisableSave] = useState(true);

  const sendTestEmail = useSendTestEmailTemplates(workspaceId);

  useError({
    mutation: sendTestEmail,
    entity: t('common.labels.email'),
    cb: () => {
      form.resetFields();
      onHideSendTestEmail();
    },
  });

  const handleFieldChange = async () => {
    const values = await form.getFieldsValue();
    if (values.email.length > 0) {
      setIsDisableSave(false);
    } else {
      setIsDisableSave(true);
    }
  };

  const onSave = async () => {
    const values = await form.validateFields();
    if (values.email.trim().length === 0) {
      form.setFields([
        {
          name: 'email',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (
      values.email.trim().length > 0 &&
      !EMAIL_REGEX_PATTERN.test(values.email)
    ) {
      form.setFields([
        {
          name: 'email',
          errors: [t('common.messages.invalid_email')],
        },
      ]);
    } else {
      sendTestEmail.mutate({ ...values, templateId: templateId });
    }
  };

  useEffect(() => {
    if (sendTestEmail.isSuccess) {
      form.resetFields();
      onHideSendTestEmail();
      openNotificationWithIcon(
        'success',
        t('common.messages.test_mail_sent_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendTestEmail.isSuccess]);

  const onCloseSendTestEmail = () => {
    form.resetFields();
    onHideSendTestEmail();
  };

  return {
    onCloseSendTestEmail,
    handleFieldChange,
    disableSave,
    sendTestEmail,
    onSave,
    form,
    t,
  };
};

export default useSendTestEmailController;
