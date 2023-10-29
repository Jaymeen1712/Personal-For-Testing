import { useHistory, useParams } from 'react-router-dom';
import { ContentModelList } from '../../../../../../types';
import { useTranslation } from 'react-i18next';

const useVersionHistoryHeaderController = (
  selectedContentModalDetails: ContentModelList
) => {
  const history = useHistory();
  const { t } = useTranslation();

  const {
    workspaceId,
    contentModalId,
    contentModalDataId,
    versionId,
    languageName,
  } = useParams<{
    workspaceId: string;
    contentModalId: string;
    contentModalDataId: string;
    versionId: string;
    languageName: string;
  }>();

  const onBackButtonClick = () => {
    history.push(
      `/workspaces/${workspaceId}/content-library/${selectedContentModalDetails?.type}-type/${contentModalId}/field/${contentModalDataId}/version/${versionId}/language/${languageName}/`
    );
  };
  return { onBackButtonClick, t };
};
export default useVersionHistoryHeaderController;
