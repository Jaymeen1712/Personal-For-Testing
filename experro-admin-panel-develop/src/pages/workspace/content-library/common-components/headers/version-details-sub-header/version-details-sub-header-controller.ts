import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useQuery from '../../../../../../hooks/queryParameter';
import { useParams } from 'react-router-dom';

const useHeaderVersionDetailsController = (
  currentVersionStatus: {
    id: string;
    name: string;
    status: string;
  }[]
) => {
  const [environmentStatus, setEnvironmentStatus] = useState('');
  // const [environmentName, setEnvironmentName] = useState('');
  const [tempState, setTempState] = useState(false);
  const { t } = useTranslation();
  const query = useQuery();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  useEffect(() => {
    if (query.get('env')) {
      const findData = currentVersionStatus.find(
        (item) => item.id === query.get('env')
      );
      if (findData) {
        setEnvironmentStatus(findData.status);
        // setEnvironmentName(findData.name);
      }
    } else {
      const findData = currentVersionStatus.find(
        (item) => item.id === localStorage.getItem(`${workspaceId}/environmentId`)
      );
      if (findData) {
        setEnvironmentStatus(findData.status);
        // setEnvironmentName(findData.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentVersionStatus,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    query.get('isPageEditor'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    query.get('env'),
    tempState,
  ]);

  useEffect(() => {
    const envChange = () => {
      setTempState(!tempState);
    };
    document.addEventListener('environmentChange', envChange);

    return () => {
      document.removeEventListener('environmentChange', envChange);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { environmentStatus, t };
};

export default useHeaderVersionDetailsController;
