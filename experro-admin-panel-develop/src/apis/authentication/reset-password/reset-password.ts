import { useMutation } from 'react-query';

// import apiClient from "../../APIClient";
import { IAPIError, IResetPassword } from '../../../types';

// const reset-password = async () => {//
//   const { data } = await apiClient.get(`v1/reset-password/`);
//   return data;
// };

const resetPassword = async (values: IResetPassword) => {
  return true;
};

const useResetPassword = () =>
  useMutation<boolean, IAPIError, IResetPassword>(
    ['reset-password'],
    resetPassword
  );

export default useResetPassword;
