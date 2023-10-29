import { message } from 'antd';

const mockParams = jest.fn();
const mockMessageSuccess = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockReturnValue(() => mockParams())(),
  };
});

describe('relation controller', () => {
  it('function check', async () => {
    message.success = mockMessageSuccess;
    mockParams.mockReturnValue({ workspaceId: '123' });
  });
});
