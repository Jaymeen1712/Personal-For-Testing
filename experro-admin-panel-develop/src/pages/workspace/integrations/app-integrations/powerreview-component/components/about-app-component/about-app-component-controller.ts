import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

const useAboutAppComponentController = () => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const history = useHistory();
  const onBackButtonClick = () => {
    history.push(`/workspaces/${workspaceId}/apps`);
  };
  return { t, onBackButtonClick };
};

export default useAboutAppComponentController;
