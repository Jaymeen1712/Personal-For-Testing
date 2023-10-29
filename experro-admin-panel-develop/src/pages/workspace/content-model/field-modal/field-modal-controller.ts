import { useParams } from 'react-router-dom';

const useFieldModalController = () => {
  const { type } = useParams<{
    type: string;
  }>();

  return {
    type,
  };
};

export default useFieldModalController;
