import { useRevenueBuyers, useWorkspaceDetailsDashboard } from '../services';

interface IUseOrdersController {
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
  pastStartDate?: string;
  pastEndDate?: string;
}

const useOrdersController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
  pastStartDate,
  pastEndDate,
}: IUseOrdersController) => {
  const WorkspaceDetailsDashboard = useWorkspaceDetailsDashboard(workspaceId);

  const revenueBuyer = useRevenueBuyers(
    workspaceId,
    environment,
    'eventSum',
    'product_purchased',
    'sum',
    startDate,
    endDate
  );

  const revenueBuyerPastData = useRevenueBuyers(
    workspaceId,
    environment,
    'eventSum',
    'product_purchased',
    'sum',
    pastStartDate,
    pastEndDate
  );

  const averageOrderValue = useRevenueBuyers(
    workspaceId,
    environment,
    'eventSum',
    'checkout_completed',
    'avg',
    startDate,
    endDate
  );

  const averageOrderValuePastData = useRevenueBuyers(
    workspaceId,
    environment,
    'eventSum',
    'checkout_completed',
    'avg',
    pastStartDate,
    pastEndDate
  );

  const averageOrder = useRevenueBuyers(
    workspaceId,
    environment,
    'eventCount',
    'checkout_completed',
    'count',
    startDate,
    endDate
  );

  const averageOrderPastData = useRevenueBuyers(
    workspaceId,
    environment,
    'eventCount',
    'checkout_completed',
    'count',
    pastStartDate,
    pastEndDate
  );

  return {
    revenueBuyer,
    revenueBuyerPastData,
    currency:
      WorkspaceDetailsDashboard.data &&
      WorkspaceDetailsDashboard.data?.currency,
    averageOrderValue,
    averageOrderValuePastData,
    averageOrder,
    averageOrderPastData,
  };
};

export default useOrdersController;
