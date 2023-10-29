import { useUnitSold } from '../../services';

interface IUseUnitSoldController {
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
  pastStartDate?: string;
  pastEndDate?: string;
}

const useUnitSoldController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
  pastStartDate,
  pastEndDate,
}: IUseUnitSoldController) => {
  const unitSold = useUnitSold(
    workspaceId,
    environment,
    'quantity',
    'product_purchased',
    'sum',
    startDate,
    endDate
  );

  const unitSoldPastData = useUnitSold(
    workspaceId,
    environment,
    'quantity',
    'product_purchased',
    'count',
    pastStartDate,
    pastEndDate
  );

  return { unitSoldPastData, unitSold };
};

export default useUnitSoldController;
