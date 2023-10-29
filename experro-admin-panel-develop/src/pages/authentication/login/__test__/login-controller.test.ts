import { renderHook, act } from '@testing-library/react-hooks';

import { wrapper } from '../../../../test/utills';
import useLoginController from '../login-controller';

describe('login useConnect', () => {
  it('create with success', async () => {
    const { result } = renderHook(() => useLoginController(), {
      wrapper,
    });

    act(()=>{
      result.current.form.getFieldValue('username')
    })

    act(()=>{
      result.current.form.setFieldsValue('username')
    });


   // await waitForNextUpdate()
   // await waitForNextUpdate()

    // act(() => {
    //   result.current.onFinish({
    //
    //     username:  result.current.form.getFieldValue('username'),
    //     password: 'password@123',
    //     remember: true,
    //   });
    // });

  });
});
