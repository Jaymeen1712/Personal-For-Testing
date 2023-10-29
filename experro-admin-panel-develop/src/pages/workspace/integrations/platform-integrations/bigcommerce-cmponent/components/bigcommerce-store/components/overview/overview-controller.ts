import { UseQueryResult } from 'react-query';
import { IAPIError, IBigcommerceStore } from '../../../../../../../../../types';
import { useGetEnvironments } from '../../../../../../../content-library/services';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface IUseOverviewController {
  storeDetails: UseQueryResult<IBigcommerceStore | undefined, IAPIError>;
}

const useOverviewController = ({ storeDetails }: IUseOverviewController) => {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const environmentList = useGetEnvironments(workspaceId);
  const [storeEnvironments, setStoreEnvironments] = useState<string[]>([]);
  const [channelStatus, setChannelStatus] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    if (
      environmentList.isSuccess &&
      environmentList.data &&
      storeDetails.data
    ) {
      const tempEnvironmentsArr: string[] = [];
      storeDetails.data?.environmentIds.forEach((storeEnvironementID) => {
        const result = environmentList.data?.findIndex(
          (environment) => environment.id === storeEnvironementID
        );
        if (result !== -1) {
          tempEnvironmentsArr.push(environmentList.data[result]?.title);
        }
      });
      setStoreEnvironments(tempEnvironmentsArr);
    }
  }, [environmentList.isSuccess, environmentList.data, storeDetails.data]);

  useEffect(() => {
    if (storeDetails.isSuccess && storeDetails.data) {
      for (const key in storeDetails.data.channelStatus) {
        if (storeDetails.data?.channelStatus[key]) {
          setChannelStatus(true);
          break;
        } else {
          setChannelStatus(false);
        }
      }
    }
  }, [storeDetails.isSuccess, storeDetails.data]);

  return {
    storeEnvironments,
    channelStatus,
  };
};

export default useOverviewController;
