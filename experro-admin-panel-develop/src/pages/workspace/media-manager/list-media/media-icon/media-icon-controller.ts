import { useEffect, useState } from 'react';
import useListEnvironments from '../../../../../apis/environments/list';
import { useParams } from 'react-router-dom';

const useMediaIconController = () => {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const [cacheDomain, setCacheDomain] = useState<string>();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getEnvironmentList = useListEnvironments(workspaceId);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);
  
  useEffect(() => {
    if (getEnvironmentList.isSuccess) {
      if (getEnvironmentList.data && getEnvironmentList.data.length > 0) {
        const environmentDetails = getEnvironmentList.data.find(
          (item) => item.type === 'PRODUCTION'
        );
        if (environmentDetails) {
          setCacheDomain(environmentDetails.cacheDomain);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEnvironmentList.isSuccess, getEnvironmentList.data]);

  useEffect(() => {
    if (getEnvironmentList.isError) {
      console.log(getEnvironmentList.error);
      setCacheDomain('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEnvironmentList.isError]);
  return {
    cacheDomain,
    isLoading,
  };
};

export default useMediaIconController;
