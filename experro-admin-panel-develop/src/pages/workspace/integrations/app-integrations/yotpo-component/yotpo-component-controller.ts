import { useRouteMatch } from 'react-router-dom';

const useYotpoComponentController = () => {
  const { path } = useRouteMatch();

  return {
    path,
  };
};

export default useYotpoComponentController;
