import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Form } from 'antd';

import {
  API_QUERY_KEY,
  openNotificationWithIcon,
  ROUTES,
} from '../../../../utills';
import { IWorkspace } from '../../../../types';
import useError from '../../../../hooks/error';
import queryClient from '../../../../query-client';
import { useDeleteWorkspace } from '../services';

interface IParams {
  workspaceId: string;
}

const useDeleteWorkspaceModalController = (workspace?: IWorkspace) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const { workspaceId } = useParams<IParams>();
  const [isButtonDisable, setIsButtonDisable] = useState(true);
  const deleteWorkspace = useDeleteWorkspace(workspaceId);

  useError({
    mutation: deleteWorkspace,
    entity: t('common.labels.workspace'),
  });

  const onSave = useCallback(async () => {
    const values = await form.validateFields();
    if (workspace?.name === values.name) {
      deleteWorkspace.mutate(values);
    }
  }, [deleteWorkspace, form, workspace]);

  /* matching the user enter value and current
   * workspace name to enable delete workspace button */

  const onFieldChange = (e: { value?: string }[]) => {
    if (e[0].value === workspace?.name) {
      setIsButtonDisable(false);
    } else {
      setIsButtonDisable(true);
    }
  };

  useEffect(() => {
    if (deleteWorkspace.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.USER_WORKSPACES]);
      openNotificationWithIcon(
        'success',
        t('common.messages.entity_deleted_successfully', {
          entity: t('common.labels.workspace'),
        })
      );
      history.push(ROUTES.WORKSPACES);
    }
  }, [history, deleteWorkspace.isSuccess, t]);

  return {
    t,
    onSave,
    isButtonDisable,
    onFieldChange,
    form,
    deleteWorkspace,
  };
};
export default useDeleteWorkspaceModalController;
