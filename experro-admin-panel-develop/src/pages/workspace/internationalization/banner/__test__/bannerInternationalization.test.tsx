import React from 'react';
import { screen } from '@testing-library/react';

import BannerInternationalization from '../banner-internationalization';
import { renderWithClient } from '../../../../../test';

const mockHistory = jest.fn();
const mockLocation = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockReturnValue(() => ({ workspaceId: '123' }))(),
    useHistory: jest.fn().mockReturnValue(() => mockHistory())(),
    useLocation: () => jest.fn().mockReturnValue(() => mockLocation())(),
  };
});

const mockAddLanguage = jest.fn();

jest.mock('../banner-internationalization-controller', () => () => ({
  t: (name: string) => name,
  onAddLanguage: mockAddLanguage,
}));

describe('BannerInternationalization internationalization', () => {
  it('component Render', async () => {
    const mockPush = jest.fn();
    mockHistory.mockReturnValue({ push: mockPush });

    renderWithClient(<BannerInternationalization />);

    const title = screen.getByText('common.labels.internationalize_content');
    expect(title).toBeInTheDocument();
  });
});
