import React from 'react';
import { screen, render } from '@testing-library/react';

import NotFound from '../no-data-found';

describe('Not Found', () => {
  it('Not Found Render Successfully', () => {
    render(<NotFound />);

    const headingElement = screen.getByRole('heading', { level: 5 });
    expect(headingElement).toBeInTheDocument();
  });
});
