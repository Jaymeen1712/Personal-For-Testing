import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

const useAboutAppComponentController = () => {
  const { t } = useTranslation();
  const { workspaceId, id, categoryId } = useParams<{
    workspaceId: string;
    id: string;
    categoryId: string;
  }>();
  const history = useHistory();
  const onBackButtonClick = () => {
    history.push(`/workspaces/${workspaceId}/apps`);
  };
  const onGetThisAppButtonClick = () => {
    history.push(
      `/workspaces/${workspaceId}/apps/algolia/${id}/${categoryId}/accept`
    );
  };

  return { t, onBackButtonClick, onGetThisAppButtonClick };
};
export default useAboutAppComponentController;
