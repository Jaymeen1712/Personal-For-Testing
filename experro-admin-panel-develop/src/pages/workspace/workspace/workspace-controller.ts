import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';

import {
  DESCRIPTION_REGEX_PATTERN,
  openNotificationWithIcon,
  SIDEBAR_KEYS,
  TEXT_REGEX_PATTERN,
} from '../../../utills';
import usePermissions from '../../../hooks/permissions';
import useError from '../../../hooks/error';
import {
  useDetailsWorkspace,
  useListCurrency,
  useListTimeZones,
  useUpdateWorkspace,
} from './services';

interface IParams {
  workspaceId: string;
}

interface IWorkspaceUpdate {
  name: string;
  description: string;
  id?: string;
  timezone?: string;
  storeLink?: string;
}

interface IUseWorkspaceController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useWorkspaceController = ({
  onMainSidebarActiveItem,
}: IUseWorkspaceController) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { workspaceId } = useParams<IParams>();
  const { canManageGlobalWorkspace } = usePermissions();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isButtonDisable, setIsButtonDisable] = useState(true);

  const updateWorkspace = useUpdateWorkspace(workspaceId);
  const detailsWorkspace = useDetailsWorkspace(workspaceId);
  const listCurrency = useListCurrency();
  const listTimeZones = useListTimeZones();

  useError({
    mutation: updateWorkspace,
    entity: t('common.labels.workspace'),
  });

  const onFinish = useCallback(
    (values: IWorkspaceUpdate) => {
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
      } else if (values.name.trim().length > 255) {
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
                entity: t('common.labels.description'),
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
                entity: t('common.labels.description'),
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
        updateWorkspace.mutate(values);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateWorkspace, t]
  );

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const OnDeleteWorkspace = () => {
    setIsModalVisible(true);
  };

  const onFieldChange = () => {
    setIsButtonDisable(false);
  };

  useEffect(() => {
    if (updateWorkspace.isSuccess) {
      setIsButtonDisable(true);
      form.setFields([
        {
          name: 'name',
          errors: [],
        },
        {
          name: 'description',
          errors: [],
        },
      ]);
      detailsWorkspace.refetch();
      openNotificationWithIcon(
        'success',
        t('common.messages.entity_updated_successfully', {
          entity: t('common.labels.workspace'),
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateWorkspace.isSuccess, t]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    t,
    onFinish,
    isModalVisible,
    hideModal,
    form,
    OnDeleteWorkspace,
    isButtonDisable,
    onFieldChange,
    canManageGlobalWorkspace: canManageGlobalWorkspace(),
    updateWorkspace,
    detailsWorkspace,
    listCurrency,
    listTimeZones,
  };
};

export default useWorkspaceController;
