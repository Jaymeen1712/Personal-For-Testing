import React from 'react';
// import { screen } from '@testing-library/react';

import PageNotFound from '../page-not-found';
import { renderWithClient } from '../../../test';

describe('Not Found', () => {
  it('Not Found Render Successfully', () => {
    renderWithClient(<PageNotFound />);
    //
    // const headingElement = screen.getByRole('heading');
    // expect(headingElement).toBeInTheDocument();
    //
    // const paragraphElement = screen.getByText(
    //   'common.labels.page_does_not_exist'
    // );
    // expect(paragraphElement).toBeInTheDocument();
  });
});
