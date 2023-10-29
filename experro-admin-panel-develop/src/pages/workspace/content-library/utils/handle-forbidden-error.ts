import { useHistory, useParams } from 'react-router-dom';

import { openNotificationWithIcon } from '../../../../utills';
import { useTranslation } from 'react-i18next';

const useHandleForbiddenError = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const handleForbiddenError = (errorCode: string) => {
    if (errorCode === 'EX-00024' || errorCode === 'EX-00006') {
      openNotificationWithIcon(
        'error',
        t('common.messages.you_dont_have_access')
      );
      history.push(`/workspaces/${workspaceId}/dashboard/traffic`);
    }
  };
  return { handleForbiddenError };
};
export default useHandleForbiddenError;
