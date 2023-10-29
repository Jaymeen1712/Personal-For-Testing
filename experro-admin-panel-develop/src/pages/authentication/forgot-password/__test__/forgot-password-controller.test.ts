import { renderHook, act } from '@testing-library/react-hooks';

import { wrapper } from '../../../../test/utills';
import useForgotPasswordController from '../forgot-password-controller';

describe('forgot password useForgotPasswordController', () => {
  it('create with success', async () => {
    const { result } = renderHook(() => useForgotPasswordController(), {
      wrapper,
    });

    act(() => {
      result.current.onFinish({ email: 'nj@gmail.com' });
    });
  });
});
