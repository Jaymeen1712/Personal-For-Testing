import { useAbandonProducts } from '../../services';

interface IUseAbandonProductsController {
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const useAbandonProductsController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
}: IUseAbandonProductsController) => {
  const abandonProducts = useAbandonProducts(
    workspaceId,
    environment,
    startDate,
    endDate
  );

  return { abandonProducts };
};

export default useAbandonProductsController;
