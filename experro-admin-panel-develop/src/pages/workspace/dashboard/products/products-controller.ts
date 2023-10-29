import { useEffect, useState } from 'react';
import { useListEnvironmentsAudience } from '../../audience/services';
import { useWorkspaceDetailsDashboard } from '../services';

interface IUseProductsController {
  workspaceId: string;
  environment: string | null;
}

const useProductsController = ({
  workspaceId,
  environment,
}: IUseProductsController) => {
  const [domain, setDomain] = useState<string>();

  const workspaceDetails = useWorkspaceDetailsDashboard(workspaceId);

  const listEnvironments = useListEnvironmentsAudience(workspaceId);

  useEffect(() => {
    if (listEnvironments.isSuccess && listEnvironments.data) {
      listEnvironments.data.forEach((environmentData) => {
        if (environmentData.id === environment) {
          if (environmentData.customDomain) {
            setDomain(environmentData.customDomain);
          } else if (environmentData?.cacheDomain) {
            setDomain(environmentData.cacheDomain);
          } else {
            setDomain(environmentData.workspaceDomain);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listEnvironments.isSuccess]);

  return { currency: workspaceDetails.data?.currency, domain };
};

export default useProductsController;
