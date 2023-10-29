import { useTranslation } from 'react-i18next';

import { useHistory, useParams } from 'react-router-dom';

const useBannerInternationalization = () => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const history = useHistory();

  const onAddLanguage = () => {
    history.push(`/workspaces/${workspaceId}/internationalization`);
  };

  return {
    t,
    onAddLanguage,
  };
};

export default useBannerInternationalization;
