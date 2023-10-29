import { useContext } from 'react';
import { UserContext } from '../../context/user';

const useUser = () => {
  return useContext(UserContext);
};

export default useUser;
