import { useRouteMatch } from 'react-router-dom';

const useAcquireComponentController = () => {
  const { path } = useRouteMatch();

  return {
    path,
  };
};

export default useAcquireComponentController;
