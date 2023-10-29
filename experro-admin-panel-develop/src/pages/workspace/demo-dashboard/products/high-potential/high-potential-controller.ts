import { useHighPotential } from '../../services';

interface IUseHighPotentialController {
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const useHighPotentialController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
}: IUseHighPotentialController) => {
  const highPotential = useHighPotential(
    workspaceId,
    environment,
    startDate,
    endDate
  );

  return { highPotential };
};

export default useHighPotentialController;
