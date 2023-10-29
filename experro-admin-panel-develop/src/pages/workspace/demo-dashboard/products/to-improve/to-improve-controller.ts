import { useToImprove } from '../../services';

interface IUseToImproveController {
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const useToImproveController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
}: IUseToImproveController) => {
  const toImprove = useToImprove(workspaceId, environment, startDate, endDate);

  return { toImprove };
};

export default useToImproveController;
