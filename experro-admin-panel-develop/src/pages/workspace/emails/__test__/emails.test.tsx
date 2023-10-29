import { renderWithClient } from '../../../../test';
import Emails from '../emails';

const mockPath = jest.fn().mockReturnValue(null);

jest.mock('../emails-controller', () => () => ({
  t: (name: string) => name,
  path: mockPath(),
}));

describe('emails', () => {
  it('render properly', () => {
    mockPath.mockReturnValue('/');

    const { container } = renderWithClient(<Emails />);

    const subSideBar = container.getElementsByClassName('submenu')[0];
    expect(subSideBar).toBeInTheDocument();
  });
});
