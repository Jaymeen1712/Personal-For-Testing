import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ContentLibraryContext } from '../../context';
import { useHistory, useParams } from 'react-router-dom';

const useNoRecordFoundController = () => {
  const contentLibraryContext = useContext(ContentLibraryContext);
  const { t } = useTranslation();
  const history = useHistory();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const onAddModelClick = () => {
    history.push(`/workspaces/${workspaceId}/content-model/`);
  };

  const onCollapseChange = () => {
    document.dispatchEvent(new CustomEvent('toggleSidebar'));
  };

  useEffect(() => {
    contentLibraryContext?.changeHeaderButtonVisible({
      type: '',
      position: '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { t, onAddModelClick, onCollapseChange };
};
export default useNoRecordFoundController;
