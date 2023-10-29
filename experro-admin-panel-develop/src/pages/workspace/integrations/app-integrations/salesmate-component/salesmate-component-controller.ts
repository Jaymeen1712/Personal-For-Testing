import { useRouteMatch } from 'react-router-dom';

const useSalesmateComponentController = () => {
  const { path } = useRouteMatch();

  return {
    path,
  };
};

export default useSalesmateComponentController;
