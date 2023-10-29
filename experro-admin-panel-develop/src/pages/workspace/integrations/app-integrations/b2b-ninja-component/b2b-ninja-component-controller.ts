import { useRouteMatch } from 'react-router-dom';

const useB2bNinjaComponentController = () => {
  const { path } = useRouteMatch();

  return {
    path,
  };
};

export default useB2bNinjaComponentController;
