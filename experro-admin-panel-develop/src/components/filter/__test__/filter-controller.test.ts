import { renderHook } from '@testing-library/react-hooks';

import useConnect from '../filter-controller';

describe('Filter useConnect', () => {
  it('useConnect', async () => {
    const onChangeFn = jest.fn();

   renderHook(() => useConnect(onChangeFn));

    // act(() => {
    //   result.current.onInputChange({
    //     target: { value: 'S' },
    //   } as ChangeEvent<HTMLInputElement>);
    // });
    // expect(result.current.filterText).toBe('S');
    // expect(onChangeFn).not.toBeCalled();
    //
    // act(() => {
    //   result.current.onInputChange({
    //     target: { value: 'Sh' },
    //   } as ChangeEvent<HTMLInputElement>);
    // });
    // expect(result.current.filterText).toBe('Sh');
    // expect(onChangeFn).not.toBeCalled();

    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 500));
    // expect(onChangeFn).toBeCalled();
    // expect(onChangeFn).toBeCalledWith('Sh');
  });
});
