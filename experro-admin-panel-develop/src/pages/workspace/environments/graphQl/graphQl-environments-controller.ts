import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IEnvironmentParams } from './graphQl-environments';

const useGraphQlEnvironmentsController = () => {
  const { environmentId, workspaceId } = useParams<IEnvironmentParams>();
  const { t } = useTranslation();
  const history = useHistory();
  const environment = environmentId.split('-')[0];

  const onBackButtonClick = () => {
    history.push(`/workspaces/${workspaceId}/environments`);
  };

  const onCancel = () => {
    history.push(`/workspaces/${workspaceId}/environments`);
  };

  return {
    t,
    onCancel,
    onBackButtonClick,
    environment,
    workspaceId,
    environmentId,
  };
};

export default useGraphQlEnvironmentsController;
