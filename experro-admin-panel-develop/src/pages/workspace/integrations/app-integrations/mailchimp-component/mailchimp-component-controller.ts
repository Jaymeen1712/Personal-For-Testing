import { useRouteMatch } from 'react-router-dom';

const useMailchimpComponentController = () => {
  const { path } = useRouteMatch();

  return {
    path,
  };
};

export default useMailchimpComponentController;
