/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';

import {
  ICreateUpdateTemplatesEmailsController,
  ICreateUpdateTemplatesEmailsUpdate,
} from '../../../../../types';
import { openNotificationWithIcon } from '../../../../../utills';
import useError from '../../../../../hooks/error';
import usePermissions from '../../../../../hooks/permissions';
import {
  useGetEnvironmentsEmails,
  useGetTemplatesEmails,
  useListPhrasesEmail,
  useUpdateTemplatesEmails,
} from '../../services';

const useCreateUpdateTemplatesEmailsController = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [htmlData, setHtmlData] = useState<string>('');
  const [subjectData, setSubjectData] = useState<string>('');

  const { workspaceId, templateId, masterTemplateId } =
    useParams<ICreateUpdateTemplatesEmailsController>();

  const [isSendEmailModalVisible, setIsSendEmailModalVisible] =
    useState<boolean>(false);
  const [selectedTemplateIdForSendEmail, setSelectedTemplateIdForSendEmail] =
    useState<string>('');
  const [disableSave, setIsDisableSave] = useState(true);

  const permission = usePermissions();
  const getPhraseEmails = useListPhrasesEmail(workspaceId);
  const getEmailTemplate = useGetTemplatesEmails(workspaceId, templateId);
  const getAllEnvironments = useGetEnvironmentsEmails(workspaceId);
  const updateTemplatesEmails = useUpdateTemplatesEmails(
    workspaceId,
    templateId
  );

  useEffect(() => {
    if (
      getEmailTemplate.isSuccess &&
      getEmailTemplate.data &&
      getPhraseEmails.isSuccess &&
      getPhraseEmails.data &&
      getPhraseEmails.data.items.length > 0
    ) {
      getPhraseEmails.data?.items.map((phrase) => {
        getEmailTemplate.data.htmlContent =
          getEmailTemplate.data.htmlContent.replaceAll(
            phrase.shortCode,
            phrase.value
          );

        getEmailTemplate.data.subject =
          getEmailTemplate.data.subject.replaceAll(
            phrase.shortCode,
            phrase.value
          );

        setHtmlData(getEmailTemplate.data.htmlContent);
        setSubjectData(getEmailTemplate.data.subject);
        return true;
      });
      setSelectedTemplateIdForSendEmail(getEmailTemplate.data.id);
    } else {
      if (getEmailTemplate.isSuccess && getEmailTemplate.data) {
        setHtmlData(getEmailTemplate.data.htmlContent);
        setSubjectData(getEmailTemplate.data.subject);
        setSelectedTemplateIdForSendEmail(getEmailTemplate.data.id);
      }
    }
  }, [
    getEmailTemplate.isSuccess,
    getPhraseEmails.isSuccess,
    getPhraseEmails.data,
    getEmailTemplate.data,
  ]);

  useError({
    mutation: updateTemplatesEmails,
    entity: t('common.labels.name'),
  });

  const onBackButtonClick = () => {
    history.push(
      `/workspaces/${workspaceId}/emails/templates/${masterTemplateId}`
    );
  };

  const handleFieldChange = () => {
    const values = form.getFieldsValue();
    if (values.environmentIds) {
      setIsDisableSave(false);
    }
  };

  const onFinish = async (values: ICreateUpdateTemplatesEmailsUpdate) => {
    if (values.name.trim().length === 0) {
      form.setFields([
        {
          name: 'name',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.name.trim().length > 255) {
      form.setFields([
        {
          name: 'name',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.name'),
            }),
          ],
        },
      ]);
    } else if (values.name.trim().length < 3) {
      form.setFields([
        {
          name: 'name',
          errors: [
            t('common.messages.min_length', {
              entity: t('common.labels.name'),
            }),
          ],
        },
      ]);
    } else if (
      values.subject &&
      values.subject.length > 0 &&
      values.subject.trim().length === 0
    ) {
      form.setFields([
        {
          name: 'subject',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else {
      values.name = values.name.trim();
      values.htmlContent = values.htmlContent
        ? values.htmlContent
        : getEmailTemplate.data?.htmlContent;
      values.subject = values.subject
        ? values.subject.trim()
        : getEmailTemplate.data?.subject;
      values.masterTemplateId = getEmailTemplate.data?.masterTemplateId;
      updateTemplatesEmails.mutate(values);
    }
  };

  useEffect(() => {
    if (updateTemplatesEmails.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );

      history.push(
        `/workspaces/${workspaceId}/emails/templates/${masterTemplateId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTemplatesEmails.isSuccess]);

  const onHideSendTestEmailModal = () => {
    setSelectedTemplateIdForSendEmail('');
    setIsSendEmailModalVisible(false);
  };

  const onSendTestEmail = () => {
    if (getEmailTemplate.data) {
      setSelectedTemplateIdForSendEmail(getEmailTemplate.data.id);
    }
    setIsSendEmailModalVisible(true);
  };

  const onTextAreaChange = (html: string) => {
    if (getPhraseEmails.data && getPhraseEmails.data.items.length > 0) {
      getPhraseEmails.data?.items.map((phrase) => {
        html = html.replaceAll(phrase.shortCode, phrase.value);
        setHtmlData(html);
        return true;
      });
    } else {
      setHtmlData(html);
    }
  };

  const onSubjectChange = (
    subject: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (getPhraseEmails.data && getPhraseEmails.data?.items.length > 0) {
      getPhraseEmails.data?.items.map((phrase) => {
        subject.target.value = subject.target.value.replaceAll(
          phrase.shortCode,
          phrase.value
        );
        setSubjectData(subject.target.value);
        return true;
      });
    } else {
      setSubjectData(subject.target.value);
    }
  };

  return {
    t,
    getEmailTemplate,
    getAllEnvironments,
    onBackButtonClick,
    form,
    onFinish,
    onHideSendTestEmailModal,
    onSendTestEmail,
    isSendEmailModalVisible,
    selectedTemplateIdForSendEmail,
    onTextAreaChange,
    htmlData,
    onSubjectChange,
    subjectData,
    permission,
    handleFieldChange,
    disableSave,
  };
};

export default useCreateUpdateTemplatesEmailsController;
