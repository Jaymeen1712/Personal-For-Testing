import { UseQueryResult } from 'react-query';
import {
  IAPIError,
  IShopifyStoreResponse,
} from '../../../../../../../../types';
import { useGetEnvironments } from '../../../../../../content-library/services';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface IUseOverviewController {
  storeDetails: UseQueryResult<IShopifyStoreResponse | undefined, IAPIError>;
}

const useOverviewController = ({ storeDetails }: IUseOverviewController) => {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const environmentList = useGetEnvironments(workspaceId);
  const [storeEnvironments, setStoreEnvironments] = useState<string[]>([]);

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

  return {
    storeEnvironments,
  };
};

export default useOverviewController;
