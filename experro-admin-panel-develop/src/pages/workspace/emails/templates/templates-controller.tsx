import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import { useListMasterTemplateEmails } from '../services';

interface ITemplateControllerParams {
  workspaceId: string;
  masterTemplateId?: string;
  source?: string;
}

const useTemplatesController = () => {
  const { t } = useTranslation();
  const { workspaceId, masterTemplateId, source } =
    useParams<ITemplateControllerParams>();
  const history = useHistory();
  const { path } = useRouteMatch();

  const [selectedMasterTemplateId, setSelectedMasterTemplateId] =
    useState<string>();

  const listMasterTemplateEmails = useListMasterTemplateEmails(workspaceId);

  useEffect(() => {
    if (source === 'templates') {
      if (masterTemplateId) {
        setSelectedMasterTemplateId(masterTemplateId);
        history.push(
          `/workspaces/${workspaceId}/emails/templates/${masterTemplateId}`
        );
      } else {
        if (listMasterTemplateEmails.data && selectedMasterTemplateId) {
          setSelectedMasterTemplateId(selectedMasterTemplateId);
          history.push(
            `/workspaces/${workspaceId}/emails/templates/${selectedMasterTemplateId}`
          );
        } else {
          if (listMasterTemplateEmails.data) {
            setSelectedMasterTemplateId(listMasterTemplateEmails.data[0].id);
            history.push(
              `/workspaces/${workspaceId}/emails/templates/${listMasterTemplateEmails.data[0].id}`
            );
          }
        }
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, window.location.href]);

  useEffect(() => {
    if (masterTemplateId) {
      setSelectedMasterTemplateId(masterTemplateId);
      history.push(
        `/workspaces/${workspaceId}/emails/templates/${masterTemplateId}`
      );
    } else {
      if (listMasterTemplateEmails.data) {
        setSelectedMasterTemplateId(listMasterTemplateEmails.data[0].id);
        history.push(
          `/workspaces/${workspaceId}/emails/templates/${listMasterTemplateEmails.data[0].id}`
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listMasterTemplateEmails.isSuccess, listMasterTemplateEmails.data]);

  const onListMasterTemplateChange = (id: string) => {
    setSelectedMasterTemplateId(id);
    history.push(`/workspaces/${workspaceId}/emails/templates/${id}`);
  };

  return {
    t,
    onListMasterTemplateChange,
    listMasterTemplateEmails,
    selectedMasterTemplateId,
    path,
  };
};

export default useTemplatesController;
