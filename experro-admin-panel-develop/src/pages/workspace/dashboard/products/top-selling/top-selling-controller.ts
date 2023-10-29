import { useTopSelling } from '../../services';

interface IUseTopSellingController {
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const useTopSellingController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
}: IUseTopSellingController) => {
  const topSelling = useTopSelling(
    workspaceId,
    environment,
    startDate,
    endDate
  );

  return { topSelling };
};

export default useTopSellingController;
