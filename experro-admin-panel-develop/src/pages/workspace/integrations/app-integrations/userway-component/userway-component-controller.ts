import { useRouteMatch } from 'react-router-dom';

const useUserwayComponentController = () => {
  const { path } = useRouteMatch();

  return {
    path,
  };
};

export default useUserwayComponentController;
