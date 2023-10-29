import { useTrendingUpProducts } from '../../services';

interface IUseTrendingUpProductsController {
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const useTrendingUpProductsController = ({
  workspaceId,
  environment,
  startDate,
  endDate,
}: IUseTrendingUpProductsController) => {
  const trendingUpProducts = useTrendingUpProducts(
    workspaceId,
    environment,
    startDate,
    endDate
  );

  return { trendingUpProducts };
};

export default useTrendingUpProductsController;
