import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import moment from 'moment-timezone';

import queryClient from '../../../../query-client';
import {
  API_QUERY_KEY,
  DESCRIPTION_REGEX_PATTERN,
  openNotificationWithIcon,
  TEXT_REGEX_PATTERN,
} from '../../../../utills';
import { IWorkspace } from '../../../../types';
import useError from '../../../../hooks/error';
import {
  useCreateWorkspace,
  useListCurrency,
  useListTimeZones,
  useUpdateWorkspace,
} from '../services';

const useCreateUpdateWorkspace = ({
  hideModal,
  setStoreLink,
  initialValue,
}: {
  hideModal: () => void;
  setStoreLink: (storeLink: string) => void;
  initialValue?: IWorkspace;
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const listCurrency = useListCurrency();
  const listTimeZones = useListTimeZones();
  const createWorkspace = useCreateWorkspace();
  const workspaceId = initialValue?.id || createWorkspace.data?.id;
  const updateWorkspace = useUpdateWorkspace(workspaceId);
  const browserTZ = moment.tz.guess();

  useError({
    mutation: createWorkspace,
    entity: t('common.labels.workspace'),
    dependentEntities: t('common.labels.workspace_name'),
  });
  useError({
    mutation: updateWorkspace,
    entity: t('common.labels.workspace'),
    dependentEntities: t('common.labels.workspace_name'),
  });

  const onSave = async () => {
    try {
      const values = await form.validateFields();

      if (values.name.trim().length === 0) {
        form.setFields([
          {
            name: 'name',
            errors: [t('common.messages.please_provide')],
          },
        ]);
      } else if (values.name.trim().length < 3) {
        form.setFields([
          {
            name: 'name',
            errors: [
              t('common.messages.min_length', {
                entity: t('common.labels.workspace_name'),
              }),
            ],
          },
        ]);
      } else if (values.name.length > 255) {
        form.setFields([
          {
            name: 'name',
            errors: [
              t('common.messages.max_length', {
                entity: t('common.labels.workspace_name'),
              }),
            ],
          },
        ]);
      } else if (
        values.name.trim().length > 0 &&
        !TEXT_REGEX_PATTERN.test(values.name)
      ) {
        form.setFields([
          {
            name: 'name',
            errors: [
              t('common.messages.format', {
                entity: t('common.labels.workspace_name'),
              }),
            ],
          },
        ]);
      } else if (
        values.description !== undefined &&
        values.description !== null &&
        values.description.length > 2000
      ) {
        form.setFields([
          {
            name: 'description',
            errors: [
              t('common.messages.max_length', {
                entity: t('common.labels.workspace_description'),
              }),
            ],
          },
        ]);
      } else if (
        values.description !== undefined &&
        values.description !== null &&
        values.description.trim().length > 0 &&
        !DESCRIPTION_REGEX_PATTERN.test(values.description)
      ) {
        form.setFields([
          {
            name: 'description',
            errors: [
              t('common.messages.format', {
                entity: t('common.labels.workspace_description'),
              }),
            ],
          },
        ]);
      } else if (
        values.description !== undefined &&
        values.description !== null &&
        values.description.length > 0 &&
        values.description.trim().length === 0
      ) {
        form.setFields([
          {
            name: 'description',
            errors: [t('common.messages.please_provide')],
          },
        ]);
      } else {
        values.name = values.name.trim();
        values.description = values.description?.trim();
        if (workspaceId) {
          updateWorkspace.mutate(values);
        } else {
          createWorkspace.mutate(values);
        }
      }
    } catch (error) {
      console.error('validation failed', error);
    }
  };

  useEffect(() => {
    if (createWorkspace.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.ROLE_LIST]);
      setStoreLink(
        `https://${window.location.host}` +
          `/workspaces/${createWorkspace.data.id}/dashboard/traffic`
      );
      queryClient.refetchQueries([API_QUERY_KEY.WORKSPACE]);
      localStorage.clear();
      localStorage.removeItem('environmentId');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createWorkspace.data, createWorkspace.isSuccess]);

  useEffect(() => {
    if (updateWorkspace.isSuccess) {
      if (!initialValue?.id) {
        openNotificationWithIcon(
          'success',
          t('common.labels.workspace_added_successfully')
        );
      } else {
        openNotificationWithIcon(
          'success',
          t('common.labels.workspace_updated_successfully')
        );
      }
      localStorage.clear();
      localStorage.removeItem('environmentId');
      queryClient.refetchQueries([API_QUERY_KEY.WORKSPACE]);
      queryClient.removeQueries([API_QUERY_KEY.ROLE_LIST]);
      hideModal();
    }
  }, [hideModal, initialValue, t, updateWorkspace.isSuccess]);

  return {
    form,
    t,
    workspaceId,
    onSave,
    createWorkspace,
    updateWorkspace,
    listCurrency,
    listTimeZones,
    browserTZ,
  };
};

export default useCreateUpdateWorkspace;
